import time
from utils.chatbot import Chatbot

if __name__ == "__main__":
    print("Advanced Chatbot with Long-term Memory is initialized. Type 'exit' to end the conversation.")
    chatbot = Chatbot()

    while True:
        user_input = input("\nYou: ")

        if user_input.lower() == 'exit':
            print("Goodbye!")
            break

        # Get response from the chatbot
        print("\nThinking...")
        start_time = time.time()
        response = chatbot.chat(user_input)
        end_time = time.time()

        print(f"\nAssistant ({round(end_time - start_time, 2)}s): {response}")
