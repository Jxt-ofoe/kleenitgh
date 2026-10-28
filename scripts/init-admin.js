import crypto from 'crypto';
import readline from 'readline';
import bcrypt from 'bcryptjs';
import { getDb } from '../lib/db.js';

function parseArgs() {
  const args = process.argv.slice(2);
  const parsed = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith('--')) {
      const key = args[i].substring(2);
      const val = args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : true;
      parsed[key] = val;
    }
  }
  return parsed;
}

function prompt(query, hideInput = false) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise(resolve => {
    rl.question(query, answer => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

async function initAdmin() {
  console.log('====================================================');
  console.log('🔐 Kleenit Ghana - Administrator Initialization');
  console.log('====================================================');

  const args = parseArgs();
  let username = args.username;
  let password = args.password;
  let name = args.name;

  if (!username) {
    username = await prompt('Enter admin username or email: ');
  }
  if (!username || username.length < 3) {
    console.error('❌ Username must be at least 3 characters long.');
    process.exit(1);
  }

  username = username.toLowerCase().trim();

  if (!name) {
    name = await prompt('Enter administrator display name: ');
  }
  if (!name) {
    name = 'Administrator';
  }

  if (!password) {
    password = await prompt('Enter a secure password (min 8 chars): ');
  }
  if (!password || password.length < 8) {
    console.error('❌ Password must be at least 8 characters long.');
    process.exit(1);
  }

  try {
    const db = getDb();
    console.log('\nConnecting to database...');

    // Check if admin with this username already exists
    const existing = await db.execute({
      sql: 'SELECT id, username, name FROM admins WHERE username = ?',
      args: [username],
    });

    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    const now = new Date().toISOString();

    if (existing.rows.length > 0) {
      console.log(`Administrator "${username}" already exists. Updating password and name...`);
      await db.execute({
        sql: 'UPDATE admins SET password_hash = ?, name = ? WHERE username = ?',
        args: [passwordHash, name, username],
      });
      console.log(`✅ Administrator "${username}" updated successfully!`);
    } else {
      const id = crypto.randomUUID();
      await db.execute({
        sql: `INSERT INTO admins (id, username, password_hash, name, role, created_at)
              VALUES (?, ?, ?, ?, 'admin', ?)`,
        args: [id, username, passwordHash, name, now],
      });
      console.log(`✅ Administrator account "${username}" created successfully!`);
    }

    console.log(`\nYou can now log in at /admin with:`);
    console.log(`  Username: ${username}`);
    console.log(`  Password: [HIDDEN]`);
    console.log('====================================================');
    process.exit(0);
  } catch (err) {
    console.error('❌ Failed to initialize administrator:', err.message);
    process.exit(1);
  }
}

initAdmin();
