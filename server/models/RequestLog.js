import { getDatabase } from '../database/init.js';

export class RequestLog {
  static async findAll(limit = 100) {
    const db = getDatabase();
    return new Promise((resolve, reject) => {
      db.all(`
        SELECT rl.*, m.path as mock_path, m.method as mock_method
        FROM request_logs rl
        LEFT JOIN mocks m ON rl.matched_mock_id = m.id
        ORDER BY rl.timestamp DESC
        LIMIT ?
      `, [limit], (err, rows) => {
        if (err) reject(err);
        else resolve(rows.map(row => ({
          ...row,
          headers: JSON.parse(row.headers || '{}'),
          body: row.body ? JSON.parse(row.body) : null,
          response_body: row.response_body ? JSON.parse(row.response_body) : null
        })));
      });
    });
  }

  static async create(logData) {
    const db = getDatabase();
    const {
      method,
      path,
      headers = {},
      body = null,
      response_status,
      response_body = null,
      matched_mock_id = null
    } = logData;

    return new Promise((resolve, reject) => {
      const stmt = db.prepare(`
        INSERT INTO request_logs (method, path, headers, body, response_status, response_body, matched_mock_id)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);
      
      stmt.run([
        method,
        path,
        JSON.stringify(headers),
        JSON.stringify(body),
        response_status,
        JSON.stringify(response_body),
        matched_mock_id
      ], function(err) {
        if (err) reject(err);
        else resolve({ id: this.lastID, ...logData });
      });
      
      stmt.finalize();
    });
  }

  static async deleteAll() {
    const db = getDatabase();
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM request_logs', (err) => {
        if (err) reject(err);
        else resolve(true);
      });
    });
  }
}