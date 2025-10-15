import { ChromaApi, OpenAIApi } from 'chromadb';
import OpenAI from 'openai';
import { Config } from '@/lib/utils/config';

export class VectorDBManager {
  private cfg: Config;
  private client: OpenAI;
  private chromaClient: ChromaApi;
  private collection: any;

  constructor(config: Config) {
    this.cfg = config;
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Initialize ChromaDB client (simplified for Next.js environment)
    this.initializeChromaClient();
  }

  private async initializeChromaClient() {
    try {
      // For now, we'll use a simple in-memory approach
      // In production, you'd want to connect to a ChromaDB server
      const { ChromaClient } = await import('chromadb');
      
      if (this.cfg.use_docker) {
        // Use HTTP client for Docker ChromaDB
        this.chromaClient = new ChromaClient({
          path: `http://${this.cfg.docker_host}:${this.cfg.docker_port}`
        });
      } else {
        // For development, we'll use a simplified approach
        this.chromaClient = new ChromaClient();
      }

      // Get or create collection
      this.collection = await this.chromaClient.getOrCreateCollection({
        name: this.cfg.collection_name,
        embeddingFunction: {
          generate: async (texts: string[]) => {
            // Use OpenAI embeddings
            const response = await this.client.embeddings.create({
              model: this.cfg.embedding_model,
              input: texts,
            });
            return response.data.map(item => item.embedding);
          }
        }
      });
    } catch (error) {
      console.error('Failed to initialize ChromaDB:', error);
      // Fallback to a mock implementation for development
      this.collection = {
        add: async () => console.log('Mock: Vector added'),
        query: async () => ({ documents: [[]] }),
        count: async () => 0
      };
    }
  }

  async updateVectorDb(msgPair: string): Promise<void> {
    try {
      const id = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      await this.collection.add({
        documents: [msgPair],
        ids: [id]
      });
    } catch (error) {
      console.error('Error updating vector database:', error);
    }
  }

  async searchVectorDb(query: string): Promise<[string, string]> {
    try {
      console.log("Performing vector search...");
      const results = await this.collection.query({
        queryTexts: [query],
        nResults: this.cfg.k
      });
      
      const documents = results.documents[0] || [];
      const llmResult = await this.prepareSearchResult(documents, query);
      
      console.log("Vector search completed.");
      console.log("Query: ", query);
      console.log("Results: ", documents);
      console.log(`LLM result: ${llmResult}`);
      
      return ["Function call successful.", llmResult];
    } catch (error) {
      console.error('Vector search error:', error);
      return ["Function call failed.", `Error: ${error}`];
    }
  }

  private async prepareSearchResult(searchResult: string[], query: string): Promise<string> {
    if (!searchResult || searchResult.length === 0) {
      return "No relevant information found in the chat history.";
    }

    const systemPrompt = `You will receive a user query and the search results retrieved from a chat history vector database. The search results will include the most likely relevant responses to the query.

Your task is to summarize the key information from both the query and the search results in a clear and concise manner.

Remember keep it concise and focus on the most relevant information.`;

    const userPrompt = `Query: ${query}\n\nSearch Results:\n${searchResult.join('\n\n')}`;

    try {
      const response = await this.client.chat.completions.create({
        model: this.cfg.rag_model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: this.cfg.temperature
      });

      return response.choices[0].message.content || "Unable to process search results.";
    } catch (error) {
      console.error('Error preparing search result:', error);
      return `Error processing search results: ${error}`;
    }
  }

  async refreshVectorDbClient(): Promise<void> {
    // Reinitialize the client if needed
    await this.initializeChromaClient();
  }
}