# 🧠 Advanced Chatbot with Long-Term Memory

This project demonstrates an advanced AI chatbot with agentic capabilities and long-term memory using vector databases and semantic search.

Feel free to ⭐️ the repo if it helps you understand long-term memory for agents!

## 🚀 Features
- **Vector Database Integration** (ChromaDB) for semantic memory search
- **Agentic Function Calling** capabilities with OpenAI's API  
- **Advanced Memory Management** (both SQL and vector-based)
- **Robust Error Handling** and fallback mechanisms
- **Production-Ready Architecture**

## 📚 What You'll Learn
1. How to design a **custom agentic long-term memory**.
2. How to implement **long-term memory using Vector DB** with semantic search.
3. How to structure memory into **semantic**, **episodic**, and **procedural** components.
4. How to build **production-ready chatbots** with advanced memory capabilities.

🔗 A great reference paper for this project:  
[Memory in LLM Agents](https://arxiv.org/abs/2310.08560)

## ▶️ Watch the Demo  
📺 **YouTube Video:** [Link](https://youtu.be/jw67V_gBzR0?si=OagwK44anyRoLimE)


## 💾 How to Run the Project

⚠️ Note: Please use Python 3.11 as Python 3.12 may cause compatibility issues with some dependencies.

1. **Create a virtual environment**  
   ```bash
   python -m venv venv
   source venv/bin/activate  # or venv\Scripts\activate on Windows
   ```
2. Install dependencies
    ```bash
    pip install -r requirements.txt
    ```
3. Prepare the databases for the chatbot
    ```bash
    python src/prepare_sqldb.py          # Setup SQLite DB  
    python src/check_sqldb.py            # Inspect DB contents  
    python src/prepare_vectordb.py       # Setup Vector DB  
    python src/check_vectordb.py         # Inspect Vector DB 
    ```
4. Run the chatbot
    - Run in terminal:
        ```bash
        python src/chat_in_terminal.py
        ```
    - Run with Gradio UI:
        ```bash
        python src/chat_in_ui.py
        ```
    
# Project Schemas:
**LLM Default Behavior**

![Schema 1](images/default_behavior.png)

**Concept of Memory**

![Schema 2](images/memory.png)

**Basic Chatbot Schema**

![Schema 3](images/basic_chatbot.png)

**Agentic_Chatbot_v2 Schema**

![Schema 4](images/chatbot_agentic_v2.png)

**Agentic_Chatbot_v3 Schema**

![Schema 5](images/agentic_chatbot_v3.png)

**Longterm Memory with Graph DB and Vector DB using LangGraph**

![Schema 6](images/langgraph_1_schema.png)

**Longterm Memory (Semantic, Episodical, and Procedural) with LangGraph**

![Schema 7](images/langgraph_course_theory.png)

![Schema 8](images/langgraph_2_updated.png)

🧩 Technologies Used
- Python
- openai
- LangChain
- LangGraph
- SQLite
- Chroma (Vector DBs)
- Gradio (UI)

📂 Project Structure (High-Level)
```bash
src/
├── bot.py                     # Terminal-based chatbot
├── bot_ui.py                  # Gradio UI version
├── prepare_sqldb.py           # Creates SQLite DB
├── prepare_vectordb.py        # Creates Vector DB
├── check_sqldb.py             # Checks SQLite DB contents
├── check_vectordb.py          # Checks Vector DB contents
└── utils/
    ├── chat_history_manager.py
    ├── chatbot_agentic_v1.py
    ├── chatbot_agentic_v2.py
    ├── chatbot.py
    ├── config.py
    ├── prepare_system_prompt.py
    ├── search_manager.py
    ├── sql_manager.py
    ├── user_manager.py
    ├── utils.py
    └── vector_db_manager.py

langgraph/
├── online-course/             # Memory system from DeepLearning.ai course
└── website-tutorial/          # Tutorial-based memory system

letta/
├── chatbot_with_longterm_memory.py
└── MemGPT_Paper.pdf           # Research paper reference

data/
├── vectordb/
└── chatbot.db

images/

├── requirements.txt
```
**`src` Folder Structure**

![Schema 9](images/src_structure.png)



