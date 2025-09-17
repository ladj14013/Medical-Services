// src/lib/db.ts
import mysql from 'mysql2/promise';

let pool: mysql.Pool | null = null;

const initializeDb = () => {
    try {
        if (!pool) {
            pool = mysql.createPool({
                host: process.env.DB_HOST || 'localhost',
                user: process.env.DB_USER || 'root',
                password: process.env.DB_PASSWORD || '',
                database: process.env.DB_NAME || 'medical_db',
                port: Number(process.env.DB_PORT) || 3306,
                waitForConnections: true,
                connectionLimit: 10,
                queueLimit: 0,
            });
            console.log('Database pool created successfully.');
        }
        return pool;
    } catch (error) {
        console.error('Failed to create database pool:', error);
        throw new Error('Database connection pool failed.');
    }
}

export const db = () => {
    if (!pool) {
        return initializeDb();
    }
    return pool;
};
