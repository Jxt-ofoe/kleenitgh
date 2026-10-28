import { createClient } from '@libsql/client';
import dotenv from 'dotenv';

// Ensure environment variables are loaded
dotenv.config();

let clientInstance = null;

/**
 * Returns the Turso / LibSQL client instance.
 * Reuses the existing client instance when available.
 */
export function getDb() {
  if (clientInstance) {
    return clientInstance;
  }

  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url) {
    throw new Error(
      'Missing TURSO_DATABASE_URL environment variable. Please configure it in your .env or hosting provider.'
    );
  }

  clientInstance = createClient({
    url,
    authToken: authToken || undefined,
  });

  return clientInstance;
}

/**
 * Helper to execute a parameterized query with clean error reporting
 * @param {string} sql 
 * @param {Array|Object} args 
 */
export async function query(sql, args = []) {
  const db = getDb();
  try {
    return await db.execute({ sql, args });
  } catch (error) {
    // Log internally without exposing credentials
    console.error('[Database Query Error]:', error.message);
    throw error;
  }
}
