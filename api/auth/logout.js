import { handleLogout } from '../../lib/handlers/auth.js';

export default async function handler(req, res) {
  return handleLogout(req, res);
}
