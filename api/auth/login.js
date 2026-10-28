import { handleLogin } from '../../lib/handlers/auth.js';

export default async function handler(req, res) {
  return handleLogin(req, res);
}
