import { handleGetStats } from '../../lib/handlers/admin.js';

export default async function handler(req, res) {
  return handleGetStats(req, res);
}
