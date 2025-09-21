import OpenAI from 'openai';
import { SQLManager } from '@/lib/managers/sql-manager';
import { Utils } from '@/lib/utils/utils';

export interface ChatMessage {
  user?: string;
  assistant?: string;
}

export class ChatHistoryManager {
  private utils: Utils;
  private client: OpenAI;
  private summaryModel: string;
  private maxTokens: number;
  private sqlManager: SQLManager;
  private userId: number | null;
  private sessionId: string;
  public chatHistory: ChatMessage[];
  private pairsSinceLastSummary: number;

  constructor(
    sqlManager: SQLManager,
    userId: number | null,
    sessionId: string,
    client: OpenAI,
    summaryModel: string,
    maxTokens: number
  ) {
    this.utils = new Utils();
    this.client = client;
    this.summaryModel = summaryModel;
    this.maxTokens = maxTokens;
    this.sqlManager = sqlManager;
    this.userId = userId;
    this.sessionId = sessionId;
    this.chatHistory = [];
    this.pairsSinceLastSummary = 0;
  }

  async addToHistory(userMessage: string, assistantResponse: string, maxHistoryPairs: number): Promise<void> {
    this.chatHistory.push({ user: userMessage });
    this.chatHistory.push({ assistant: assistantResponse });

    if (this.chatHistory.length > maxHistoryPairs * 2) {
      this.chatHistory = this.chatHistory.slice(-maxHistoryPairs * 2);
    }

    await this.saveToDb(userMessage, assistantResponse);
    this.pairsSinceLastSummary += 1;
    console.log("Chat history saved to database.");
    
    const chatHistoryTokenCount = this.utils.countNumberOfTokens(JSON.stringify(this.chatHistory));
    if (chatHistoryTokenCount > this.maxTokens) {
      console.log("Summarizing the chat history ...");
      console.log("\nOld number of tokens:", chatHistoryTokenCount);

      await this.summarizeChatHistory();

      // Re-count tokens after summarization
      const newChatHistoryTokenCount = this.utils.countNumberOfTokens(JSON.stringify(this.chatHistory));
      console.log("\nNew number of tokens:", newChatHistoryTokenCount);
    }
  }

  private async saveToDb(userMessage: string, assistantResponse: string): Promise<void> {
    if (!this.userId) {
      console.log("Error: No user found in the database.");
      return;
    }
    
    const query = `
      INSERT INTO chat_history (user_id, question, answer, session_id)
      VALUES (?, ?, ?, ?);
    `;
    
    await this.sqlManager.executeQuery(query, [this.userId, userMessage, assistantResponse, this.sessionId]);
  }

  async getLatestChatPairs(numPairs: number): Promise<Array<[string, string]>> {
    const query = `
      SELECT question, answer FROM chat_history
      WHERE session_id = ?
      ORDER BY timestamp DESC
      LIMIT ?;
    `;
    
    const chatData = await this.sqlManager.executeQuery<any>(query, [this.sessionId, numPairs * 2], false, true);
    
    if (!Array.isArray(chatData)) return [];
    
    // Reverse to maintain chronological order and return as tuples
    return chatData.reverse().map(row => [row.question, row.answer]);
  }

  async getLatestSummary(): Promise<string | null> {
    const query = `
      SELECT summary_text FROM summary
      WHERE session_id = ? ORDER BY timestamp DESC LIMIT 1;
    `;
    
    const summary = await this.sqlManager.executeQuery<any>(query, [this.sessionId], true);
    return summary ? summary.summary_text : null;
  }

  private async saveSummaryToDb(summaryText: string): Promise<void> {
    if (!this.userId || !summaryText) {
      return;
    }
    
    const query = `
      INSERT INTO summary (user_id, session_id, summary_text)
      VALUES (?, ?, ?);
    `;
    
    await this.sqlManager.executeQuery(query, [this.userId, this.sessionId, summaryText]);
    console.log("Summary saved to database.");
  }

  async updateChatSummary(maxHistoryPairs: number): Promise<void> {
    console.log("pairs_since_last_summary:", this.pairsSinceLastSummary);
    if (this.pairsSinceLastSummary < maxHistoryPairs) {
      return;
    }

    // Fetch the latest pairs
    const chatData = await this.getLatestChatPairs(maxHistoryPairs);

    // Fetch the previous summary
    const previousSummary = await this.getLatestSummary();

    // Only generate a new summary if there are enough pairs
    if (chatData.length <= maxHistoryPairs) {
      console.log("Insufficient chat data. Skipping summary.");
      return;
    }

    const summaryText = await this.generateTheNewSummary(chatData, previousSummary);

    if (summaryText) {
      await this.saveSummaryToDb(summaryText);
      this.pairsSinceLastSummary = 0; // Reset the counter after a summary
      console.log("Chat history summary generated and saved to database.");
    }
  }

  private async generateTheNewSummary(
    chatData: Array<[string, string]>,
    previousSummary: string | null
  ): Promise<string | null> {
    if (!chatData || chatData.length === 0) {
      return null;
    }

    // Start building the prompt
    let summaryPrompt = "Summarize the following conversation:\n\n";

    if (previousSummary) {
      summaryPrompt += `Previous summary:\n${previousSummary}\n\n`;
    }

    for (const [q, a] of chatData) {
      summaryPrompt += `User: ${q}\nAssistant: ${a}\n\n`;
    }

    summaryPrompt += "Provide a concise summary while keeping important details.";

    try {
      const response = await this.client.chat.completions.create({
        model: this.summaryModel,
        messages: [{ role: "system", content: summaryPrompt }]
      });
      return response.choices[0].message.content;
    } catch (error) {
      console.error(`Error generating summary: ${error}`);
      return null;
    }
  }

  private async summarizeChatHistory(): Promise<void> {
    // Select older pairs to summarize (keep latest pairs untouched)
    const pairsToKeep = 1;
    const pairsToSummarize = this.chatHistory.slice(0, -pairsToKeep * 2);

    if (pairsToSummarize.length === 0) {
      return;
    }

    // Create a prompt for summarization
    const prompt = `
      Summarize the following conversation while preserving key details and the conversation's tone:
      ${JSON.stringify(pairsToSummarize)}

      Return the summarized conversation (in JSON format with 'user' and 'assistant' pairs):
    `;

    try {
      // Use GPT model to generate a summary
      const response = await this.client.chat.completions.create({
        model: this.summaryModel,
        messages: [
          { role: "user", content: prompt }
        ],
        max_tokens: 300
      });

      const summarizedContent = response.choices[0].message.content;
      if (!summarizedContent) {
        throw new Error("No content received from summarization");
      }

      let summarizedPairs = JSON.parse(summarizedContent);

      // If output is a single dictionary, wrap it in a list
      if (!Array.isArray(summarizedPairs)) {
        summarizedPairs = [summarizedPairs];
      }

      // Ensure the format is consistent
      const isValidFormat = Array.isArray(summarizedPairs) && summarizedPairs.every(
        (pair: any) => typeof pair === 'object' && ('user' in pair || 'assistant' in pair)
      );

      if (isValidFormat) {
        // Keep latest pairs + summarized history
        this.chatHistory = [...summarizedPairs, ...this.chatHistory.slice(-pairsToKeep * 2)];
        console.log("Chat history summarized.");
      } else {
        throw new Error("Invalid format received from LLM.");
      }

    } catch (error) {
      console.error(`Failed to summarize chat history: ${error}`);
    }
  }
}