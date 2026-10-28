import { handleListBookings } from '../../../lib/handlers/admin.js';

export default async function handler(req, res) {
  return handleListBookings(req, res);
}
