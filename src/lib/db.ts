// src/lib/db.ts
import mysql from 'mysql2/promise';

// The pool is now a promise to ensure it's resolved before being used.
let pool: mysql.Pool | null = null;

/**
 * Initializes the database connection pool if it doesn't exist.
 * This is designed to work with Next.js's hot-reloading in development.
 */
const initializeDb = () => {
  if (pool) {
    return pool;
  }
  try {
    const newPool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'medical_db',
      port: Number(process.env.DB_PORT) || 3306,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      // Add idle timeout to gracefully handle closed connections
      idleTimeout: 60000, // 60 seconds
      enableKeepAlive: true,
    });
    console.log('Database pool created successfully.');
    pool = newPool;
    return pool;
  } catch (error) {
    console.error('Failed to create database pool:', error);
    // In case of failure, we don't want to cache the broken pool.
    pool = null; 
    throw new Error('Database connection pool failed.');
  }
};

/**
 * Returns a promise that resolves to the database connection pool.
 * It initializes the pool if it's not already created.
 */
export const db = (): mysql.Pool => {
  if (!pool) {
    return initializeDb();
  }
  return pool;
};
