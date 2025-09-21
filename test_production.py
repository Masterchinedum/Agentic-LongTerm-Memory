#!/usr/bin/env python3
"""
Production readiness test script for the Agentic Chatbot project.
Equivalent to 'npm run build' and 'npm run lint' for Python projects.
"""

import sys
import subprocess
import os
from pathlib import Path


def test_syntax_and_imports():
    """Test Python syntax and imports for all modules."""
    print("🔍 Testing syntax and imports...")
    
    # Add src to Python path
    src_path = Path("src").absolute()
    if str(src_path) not in sys.path:
        sys.path.insert(0, str(src_path))
    
    # Test main modules
    test_imports = [
        "from utils.chatbot import Chatbot",
        "from utils.sql_manager import SQLManager", 
        "from utils.vector_db_manager import VectorDBManager",
        "from utils.user_manager import UserManager",
        "from utils.chat_history_manager import ChatHistoryManager",
        "import chat_in_terminal",
        "import chat_in_ui",
        "import prepare_sqldb",
        "import prepare_vectordb"
    ]
    
    errors = []
    
    for import_stmt in test_imports:
        try:
            # Test the import
            exec(import_stmt)
            module_name = import_stmt.split()[-1]
            print(f"✅ {module_name} - OK")
        except Exception as e:
            print(f"❌ {import_stmt} - ERROR: {str(e)}")
            errors.append(f"Import '{import_stmt}': {str(e)}")
    
    return errors


def test_code_style():
    """Run code style checks."""
    print("\n🎨 Testing code style...")
    
    try:
        # Check if flake8 is available
        result = subprocess.run(
            ["flake8", "src/", "--max-line-length=120", "--ignore=E501,W503"],
            capture_output=True,
            text=True
        )
        
        if result.returncode == 0:
            print("✅ Code style - OK")
            return []
        else:
            print("❌ Code style issues found:")
            print(result.stdout)
            return [f"Code style: {result.stdout}"]
            
    except FileNotFoundError:
        print("⚠️  flake8 not installed - skipping code style check")
        print("   Install with: pip install flake8")
        return []


def test_database_setup():
    """Test database initialization."""
    print("\n💾 Testing database setup...")
    
    try:
        # Test SQL database setup
        subprocess.run([sys.executable, "src/prepare_sqldb.py"], 
                      check=True, capture_output=True)
        print("✅ SQL Database setup - OK")
        
        # Test Vector database setup  
        subprocess.run([sys.executable, "src/prepare_vectordb.py"], 
                      check=True, capture_output=True)
        print("✅ Vector Database setup - OK")
        
        return []
        
    except subprocess.CalledProcessError as e:
        error_msg = f"Database setup failed: {e}"
        print(f"❌ {error_msg}")
        return [error_msg]
    except Exception as e:
        error_msg = f"Database test error: {e}"
        print(f"❌ {error_msg}")
        return [error_msg]


def test_environment():
    """Test environment configuration."""
    print("\n🔧 Testing environment...")
    
    errors = []
    
    # Check for .env file
    env_file = Path(".env")
    if not env_file.exists():
        error_msg = ".env file not found - create it with OPENAI_API_KEY"
        print(f"⚠️  {error_msg}")
        errors.append(error_msg)
    else:
        print("✅ .env file found")
    
    # Check config file
    config_file = Path("config/config.yml")
    if not config_file.exists():
        error_msg = "config/config.yml not found"
        print(f"❌ {error_msg}")
        errors.append(error_msg)
    else:
        print("✅ config.yml found")
    
    return errors


def main():
    """Run all production readiness tests."""
    print("🚀 Running Production Readiness Tests")
    print("=" * 50)
    
    all_errors = []
    
    # Run all tests
    all_errors.extend(test_syntax_and_imports())
    all_errors.extend(test_code_style())
    all_errors.extend(test_environment())
    all_errors.extend(test_database_setup())
    
    # Summary
    print("\n" + "=" * 50)
    if all_errors:
        print("❌ PRODUCTION READINESS: FAILED")
        print(f"\nFound {len(all_errors)} issues:")
        for i, error in enumerate(all_errors, 1):
            print(f"{i}. {error}")
        sys.exit(1)
    else:
        print("✅ PRODUCTION READINESS: PASSED")
        print("\n🎉 Your chatbot is ready for production!")
        sys.exit(0)


if __name__ == "__main__":
    main()