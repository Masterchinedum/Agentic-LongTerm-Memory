import * as fs from 'fs';
import * as path from 'path';
import sqlite3 from 'sqlite3';

export function createUserInfo(): Promise<void> {
  return new Promise((resolve, reject) => {
    // Create data directory if it doesn't exist
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
      console.log(`Directory '${dataDir}' was created.`);
    }

    // Connect to SQLite database (or create it if it doesn't exist)
    const dbPath = path.join(dataDir, 'chatbot.db');
    const conn = new sqlite3.Database(dbPath);

    // Create Tables
    const createTablesSQL = `
      CREATE TABLE IF NOT EXISTS user_info (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          last_name TEXT NOT NULL,
          occupation TEXT NOT NULL,
          location TEXT NOT NULL,
          age INTEGER,
          gender TEXT,
          interests TEXT
      );

      CREATE TABLE IF NOT EXISTS chat_history (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER,
          timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
          question TEXT NOT NULL,
          answer TEXT NOT NULL,
          session_id TEXT NOT NULL,
          FOREIGN KEY (user_id) REFERENCES user_info(id)
      );

      CREATE TABLE IF NOT EXISTS summary (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER,
          session_id TEXT NOT NULL,
          summary_text TEXT NOT NULL,
          timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES user_info(id)
      );
    `;

    conn.exec(createTablesSQL, (err) => {
      if (err) {
        console.error('Error creating tables:', err);
        reject(err);
      } else {
        console.log('✅ Database tables created successfully!');
        console.log('📝 The database is now ready for use with your chatbot.');
        
        conn.close((closeErr) => {
          if (closeErr) {
            reject(closeErr);
          } else {
            resolve();
          }
        });
      }
    });
  });
}

// For command line usage
if (require.main === module) {
  createUserInfo()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Failed to create database:', error);
      process.exit(1);
    });
}