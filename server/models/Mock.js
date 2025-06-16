import { getDatabase } from '../database/init.js';

export class Mock {
  static async findAll() {
    const db = getDatabase();
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM mocks ORDER BY created_at DESC', (err, rows) => {
        if (err) reject(err);
        else resolve(rows.map(row => ({
          ...row,
          request_headers: JSON.parse(row.request_headers || '{}'),
          request_body_schema: JSON.parse(row.request_body_schema || '{}'),
          response_headers: JSON.parse(row.response_headers || '{}'),
          response_body: row.response_body ? JSON.parse(row.response_body) : ''
        })));
      });
    });
  }

  static async findById(id) {
    const db = getDatabase();
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM mocks WHERE id = ?', [id], (err, row) => {
        if (err) reject(err);
        else if (row) {
          resolve({
            ...row,
            request_headers: JSON.parse(row.request_headers || '{}'),
            request_body_schema: JSON.parse(row.request_body_schema || '{}'),
            response_headers: JSON.parse(row.response_headers || '{}'),
            response_body: row.response_body ? JSON.parse(row.response_body) : ''
          });
        } else {
          resolve(null);
        }
      });
    });
  }

  static async findByPathAndMethod(path, method) {
    const db = getDatabase();
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM mocks WHERE path = ? AND method = ?', [path, method.toUpperCase()], (err, row) => {
        if (err) reject(err);
        else if (row) {
          resolve({
            ...row,
            request_headers: JSON.parse(row.request_headers || '{}'),
            request_body_schema: JSON.parse(row.request_body_schema || '{}'),
            response_headers: JSON.parse(row.response_headers || '{}'),
            response_body: row.response_body ? JSON.parse(row.response_body) : ''
          });
        } else {
          resolve(null);
        }
      });
    });
  }

  static async findAllByPathAndMethod(path, method) {
    const db = getDatabase();
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM mocks WHERE path = ? AND method = ?', [path, method.toUpperCase()], (err, rows) => {
        if (err) reject(err);
        else resolve(rows.map(row => ({
          ...row,
          request_headers: JSON.parse(row.request_headers || '{}'),
          request_body_schema: JSON.parse(row.request_body_schema || '{}'),
          response_headers: JSON.parse(row.response_headers || '{}'),
          response_body: row.response_body ? JSON.parse(row.response_body) : ''
        })));
      });
    });
  }

  static async create(mockData) {
    const db = getDatabase();
    const {
      path,
      method,
      request_headers = {},
      request_body_schema = {},
      response_status = 200,
      response_headers = {},
      response_body = {}
    } = mockData;

    return new Promise((resolve, reject) => {
      const stmt = db.prepare(`
        INSERT INTO mocks (path, method, request_headers, request_body_schema, response_status, response_headers, response_body)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);

      stmt.run([
        path,
        method.toUpperCase(),
        JSON.stringify(request_headers),
        JSON.stringify(request_body_schema),
        response_status,
        JSON.stringify(response_headers),
        JSON.stringify(response_body)
      ], function(err) {
        if (err) reject(err);
        else resolve({ id: this.lastID, ...mockData });
      });

      stmt.finalize();
    });
  }

  static async update(id, mockData) {
    const db = getDatabase();
    const {
      path,
      method,
      request_headers = {},
      request_body_schema = {},
      response_status = 200,
      response_headers = {},
      response_body = {}
    } = mockData;

    return new Promise((resolve, reject) => {
      const stmt = db.prepare(`
        UPDATE mocks
        SET path = ?, method = ?, request_headers = ?, request_body_schema = ?,
            response_status = ?, response_headers = ?, response_body = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `);

      stmt.run([
        path,
        method.toUpperCase(),
        JSON.stringify(request_headers),
        JSON.stringify(request_body_schema),
        response_status,
        JSON.stringify(response_headers),
        JSON.stringify(response_body),
        id
      ], function(err) {
        if (err) reject(err);
        else resolve({ id, ...mockData });
      });

      stmt.finalize();
    });
  }

  static async delete(id) {
    const db = getDatabase();
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM mocks WHERE id = ?', [id], function(err) {
        if (err) reject(err);
        else resolve(this.changes > 0);
      });
    });
  }
}
