import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getDb } from '../lib/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigration() {
  console.log('🚀 Running database migration for Turso...');
  
  try {
    const db = getDb();
    const schemaPath = path.join(__dirname, '..', 'db', 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    // Strip line comments (-- ...) and block comments
    const cleanSql = schemaSql
      .replace(/--.*$/gm, '')
      .replace(/\/\*[\s\S]*?\*\//g, '');

    // Split SQL into individual statements
    const statements = cleanSql
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);

    console.log(`Found ${statements.length} schema statements to execute.`);

    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i];
      await db.execute(stmt);
      const match = stmt.match(/CREATE\s+(TABLE|INDEX)\s+(?:IF\s+NOT\s+EXISTS\s+)?([^\s(]+)/i);
      const targetName = match ? match[2] : `Statement #${i + 1}`;
      console.log(`  ✓ Created/verified: ${targetName}`);
    }

    console.log('✅ Turso database migration completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
    process.exit(1);
  }
}

runMigration();
