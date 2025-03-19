const db = require('../config/db');

module.exports = {
  async getAll() {
    const { rows } = await db.query(
      `
      SELECT title, content, first_name, last_name FROM users
      JOIN posts ON user.id = user_id
      ORDER BY created_at
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
};
