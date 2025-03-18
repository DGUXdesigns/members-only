const { Client } = require('pg');
const { hashPassword } = require('../lib/passwordUtils');

const client = new Client({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT || 5432,
});

const tableSQL = `
  CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    is_member BOOLEAN DEFAULT FALSE
  );

  CREATE TABLE IF NOT EXISTS posts (
    id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    user_id INT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );
`;

const userSQL = `
  INSERT INTO users (first_name, last_name, email, password, is_member) VALUES
    ('John', 'Doe', 'john.doe@example.com', $1, TRUE), 
    ('Jane', 'Smith', 'jane.smith@example.com', $2, FALSE), 
    ('Alice', 'Johnson', 'alice.j@example.com', $3, TRUE), 
    ('Bob', 'Brown', 'bob.brown@example.com', $4, TRUE); 
`;

const postsSQL = `
  INSERT INTO posts (title, content, user_id) VALUES
    ('Welcome to the Clubhouse', 'This is our first post! Excited to see what everyone shares.', 1),
    ('Mysterious Encounter', 'I once met a stranger who knew everything about me... still wondering how.', 2),
    ('The Secret Ingredient', 'I discovered the best recipe ever. But should I share it?', 3),
    ('Life in the Shadows', 'Being anonymous has its perks. But sometimes, I want to be seen.', 4);
`;

async function populateDB() {
  try {
    console.log('Populating database...');
    await client.connect();

    // hash passwords
    const hashedPasswords = {
      john: await hashPassword('password123'),
      jane: await hashPassword('securepass'),
      alice: await hashPassword('mypassword'),
      bob: await hashPassword('letmein'),
    };

    await client.query(tableSQL);
    await client.query(userSQL, [
      hashedPasswords.john,
      hashedPasswords.jane,
      hashedPasswords.alice,
      hashedPasswords.bob,
    ]);
    await client.query(postsSQL);
    console.log('Database populated successfully!');
  } catch (error) {
    console.error('Error populating database:', error);
  } finally {
    await client.end();
  }
}

populateDB();
