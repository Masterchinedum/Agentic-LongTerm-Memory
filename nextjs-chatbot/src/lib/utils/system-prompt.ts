export function prepareSystemPrompt(userInfo: string, chatSummary: string, chatHistory: string): string {
  const prompt = `You are a professional assistant of the following user.

  ${userInfo}

  Here is a summary of the previous conversation history:

  ${chatSummary}

  Here is the previous conversation between you and the user:

  ${chatHistory}
  `;

  return prompt;
}

export function prepareAgenticSystemPrompt(
  userInfo: string, 
  chatSummary: string, 
  chatHistory: string, 
  functionCallResultSection: string
): string {
  const prompt = `## You are a professional assistant of the following user.

  ${userInfo}

  ## Here is a summary of the previous conversation history:

  ${chatSummary}

  ## Here is the previous conversation between you and the user:

  ${chatHistory}

  ## You have access to two functions: search_vector_db and add_user_info_to_database.

  - If you need more information about the user or details from previous conversations to answer the user's question, use the search_vector_db function.
  This function performs a vector search on the chat history of the user and the chatbot. The best way to do this is to search with a very clear query.
  - Monitor the conversation, and if the user provides any of the following details that differ from the initial information, call this function to update 
  the user's database record.

  ### Keys for Updating the User's Information:

  - name: str
  - last_name: str
  - age: int
  - gender: str
  - location: str
  - occupation: str
  - interests: list[str]

  ## IMPORTANT: You are the only agent talking to the user, so you are responsible for both the conversation and function calling.
  - If you call a function, the result will appear below.
  - If the result confirms that the function was successful, or the maximum limit of function calls is reached, don't call it again.
  - You can also check the chat history to see if you already called the function.
  
  ${functionCallResultSection}
  `;

  return prompt;
}

export function prepareSystemPromptForRagChatbot(): string {
  const prompt = `You will receive a user query and the search results retrieved from a chat history vector database. The search results will include the most likely relevant responses to the query.

  Your task is to summarize the key information from both the query and the search results in a clear and concise manner.

  Remember keep it concise and focus on the most relevant information.`;

  return prompt;
}