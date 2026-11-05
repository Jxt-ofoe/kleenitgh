/**
 * Safely parse JSON body from incoming request
 */
export async function readJsonBody(req) {
  if (req.body && typeof req.body === 'object') {
    return req.body;
  }
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body);
    } catch {
      return null;
    }
  }

  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      // Safeguard against oversized payloads (max 1MB)
      if (body.length > 1e6) {
        req.destroy();
        resolve(null);
      }
    });
    req.on('end', () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch {
        resolve(null);
      }
    });
    req.on('error', () => resolve(null));
  });
}

/**
 * Send JSON response
 */
export function sendJson(res, statusCode, data, headers = {}) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  for (const [key, val] of Object.entries(headers)) {
    res.setHeader(key, val);
  }
  res.end(JSON.stringify(data));
}

/**
 * Normalize a Ghanaian phone number to international format.
 */
export function normalizeGhanaPhone(phone) {
  if (typeof phone !== 'string') return '';

  let digits = phone.replace(/\D/g, '');
  if (digits.startsWith('00')) digits = digits.slice(2);

  if (digits.startsWith('233')) {
    digits = digits.slice(3);
  } else if (digits.startsWith('0')) {
    digits = digits.slice(1);
  }

  return /^[2-5]\d{8}$/.test(digits) ? `+233${digits}` : '';
}

/**
 * Sanitize and validate phone numbers for Ghana / international WhatsApp
 * e.g., '054 402 6418' -> '233544026418'
 * '+233 54 402 6418' -> '233544026418'
 */
export function formatPhoneForWhatsApp(phone) {
  if (!phone) return '';
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('0') && digits.length === 10) {
    return '233' + digits.substring(1);
  }
  if (digits.startsWith('233') && digits.length === 12) {
    return digits;
  }
  return digits;
}

/**
 * Simple string sanitizer
 */
export function sanitize(str, maxLength = 255) {
  if (!str || typeof str !== 'string') return '';
  return str.trim().substring(0, maxLength);
}
