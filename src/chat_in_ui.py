import time
import gradio as gr
from utils.chatbot import Chatbot

# Initialize chatbot instance
ai_chatbot = Chatbot()


def respond(history, user_input):
    if not user_input.strip():
        return history, ""

    start_time = time.time()
    response = ai_chatbot.chat(user_input)
    end_time = time.time()

    # Append user and assistant messages in the correct format for Gradio
    history.append({
        "role": "user", 
        "content": user_input
    })
    history.append({
        "role": "assistant", 
        "content": f"{response} ({round(end_time - start_time, 2)}s)"
    })
    return history, ""


with gr.Blocks() as demo:
    with gr.Tabs():
        with gr.TabItem("Advanced Chatbot with Long-term Memory"):
            with gr.Row():
                chatbot = gr.Chatbot(
                    [],
                    elem_id="chatbot",
                    height=500,
                    type="messages"
                )

            with gr.Row():
                input_txt = gr.Textbox(
                    lines=3,
                    scale=8,
                    placeholder="Enter text and press enter...",
                    container=False,
                )

            with gr.Row():
                text_submit_btn = gr.Button(value="Submit")
                clear_button = gr.ClearButton([input_txt, chatbot])

            # Handle submission
            input_txt.submit(
                fn=respond,
                inputs=[chatbot, input_txt],
                outputs=[chatbot, input_txt]
            )

            text_submit_btn.click(
                fn=respond,
                inputs=[chatbot, input_txt],
                outputs=[chatbot, input_txt]
            )

if __name__ == "__main__":
    demo.launch()
