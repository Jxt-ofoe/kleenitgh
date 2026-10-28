import { handleTrackWhatsApp } from '../../lib/handlers/bookings.js';

export default async function handler(req, res) {
  return handleTrackWhatsApp(req, res);
}
