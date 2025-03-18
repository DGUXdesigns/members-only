const bcrypt = require('bcryptjs');
const saltRounds = 10;

module.exports = {
  async hashPassword(password) {
    try {
      return await bcrypt.hash(password, saltRounds);
    } catch (error) {
      throw new Error('Hashing failed', error);
    }
  },
};
