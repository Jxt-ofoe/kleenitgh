import {
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
} from './build-seo-pages.js';


// ============================================================================
// CORE SERVICE PAGES DATA (6 Pages)
// ============================================================================
const coreServices = [
  {
    slug: 'home-cleaning',
    url: '/home-cleaning',
    formService: 'Regular Home Cleaning',
    title: 'Home Cleaning Services Accra | Kleenit Ghana Limited',
    description: 'Trusted home cleaning in Accra by Kleenit Ghana Limited. Professional weekly, bi-weekly, and recurring housekeeping. Call 054 402 6418.',
    h1: 'Professional Home Cleaning Services in Accra',
    subtitle: 'Reliable, scrupulous residential housekeeping tailored to your home, schedule, and family life in Greater Accra.',
    image: '/pic2.jpg',
    imageAlt: 'Kleenit Ghana Limited team members deep cleaning a residential living room in Accra',
    whatsIncluded: [
      'Comprehensive dusting of all living areas, furniture, ceiling fans, and fixtures',
      'Thorough floor sweeping, vacuuming, and damp mopping with eco-friendly sanitizers',
      'Kitchen cleaning: wiped exterior counters, stovetops, sinks, and cabinet faces',
      'Washroom scrubbing and disinfection: toilets, washbasins, mirrors, and shower stalls',
      'Bed making, sheet straightening, and bedroom surface sanitization',
      'Trash emptying, bin relining, and overall room tidying'
    ],
    whoItsFor: 'Busy executives, growing families, expatriates, and homeowners in Accra who want a consistently pristine living space without spending their weekends scrubbing floors.',
    processSteps: [
      { step: 1, title: 'Inquiry & Schedule', desc: 'Contact us via our booking form or WhatsApp with your home size and preferred day.' },
      { step: 2, title: 'Personalized Checklist', desc: 'We confirm your custom cleaning preferences, entry access, and timing.' },
      { step: 3, title: 'Expert Cleaning', desc: 'Our vetted, trained cleaning professionals arrive promptly with premium supplies and equipment.' },
      { step: 4, title: 'Quality Walkthrough', desc: 'We inspect every room against our strict quality standards before finishing the job.' }
    ],
    faqs: [
      {
        q: 'How frequently can I schedule home cleaning in Accra?',
        a: 'We offer flexible recurring schedules including weekly, bi-weekly, monthly, or one-off visits depending on your household needs.'
      },
      {
        q: 'Do I need to supply cleaning chemicals and equipment?',
        a: 'No, our team arrives fully equipped with commercial-grade cleaning agents, microfiber cloths, mops, and vacuums.'
      },
      {
        q: 'Are your cleaners vetted and trustworthy?',
        a: 'Yes, every cleaning specialist at Kleenit Ghana Limited undergoes rigorous background verification, reference checks, and comprehensive on-site training.'
      },
      {
        q: 'Can I request specific rooms or tasks to be prioritized?',
        a: 'Absolutely, you can instruct our team on priority areas like master suites, guest bathrooms, or kitchen areas during booking.'
      }
    ]
  },
  {
    slug: 'office-janitorial',
    url: '/office-janitorial',
    formService: 'Office Janitorial Service',
    title: 'Office Cleaning Accra | Kleenit Ghana Limited',
    description: 'Reliable office cleaning and janitorial services in Accra. Pristine workplaces for corporate offices and commercial facilities. Call 054 402 6418.',
    h1: 'Commercial Office Janitorial Cleaning in Accra',
    subtitle: 'Maintain an impeccably clean, hygienic workplace that impresses corporate clients and protects employee health across Accra.',
    image: '/janitorial-cleaning.jpg',
    imageAlt: 'Kleenit Ghana Limited janitorial cleaning staff sanitizing an office conference room in Accra',
    whatsIncluded: [
      'Daily or scheduled workstation, desk, and conference room surface sanitization',
      'Washroom deep cleaning, odor control, and continuous hygiene maintenance',
      'Hard floor buffing, vacuuming of carpeted office zones, and reception area care',
      'Kitchenette and staff breakroom sanitization, microwave and counter wiping',
      'Waste bin emptying, document shredder bin clearing, and eco-friendly waste management',
      'High-touch point disinfection: elevator buttons, door handles, light switches, and railings'
    ],
    whoItsFor: 'Corporate offices, financial institutions, tech hubs, embassies, legal firms, and co-working spaces across Accra seeking dependable commercial facility maintenance.',
    processSteps: [
      { step: 1, title: 'Facility Assessment', desc: 'We assess your floor plan, traffic volume, shift hours, and hygiene requirements.' },
      { step: 2, title: 'Custom Janitorial Plan', desc: 'We design an off-hours or daytime janitorial schedule that minimizes business disruption.' },
      { step: 3, title: 'Dedicated Crew Deployment', desc: 'Assigned uniformed janitors deliver disciplined daily cleaning following standard operating procedures.' },
      { step: 4, title: 'Supervisory Audits', desc: 'Our quality supervisors conduct periodic inspections to guarantee uncompromised cleaning standards.' }
    ],
    faqs: [
      {
        q: 'Can you clean our office outside of regular business hours?',
        a: 'Yes, we provide flexible night, early morning, or weekend janitorial shifts to ensure your staff is never interrupted during work hours.'
      },
      {
        q: 'Do you provide full-time outsourced office cleaners?',
        a: 'Yes, we supply trained, insured, and managed full-time janitorial staff dedicated exclusively to your facility.'
      },
      {
        q: 'What types of commercial facilities do you service in Accra?',
        a: 'We service multi-story office complexes, corporate suites, retail banks, IT centers, educational institutions, and creative agencies.'
      },
      {
        q: 'How do you handle confidentiality and office security?',
        a: 'All Kleenit Ghana Limited personnel sign strict confidentiality agreements and adhere to strict access control guidelines while on your premises.'
      }
    ]
  },
  {
    slug: 'post-construction-cleaning',
    url: '/post-construction-cleaning',
    formService: 'Post-construction Cleaning',
    title: 'Post-Construction Cleaning Accra | Kleenit Ghana',
    description: 'Expert post-construction cleaning in Accra. We remove cement haze, plaster dust, paint drips, and renovation debris safely. Call 054 402 6418.',
    h1: 'Post-Construction Cleaning Services in Accra',
    subtitle: 'Transform newly built or newly renovated buildings from dusty construction zones into pristine, move-in ready properties.',
    image: '/post-construction.jpg',
    imageAlt: 'Detailed post-construction dust and plaster residue removal by Kleenit Ghana Limited in Accra',
    whatsIncluded: [
      'Comprehensive removal of fine airborne gypsum, drywall, and plaster dust from all surfaces',
      'Careful scraping and cleaning of paint overspray, sealant drips, and tape residue from glass',
      'Heavy-duty floor scrubbing to eliminate grout haze, cement stains, and construction dirt',
      'Deep interior and exterior window frame, track, and sill detailing',
      'Sanitization of newly installed bathroom sanitary ware, cabinets, and light fittings',
      'Detailed vacuuming and wiping of closet interiors, electrical baseboards, and HVAC vents'
    ],
    whoItsFor: 'Property developers, building contractors, interior designers, real estate agencies, and property owners preparing residential or commercial sites for handover.',
    processSteps: [
      { step: 1, title: 'Site Inspection', desc: 'We evaluate the square footage, building materials, and level of construction residue on-site.' },
      { step: 2, title: 'Debris & Rough Clear', desc: 'Our team collects residual packaging and performs high-volume dust extraction.' },
      { step: 3, title: 'Detailed Deep Scrub', desc: 'Specialized non-abrasive scrapers, tile cleaners, and window tools restore pristine surfaces.' },
      { step: 4, title: 'Final Handover Polish', desc: 'A thorough final wipe down prepares the site for client inspection or official move-in.' }
    ],
    faqs: [
      {
        q: 'When should post-construction cleaning be scheduled?',
        a: 'Post-construction cleaning is best scheduled after all major contracting work, electrical fittings, and painting have been completely finished.'
      },
      {
        q: 'Can you safely remove cement residue without scratching tiles or glass?',
        a: 'Yes, we use professional pH-balanced chemical formulations and specialized safety scrapers designed specifically to protect glass and glazed tiles.'
      },
      {
        q: 'How long does a post-construction cleaning project take?',
        a: 'Most residential apartments and homes take 1 to 2 days, while large multi-story commercial developments are scheduled based on square footage.'
      },
      {
        q: 'Do you dispose of leftover construction debris?',
        a: 'We clear all interior construction dust, packaging, and fine waste, leaving surfaces polished and ready for occupancy.'
      }
    ]
  },
  {
    slug: 'airbnb-turnover-cleaning',
    url: '/airbnb-turnover-cleaning',
    formService: 'Airbnb / Short-let Turnover',
    title: 'Airbnb Cleaning Accra | Kleenit Ghana Limited',
    description: 'Rapid Airbnb and short-let turnover cleaning in Accra. Fresh linens, spotless bathrooms, and guest-ready sanitization. Call 054 402 6418.',
    h1: 'Airbnb & Short-Let Turnover Cleaning in Accra',
    subtitle: 'Keep your short-term rental property spotless, 5-star reviewed, and flawlessly guest-ready with reliable turnover cleaning.',
    image: '/pic2.jpg',
    imageAlt: 'Airbnb apartment guest-ready turnover cleaning in Accra by Kleenit Ghana Limited',
    whatsIncluded: [
      'Fast turnover sanitization between guest check-out and check-in windows',
      'Bed linen changing, pillow fluffing, and fresh towel arrangement',
      'Sparkling bathroom disinfection: toilet sanitization, glass descaling, and toiletry replenishment',
      'Kitchen restocking check: washing dishware, sanitizing countertops, microwave, and fridge wipe-down',
      'Comprehensive floor vacuuming, mopping, and patio/balcony sweep',
      'Host checklist reporting: photo verification of property condition and alert for forgotten guest items'
    ],
    whoItsFor: 'Airbnb hosts, short-let property managers, real estate investors, and vacation rental operators in Osu, Cantonments, East Legon, and Airport Residential.',
    processSteps: [
      { step: 1, title: 'Check-out Notification', desc: 'Notify us of your guest check-out and check-in timeline via WhatsApp or our booking portal.' },
      { step: 2, title: 'Turnover Dispatch', desc: 'Our hospitality-trained team arrives promptly during the 11:00 AM to 3:00 PM turnaround window.' },
      { step: 3, title: 'Hotel-Grade Detailing', desc: 'We execute a 40-point hospitality checklist covering linens, surfaces, scents, and amenities.' },
      { step: 4, title: 'Ready for Guest Arrival', desc: 'The apartment is locked, cooled, and ready to welcome your incoming guests with five-star cleanliness.' }
    ],
    faqs: [
      {
        q: 'Can you work within strict same-day turnover windows?',
        a: 'Yes, our teams specialize in fast 3-to-4 hour turnarounds between 11:00 AM check-out and 3:00 PM check-in.'
      },
      {
        q: 'Do you wash and change bed linens and towels on-site?',
        a: 'Yes, if you have on-site laundry machines or a secondary set of clean linens, we strip, replace, and neatly arrange all bedding.'
      },
      {
        q: 'Will you alert me if a guest leaves damage or missing items?',
        a: 'Yes, our cleaners inspect the property upon entry and immediately send photo alerts of any damage or items left behind by previous guests.'
      },
      {
        q: 'Do you offer monthly service agreements for multiple short-let units?',
        a: 'Yes, we partner with property management companies and multi-unit hosts across Accra with customized recurring turnover packages.'
      }
    ]
  },
  {
    slug: 'fumigation-pest-control',
    url: '/fumigation-pest-control',
    formService: 'Fumigation & Pest Control',
    title: 'Fumigation & Pest Control Accra | Kleenit Ghana',
    description: 'Certified fumigation and pest control in Accra. Eradicate termites, bedbugs, roaches, and rodents safely for homes and offices. Call 054 402 6418.',
    h1: 'Fumigation & Pest Control Services in Accra',
    subtitle: 'Safe, certified pest eradication and preventive fumigation treatments for homes, warehouses, restaurants, and office premises.',
    image: '/images/fumigation-service.jpg',
    imageAlt: 'Professional fumigation and pest control treatment in Accra by Kleenit Ghana Limited',
    whatsIncluded: [
      'Comprehensive property inspection to identify pest harborages, entry points, and infestation levels',
      'Targeted eradication of cockroaches, bed bugs, termites, mosquitoes, ants, and rodents',
      'Ultra-Low Volume (ULV) cold misting and residual barrier perimeter sprays',
      'Use of EPA-approved, low-odor, eco-friendly pest control chemicals safe for humans and pets',
      'Drainage, compound perimeter, and sewer inspection and larvicide treatment',
      'Preventive proofing advice and scheduled recurring protection programs'
    ],
    whoItsFor: 'Homeowners, property managers, hospitality venues, commercial warehouses, schools, and offices experiencing pest issues or seeking proactive preventive fumigation.',
    processSteps: [
      { step: 1, title: 'Initial Assessment', desc: 'We examine your space to determine the pest species, nesting locations, and treatment strategy.' },
      { step: 2, title: 'Safety Preparation', desc: 'We advise on property evacuation times, covering foodstuffs, and preparing the space for treatment.' },
      { step: 3, title: 'Targeted Application', desc: 'Our certified technicians apply specialized misting, gel baits, and perimeter barrier sprays.' },
      { step: 4, title: 'Safe Re-Entry & Follow-up', desc: 'We ventilate the space, provide re-entry clearance, and schedule follow-up checks if required.' }
    ],
    faqs: [
      {
        q: 'Are your fumigation chemicals safe for children and pets?',
        a: 'Yes, we use approved, low-toxicity pest control formulations, and specify safe re-entry times (typically 2 to 4 hours post-treatment).'
      },
      {
        q: 'How long does a fumigation treatment remain effective?',
        a: 'Residual barrier treatments typically protect your property for 3 to 6 months depending on environmental conditions and moisture levels.'
      },
      {
        q: 'Can you eliminate persistent bed bug infestations?',
        a: 'Yes, we employ multi-stage treatments combining contact sprays, deep crevice penetration, and residual powders to eliminate both live bed bugs and eggs.'
      },
      {
        q: 'Do you provide fumigation certificates for commercial compliance?',
        a: 'Yes, we provide official service reports and fumigation certificates for restaurants, warehouses, and corporate facilities upon request.'
      }
    ]
  },
  {
    slug: 'medical-facility-cleaning',
    url: '/medical-facility-cleaning',
    formService: 'Medical Facility Cleaning',
    title: 'Medical Facility Cleaning Accra | Kleenit Ghana',
    description: 'Hospital-grade disinfection and medical clinic cleaning in Accra by Kleenit Ghana Limited. Strict infection prevention protocols. Call 054 402 6418.',
    h1: 'Medical Facility & Clinic Cleaning in Accra',
    subtitle: 'Hospital-grade disinfection, bio-hazard sanitation, and clinic environmental hygiene meeting stringent healthcare standards.',
    image: '/images/medical-facility.jpg',
    imageAlt: 'Medical facility and clinical sanitization by Kleenit Ghana Limited in Accra',
    whatsIncluded: [
      'Hospital-grade surface disinfection targeting cross-contamination and nosocomial pathogens',
      'Clinical examination room, patient waiting area, and reception deep cleaning',
      'Sterilization of high-touch medical fixtures: diagnostic handles, exam tables, and patient chairs',
      'Restroom deep sanitation and antibacterial replenishment compliant with health guidelines',
      'Proper segregation and handling of general vs clinical waste in accordance with healthcare standards',
      'HEPA-filtered floor vacuuming and anti-microbial terminal floor damp mopping'
    ],
    whoItsFor: 'Hospitals, outpatient clinics, diagnostic laboratories, dental practices, physiotherapy centers, and pharmacies across Accra demanding flawless hygiene.',
    processSteps: [
      { step: 1, title: 'Protocol Alignment', desc: 'We review your clinic’s specific infection control protocols and sterile zone requirements.' },
      { step: 2, title: 'Specialized Staff Assignment', desc: 'Trained cleaning personnel equipped with medical PPE and healthcare-grade disinfectants are deployed.' },
      { step: 3, title: 'Color-Coded Cleaning', desc: 'We utilize strict color-coded microfiber systems to eliminate any risk of cross-contamination.' },
      { step: 4, title: 'Hygiene Verification', desc: 'Supervisors audit clinical surfaces against rigorous sanitization checklists.' }
    ],
    faqs: [
      {
        q: 'What types of disinfectants do you use in healthcare facilities?',
        a: 'We use hospital-grade, broad-spectrum virucidal and bactericidal disinfectants proven against common clinical pathogens.'
      },
      {
        q: 'How do you prevent cross-contamination between treatment rooms?',
        a: 'We implement strict color-coded microfiber cloths, separate mop heads per room, and mandatory single-use glove replacements.'
      },
      {
        q: 'Can your team clean medical offices after operating hours?',
        a: 'Yes, we routinely perform evening and night-shift clinical sanitization to ensure patient appointments are never disturbed.'
      },
      {
        q: 'Are your cleaners trained in bio-safety protocols?',
        a: 'Yes, our healthcare cleaning personnel receive specialized training in PPE compliance, chemical dwell times, and bio-waste protocols.'
      }
    ]
  }
];

// ============================================================================
// SECONDARY SERVICE PAGES DATA (10 Pages under /services/)
// ============================================================================
const secondaryServices = [
  {
    slug: 'deep-cleaning',
    url: '/services/deep-cleaning',
    formService: 'Deep Cleaning',
    title: 'Deep Cleaning Services Accra | Kleenit Ghana',
    description: 'Comprehensive deep cleaning services in Accra. Intensive scrubbing of kitchens, bathrooms, baseboards, and hard-to-reach areas. Call 054 402 6418.',
    h1: 'Intensive Deep Cleaning Services in Accra',
    subtitle: 'Reach behind, underneath, and inside every corner with our comprehensive top-to-bottom deep cleaning treatment.',
    image: '/pic2.jpg',
    imageAlt: 'Intensive residential deep cleaning in Accra by Kleenit Ghana Limited',
    whatsIncluded: [
      'Scrubbing inside and behind kitchen appliances: ovens, stovetops, refrigerators',
      'Descaling bathroom tiles, hard water deposits, shower glass, and deep grout sanitization',
      'Detailed hand-wiping of baseboards, door frames, switch plates, and crown molding',
      'Interior window sill, track, and reachable blind detailing',
      'Under-bed, under-sofa, and behind-furniture dust extraction',
      'Air vent cover wipe-down and high-level cobweb removal'
    ],
    whoItsFor: 'Homeowners preparing for festive seasons, spring cleaning, or homes that haven’t received professional cleaning in several months.'
  },
  {
    slug: 'move-in-out-cleaning',
    url: '/services/move-in-out-cleaning',
    formService: 'Move-in / Move-out Cleaning',
    title: 'Move-In Move-Out Cleaning Accra | Kleenit Ghana',
    description: 'Thorough move-in and move-out cleaning in Accra. Get tenant spaces spotless or prepare your new home for immediate move-in. Call 054 402 6418.',
    h1: 'Move-In & Move-Out Cleaning Services in Accra',
    subtitle: 'Leave your old home in pristine condition or step into a thoroughly sanitized, sparkling clean new residence.',
    image: '/images/move-in-cleaning.jpg',
    imageAlt: 'Pristine move-in and move-out cleaning in Accra by Kleenit Ghana Limited',
    whatsIncluded: [
      'Empty home deep cleaning: all interior wardrobes, cupboards, drawers, and shelving',
      'Deep sanitization of kitchen cabinetry, pantry shelves, and built-in appliances',
      'Intensive bathroom scrubbing, tile descaling, and plumbing fixture polishing',
      'Complete floor restoration: vacuuming, scrubbing, and damp mopping throughout',
      'Wall spot-cleaning, scuff removal, and light fixture dusting',
      'Balcony, terrace, and entrance porch sweeping and washdown'
    ],
    whoItsFor: 'Tenants safeguarding security deposits, landlords preparing rentals for new occupants, and buyers moving into new properties.'
  },
  {
    slug: 'upholstery-cleaning',
    url: '/services/upholstery-cleaning',
    formService: 'Upholstery & Carpet Cleaning',
    title: 'Sofa & Carpet Cleaning Accra | Kleenit Ghana',
    description: 'Steam extraction sofa, rug, and carpet cleaning in Accra. Remove tough stains, dirt, and allergens from living room furniture. Call 054 402 6418.',
    h1: 'Sofa, Rug & Upholstery Cleaning in Accra',
    subtitle: 'Revitalize fabric sofas, leather couches, oriental rugs, and fitted carpets with professional deep stain and odor extraction.',
    image: '/pic1.jpg',
    imageAlt: 'Professional sofa, carpet, and upholstery steam cleaning in Accra by Kleenit Ghana Limited',
    whatsIncluded: [
      'High-filtration dry vacuuming to remove embedded dust, pet dander, and grit',
      'Targeted pre-treatment for grease, drink spills, and stubborn localized stains',
      'Deep hot-water steam extraction cleaning lifting dirt from deep fiber layers',
      'Fabric-safe shampooing and color-restoring fiber treatment',
      'Odor neutralization eliminating pet, food, and moisture smells',
      'Rapid air drying process minimizing fabric downtime'
    ],
    whoItsFor: 'Households with children or pets, homeowners recovering from dusty seasons, and offices with high-traffic lounge furniture.'
  },
  {
    slug: 'mattress-cleaning',
    url: '/services/mattress-cleaning',
    formService: 'Mattress Cleaning',
    title: 'Mattress Deep Cleaning Accra | Kleenit Ghana',
    description: 'Professional mattress cleaning and dust mite sanitization in Accra. Breathe easy with fresh, deeply cleaned beds. Call 054 402 6418.',
    h1: 'Professional Mattress Deep Cleaning in Accra',
    subtitle: 'Eliminate dust mites, dead skin cells, perspiration stains, and allergens for a healthier, more hygienic night’s sleep.',
    image: '/images/mattress-cleaning.jpg',
    imageAlt: 'Deep mattress cleaning and allergen sanitization in Accra by Kleenit Ghana Limited',
    whatsIncluded: [
      'High-power UV and vacuum extraction of deep-seated allergens and mites',
      'Enzymatic stain pre-treatment for sweat marks, spills, and discolouration',
      'Antibacterial steam sanitization of mattress tops, sides, and seams',
      'Hospitality-grade odor neutralizing and hygienic deodorization',
      'Fast-drying extraction ensuring same-day bed usability'
    ],
    whoItsFor: 'Individuals with asthma or dust allergies, parents, luxury hotels, and short-let operators seeking fresh, hygienic sleep surfaces.'
  },
  {
    slug: 'window-cleaning',
    url: '/services/window-cleaning',
    formService: 'Window Cleaning',
    title: 'Window Cleaning Services Accra | Kleenit Ghana',
    description: 'Streak-free residential and commercial window cleaning in Accra. Interior and exterior glass washing for homes and offices. Call 054 402 6418.',
    h1: 'Streak-Free Window Cleaning Services in Accra',
    subtitle: 'Crystal-clear interior and exterior glass cleaning for residential villas, modern apartments, and commercial office facades.',
    image: '/images/window-cleaning.jpg',
    imageAlt: 'Streak-free window and architectural glass cleaning in Accra by Kleenit Ghana Limited',
    whatsIncluded: [
      'Streak-free interior and exterior pane cleaning with purified water solutions',
      'Window track, slider groove, and lock detailing removing Harmattan dust',
      'Flyscreen washing, mesh brushing, and frame restoration',
      'Scraping of bird droppings, mineral scale, and environmental residue',
      'Safe ground-level and extension pole exterior glass cleaning'
    ],
    whoItsFor: 'Modern architectural homes with floor-to-ceiling glass, corporate offices, retail showrooms, and multi-story compounds.'
  },
  {
    slug: 'tile-grout-cleaning',
    url: '/services/tile-grout-cleaning',
    formService: 'Tile & Grout Cleaning',
    title: 'Tile & Grout Cleaning Accra | Kleenit Ghana',
    description: 'High-pressure rotary tile and grout cleaning in Accra. Restore soiled floor tiles and stained grout lines like new. Call 054 402 6418.',
    h1: 'Professional Tile & Grout Restoration in Accra',
    subtitle: 'Extract years of ingrained dirt, mold, and discoloration from porous grout lines and tiled floors.',
    image: '/images/tile-grout-cleaning.jpg',
    imageAlt: 'High-pressure rotary tile and grout cleaning in Accra by Kleenit Ghana Limited',
    whatsIncluded: [
      'Alkaline soil-loosening pre-spray applied to porous grout lines',
      'High-speed rotary floor machine scrubbing removing stubborn buildup',
      'High-pressure hot water extraction and slurry recovery',
      'Targeted mildew and mold elimination in damp bathroom zones',
      'Tile surface buffing restoring clean, natural sheen'
    ],
    whoItsFor: 'Homes, restaurants, commercial washrooms, and church auditoriums with dull, discolored tile floors.'
  },
  {
    slug: 'kitchen-deep-cleaning',
    url: '/services/kitchen-deep-cleaning',
    formService: 'Kitchen Deep Cleaning',
    title: 'Kitchen Deep Cleaning Accra | Kleenit Ghana',
    description: 'Intensive kitchen degreasing and deep cleaning in Accra. Heavy-duty appliance, hood, oven, and surface scrubbing. Call 054 402 6418.',
    h1: 'Commercial & Domestic Kitchen Deep Cleaning in Accra',
    subtitle: 'Intensive food-grade degreasing and thermal sanitization for residential kitchens, bakery hubs, and restaurant prep areas.',
    image: '/images/kitchen-deep-cleaning.jpg',
    imageAlt: 'Commercial and residential kitchen deep degreasing in Accra by Kleenit Ghana Limited',
    whatsIncluded: [
      'Heavy-duty carbon and grease breakdown on cooktops, burners, and range hoods',
      'Interior oven, grill rack, and microwave deep detailing and degreasing',
      'Refrigerator and freezer pull-out, defrost sanitation, and door seal cleaning',
      'Kitchen cabinet interior and exterior degreasing and shelf lining wipe-down',
      'Stainless steel sink polishing, limescale descaling, and drain sanitization'
    ],
    whoItsFor: 'Commercial kitchens, food entrepreneurs, and busy residential households wanting a sterile, grease-free cooking environment.'
  },
  {
    slug: 'commercial-cleaning',
    url: '/services/commercial-cleaning',
    formService: 'Office Janitorial Service',
    title: 'Commercial Cleaning Accra | Kleenit Ghana',
    description: 'Commercial and industrial facility cleaning services in Accra. Tailored maintenance programs for retail, warehouses, and banks. Call 054 402 6418.',
    h1: 'Commercial Facility Cleaning Services in Accra',
    subtitle: 'Turnkey facility sanitation for shopping malls, warehouses, banks, showrooms, and industrial facilities in Greater Accra.',
    image: '/auditorium-cleaning.jpg',
    imageAlt: 'Commercial facility and warehouse cleaning in Accra by Kleenit Ghana Limited',
    whatsIncluded: [
      'Large-scale floor sweeping, auto-scrubbing, and industrial dust control',
      'Customer-facing area sanitation: counters, entry portals, and glass facades',
      'Staff washroom, changing room, and cafeteria hygiene management',
      'High-bay structural dusting, pipework cleaning, and warehouse shelving care',
      'Customized daily, weekly, or shift-based cleaning contracts'
    ],
    whoItsFor: 'Logistics hubs, manufacturing sites, retail showrooms, event venues, and commercial property owners.'
  },
  {
    slug: 'pressure-washing',
    url: '/services/pressure-washing',
    formService: 'Pressure Washing',
    title: 'Pressure Washing Services Accra | Kleenit Ghana',
    description: 'High-power pressure washing in Accra for paved driveways, exterior compound walls, concrete floors, and parking lots. Call 054 402 6418.',
    h1: 'High-Pressure Washing Services in Accra',
    subtitle: 'Blast away algae, mildew, tire marks, and red dust from driveways, perimeter walls, and outdoor paved compounds.',
    image: '/images/pressure-washing.jpg',
    imageAlt: 'High-pressure compound and driveway washing in Accra by Kleenit Ghana Limited',
    whatsIncluded: [
      'Commercial-grade high-PSI water jet pressure washing',
      'Interlocking paver and stamped concrete deep cleaning',
      'Compound wall, boundary fence, and gate washing removing mud splatters and algae',
      'Garage floor, vehicle parking bay, and carport oil stain treatment',
      'Swimming pool deck, patio, and outdoor entertaining area revitalization'
    ],
    whoItsFor: 'Gated community residences, private villas, corporate parking lots, and commercial plazas across Accra.'
  },
  {
    slug: 'event-cleaning',
    url: '/services/event-cleaning',
    formService: 'Event Cleaning',
    title: 'Event Cleaning Services Accra | Kleenit Ghana',
    description: 'Pre-event prep and post-event cleanup services in Accra. Rapid trash clearance, floor sanitization, and venue handover. Call 054 402 6418.',
    h1: 'Pre & Post Event Cleaning Services in Accra',
    subtitle: 'Seamless venue preparation, ongoing event porter service, and rapid post-event cleanup for weddings, conferences, and parties.',
    image: '/images/event-cleaning.jpg',
    imageAlt: 'Pre and post event venue cleaning in Accra by Kleenit Ghana Limited',
    whatsIncluded: [
      'Pre-event venue inspection, floor detailing, and washroom readiness checks',
      'During-event porter service: continuous washroom hygiene, spill clearing, and bin swaps',
      'Post-event rapid trash collection, bottle sorting, and debris bagging',
      'Complete hall and venue floor scrubbing, mopping, and prompt handover',
      'Waste carting and eco-conscious disposal coordination'
    ],
    whoItsFor: 'Event planners, wedding organizers, banquet hall managers, conference hosts, and private party organizers.'
  }
];

// ============================================================================
// AREA PAGES DATA (9 Neighborhoods in Greater Accra)
// ============================================================================
const areaPages = [
  {
    slug: 'dome',
    url: '/areas/dome',
    name: 'Dome & Dome Pillar 2',
    title: 'Cleaning Services in Dome Accra | Kleenit Ghana',
    description: 'Professional home, office, and fumigation cleaning services in Dome and Dome Pillar 2, Accra by Kleenit Ghana Limited. Call 054 402 6418.',
    h1: 'Professional Cleaning Services in Dome & Dome Pillar 2, Accra',
    subtitle: 'Direct local service from our primary headquarters at 1 Flower Street, Dome Pillar 2. Rapid dispatch for homes, offices, and residential compounds.',
    highlights: [
      'Immediate, same-day response from our headquarters at 1 Flower Street, Dome Pillar 2',
      'Complete residential housekeeping, deep cleaning, and compound power washing',
      'Fumigation and pest eradication for Dome residential compounds and business sites',
      'Post-renovation and post-construction cleaning for newly developed apartments'
    ],
    faq: [
      { q: 'Where is your primary office located in Dome?', a: 'Our office is located at 1 Flower Street, Dome Pillar 2, Accra, available by appointment.' },
      { q: 'How quickly can cleaners arrive at my Dome residence?', a: 'Because our central operations hub is in Dome Pillar 2, we can frequently accommodate same-day or priority next-day bookings.' },
      { q: 'Do you clean compounds and driveways in Dome?', a: 'Yes, we provide pressure washing for paved driveways, compound walls, and tile flooring across Dome.' }
    ]
  },
  {
    slug: 'east-legon',
    url: '/areas/east-legon',
    name: 'East Legon',
    title: 'Cleaning Services East Legon | Kleenit Ghana',
    description: 'Top-rated home cleaning, office janitorial, and fumigation in East Legon, Accra. Reliable, scrupulous cleaning teams. Call 054 402 6418.',
    h1: 'Cleaning Services in East Legon, Accra',
    subtitle: 'Premium residential housekeeping, luxury short-let turnover, and corporate office janitorial services in prestigious East Legon.',
    highlights: [
      'Specialized care for high-end luxury villas, multi-story residences, and executive duplexes',
      'Rapid Airbnb turnover cleaning for short-term rental investors along Lagos Avenue & Mensah Wood',
      'Corporate janitorial maintenance for embassies, tech firms, and commercial complexes',
      'Upholstery and delicate rug steam cleaning preserving fine interior furnishings'
    ],
    faq: [
      { q: 'Do you service residential villas in East Legon?', a: 'Yes, we regularly service multi-bedroom villas, townhouses, and luxury compounds throughout East Legon.' },
      { q: 'Can you handle Airbnb turnovers in East Legon between guest stays?', a: 'Yes, we provide fast 3-to-4 hour turnovers between check-outs and check-ins.' },
      { q: 'Are your cleaners trained to handle high-end appliances and surfaces?', a: 'Yes, our staff is trained on delicate granite countertops, marble floors, and luxury appliances.' }
    ]
  },
  {
    slug: 'cantonments',
    url: '/areas/cantonments',
    name: 'Cantonments',
    title: 'Cleaning Services Cantonments | Kleenit Ghana',
    description: 'Premium residential and embassy facility cleaning in Cantonments, Accra by Kleenit Ghana Limited. Disinfection and deep cleaning. Call 054 402 6418.',
    h1: 'Cleaning Services in Cantonments, Accra',
    subtitle: 'Discreet, detail-oriented cleaning for diplomatic residences, luxury apartments, and corporate offices in Cantonments.',
    highlights: [
      'Vetted, security-cleared cleaning professionals suited for diplomatic and executive residences',
      'Hospital-grade surface disinfection and deep hygiene sanitization',
      'Move-in and move-out preparation for expatriates and corporate executives',
      'Window cleaning and exterior facade washdown for gated community townhomes'
    ],
    faq: [
      { q: 'Do your cleaners comply with security clearance protocols in Cantonments?', a: 'Yes, all our staff carry official company ID badges, have verified backgrounds, and follow strict estate security rules.' },
      { q: 'Do you offer scheduled weekly housekeeping in Cantonments?', a: 'Yes, we offer recurring weekly, bi-weekly, or monthly cleaning contracts tailored to your schedule.' },
      { q: 'Can you clean post-construction properties in Cantonments?', a: 'Yes, we frequently prepare newly built luxury developments and renovated duplexes for tenancy handover.' }
    ]
  },
  {
    slug: 'airport-residential',
    url: '/areas/airport-residential',
    name: 'Airport Residential Area',
    title: 'Cleaning Airport Residential | Kleenit Ghana',
    description: 'Elite cleaning services in Airport Residential Area, Accra. Luxury apartment turnovers, office janitorial, and deep sanitization. Call 054 402 6418.',
    h1: 'Cleaning Services in Airport Residential Area, Accra',
    subtitle: 'Impeccable housekeeping and commercial cleaning for high-rise apartment towers, private homes, and corporate offices.',
    highlights: [
      'Turnkey cleaning for luxury high-rise developments along Senchi and Patrice Lumumba roads',
      'Daily and after-hours corporate office janitorial maintenance',
      'Same-day Airbnb short-let turnovers with linen replacement and restocking reports',
      'Deep sofa, mattress, and floor restoration'
    ],
    faq: [
      { q: 'Do you clean penthouse suites and high-rise apartments in Airport Residential?', a: 'Yes, our crews are experienced with multi-level apartments, balconies, and high-rise condos.' },
      { q: 'Can you work weekends in Airport Residential Area?', a: 'Yes, we operate Monday through Saturday with flexible booking slots to fit your weekend schedule.' },
      { q: 'How do you bill for recurring office cleaning in Airport Residential?', a: 'We provide structured monthly billing with detailed attendance and supervisory inspection logs.' }
    ]
  },
  {
    slug: 'osu',
    url: '/areas/osu',
    name: 'Osu',
    title: 'Cleaning Services Osu Accra | Kleenit Ghana',
    description: 'Expert Airbnb turnover cleaning, commercial office, and residential cleaning in Osu, Accra. Flexible scheduling. Call 054 402 6418.',
    h1: 'Cleaning Services in Osu, Accra',
    subtitle: 'Fast-response cleaning for bustling Airbnb rentals, boutique hospitality venues, and retail spaces in vibrant Osu.',
    highlights: [
      'High-speed turnover cleaning for short-stay apartments near Oxford Street',
      'Commercial kitchen deep cleaning and degreasing for cafes and dining spots',
      'Eco-friendly fumigation and pest control for heritage and modern buildings',
      'Pre-event and post-event cleanup for private celebrations and brand activations'
    ],
    faq: [
      { q: 'How quickly can you turn over an Airbnb in Osu?', a: 'We can complete standard apartment turnovers in 2.5 to 3.5 hours between guest shifts.' },
      { q: 'Do you offer pest control and fumigation in Osu?', a: 'Yes, we provide targeted eradication for roaches, bed bugs, and rodents in residential and commercial spaces.' },
      { q: 'Can you provide emergency spill or event cleaning in Osu?', a: 'Yes, contact us on WhatsApp at 054 402 6418 for prompt dispatch.' }
    ]
  },
  {
    slug: 'spintex',
    url: '/areas/spintex',
    name: 'Spintex Road',
    title: 'Cleaning Services Spintex Road | Kleenit Ghana',
    description: 'Dependable residential and commercial cleaning services along Spintex Road, Accra. Post-construction, home, and office care. Call 054 402 6418.',
    h1: 'Cleaning Services on Spintex Road, Accra',
    subtitle: 'Thorough, reliable cleaning for gated estates, commercial distribution hubs, and family residences along the Spintex corridor.',
    highlights: [
      'Harmattan dust control and complete residential housekeeping for gated communities',
      'Industrial and warehouse floor scrubbing for Spintex commercial zones',
      'Move-in and tenancy turnover cleaning for houses and apartments',
      'Comprehensive tile, grout, and driveway pressure washing'
    ],
    faq: [
      { q: 'Do you service gated estates along Spintex Road?', a: 'Yes, we regularly clean homes in estates along Spintex, Sakumono, and Kasstower corridors.' },
      { q: 'Can you clean large commercial warehouses on Spintex Road?', a: 'Yes, we deploy specialized auto-scrubbers and industrial equipment for commercial facilities.' },
      { q: 'Do you bring your own water and cleaning solutions?', a: 'Our teams bring complete industrial cleaning equipment and specialized chemical supplies.' }
    ]
  },
  {
    slug: 'tema',
    url: '/areas/tema',
    name: 'Tema & Communities',
    title: 'Cleaning Services Tema | Kleenit Ghana Limited',
    description: 'Professional industrial, warehouse, office, and home cleaning services in Tema and surrounding communities. Call 054 402 6418 today.',
    h1: 'Cleaning Services in Tema & Communities',
    subtitle: 'Heavy-duty industrial cleaning, corporate office janitorial, and residential housekeeping across Tema Communities 1 through 25.',
    highlights: [
      'Industrial facility, warehouse, and logistics depot deep cleaning',
      'Corporate office janitorial contracts for shipping lines, manufacturing firms, and banks',
      'Residential deep cleaning and pest fumigation for Tema homes',
      'Exterior facade and hard-standing high-pressure washing'
    ],
    faq: [
      { q: 'Which Tema communities do you service?', a: 'We service all Tema communities, including Community 1 through 25, Sakumono, and the Industrial Area.' },
      { q: 'Do you handle heavy factory and warehouse cleaning in Tema?', a: 'Yes, we have specialized heavy-duty equipment for degreasing, industrial dust collection, and scrub-downs.' },
      { q: 'Can you provide long-term janitorial outsourcing in Tema?', a: 'Yes, we supply managed full-time cleaning staff with dedicated site supervision.' }
    ]
  },
  {
    slug: 'dzorwulu',
    url: '/areas/dzorwulu',
    name: 'Dzorwulu',
    title: 'Cleaning Services Dzorwulu | Kleenit Ghana',
    description: 'Corporate office janitorial, residential cleaning, and fumigation services in Dzorwulu, Accra by Kleenit Ghana Limited. Call 054 402 6418.',
    h1: 'Cleaning Services in Dzorwulu, Accra',
    subtitle: 'Tailored cleaning for corporate headquarters, modern residential villas, and medical clinics in central Dzorwulu.',
    highlights: [
      'Convenient proximity to our Dome Pillar 2 hub for fast dispatch across Dzorwulu',
      'Corporate janitorial services for multinational offices and tech startups',
      'Residential deep cleaning, mattress sanitization, and upholstery care',
      'Medical facility and dental clinic hospital-grade sanitization'
    ],
    faq: [
      { q: 'How far is your team from Dzorwulu?', a: 'Our operations base is located just minutes away in Dome Pillar 2, allowing rapid dispatch to Dzorwulu.' },
      { q: 'Can you clean corporate offices on weekends in Dzorwulu?', a: 'Yes, we provide weekend and after-hours commercial janitorial services.' },
      { q: 'Do you offer sofa and rug steam cleaning in Dzorwulu?', a: 'Yes, our upholstery technicians bring portable steam extraction machines right to your home or office.' }
    ]
  },
  {
    slug: 'labone',
    url: '/areas/labone',
    name: 'Labone',
    title: 'Cleaning Services Labone | Kleenit Ghana',
    description: 'Scrupulous residential cleaning, short-let maintenance, and fumigation services in Labone, Accra. Book online or call 054 402 6418.',
    h1: 'Cleaning Services in Labone, Accra',
    subtitle: 'Meticulous housekeeping, boutique workspace sanitation, and guest-ready apartment turnovers in quiet, leafy Labone.',
    highlights: [
      'Detail-oriented housekeeping for private townhouses and executive flats',
      'Airbnb turnover cleaning with linen changes and bathroom sanitization',
      'Safe, low-odor pest control and fumigation protecting residential homes',
      'Window washing and garden patio pressure cleaning'
    ],
    faq: [
      { q: 'Do you clean homes in Labone on a recurring basis?', a: 'Yes, we offer weekly, bi-weekly, or monthly recurring housekeeping visits.' },
      { q: 'Can you service boutique creative agencies and offices in Labone?', a: 'Yes, we provide custom office cleaning schedules designed for boutique agencies and studios.' },
      { q: 'How do I book a cleaning session in Labone?', a: 'You can submit a booking request through our website form or message us directly on WhatsApp at 054 402 6418.' }
    ]
  }
];

// ============================================================================
// BUILD CORE SERVICE PAGES
// ============================================================================
for (const s of coreServices) {
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": s.h1,
    "serviceType": s.formService,
    "provider": {
      "@id": `${BASE_URL}/#organization`
    },
    "areaServed": localBusinessSchema.areaServed
  };

  const breadcrumbsSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": BASE_URL },
      { "@type": "ListItem", "position": 2, "name": "Services", "item": `${BASE_URL}/services` },
      { "@type": "ListItem", "position": 3, "name": s.h1, "item": `${BASE_URL}${s.url}` }
    ]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": s.faqs.map(f => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": f.a
      }
    }))
  };

  const headHtml = renderHead({
    title: s.title,
    description: s.description,
    canonicalPath: s.url,
    schemaObjects: [serviceSchema, breadcrumbsSchema, faqSchema]
  });

  const navHtml = renderNavbar('services');
  const formHtml = renderBookingForm(s.formService, `Book your ${s.formService} in Accra. We confirm your date and quote instantly on WhatsApp.`);
  const footerHtml = renderFooter();

  const html = `${headHtml}
${navHtml}

  <!-- Page Hero -->
  <header class="page-hero">
    <div class="container page-hero-content">
      <nav class="breadcrumb-nav" aria-label="Breadcrumbs">
        <ol class="breadcrumbs">
          <li><a href="/">Home</a></li>
          <li><a href="/services">Services</a></li>
          <li aria-current="page">${s.h1}</li>
        </ol>
      </nav>
      <h1 class="page-title">${s.h1}</h1>
      <p class="page-subtitle">${s.subtitle}</p>
      <div class="page-hero-ctas">
        <a href="#contact" class="btn btn-primary"><i class="fa-solid fa-calendar-check"></i> Book This Service</a>
        <a href="tel:0544026418" class="btn btn-outline" style="color: #ffffff; border-color: #ffffff;"><i class="fa-solid fa-phone"></i> Call 054 402 6418</a>
        <a href="${WHATSAPP_LINK}" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp-hero"><i class="fa-brands fa-whatsapp"></i> Chat on WhatsApp</a>
      </div>
    </div>
  </header>

  <!-- Main Content Grid -->
  <main class="section-padding">
    <div class="container">
      <div class="service-content-grid">
        <!-- Main Column -->
        <div class="service-main-content">
          <!-- Featured Image -->
          <div style="margin-bottom: 2rem; border-radius: 16px; overflow: hidden; box-shadow: var(--shadow-md);">
            <img src="${s.image}" alt="${s.imageAlt}" style="width: 100%; height: auto; max-height: 420px; object-fit: cover; display: block;" loading="lazy" />
          </div>

          <!-- Section 1: Overview & Who It's For -->
          <h2>Who This Service Is For in Accra</h2>
          <p>${s.whoItsFor}</p>
          <p>At <strong>${COMPANY_NAME}</strong>, we have been delivering professional cleaning solutions in Accra since ${OPERATING_SINCE}, with over ${PROJECTS_COMPLETED} successful projects completed. We understand the specific challenges facing properties in Greater Accra, including dust from seasonal Harmattan winds, humidity, and rapid urban growth.</p>

          <!-- Section 2: What's Included -->
          <h2>What's Included in Our ${s.h1}</h2>
          <p>Our systematic service protocol leaves no detail overlooked. Here is what our trained cleaning specialists cover:</p>
          <ul class="feature-checklist">
            ${s.whatsIncluded.map(item => `
            <li class="feature-checklist-item">
              <i class="fa-solid fa-circle-check feature-check-icon"></i>
              <span>${item}</span>
            </li>`).join('')}
          </ul>

          <!-- Section 3: How the Process Works -->
          <h2>How Our Cleaning Process Works</h2>
          <p>From initial booking to final walkthrough, we keep our process smooth, punctual, and reliable:</p>
          <div class="process-steps-grid">
            ${s.processSteps.map(p => `
            <div class="process-step-card">
              <span class="step-number">${p.step}</span>
              <h4>${p.title}</h4>
              <p>${p.desc}</p>
            </div>`).join('')}
          </div>

          <!-- Section 4: Frequently Asked Questions -->
          <h2>Frequently Asked Questions</h2>
          <div class="faq-container">
            ${s.faqs.map(f => `
            <div class="faq-card">
              <div class="faq-question">
                <i class="fa-solid fa-circle-question faq-icon"></i>
                <span>${f.q}</span>
              </div>
              <p class="faq-answer">${f.a}</p>
            </div>`).join('')}
          </div>

          <!-- Section 5: Neighborhood Availability -->
          <h2>Service Areas Available in Greater Accra</h2>
          <p>We provide prompt dispatch for our ${s.h1.toLowerCase()} across major residential and commercial districts, including:</p>
          <div class="area-pills-grid">
            ${areaPages.map(a => `<a href="${a.url}" class="area-pill"><i class="fa-solid fa-location-dot"></i> ${a.name}</a>`).join('')}
          </div>
        </div>

        <!-- Sidebar Column -->
        <aside class="service-sidebar">
          ${formHtml}

          <!-- Quick Navigation Box -->
          <div class="sidebar-box">
            <h4>Other Core Services</h4>
            <ul class="sidebar-service-list">
              ${coreServices.map(cs => `
              <li>
                <a href="${cs.url}" class="${cs.url === s.url ? 'active' : ''}">
                  <span>${cs.formService}</span>
                  <i class="fa-solid fa-chevron-right"></i>
                </a>
              </li>`).join('')}
            </ul>
          </div>

          <!-- Trust & Direct Call Box -->
          <div class="sidebar-box" style="background: #f8fafc; text-align: center;">
            <i class="fa-solid fa-headset" style="font-size: 2.2rem; color: var(--primary-color); margin-bottom: 0.75rem;"></i>
            <h4>Need Urgent Cleaning?</h4>
            <p style="font-size: 0.95rem; color: var(--text-muted); margin-bottom: 1.25rem;">Speak directly with our cleaning coordinator in Accra.</p>
            <a href="tel:0544026418" class="btn btn-primary w-100" style="margin-bottom: 0.75rem;"><i class="fa-solid fa-phone"></i> Call 054 402 6418</a>
            <a href="${WHATSAPP_LINK}" target="_blank" rel="noopener noreferrer" class="btn btn-outline w-100"><i class="fa-brands fa-whatsapp"></i> WhatsApp Us</a>
          </div>
        </aside>
      </div>
    </div>
  </main>

${footerHtml}`;

  writePage(`${s.slug}/index.html`, html);
}

// ============================================================================
// BUILD SECONDARY SERVICE PAGES (10 Pages under /services/)
// ============================================================================
for (const sub of secondaryServices) {
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": sub.h1,
    "serviceType": sub.formService,
    "provider": { "@id": `${BASE_URL}/#organization` },
    "areaServed": localBusinessSchema.areaServed
  };

  const breadcrumbsSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": BASE_URL },
      { "@type": "ListItem", "position": 2, "name": "Services", "item": `${BASE_URL}/services` },
      { "@type": "ListItem", "position": 3, "name": sub.h1, "item": `${BASE_URL}${sub.url}` }
    ]
  };

  const headHtml = renderHead({
    title: sub.title,
    description: sub.description,
    canonicalPath: sub.url,
    schemaObjects: [serviceSchema, breadcrumbsSchema]
  });

  const navHtml = renderNavbar('services');
  const formHtml = renderBookingForm(sub.formService, `Book your ${sub.formService} in Accra. Fast confirmation on WhatsApp.`);
  const footerHtml = renderFooter();

  const html = `${headHtml}
${navHtml}

  <!-- Page Hero -->
  <header class="page-hero">
    <div class="container page-hero-content">
      <nav class="breadcrumb-nav" aria-label="Breadcrumbs">
        <ol class="breadcrumbs">
          <li><a href="/">Home</a></li>
          <li><a href="/services">Services</a></li>
          <li aria-current="page">${sub.h1}</li>
        </ol>
      </nav>
      <h1 class="page-title">${sub.h1}</h1>
      <p class="page-subtitle">${sub.subtitle}</p>
      <div class="page-hero-ctas">
        <a href="#contact" class="btn btn-primary"><i class="fa-solid fa-calendar-check"></i> Book This Service</a>
        <a href="tel:0544026418" class="btn btn-outline" style="color: #ffffff; border-color: #ffffff;"><i class="fa-solid fa-phone"></i> 054 402 6418</a>
        <a href="${WHATSAPP_LINK}" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp-hero"><i class="fa-brands fa-whatsapp"></i> Chat on WhatsApp</a>
      </div>
    </div>
  </header>

  <!-- Main Content Grid -->
  <main class="section-padding">
    <div class="container">
      <div class="service-content-grid">
        <div class="service-main-content">
          <!-- Featured Image -->
          <div style="margin-bottom: 2rem; border-radius: 16px; overflow: hidden; box-shadow: var(--shadow-md);">
            <img src="${sub.image}" alt="${sub.imageAlt}" style="width: 100%; height: auto; max-height: 420px; object-fit: cover; display: block;" loading="lazy" />
          </div>

          <h2>About This Specialized Service</h2>
          <p>${sub.whoItsFor}</p>
          <p>Delivered by the professional team at <strong>${COMPANY_NAME}</strong>, operating since ${OPERATING_SINCE} with over ${PROJECTS_COMPLETED} completed projects across Accra. Our crew utilizes high-performance commercial equipment and certified eco-friendly cleaning agents to restore pristine conditions.</p>

          <h2>What's Included in the Service</h2>
          <ul class="feature-checklist">
            ${sub.whatsIncluded.map(item => `
            <li class="feature-checklist-item">
              <i class="fa-solid fa-circle-check feature-check-icon"></i>
              <span>${item}</span>
            </li>`).join('')}
          </ul>

          <h2>Why Choose Kleenit Ghana Limited</h2>
          <p>We pride ourselves on attention to detail, punctuality, and trustworthy personnel. Whether you are situated in Dome, East Legon, Cantonments, Osu, or Tema, our mobile cleaning teams are equipped to handle spaces of any scale.</p>

          <h2>Areas We Serve in Greater Accra</h2>
          <div class="area-pills-grid">
            ${areaPages.map(a => `<a href="${a.url}" class="area-pill"><i class="fa-solid fa-location-dot"></i> ${a.name}</a>`).join('')}
          </div>
        </div>

        <aside class="service-sidebar">
          ${formHtml}
          <div class="sidebar-box">
            <h4>All Specialized Cleaning</h4>
            <ul class="sidebar-service-list">
              ${secondaryServices.map(item => `
              <li>
                <a href="${item.url}" class="${item.url === sub.url ? 'active' : ''}">
                  <span>${item.formService}</span>
                  <i class="fa-solid fa-chevron-right"></i>
                </a>
              </li>`).join('')}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  </main>

${footerHtml}`;

  writePage(`services/${sub.slug}/index.html`, html);
}

// ============================================================================
// BUILD AREA PAGES (9 Pages under /areas/)
// ============================================================================
for (const a of areaPages) {
  const breadcrumbsSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": BASE_URL },
      { "@type": "ListItem", "position": 2, "name": "Service Areas", "item": `${BASE_URL}/services` },
      { "@type": "ListItem", "position": 3, "name": a.name, "item": `${BASE_URL}${a.url}` }
    ]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": a.faq.map(f => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": { "@type": "Answer", "text": f.a }
    }))
  };

  const headHtml = renderHead({
    title: a.title,
    description: a.description,
    canonicalPath: a.url,
    schemaObjects: [breadcrumbsSchema, faqSchema]
  });

  const navHtml = renderNavbar();
  const formHtml = renderBookingForm('Regular Home Cleaning', `Book trusted cleaning in ${a.name}. Our team confirms availability promptly.`);
  const footerHtml = renderFooter();

  const html = `${headHtml}
${navHtml}

  <header class="page-hero">
    <div class="container page-hero-content">
      <nav class="breadcrumb-nav" aria-label="Breadcrumbs">
        <ol class="breadcrumbs">
          <li><a href="/">Home</a></li>
          <li><a href="/services">Areas</a></li>
          <li aria-current="page">${a.name}</li>
        </ol>
      </nav>
      <h1 class="page-title">${a.h1}</h1>
      <p class="page-subtitle">${a.subtitle}</p>
      <div class="page-hero-ctas">
        <a href="#contact" class="btn btn-primary"><i class="fa-solid fa-calendar-check"></i> Book in ${a.name}</a>
        <a href="tel:0544026418" class="btn btn-outline" style="color: #ffffff; border-color: #ffffff;"><i class="fa-solid fa-phone"></i> 054 402 6418</a>
        <a href="${WHATSAPP_LINK}" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp-hero"><i class="fa-brands fa-whatsapp"></i> WhatsApp Dispatch</a>
      </div>
    </div>
  </header>

  <main class="section-padding">
    <div class="container">
      <div class="service-content-grid">
        <div class="service-main-content">
          <h2>Cleaning Services Available in ${a.name}</h2>
          <p>Residents, property investors, and corporate facilities in <strong>${a.name}</strong> trust <strong>${COMPANY_NAME}</strong> for punctual, high-standard cleaning and pest control. Headquartered at <strong>${ADDRESS_FULL}</strong>, our mobile teams provide responsive dispatch across the entire neighborhood.</p>

          <ul class="feature-checklist">
            ${a.highlights.map(item => `
            <li class="feature-checklist-item">
              <i class="fa-solid fa-circle-check feature-check-icon"></i>
              <span>${item}</span>
            </li>`).join('')}
          </ul>

          <h2>Available Services in ${a.name}</h2>
          <p>We deliver our full range of cleaning solutions directly to properties in ${a.name}:</p>
          <div class="process-steps-grid">
            <div class="process-step-card">
              <h4>Residential Cleaning</h4>
              <p>Weekly housekeeping, deep cleaning, and move-in preparations for villas and apartments.</p>
              <a href="/home-cleaning" class="btn btn-sm btn-outline mt-2">Learn More</a>
            </div>
            <div class="process-step-card">
              <h4>Office Janitorial</h4>
              <p>Scheduled daily and after-hours commercial workplace maintenance.</p>
              <a href="/office-janitorial" class="btn btn-sm btn-outline mt-2">Learn More</a>
            </div>
            <div class="process-step-card">
              <h4>Post-Construction</h4>
              <p>Cement haze, dust, and paint drip removal for newly completed buildings.</p>
              <a href="/post-construction-cleaning" class="btn btn-sm btn-outline mt-2">Learn More</a>
            </div>
            <div class="process-step-card">
              <h4>Fumigation</h4>
              <p>Certified eradication of cockroaches, bed bugs, termites, and rodents.</p>
              <a href="/fumigation-pest-control" class="btn btn-sm btn-outline mt-2">Learn More</a>
            </div>
          </div>

          <h2>Frequently Asked Questions in ${a.name}</h2>
          <div class="faq-container">
            ${a.faq.map(f => `
            <div class="faq-card">
              <div class="faq-question">
                <i class="fa-solid fa-circle-question faq-icon"></i>
                <span>${f.q}</span>
              </div>
              <p class="faq-answer">${f.a}</p>
            </div>`).join('')}
          </div>

          <h2>Other Accra Neighborhoods We Serve</h2>
          <div class="area-pills-grid">
            ${areaPages.filter(item => item.slug !== a.slug).map(item => `
            <a href="${item.url}" class="area-pill"><i class="fa-solid fa-location-dot"></i> ${item.name}</a>`).join('')}
          </div>
        </div>

        <aside class="service-sidebar">
          ${formHtml}
        </aside>
      </div>
    </div>
  </main>

${footerHtml}`;

  writePage(`areas/${a.slug}/index.html`, html);
}

// ============================================================================
// BUILD MAIN DIRECTORY PAGES (/about, /services, /gallery, /contact)
// ============================================================================

// 1. /about
{
  const headHtml = renderHead({
    title: 'About Us | Kleenit Ghana Limited Accra',
    description: 'Learn about Kleenit Ghana Limited, Accra’s detail-oriented cleaning and fumigation company operating since September 2019. 400+ projects completed.',
    canonicalPath: '/about',
    schemaObjects: [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": BASE_URL },
          { "@type": "ListItem", "position": 2, "name": "About Us", "item": `${BASE_URL}/about` }
        ]
      }
    ]
  });

  const html = `${headHtml}
${renderNavbar('about')}

  <header class="page-hero">
    <div class="container page-hero-content">
      <nav class="breadcrumb-nav" aria-label="Breadcrumbs">
        <ol class="breadcrumbs">
          <li><a href="/">Home</a></li>
          <li aria-current="page">About Us</li>
        </ol>
      </nav>
      <h1 class="page-title">About Kleenit Ghana Limited</h1>
      <p class="page-subtitle">Operating since September 2019 • 400+ Projects Completed Across Greater Accra.</p>
    </div>
  </header>

  <main class="section-padding">
    <div class="container">
      <div class="about-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: center;">
        <div class="about-text">
          <h2 class="section-title">Cleanliness Meets Excellence</h2>
          <p>Welcome to <strong>${COMPANY_NAME}</strong>, where cleanliness meets excellence. Operating since <strong>${OPERATING_SINCE}</strong>, we bring over 6 years of proven professional cleaning experience transforming spaces and maintaining pristine environments for homeowners, embassies, developers, and corporate enterprises across Greater Accra.</p>
          <p>From our headquarters at <strong>${ADDRESS_FULL}</strong>, our vetted, disciplined staff is trained to deliver scrupulously clean results with uncompromised attention to detail.</p>
          
          <div class="stats-box" style="margin: 2rem 0; padding: 1.5rem; background: #f0fdfa; border-radius: 12px; border-left: 4px solid var(--primary-color);">
            <span class="stats-number" style="font-size: 2.5rem; font-weight: 700; color: var(--primary-dark); display: block;">${PROJECTS_COMPLETED}</span>
            <span class="stats-label" style="color: #0f766e; font-weight: 600;">Successful Commercial & Residential Projects Completed</span>
          </div>

          <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
            <a href="/contact" class="btn btn-primary"><i class="fa-solid fa-calendar-check"></i> Book a Service</a>
            <a href="tel:0544026418" class="btn btn-outline"><i class="fa-solid fa-phone"></i> 054 402 6418</a>
          </div>
        </div>
        <div class="about-image">
          <img src="/janitorial-cleaning.jpg" alt="Kleenit Ghana Limited team members delivering professional facility services in Accra" class="rounded-image shadow-lg" style="width: 100%; border-radius: 16px; object-fit: cover;" />
        </div>
      </div>

      <!-- Mission & Vision -->
      <div class="mv-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-top: 5rem;">
        <div class="mission-box" style="padding: 2.5rem; background: #ffffff; border-radius: 16px; box-shadow: var(--shadow-sm); border: 1px solid #e2e8f0;">
          <div class="icon-header" style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem;">
            <i class="fa-solid fa-bullseye" style="font-size: 2rem; color: var(--primary-color);"></i>
            <h3 style="font-size: 1.5rem; color: var(--text-dark);">Our Mission</h3>
          </div>
          <ul class="styled-list" style="display: flex; flex-direction: column; gap: 0.75rem; color: #475569;">
            <li><i class="fa-solid fa-check text-primary"></i> Deliver detail-oriented, consistent cleaning services</li>
            <li><i class="fa-solid fa-check text-primary"></i> Provide expert environmental consultation</li>
            <li><i class="fa-solid fa-check text-primary"></i> Support employee growth and work-life balance</li>
            <li><i class="fa-solid fa-check text-primary"></i> Utilize safe, eco-friendly cleaning formulations</li>
            <li><i class="fa-solid fa-check text-primary"></i> Remain an industry leader across Ghana</li>
          </ul>
        </div>
        <div class="vision-box" style="padding: 2.5rem; background: #ffffff; border-radius: 16px; box-shadow: var(--shadow-sm); border: 1px solid #e2e8f0;">
          <div class="icon-header" style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem;">
            <i class="fa-solid fa-eye" style="font-size: 2rem; color: var(--secondary-color);"></i>
            <h3 style="font-size: 1.5rem; color: var(--text-dark);">Our Vision</h3>
          </div>
          <p style="font-size: 1.25rem; font-style: italic; color: #334155; line-height: 1.7;">
            "To professionally handle all cleaning and fumigation needs with uncompromised attention to detail."
          </p>
        </div>
      </div>
    </div>
  </main>

${renderFooter()}`;
  writePage('about/index.html', html);
}

// 2. /services
{
  const headHtml = renderHead({
    title: 'Cleaning Services Accra | Kleenit Ghana Limited',
    description: 'Explore residential, commercial, and specialized cleaning services in Accra by Kleenit Ghana Limited. View our complete service catalog.',
    canonicalPath: '/services',
    schemaObjects: [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": BASE_URL },
          { "@type": "ListItem", "position": 2, "name": "Services", "item": `${BASE_URL}/services` }
        ]
      }
    ]
  });

  const html = `${headHtml}
${renderNavbar('services')}

  <header class="page-hero">
    <div class="container page-hero-content">
      <nav class="breadcrumb-nav" aria-label="Breadcrumbs">
        <ol class="breadcrumbs">
          <li><a href="/">Home</a></li>
          <li aria-current="page">Services Directory</li>
        </ol>
      </nav>
      <h1 class="page-title">Cleaning & Fumigation Services in Accra</h1>
      <p class="page-subtitle">Comprehensive, reliable residential, commercial, and specialized hygiene solutions across Greater Accra.</p>
    </div>
  </header>

  <main class="section-padding">
    <div class="container">
      <!-- Core Services Section -->
      <h2 class="section-title">Core Cleaning Solutions</h2>
      <p class="section-subtitle" style="margin-bottom: 2.5rem;">Click any service for detailed scope, pricing, and direct booking.</p>
      
      <div class="services-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.75rem; margin-bottom: 4rem;">
        ${coreServices.map(cs => `
        <div class="service-card" style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 2rem; box-shadow: var(--shadow-sm); display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <div class="service-icon" style="font-size: 2rem; color: var(--primary-color); margin-bottom: 1rem;"><i class="fa-solid fa-sparkles"></i></div>
            <h3 style="font-size: 1.35rem; color: var(--text-dark); margin-bottom: 0.75rem;">${cs.h1}</h3>
            <p style="color: #64748b; font-size: 0.95rem; line-height: 1.6; margin-bottom: 1.25rem;">${cs.subtitle}</p>
          </div>
          <a href="${cs.url}" class="btn btn-outline" style="align-self: flex-start;">Explore Service <i class="fa-solid fa-arrow-right"></i></a>
        </div>`).join('')}
      </div>

      <!-- Specialized Services Section -->
      <h2 class="section-title">Specialized Cleaning Services</h2>
      <p class="section-subtitle" style="margin-bottom: 2.5rem;">Targeted treatments for furniture, surfaces, kitchens, and events.</p>
      
      <div class="services-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; margin-bottom: 4rem;">
        ${secondaryServices.map(sub => `
        <div class="service-card" style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1.5rem; box-shadow: var(--shadow-sm);">
          <h3 style="font-size: 1.15rem; color: var(--text-dark); margin-bottom: 0.5rem;">${sub.h1}</h3>
          <p style="color: #64748b; font-size: 0.88rem; line-height: 1.5; margin-bottom: 1rem;">${sub.subtitle}</p>
          <a href="${sub.url}" style="color: var(--primary-color); font-weight: 600; font-size: 0.9rem;">View Details & Pricing &rarr;</a>
        </div>`).join('')}
      </div>

      <!-- Service Areas Section -->
      <h2 class="section-title">Accra Service Locations</h2>
      <p class="section-subtitle" style="margin-bottom: 1.5rem;">We service all major neighborhoods across the Greater Accra Region.</p>
      <div class="area-pills-grid" style="margin-bottom: 4rem;">
        ${areaPages.map(a => `<a href="${a.url}" class="area-pill"><i class="fa-solid fa-location-dot"></i> ${a.name}</a>`).join('')}
      </div>
    </div>
  </main>

${renderFooter()}`;
  writePage('services/index.html', html);
}

// 3. /gallery
{
  const headHtml = renderHead({
    title: 'Cleaning Project Gallery | Kleenit Ghana Limited',
    description: 'Browse photos and videos of Kleenit Ghana Limited’s commercial and residential cleaning projects across Accra, Ghana. Call 054 402 6418.',
    canonicalPath: '/gallery',
    schemaObjects: [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": BASE_URL },
          { "@type": "ListItem", "position": 2, "name": "Gallery", "item": `${BASE_URL}/gallery` }
        ]
      }
    ]
  });

  const html = `${headHtml}
${renderNavbar('gallery')}

  <header class="page-hero">
    <div class="container page-hero-content">
      <nav class="breadcrumb-nav" aria-label="Breadcrumbs">
        <ol class="breadcrumbs">
          <li><a href="/">Home</a></li>
          <li aria-current="page">Gallery</li>
        </ol>
      </nav>
      <h1 class="page-title">Project Gallery</h1>
      <p class="page-subtitle">See Kleenit Ghana Limited specialists in action across commercial and residential spaces in Accra.</p>
    </div>
  </header>

  <main class="section-padding">
    <div class="container">
      <div class="gallery-grid">
        <div class="gallery-item" data-src="/auditorium-cleaning.jpg">
          <img src="/auditorium-cleaning.jpg" alt="Auditorium and commercial facility deep cleaning in Accra by Kleenit Ghana Limited" style="width: 100%; height: 100%; object-fit: cover; border-radius: 12px;" loading="lazy" />
          <div class="gallery-overlay" style="border-radius: 12px;"><i class="fa-solid fa-magnifying-glass-plus"></i></div>
          <p class="video-label">Auditorium Deep Cleaning</p>
        </div>
        <div class="gallery-item" data-src="/post-construction.jpg">
          <img src="/post-construction.jpg" alt="Post-construction cleanup and dust removal on newly completed Accra building" style="width: 100%; height: 100%; object-fit: cover; border-radius: 12px;" loading="lazy" />
          <div class="gallery-overlay" style="border-radius: 12px;"><i class="fa-solid fa-magnifying-glass-plus"></i></div>
          <p class="video-label">Post Construction Cleaning</p>
        </div>
        <div class="gallery-item" data-src="/janitorial-cleaning.jpg">
          <img src="/janitorial-cleaning.jpg" alt="Commercial office janitorial service delivered by Kleenit Ghana Limited in Accra" style="width: 100%; height: 100%; object-fit: cover; border-radius: 12px;" loading="lazy" />
          <div class="gallery-overlay" style="border-radius: 12px;"><i class="fa-solid fa-magnifying-glass-plus"></i></div>
          <p class="video-label">Office Janitorial Service</p>
        </div>
        <div class="gallery-item" data-src="/pic1.jpg">
          <img src="/pic1.jpg" alt="Deep carpet and upholstery steam extraction cleaning in an Accra home" style="width: 100%; height: 100%; object-fit: cover; border-radius: 12px;" loading="lazy" />
          <div class="gallery-overlay" style="border-radius: 12px;"><i class="fa-solid fa-magnifying-glass-plus"></i></div>
          <p class="video-label">Carpet & Upholstery Cleaning</p>
        </div>
        <div class="gallery-item" data-src="/pic2.jpg">
          <img src="/pic2.jpg" alt="Living room deep housekeeping and furniture sanitization in Accra" style="width: 100%; height: 100%; object-fit: cover; border-radius: 12px;" loading="lazy" />
          <div class="gallery-overlay" style="border-radius: 12px;"><i class="fa-solid fa-magnifying-glass-plus"></i></div>
          <p class="video-label">Living Room Deep Cleaning</p>
        </div>
        <div class="gallery-item" data-src="/pic3.jpg">
          <img src="/pic3.jpg" alt="Corporate office desk sanitization and floor maintenance in Accra" style="width: 100%; height: 100%; object-fit: cover; border-radius: 12px;" loading="lazy" />
          <div class="gallery-overlay" style="border-radius: 12px;"><i class="fa-solid fa-magnifying-glass-plus"></i></div>
          <p class="video-label">Office Desk & Floor Detailing</p>
        </div>
      </div>

      <!-- Lightbox Modal -->
      <div id="lightbox" class="lightbox">
        <span class="close-lightbox">&times;</span>
        <img class="lightbox-content" id="lightbox-img" style="display: none;" />
        <video class="lightbox-content" id="lightbox-video" controls style="display: none;"></video>
      </div>
    </div>
  </main>

${renderFooter()}`;
  writePage('gallery/index.html', html);
}

// 4. /contact
{
  const headHtml = renderHead({
    title: 'Contact Us | Kleenit Ghana Limited Accra',
    description: 'Contact Kleenit Ghana Limited at 1 Flower Street, Dome Pillar 2, Accra. Book cleaning services online or call WhatsApp 054 402 6418 today.',
    canonicalPath: '/contact',
    schemaObjects: [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": BASE_URL },
          { "@type": "ListItem", "position": 2, "name": "Contact", "item": `${BASE_URL}/contact` }
        ]
      }
    ]
  });

  const html = `${headHtml}
${renderNavbar('contact')}

  <header class="page-hero">
    <div class="container page-hero-content">
      <nav class="breadcrumb-nav" aria-label="Breadcrumbs">
        <ol class="breadcrumbs">
          <li><a href="/">Home</a></li>
          <li aria-current="page">Contact Us</li>
        </ol>
      </nav>
      <h1 class="page-title">Contact Kleenit Ghana Limited</h1>
      <p class="page-subtitle">Get in touch with our team for inquiries, quotes, and immediate cleaning bookings in Accra.</p>
    </div>
  </header>

  <main class="section-padding">
    <div class="container">
      <div class="contact-grid">
        <div class="contact-info">
          <div class="contact-item">
            <i class="fa-solid fa-phone"></i>
            <div>
              <h4>Call Us</h4>
              <a href="tel:0544026418">${PHONE_NUMBER}</a>
            </div>
          </div>
          <div class="contact-item">
            <i class="fa-brands fa-whatsapp"></i>
            <div>
              <h4>WhatsApp Us</h4>
              <a href="${WHATSAPP_LINK}" target="_blank" rel="noopener noreferrer">${PHONE_NUMBER}</a>
            </div>
          </div>
          <div class="contact-item">
            <i class="fa-solid fa-envelope"></i>
            <div>
              <h4>Email Us</h4>
              <a href="mailto:${EMAIL_ADDRESS}">${EMAIL_ADDRESS}</a>
            </div>
          </div>
          <div class="contact-item">
            <i class="fa-solid fa-location-dot"></i>
            <div>
              <h4>Headquarters Location</h4>
              <p>${ADDRESS_FULL}</p>
              <p class="text-muted"><small><i class="fa-solid fa-clock"></i> By appointment only • Mon - Sat: 7:30 AM - 6:00 PM</small></p>
            </div>
          </div>
        </div>

        <div class="contact-form-container">
          ${renderBookingForm('', 'Fill out the form below. We record your booking in our system immediately and connect on WhatsApp.')}
        </div>
      </div>

      <!-- Google Map -->
      <div class="map-container mt-4" style="margin-top: 3rem; border-radius: 16px; overflow: hidden; box-shadow: var(--shadow-sm);">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15881.047029519395!2d-0.223838!3d5.642593!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfdf9ebf00000001%3A0x0!2sDome%2C%20Accra%2C%20Ghana!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s"
          width="100%" height="350" style="border:0;" allowfullscreen="" loading="lazy"
          referrerpolicy="no-referrer-when-downgrade">
        </iframe>
      </div>
    </div>
  </main>

${renderFooter()}`;
  writePage('contact/index.html', html);
}

console.log('All 29 secondary & core SEO pages generated successfully!');
