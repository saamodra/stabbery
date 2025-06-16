import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DB_PATH = join(__dirname, '../data/mocks.db');

let db;

export const initDatabase = async () => {
  return new Promise((resolve, reject) => {
    db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        console.error('Error opening database:', err);
        reject(err);
        return;
      }
      
      console.log('📦 Connected to SQLite database');
      
      // Create tables
      const createMocksTable = `
        CREATE TABLE IF NOT EXISTS mocks (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          path TEXT NOT NULL,
          method TEXT NOT NULL,
          request_headers TEXT DEFAULT '{}',
          request_body_schema TEXT DEFAULT '{}',
          response_status INTEGER DEFAULT 200,
          response_headers TEXT DEFAULT '{}',
          response_body TEXT DEFAULT '{}',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(path, method)
        )
      `;
      
      const createLogsTable = `
        CREATE TABLE IF NOT EXISTS request_logs (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          method TEXT NOT NULL,
          path TEXT NOT NULL,
          headers TEXT DEFAULT '{}',
          body TEXT DEFAULT '{}',
          response_status INTEGER,
          response_body TEXT DEFAULT '{}',
          matched_mock_id INTEGER,
          timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (matched_mock_id) REFERENCES mocks (id)
        )
      `;
      
      db.run(createMocksTable, (err) => {
        if (err) {
          console.error('Error creating mocks table:', err);
          reject(err);
          return;
        }
        
        db.run(createLogsTable, (err) => {
          if (err) {
            console.error('Error creating logs table:', err);
            reject(err);
            return;
          }
          
          console.log('✅ Database tables initialized');
          resolve();
        });
      });
    });
  });
};

export const getDatabase = () => {
  if (!db) {
    throw new Error('Database not initialized');
  }
  return db;
};