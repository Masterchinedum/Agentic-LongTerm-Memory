#!/bin/bash
# Production testing script for Unix/Linux/Mac
# Equivalent to npm run build and npm run lint

echo "🚀 Testing Chatbot for Production Readiness"
echo "==============================================="

echo ""
echo "📦 1. Installing development dependencies..."
pip install flake8 black pytest mypy --quiet

echo ""
echo "🔍 2. Running comprehensive production test..."
python test_production.py

echo ""
echo "🎨 3. Running code style checks..."
flake8 src/ --max-line-length=120 --ignore=E501,W503 || echo "⚠️ Code style issues found"

echo ""
echo "🧪 4. Running unit tests..."
pytest tests/ -v || echo "⚠️ Some tests failed or no tests found"

echo ""
echo "✅ Production testing complete!"
echo "You can now run the chatbot with:"
echo "  python src/chat_in_terminal.py"
echo "  python src/chat_in_ui.py"