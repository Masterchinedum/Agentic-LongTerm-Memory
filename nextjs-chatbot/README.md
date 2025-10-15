# 🧠 Advanced Chatbot with Long-Term Memory (Next.js Version)

A sophisticated AI chatbot built with Next.js and TypeScript that features long-term memory capabilities, semantic search, and agentic function calling. This is a complete port of the Python version with all original functionality preserved and enhanced.

## 🚀 Features

- **Vector Database Integration** (ChromaDB) for semantic memory search
- **Agentic Function Calling** capabilities with OpenAI's API  
- **Advanced Memory Management** (both SQL and vector-based)
- **Robust Error Handling** and fallback mechanisms
- **Modern Web Interface** built with Next.js and Tailwind CSS
- **Production-Ready Architecture** with TypeScript

## 🎯 What This Chatbot Does

- Remembers conversations using semantic search in vector databases
- Can dynamically call functions based on user requests
- Stores user information and retrieves it contextually
- Maintains long-term memory across sessions
- Provides intelligent responses based on conversation history
- Real-time web interface with message history

## 💾 Installation & Setup

### Prerequisites

- Node.js 18+ 
- npm or yarn
- OpenAI API Key

### Installation Steps

1. **Clone and navigate to the Next.js version**
   ```bash
   cd nextjs-chatbot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Add your OpenAI API key to .env.local
   echo "OPENAI_API_KEY=your_openai_api_key_here" > .env.local
   ```

4. **Initialize databases**
   The databases will be automatically initialized when you first run the application.

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
nextjs-chatbot/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── chat/route.ts          # Chat API endpoint
│   │   │   └── setup/route.ts         # Database setup endpoint
│   │   ├── globals.css                # Global styles
│   │   ├── layout.tsx                 # Root layout
│   │   └── page.tsx                   # Main chat interface
│   └── lib/
│       ├── chatbot.ts                 # Main chatbot implementation
│       ├── managers/
│       │   ├── chat-history-manager.ts # Chat history handling
│       │   ├── sql-manager.ts         # SQL database management
│       │   ├── user-manager.ts        # User information management
│       │   └── vector-db-manager.ts   # Vector database management
│       ├── setup/
│       │   └── prepare-sqldb.ts       # Database initialization
│       └── utils/
│           ├── config.ts              # Configuration management
│           ├── system-prompt.ts       # System prompt preparation
│           └── utils.ts               # Utility functions
├── src/config/
│   └── config.yml                     # Configuration file
└── data/                              # Database files (auto-created)
    ├── chatbot.db                     # SQLite database
    └── vectordb/                      # ChromaDB files
```

## ⚙️ Configuration

Edit `src/config/config.yml` to customize:
- OpenAI model settings
- Database paths
- Memory management parameters
- Function call limits
- Vector database settings

## 🔧 Key Components

- **Chatbot**: Main class with agentic capabilities
- **Vector DB Manager**: Handles semantic search and memory storage
- **SQL Manager**: Manages structured data and chat history
- **User Manager**: Handles user information and preferences
- **Chat History Manager**: Manages conversation persistence and summarization
- **Function Calling**: Dynamic function execution based on user input

## 🚀 Usage

### Web Interface

1. Start the development server: `npm run dev`
2. Open [http://localhost:3000](http://localhost:3000)
3. Start chatting with the AI assistant
4. The chatbot will remember your conversations and personal information

### API Usage

You can also use the chat API directly:

```javascript
const response = await fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ message: 'Hello, how are you?' })
});

const data = await response.json();
console.log(data.response);
```

## 🧪 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Environment Variables

- `OPENAI_API_KEY` - Your OpenAI API key (required)

## 🆚 Comparison with Python Version

This Next.js version maintains **100% feature parity** with the original Python implementation:

| Feature | Python Version | Next.js Version |
|---------|---------------|----------------|
| Long-term Memory | ✅ ChromaDB | ✅ ChromaDB |
| User Management | ✅ SQLite | ✅ SQLite |
| Function Calling | ✅ OpenAI Functions | ✅ OpenAI Functions |
| Chat Summarization | ✅ | ✅ |
| Vector Search | ✅ | ✅ |
| Session Management | ✅ | ✅ |
| UI | Gradio | Modern React UI |
| Language | Python | TypeScript |
| Architecture | Standalone | Full-stack Web App |

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

---

*Built with Next.js, OpenAI GPT models, ChromaDB, and modern TypeScript practices.*
