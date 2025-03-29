const db = require('../config/db');

module.exports = {
  async getAll() {
    const { rows } = await db.query(
      `
      SELECT 
        posts.title, 
        posts.content, 
        CONCAT(users.first_name, ' ', users.last_name) AS Author,
        TO_CHAR(posts.created_at, 'Mon DD, YYYY at HH12:MI AM') AS created_at
      FROM users
      JOIN posts ON users.id = user_id
      ORDER BY posts.created_at DESC;
      `,
    );

    return rows;
  },

  async getUsersPosts(userId) {
    const { rows } = await db.query(
      `
      SELECT first_name, last_name, title, content, created_at
      FROM users
      JOIN posts ON users.id = posts.user_id
      WHERE users.id = $1
      ORDER BY created_at DESC
      `,
      [userId],
    );

    return rows;
  },

  async create(title, content, userId) {
    await db.query(
      `
      INSERT INTO posts (
        title,
        content,
        user_id
      ) VALUES ($1, $2, $3);
      `,
      [title, content, userId],
    );
  },

  async delete(postId) {
    await db.query('DELETE FROM posts WHERE id = $1;', [postId]);
  },
};
