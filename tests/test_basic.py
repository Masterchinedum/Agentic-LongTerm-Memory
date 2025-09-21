"""
Basic unit tests for the chatbot components.
Run with: pytest tests/
"""

import pytest
import sys
import os
from pathlib import Path

# Add src to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent / "src"))


def test_config_loading():
    """Test that configuration loads correctly."""
    from utils.config import Config
    
    config = Config()
    assert config.chat_model is not None
    assert config.db_path is not None


def test_chatbot_import():
    """Test that main chatbot class can be imported."""
    from utils.chatbot import Chatbot
    
    # Just test that class can be instantiated (might fail without API key)
    assert Chatbot is not None


def test_database_managers_import():
    """Test that database managers can be imported."""
    from utils.sql_manager import SQLManager
    from utils.vector_db_manager import VectorDBManager
    
    assert SQLManager is not None
    assert VectorDBManager is not None


def test_utility_functions():
    """Test utility functions."""
    from utils.utils import Utils
    
    utils = Utils()
    assert utils is not None


def test_user_manager():
    """Test user manager functionality."""
    from utils.user_manager import UserManager
    from utils.sql_manager import SQLManager
    
    # Test with in-memory database
    sql_manager = SQLManager(":memory:")
    user_manager = UserManager(sql_manager)
    
    assert user_manager is not None
    assert user_manager.user_id is not None