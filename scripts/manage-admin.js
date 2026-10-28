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

function prompt(query) {
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

function validatePasswordStrength(pw) {
  if (pw.length < 10) return 'Password must be at least 10 characters long.';
  if (!/[A-Z]/.test(pw)) return 'Password must contain at least one uppercase letter (A-Z).';
  if (!/[a-z]/.test(pw)) return 'Password must contain at least one lowercase letter (a-z).';
  if (!/[0-9]/.test(pw)) return 'Password must contain at least one digit (0-9).';
  return null;
}

async function run() {
  const args = parseArgs();
  const db = getDb();

  console.log('====================================================');
  console.log('🛡️ Kleenit Ghana - Administrator Security Manager');
  console.log('====================================================');

  if (args.list) {
    const res = await db.execute('SELECT id, username, name, role, created_at, last_login_at FROM admins');
    console.log(`\nFound ${res.rows.length} administrator account(s):`);
    res.rows.forEach((row, i) => {
      console.log(`\n[${i + 1}] Username: ${row.username}`);
      console.log(`    Name:     ${row.name}`);
      console.log(`    Role:     ${row.role}`);
      console.log(`    Created:  ${row.created_at}`);
      console.log(`    Last In:  ${row.last_login_at || 'Never'}`);
    });
    process.exit(0);
  }

  if (args['delete']) {
    const username = String(args['delete']).toLowerCase().trim();
    const countCheck = await db.execute('SELECT COUNT(*) as cnt FROM admins');
    if (Number(countCheck.rows[0]?.cnt || 0) <= 1) {
      console.error('\n⚠️ Security Safeguard: Cannot delete the only administrator account in the system.');
      process.exit(1);
    }

    const delRes = await db.execute({
      sql: 'DELETE FROM admins WHERE username = ?',
      args: [username]
    });

    if (delRes.rowsAffected > 0) {
      console.log(`\n✅ Administrator account "${username}" has been deleted.`);
    } else {
      console.log(`\n❌ Administrator "${username}" was not found.`);
    }
    process.exit(0);
  }

  if (args['remove-test-account']) {
    const testUsername = 'admin@kleenitgh.com';
    const check = await db.execute({
      sql: 'SELECT id FROM admins WHERE username = ?',
      args: [testUsername]
    });
    if (check.rows.length === 0) {
      console.log('\n✅ No test account exists in the database.');
      process.exit(0);
    }

    const total = await db.execute('SELECT COUNT(*) as cnt FROM admins');
    if (Number(total.rows[0]?.cnt || 0) <= 1) {
      console.error('\n⚠️ Warning: "admin@kleenitgh.com" is currently the only administrator account.');
      console.error('Please create your personal admin account first using: npm run init-admin');
      process.exit(1);
    }

    await db.execute({
      sql: 'DELETE FROM admins WHERE username = ?',
      args: [testUsername]
    });
    console.log(`\n✅ Test account "${testUsername}" has been permanently removed.`);
    process.exit(0);
  }

  if (args['change-password']) {
    const username = String(args['change-password']).toLowerCase().trim();
    const check = await db.execute({
      sql: 'SELECT id, username FROM admins WHERE username = ?',
      args: [username]
    });
    if (check.rows.length === 0) {
      console.error(`\n❌ Administrator "${username}" not found.`);
      process.exit(1);
    }

    const newPassword = await prompt(`Enter new secure password for "${username}": `);
    const error = validatePasswordStrength(newPassword);
    if (error) {
      console.error(`\n❌ Insecure Password: ${error}`);
      process.exit(1);
    }

    const hash = await bcrypt.hash(newPassword, 12);
    await db.execute({
      sql: 'UPDATE admins SET password_hash = ? WHERE username = ?',
      args: [hash, username]
    });

    console.log(`\n✅ Password for "${username}" updated successfully with 12-round salted bcrypt encryption.`);
    process.exit(0);
  }

  console.log('\nAvailable Security Commands:');
  console.log('  node scripts/manage-admin.js --list');
  console.log('  node scripts/manage-admin.js --change-password <username>');
  console.log('  node scripts/manage-admin.js --delete <username>');
  console.log('  node scripts/manage-admin.js --remove-test-account');
  process.exit(0);
}

run().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
