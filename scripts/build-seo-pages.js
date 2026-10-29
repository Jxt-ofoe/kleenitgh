import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// ============================================================================
// CONSTANTS & BUSINESS FACTS
// ============================================================================
const COMPANY_NAME = 'Kleenit Ghana Limited';
const PHONE_NUMBER = '054 402 6418';
const WHATSAPP_LINK = 'https://wa.me/233544026418';
const ADDRESS_STREET = '1 Flower Street, Dome Pillar 2';
const ADDRESS_FULL = '1 Flower Street, Dome Pillar 2, Accra';
const EMAIL_ADDRESS = 'kleenitgh@yahoo.com'; // User requested: do not replace the email
const OPERATING_SINCE = 'September 2019';
const PROJECTS_COMPLETED = '400+';
const BASE_URL = 'https://www.kleenitgh.com';

// Common LocalBusiness JSON-LD
const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "CleaningService",
  "@id": `${BASE_URL}/#organization`,
  "name": COMPANY_NAME,
  "image": `${BASE_URL}/logo.jpg`,
  "url": BASE_URL,
  "telephone": "+233544026418",
  "email": EMAIL_ADDRESS,
  "priceRange": "GH₵₵",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": ADDRESS_STREET,
    "addressLocality": "Accra",
    "addressRegion": "Greater Accra",
    "addressCountry": "GH"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 5.642593,
    "longitude": -0.223838
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      "opens": "07:30",
      "closes": "18:00"
    }
  ],
  "sameAs": [
    "https://facebook.com/TODO_SOCIAL_LINK",
    "https://instagram.com/TODO_SOCIAL_LINK"
  ],
  "areaServed": [
    { "@type": "City", "name": "Accra" },
    { "@type": "AdministrativeArea", "name": "Dome" },
    { "@type": "AdministrativeArea", "name": "East Legon" },
    { "@type": "AdministrativeArea", "name": "Cantonments" },
    { "@type": "AdministrativeArea", "name": "Airport Residential Area" },
    { "@type": "AdministrativeArea", "name": "Osu" },
    { "@type": "AdministrativeArea", "name": "Spintex" },
    { "@type": "AdministrativeArea", "name": "Tema" },
    { "@type": "AdministrativeArea", "name": "Dzorwulu" },
    { "@type": "AdministrativeArea", "name": "Labone" }
  ]
};

// ============================================================================
// SHARED HTML SNIPPETS
// ============================================================================
function renderHead({ title, description, canonicalPath, schemaObjects = [] }) {
  const canonicalUrl = `${BASE_URL}${canonicalPath}`;
  const allSchemas = [localBusinessSchema, ...schemaObjects];

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <meta name="description" content="${description}" />
  <link rel="canonical" href="${canonicalUrl}" />
  
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website" />
  <meta property="og:url" content="${canonicalUrl}" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:image" content="${BASE_URL}/logo.jpg" />
  <meta property="og:locale" content="en_GH" />

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:url" content="${canonicalUrl}" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${description}" />
  <meta name="twitter:image" content="${BASE_URL}/logo.jpg" />

  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;600;700&display=swap" rel="stylesheet">
  
  <!-- FontAwesome -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
  
  <!-- Favicon -->
  <link rel="icon" type="image/jpeg" href="/favicon.jpg" />

  <!-- Structured Data JSON-LD -->
  <script type="application/ld+json">
  ${JSON.stringify(allSchemas, null, 2)}
  </script>
</head>
<body>`;
}

function renderNavbar(activePage = '') {
  return `  <!-- Navbar -->
  <nav class="navbar" id="navbar">
    <div class="container nav-container">
      <a href="/" class="logo">
        <span class="logo-icon"><i class="fa-solid fa-sparkles"></i></span>
        Kleenit <span class="logo-accent">Ghana Limited</span>
      </a>
      <ul class="nav-links">
        <li><a href="/" class="${activePage === 'home' ? 'active' : ''}">Home</a></li>
        <li><a href="/about" class="${activePage === 'about' ? 'active' : ''}">About</a></li>
        <li><a href="/services" class="${activePage === 'services' ? 'active' : ''}">Services</a></li>
        <li><a href="/gallery" class="${activePage === 'gallery' ? 'active' : ''}">Gallery</a></li>
        <li><a href="/contact" class="${activePage === 'contact' ? 'active' : ''}">Contact</a></li>
        <li><a href="tel:0544026418" class="nav-phone-link"><i class="fa-solid fa-phone"></i> 054 402 6418</a></li>
      </ul>
      <div class="mobile-menu-btn" aria-label="Toggle Navigation Menu">
        <i class="fa-solid fa-bars"></i>
      </div>
    </div>
  </nav>`;
}

function renderBookingForm(prefillService = '', formSubtitle = 'Fill in the form below. We save your booking immediately and connect with you on WhatsApp.') {
  const serviceOptions = [
    { group: "Residential Services", items: [
      "Regular Home Cleaning", "Deep Cleaning", "Move-in / Move-out Cleaning",
      "Upholstery & Carpet Cleaning", "Mattress Cleaning", "Window Cleaning",
      "Tile & Grout Cleaning", "Kitchen Deep Cleaning", "Refrigerator/Oven Cleaning",
      "Airbnb / Short-let Turnover"
    ]},
    { group: "Commercial Services", items: [
      "Office Janitorial Service", "Washroom Cleaning", "Facade/Exterior Cleaning",
      "Industrial/Warehouse Cleaning", "Pressure Washing", "Event Cleaning",
      "Full-time Cleaner Outsourcing", "Swimming Pool Cleaning"
    ]},
    { group: "Specialized Services", items: [
      "Post-construction Cleaning", "Fumigation & Pest Control",
      "Disinfection & Sanitization", "Medical Facility Cleaning"
    ]}
  ];

  let optionsHtml = '<option value="" disabled>-- Select a Cleaning Service --</option>';
  for (const grp of serviceOptions) {
    optionsHtml += `<optgroup label="${grp.group}">`;
    for (const item of grp.items) {
      const isSelected = (item.toLowerCase() === prefillService.toLowerCase()) ? 'selected' : '';
      optionsHtml += `<option value="${item}" ${isSelected}>${item}</option>`;
    }
    optionsHtml += `</optgroup>`;
  }
  optionsHtml += `<option value="Other / Custom Service">Other / Custom Cleaning Service</option>`;

  return `      <!-- Booking Form Card -->
      <div class="contact-form-container" id="contact">
        <form class="contact-form" id="contact-form" data-prefill-service="${prefillService}" novalidate>
          <div class="form-title-wrap">
            <h3 class="form-title">Request a Booking / Quote</h3>
            <p class="form-subtitle">${formSubtitle}</p>
          </div>

          <!-- Live Error Notification Banner -->
          <div id="booking-error" class="form-alert form-alert-error" style="display: none;" role="alert">
            <div class="alert-content">
              <i class="fa-solid fa-circle-exclamation alert-icon"></i>
              <div>
                <strong class="alert-title">Booking could not be saved</strong>
                <p id="booking-error-text" class="alert-desc">Please check your details and try again.</p>
              </div>
            </div>
            <button type="button" class="btn-retry" id="btn-retry-booking">Retry</button>
          </div>

          <!-- Live Success Notification Modal / Box -->
          <div id="booking-success" class="form-alert form-alert-success" style="display: none;" role="status">
            <i class="fa-solid fa-circle-check alert-icon"></i>
            <div>
              <strong class="alert-title">Booking Saved Successfully!</strong>
              <p class="alert-desc">Reference: <span id="booking-ref-display" class="booking-ref-badge"></span></p>
              <p class="alert-subtext">Opening WhatsApp now to confirm your schedule with our team...</p>
              <a id="btn-manual-whatsapp" href="#" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-whatsapp mt-2">
                <i class="fa-brands fa-whatsapp"></i> Open WhatsApp Now
              </a>
            </div>
          </div>

          <!-- 15% November Promo Applied Banner -->
          <div id="booking-promo-applied" class="promo-applied-badge" style="display: none;">
            <div class="promo-applied-content">
              <span class="promo-sparkle"><i class="fa-solid fa-gift"></i></span>
              <div>
                <strong>15% November Discount Applied!</strong>
                <p>Promo code <span class="promo-code-pill">NOV15</span> will be included with your booking request.</p>
              </div>
            </div>
            <button type="button" id="btn-remove-promo" class="btn-remove-promo" title="Remove promotion">&times;</button>
          </div>

          <div class="form-group">
            <label for="contact-name">Full Name <span class="required-star">*</span></label>
            <input type="text" id="contact-name" name="customer_name" placeholder="e.g. Kwesi Mensah" required />
            <span class="field-error" id="error-name"></span>
          </div>

          <div class="form-row-2">
            <div class="form-group">
              <label for="contact-phone">Phone Number (WhatsApp) <span class="required-star">*</span></label>
              <input type="tel" id="contact-phone" name="customer_phone" placeholder="e.g. 054 402 6418" required />
              <span class="field-error" id="error-phone"></span>
            </div>

            <div class="form-group">
              <label for="contact-email">Email Address <span class="text-muted">(Optional)</span></label>
              <input type="email" id="contact-email" name="customer_email" placeholder="e.g. kwesi@example.com" />
              <span class="field-error" id="error-email"></span>
            </div>
          </div>

          <div class="form-group">
            <label for="contact-service">Service Requested <span class="required-star">*</span></label>
            <select id="contact-service" name="service" required>
              ${optionsHtml}
            </select>
            <span class="field-error" id="error-service"></span>
          </div>

          <div class="form-row-2">
            <div class="form-group">
              <label for="contact-date">Preferred Date <span class="text-muted">(Optional)</span></label>
              <input type="date" id="contact-date" name="booking_date" />
            </div>

            <div class="form-group">
              <label for="contact-time">Preferred Time <span class="text-muted">(Optional)</span></label>
              <select id="contact-time" name="booking_time">
                <option value="">Any Time (Flexible)</option>
                <option value="Morning (8:00 AM - 12:00 PM)">Morning (8:00 AM - 12:00 PM)</option>
                <option value="Afternoon (12:00 PM - 4:00 PM)">Afternoon (12:00 PM - 4:00 PM)</option>
                <option value="Evening (4:00 PM - 7:00 PM)">Evening (4:00 PM - 7:00 PM)</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label for="contact-message">Additional Details / Space Description</label>
            <textarea id="contact-message" name="message" placeholder="Provide any details about the property (e.g., number of rooms, specific areas, timeline)..." rows="4"></textarea>
          </div>

          <button type="submit" id="booking-submit-btn" class="btn btn-primary w-100">
            <span class="btn-content-default">
              <i class="fa-solid fa-calendar-check"></i> Submit Booking & Open WhatsApp
            </span>
            <span class="btn-content-loading" style="display: none;">
              <i class="fa-solid fa-circle-notch fa-spin"></i> Saving Booking in Database...
            </span>
          </button>
          <p class="form-trust-note">
            <i class="fa-solid fa-shield-halved"></i> Your booking is securely recorded in our system before WhatsApp opens.
          </p>
        </form>
      </div>`;
}

function renderFooter() {
  return `  <!-- Footer -->
  <footer class="footer">
    <div class="container footer-multi-col">
      <!-- Col 1: Brand & Identity -->
      <div class="footer-col">
        <a href="/" class="logo footer-logo">
          <span class="logo-icon"><i class="fa-solid fa-sparkles"></i></span>
          Kleenit <span class="logo-accent">Ghana Limited</span>
        </a>
        <p>Professional cleaning and fumigation services in Accra, Ghana. Operating since ${OPERATING_SINCE} with ${PROJECTS_COMPLETED} successful projects completed.</p>
        <div class="footer-badge-note">
          <i class="fa-solid fa-certificate"></i> Scrupulously Clean • Reliable • Detail-Oriented
        </div>
        <ul class="footer-contact-list">
          <li class="footer-contact-item">
            <i class="fa-solid fa-location-dot"></i>
            <span>${ADDRESS_FULL} <small class="text-muted">(By appointment only)</small></span>
          </li>
          <li class="footer-contact-item">
            <i class="fa-solid fa-phone"></i>
            <a href="tel:0544026418">${PHONE_NUMBER}</a>
          </li>
          <li class="footer-contact-item">
            <i class="fa-brands fa-whatsapp"></i>
            <a href="${WHATSAPP_LINK}" target="_blank" rel="noopener noreferrer">WhatsApp: ${PHONE_NUMBER}</a>
          </li>
          <li class="footer-contact-item">
            <i class="fa-solid fa-envelope"></i>
            <a href="mailto:${EMAIL_ADDRESS}">${EMAIL_ADDRESS}</a>
          </li>
        </ul>
      </div>

      <!-- Col 2: Core Services -->
      <div class="footer-col">
        <h4>Core Cleaning Services</h4>
        <ul class="footer-links-list">
          <li><a href="/home-cleaning">Regular Home Cleaning</a></li>
          <li><a href="/office-janitorial">Office & Janitorial Cleaning</a></li>
          <li><a href="/post-construction-cleaning">Post-Construction Cleaning</a></li>
          <li><a href="/airbnb-turnover-cleaning">Airbnb & Short-let Turnover</a></li>
          <li><a href="/fumigation-pest-control">Fumigation & Pest Control</a></li>
          <li><a href="/medical-facility-cleaning">Medical Facility Cleaning</a></li>
          <li><a href="/services/deep-cleaning">Residential Deep Cleaning</a></li>
          <li><a href="/services/move-in-out-cleaning">Move-in / Move-out Cleaning</a></li>
        </ul>
      </div>

      <!-- Col 3: Specialized Cleaning -->
      <div class="footer-col">
        <h4>Specialized Solutions</h4>
        <ul class="footer-links-list">
          <li><a href="/services/upholstery-cleaning">Sofa & Carpet Cleaning</a></li>
          <li><a href="/services/mattress-cleaning">Mattress Sanitization</a></li>
          <li><a href="/services/window-cleaning">Window & Glass Cleaning</a></li>
          <li><a href="/services/tile-grout-cleaning">Tile & Grout Deep Cleaning</a></li>
          <li><a href="/services/kitchen-deep-cleaning">Kitchen Deep Cleaning</a></li>
          <li><a href="/services/commercial-cleaning">Commercial Cleaning</a></li>
          <li><a href="/services/pressure-washing">High-Pressure Washing</a></li>
          <li><a href="/services/event-cleaning">Pre & Post Event Cleaning</a></li>
        </ul>
      </div>

      <!-- Col 4: Service Areas in Accra -->
      <div class="footer-col">
        <h4>Areas Served in Accra</h4>
        <ul class="footer-links-list">
          <li><a href="/areas/dome">Dome & Dome Pillar 2 (Office)</a></li>
          <li><a href="/areas/east-legon">East Legon</a></li>
          <li><a href="/areas/cantonments">Cantonments</a></li>
          <li><a href="/areas/airport-residential">Airport Residential Area</a></li>
          <li><a href="/areas/osu">Osu</a></li>
          <li><a href="/areas/spintex">Spintex Road</a></li>
          <li><a href="/areas/tema">Tema & Communities</a></li>
          <li><a href="/areas/dzorwulu">Dzorwulu</a></li>
          <li><a href="/areas/labone">Labone</a></li>
        </ul>
      </div>
    </div>

    <div class="footer-bottom">
      <div class="container footer-bottom-inner" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
        <p>&copy; 2026 ${COMPANY_NAME}. All Rights Reserved.</p>
        <p class="text-muted" style="font-size: 0.85rem;">Scrupulously Clean • 1 Flower Street, Dome Pillar 2, Accra</p>
      </div>
    </div>
  </footer>

  <!-- Floating WhatsApp Button -->
  <a href="${WHATSAPP_LINK}" class="whatsapp-float" target="_blank" rel="noopener noreferrer" title="Chat on WhatsApp">
    <i class="fa-brands fa-whatsapp"></i>
  </a>

  <!-- Floating November Promo Badge -->
  <button id="promo-floating-badge" class="promo-float-badge" aria-label="View November 15% Discount" title="Click to view November 15% Discount">
    <span class="badge-pulse"></span>
    <i class="fa-solid fa-gift"></i>
    <span class="badge-label"><strong>15% OFF</strong> November Special</span>
  </button>

  <!-- 15% November Promotion Popup Modal -->
  <div id="promo-popup-modal" class="promo-overlay" style="display: none;" role="dialog" aria-modal="true" aria-labelledby="promo-title">
    <div class="promo-card">
      <button type="button" id="btn-close-promo" class="promo-close-btn" aria-label="Close promotion">&times;</button>
      
      <div class="promo-badge-top">
        <i class="fa-solid fa-sparkles"></i> EXCLUSIVE WEBSITE OFFER
      </div>

      <div class="promo-header">
        <span class="promo-tagline">🍂 SPECIAL NOVEMBER PROMOTION</span>
        <h2 id="promo-title" class="promo-headline">Get <span class="highlight-discount">15% OFF</span> All Cleaning Services!</h2>
        <p class="promo-desc">
          Book any cleaning service directly through our website and enjoy an exclusive <strong>15% discount</strong> applied to your booking quote!
        </p>
      </div>

      <div class="promo-features">
        <div class="promo-feature-item">
          <i class="fa-solid fa-circle-check"></i>
          <span>Valid for Home, Deep & Move-in Cleaning</span>
        </div>
        <div class="promo-feature-item">
          <i class="fa-solid fa-circle-check"></i>
          <span>Valid for Offices, Fumigation & Upholstery</span>
        </div>
        <div class="promo-feature-item">
          <i class="fa-solid fa-circle-check"></i>
          <span>Discount applied directly to your booking quote</span>
        </div>
      </div>

      <div class="promo-code-container">
        <span class="code-label">PROMO CODE:</span>
        <div class="code-box">
          <span class="code-text" id="promo-code-text">NOV15</span>
          <button type="button" id="btn-copy-promo" class="btn-copy-code" title="Copy code">
            <i class="fa-regular fa-copy"></i>
          </button>
        </div>
      </div>

      <div class="promo-actions">
        <button type="button" id="btn-claim-promo" class="btn btn-primary btn-claim-promo">
          <i class="fa-solid fa-gift"></i> Claim 15% Discount & Book Now
        </button>
        <button type="button" id="btn-dismiss-promo" class="btn-dismiss-text">
          No thanks, maybe later
        </button>
      </div>

      <p class="promo-expiry-note">
        <i class="fa-regular fa-clock"></i> Limited-time website offer valid throughout November.
      </p>
    </div>
  </div>

  <script type="module" src="/src/main.js"></script>
</body>
</html>`;
}

// Helper to write files
function writePage(relativeFilePath, htmlContent) {
  const fullPath = path.join(projectRoot, relativeFilePath);
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(fullPath, htmlContent, 'utf-8');
  console.log(`Generated: ${relativeFilePath}`);
}

// Export for usage
export {
  COMPANY_NAME,
  PHONE_NUMBER,
  WHATSAPP_LINK,
  ADDRESS_FULL,
  EMAIL_ADDRESS,
  OPERATING_SINCE,
  PROJECTS_COMPLETED,
  BASE_URL,
  localBusinessSchema,
  renderHead,
  renderNavbar,
  renderBookingForm,
  renderFooter,
  writePage
};

