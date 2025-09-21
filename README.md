# 🧠 Advanced Chatbot with Long-Term Memory

An advanced AI chatbot with agentic capabilities and long-term memory using vector databases and semantic search.

## 🚀 Features
- **Vector Database Integration** (ChromaDB) for semantic memory search
- **Agentic Function Calling** capabilities with OpenAI's API  
- **Advanced Memory Management** (both SQL and vector-based)
- **Robust Error Handling** and fallback mechanisms
- **Production-Ready Architecture**

## 🎯 What This Chatbot Does
- Remembers conversations using semantic search in vector databases
- Can dynamically call functions based on user requests
- Stores user information and retrieves it contextually
- Maintains long-term memory across sessions
- Provides intelligent responses based on conversation history

## 💾 Installation & Setup

### Prerequisites
- Python 3.11 (recommended - Python 3.12 may have compatibility issues)
- OpenAI API key

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Agentic-LongTerm-Memory
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # Linux/Mac
   # or
   venv\Scripts\activate     # Windows
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```

5. **Initialize databases**
   ```bash
   python src/prepare_sqldb.py     # Setup SQLite database
   python src/prepare_vectordb.py  # Setup Vector database
   ```

6. **Verify setup (optional)**
   ```bash
   python src/check_sqldb.py       # Check SQLite database
   python src/check_vectordb.py    # Check Vector database
   ```

7. **Test for production readiness**
   ```bash
   # Quick test (equivalent to npm run build)
   python test_production.py
   
   # Comprehensive test with all tools
   ./test_all.sh      # Linux/Mac
   # or
   test_all.bat       # Windows
   ```

## 🚀 Usage

### Terminal Interface
```bash
python src/chat_in_terminal.py
```

### Web Interface (Gradio UI)
```bash
python src/chat_in_ui.py
```

## 🏗️ Project Structure
```
Agentic-LongTerm-Memory/
├── src/
│   ├── chat_in_terminal.py     # Terminal chat interface
│   ├── chat_in_ui.py          # Web UI chat interface
│   ├── prepare_sqldb.py       # SQL database setup
│   ├── prepare_vectordb.py    # Vector database setup
│   ├── check_sqldb.py         # SQL database checker
│   ├── check_vectordb.py      # Vector database checker
│   └── utils/
│       ├── chatbot.py          # Main chatbot implementation
│       ├── vector_db_manager.py # Vector database management
│       ├── sql_manager.py      # SQL database management
│       ├── chat_history_manager.py # Chat history handling
│       ├── user_manager.py     # User information management
│       ├── search_manager.py   # Search functionality
│       ├── prepare_system_prompt.py # System prompt preparation
│       ├── config.py           # Configuration settings
│       └── utils.py            # Utility functions
├── config/
│   └── config.yml             # Configuration file
├── data/                      # Database files (auto-created)
├── requirements.txt           # Python dependencies
├── docker-compose.yml         # Docker configuration
├── test_production.py        # Production readiness test script
├── tests/                    # Unit tests
└── README.md                 # This file
```

## 🧪 Testing for Production

### Quick Production Test (equivalent to `npm run build`)
```bash
python test_production.py
```

### Manual Testing Commands

#### 1. **Syntax & Import Testing**
```bash
# Test all imports work correctly
python -c "from src.utils.chatbot import Chatbot; print('✅ Chatbot imports successfully')"
python -c "from src.chat_in_terminal import *; print('✅ Terminal app imports successfully')"
python -c "from src.chat_in_ui import *; print('✅ UI app imports successfully')"

# Test syntax of all Python files
python -m py_compile src/utils/*.py
python -m py_compile src/*.py
```

#### 2. **Code Quality & Linting**
```bash
# Install linting tools
pip install flake8 black mypy

# Check code style
flake8 src/ --max-line-length=120

# Format code (optional)
black src/

# Type checking (optional)
mypy src/
```

#### 3. **Database Testing**
```bash
# Test database setup
python src/prepare_sqldb.py
python src/prepare_vectordb.py

# Verify databases
python src/check_sqldb.py
python src/check_vectordb.py
```

#### 4. **Unit Tests**
```bash
# Install pytest
pip install pytest

# Run tests
pytest tests/ -v
```

#### 5. **Integration Testing**
```bash
# Test terminal interface (manual)
python src/chat_in_terminal.py

# Test web interface (manual)
python src/chat_in_ui.py
```

## ⚙️ Configuration

Edit `config/config.yml` to customize:
- OpenAI model settings
- Database paths
- Memory management parameters
- Function call limits

## 🔧 Key Components

- **Chatbot**: Main class with agentic capabilities
- **Vector DB Manager**: Handles semantic search and memory storage
- **SQL Manager**: Manages structured data and chat history
- **User Manager**: Handles user information and preferences
- **Function Calling**: Dynamic function execution based on user input

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

---

*Built with OpenAI GPT models, ChromaDB, and modern Python practices.*