import { handleChangePassword } from '../../lib/handlers/auth.js';

export default async function handler(req, res) {
  return handleChangePassword(req, res);
}

