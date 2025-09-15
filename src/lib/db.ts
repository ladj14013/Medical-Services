// src/lib/db.ts
import mysql from 'mysql2/promise';

// This is a simplified connection setup. In a production environment,
// you might want to use a connection pool.
let connection: mysql.Connection | null = null;

export async function db() {
  if (connection) {
    return connection;
  }

  try {
    // Read connection details from environment variables
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: Number(process.env.DB_PORT)
    });
    console.log('Connected to MySQL database!');
    return connection;
  } catch (error) {
    console.error('Failed to connect to the database:', error);
    throw new Error('Database connection failed.');
  }
}
