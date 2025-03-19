const db = require('../config/db');
const { hashPassword } = require('../lib/passwordUtils');

module.exports = {
  async create(firstName, lastName, email, password) {
    const hashedPassword = await hashPassword(password);

    const { rows } = await db.query(
      `
        INSERT INTO users (
          first_name,
          last_name,
          email,
          password
        ) VALUES ($1, $2, $3, $4)
         RETURNING *
      `,
      [firstName, lastName, email, hashedPassword],
    );

    console.log('New User:', rows[0]);
    return rows[0];
  },

  async findByEmail(email) {
    const { rows } = await db.query(
      `
      SELECT * FROM users 
      WHERE email = $1
      `,
      [email],
    );

    return rows[0];
  },

  async findById(id) {
    const { rows } = await db.query(
      `
      SELECT * FROM users
      WHERE id = $1
      `,
      [id],
    );

    return rows[0];
  },
};
