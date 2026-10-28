import { handleMe } from '../../lib/handlers/auth.js';

export default async function handler(req, res) {
  return handleMe(req, res);
}
