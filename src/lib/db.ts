// src/lib/db.ts
import mysql from 'mysql2/promise';

// This is a more robust connection setup using a connection pool.
// It's better for performance and scalability.
let pool: mysql.Pool | null = null;

export function db() {
  if (pool) {
    return pool;
  }

  try {
    // Read connection details from environment variables
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: Number(process.env.DB_PORT),
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
    
    console.log('Connected to MySQL database using connection pool!');
    return pool;

  } catch (error) {
    console.error('Failed to create database pool:', error);
    throw new Error('Database connection pool failed.');
  }
}
