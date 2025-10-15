import sqlite3, { Database } from 'sqlite3';

type QueryResult = Record<string, unknown>;

export class SQLManager {
  private db: Database;

  constructor(dbPath: string) {
    this.db = new sqlite3.Database(dbPath);
  }

  async executeQuery<T extends QueryResult = QueryResult>(
    query: string,
    params: unknown[] = [],
    fetchOne: boolean = false,
    fetchAll: boolean = false
  ): Promise<T[] | T | null> {
    return new Promise((resolve, reject) => {
      if (fetchOne) {
        this.db.get(query, params, (err, row: T | undefined) => {
          if (err) {
            reject(err);
          } else {
            resolve(row || null);
          }
        });
      } else if (fetchAll) {
        this.db.all(query, params, (err, rows: T[]) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        });
      } else {
        this.db.run(query, params, function(err) {
          if (err) {
            reject(err);
          } else {
            resolve(null);
          }
        });
      }
    });
  }

  close(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.close((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}