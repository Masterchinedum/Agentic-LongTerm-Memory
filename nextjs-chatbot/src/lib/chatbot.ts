import OpenAI from 'openai';
import { v4 as uuidv4 } from 'uuid';
import { Config } from '@/lib/utils/config';
import { Utils } from '@/lib/utils/utils';
import { SQLManager } from '@/lib/managers/sql-manager';
import { UserManager } from '@/lib/managers/user-manager';
import { ChatHistoryManager } from '@/lib/managers/chat-history-manager';
import { VectorDBManager } from '@/lib/managers/vector-db-manager';
import { prepareAgenticSystemPrompt } from '@/lib/utils/system-prompt';

export class Chatbot {
  private client: OpenAI;
  private cfg: Config;
  private chatModel: string;
  private summaryModel: string;
  private temperature: number;
  private maxHistoryPairs: number;
  private sessionId: string;
  private utils: Utils;
  private sqlManager: SQLManager;
  private userManager: UserManager;
  private chatHistoryManager: ChatHistoryManager;
  private vectorDbManager: VectorDBManager;
  private agentFunctions: any[];
  private chatHistory: any[];
  private previousSummary: string | null;

  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.cfg = new Config();
    this.chatModel = this.cfg.chat_model;
    this.summaryModel = this.cfg.summary_model;
    this.temperature = this.cfg.temperature;
    this.maxHistoryPairs = this.cfg.max_history_pairs;

    this.sessionId = uuidv4();
    this.utils = new Utils();
    this.sqlManager = new SQLManager(this.cfg.db_path);
    this.userManager = new UserManager(this.sqlManager);
    this.chatHistoryManager = new ChatHistoryManager(
      this.sqlManager,
      this.userManager.userId,
      this.sessionId,
      this.client,
      this.summaryModel,
      this.cfg.max_tokens
    );

    this.vectorDbManager = new VectorDBManager(this.cfg);

    // Define agent functions (simplified for TypeScript)
    this.agentFunctions = [
      {
        name: "add_user_info_to_database",
        description: "Updates user information in the database",
        parameters: {
          type: "object",
          properties: {
            user_info: {
              type: "object",
              description: "User information to update"
            }
          },
          required: ["user_info"]
        }
      },
      {
        name: "search_vector_db",
        description: "Searches the vector database for relevant information",
        parameters: {
          type: "object",
          properties: {
            query: {
              type: "string",
              description: "The search query"
            }
          },
          required: ["query"]
        }
      }
    ];

    this.chatHistory = [];
    this.previousSummary = null;
  }

  async initialize(): Promise<void> {
    await this.userManager.initialize();
    this.chatHistoryManager = new ChatHistoryManager(
      this.sqlManager,
      this.userManager.userId,
      this.sessionId,
      this.client,
      this.summaryModel,
      this.cfg.max_tokens
    );
  }

  private async executeFunctionCall(functionName: string, functionArgs: any): Promise<[string, string]> {
    if (functionName === "search_vector_db") {
      return await this.vectorDbManager.searchVectorDb(functionArgs.query);
    } else if (functionName === "add_user_info_to_database") {
      return await this.userManager.addUserInfoToDatabase(functionArgs.user_info || functionArgs);
    }
    return ["Function call failed.", "Unknown function"];
  }

  async chat(userMessage: string): Promise<string> {
    let functionCallResultSection = "";
    let functionCallState: string | null = null;
    let chatState = "thinking";
    let functionCallCount = 0;
    let functionName = "";
    let functionArgs: any = {};
    let functionCallResult = "";

    this.chatHistory = this.chatHistoryManager.chatHistory;
    this.previousSummary = await this.chatHistoryManager.getLatestSummary();

    while (chatState !== "finished") {
      try {
        if (functionCallState === "Function call successful.") {
          chatState = "finished";
          if (functionName === "add_user_info_to_database") {
            await this.userManager.refreshUserInfo();
          }
          functionCallResultSection = `## Function Call Executed

- The assistant just called the function \`${functionName}\` in response to the user's most recent message.
- Arguments provided:
${Object.entries(functionArgs).map(([k, v]) => `  - ${k}: ${v}`).join('\n')}
- Outcome: ✅ ${functionCallState}

Please proceed with the conversation using the new context.

${functionCallResult}`;
          
          console.log("************************************");
          console.log(functionCallResult);
          console.log("************************************");
        } else if (functionCallState === "Function call failed.") {
          functionCallResultSection = `## Function Call Attempted

- The assistant attempted to call \`${functionName}\` with the following arguments:
${Object.entries(functionArgs).map(([k, v]) => `  - ${k}: ${v}`).join('\n')}
- Outcome: ❌ ${functionCallState} - ${functionCallResult}

Please assist the user based on this result.`;
        }

        if (functionCallCount >= this.cfg.max_function_calls) {
          functionCallResultSection = `# Function Call Limit Reached.
          Please conclude the conversation with the user based on the available information.`;
        }

        const systemPrompt = prepareAgenticSystemPrompt(
          JSON.stringify(this.userManager.userInfo || {}),
          this.previousSummary || "",
          JSON.stringify(this.chatHistory),
          functionCallResultSection
        );

        console.log("\n\n==========================================");
        console.log(`System prompt: ${systemPrompt}`);
        console.log("\n\nchat_State:", chatState);

        const response = await this.client.chat.completions.create({
          model: this.chatModel,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userMessage }
          ],
          functions: this.agentFunctions,
          function_call: "auto",
          temperature: this.cfg.temperature
        });

        const choice = response.choices[0];

        if (choice.message.content) {
          const assistantResponse = choice.message.content;
          await this.chatHistoryManager.addToHistory(
            userMessage,
            assistantResponse,
            this.maxHistoryPairs
          );
          await this.chatHistoryManager.updateChatSummary(this.maxHistoryPairs);
          chatState = "finished";
          
          const msgPair = `user: ${userMessage}, assistant: ${assistantResponse}`;
          await this.vectorDbManager.updateVectorDb(msgPair);
          functionCallState = null;
          await this.vectorDbManager.refreshVectorDbClient();
          
          return assistantResponse;
        } else if (choice.message.function_call) {
          if (functionCallCount >= this.cfg.max_function_calls || chatState === "finished") {
            console.log("Triggering the fallback model...");
            const fallbackResponse = await this.client.chat.completions.create({
              model: this.chatModel,
              messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userMessage }
              ],
              temperature: this.cfg.temperature
            });
            
            const assistantResponse = fallbackResponse.choices[0].message.content || "I apologize, but I couldn't generate a proper response.";
            await this.chatHistoryManager.addToHistory(
              userMessage,
              assistantResponse,
              this.maxHistoryPairs
            );
            
            const msgPair = `user: ${userMessage}, assistant: ${assistantResponse}`;
            await this.vectorDbManager.updateVectorDb(msgPair);
            functionCallState = null;
            await this.vectorDbManager.refreshVectorDbClient();
            
            return assistantResponse;
          }

          functionCallCount += 1;
          functionName = choice.message.function_call.name;
          functionArgs = JSON.parse(choice.message.function_call.arguments || '{}');
          
          console.log("Function name that was requested by the LLM:", functionName);
          console.log("Function arguments:", functionArgs);
          
          [functionCallState, functionCallResult] = await this.executeFunctionCall(functionName, functionArgs);
        } else {
          return "Warning: No valid assistant response from the chatbot. Please try again.";
        }
      } catch (error) {
        console.error("Error in chat:", error);
        return `Error: ${error}`;
      }
    }

    return "An unexpected error occurred.";
  }
}