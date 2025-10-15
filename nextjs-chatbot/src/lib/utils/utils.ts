import { encoding_for_model } from 'tiktoken';

export class Utils {
  /**
   * Counts the number of tokens in a given text using the GPT-4o-mini encoding.
   */
  countNumberOfTokens(text: string): number {
    const encoding = encoding_for_model('gpt-4o-mini');
    const tokens = encoding.encode(text);
    encoding.free(); // Free the encoding resources
    return tokens.length;
  }

  /**
   * Counts the number of characters in a given text.
   */
  countNumberOfCharacters(text: string): number {
    return text.length;
  }

  /**
   * Generate a JSON schema for a function (simplified version for TypeScript)
   */
  jsonSchema(func: Function, description: string): any {
    return {
      name: func.name,
      description: description,
      parameters: {
        type: "object",
        properties: {},
        required: []
      }
    };
  }
}