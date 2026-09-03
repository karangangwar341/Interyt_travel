import type { Destination } from "./types";

// Source-of-truth content used by prisma/seed.ts to populate the database,
// and by lib/data/destinations.ts for the presentational-only scenic SVG
// lookup (see components/ui/ScenicBlock.tsx). The live app reads destination
// content from the database, not this file — this is the migration record.
export const destinations: Destination[] = [
  {
    id: "dest-kashmir",
    name: "Kashmir",
    slug: "kashmir",
    state: "Jammu & Kashmir",
    region: "NORTH",
    summary: "Alpine lakes, saffron valleys and snow-capped peaks — India's most cinematic mountain landscape.",
    description:
      "Kashmir pairs the still waters of Dal Lake with the meadows of Gulmarg and Pahalgam. Houseboat stays, shikara rides, and pine-forested valleys make it one of India's most photographed regions, equally suited to leisurely sightseeing and high-altitude adventure.",
    bestSeason: "March to October for valleys and gardens; December to February for snow sports in Gulmarg.",
    thingsToDo: [
      "Shikara ride on Dal Lake",
      "Gondola ride in Gulmarg",
      "Betaab Valley in Pahalgam",
      "Mughal Gardens of Srinagar",
      "Sonamarg glacier trek",
    ],
    experiences: ["Houseboat stay", "Saffron field walk", "Local Wazwan feast", "Snow skiing"],
    faqs: [
      {
        question: "Is Kashmir safe for tourists?",
        answer:
          "Kashmir's tourist circuits (Srinagar, Gulmarg, Pahalgam, Sonamarg) see heavy domestic and international footfall year-round. We recommend checking current travel advisories before booking and traveling with a local operator.",
      },
      {
        question: "How many days do I need for Kashmir?",
        answer: "A well-paced trip covering Srinagar, Gulmarg and Pahalgam typically needs 6-7 days.",
      },
    ],
    scenic: { pattern: "mountains", tone: "forest" },
    published: true,
  },
  {
    id: "dest-ladakh",
    name: "Ladakh",
    slug: "ladakh",
    state: "Ladakh",
    region: "NORTH",
    summary: "High-altitude desert, cobalt lakes and Buddhist monasteries above 11,000 feet.",
    description:
      "Ladakh's stark, moon-like terrain, turquoise lakes like Pangong Tso, and centuries-old monasteries at Thiksey and Diskit make it a bucket-list destination for riders, trekkers and photographers alike. Acclimatization is essential given the altitude.",
    bestSeason: "May to September, when Manali-Leh and Srinagar-Leh highways are open.",
    thingsToDo: [
      "Pangong Tso lake visit",
      "Nubra Valley sand dunes",
      "Thiksey Monastery",
      "Khardung La pass",
      "Magnetic Hill",
    ],
    experiences: ["Monastery stay", "Double-hump camel ride in Nubra", "Star-gazing camp"],
    faqs: [
      {
        question: "How do I deal with altitude sickness in Ladakh?",
        answer:
          "Spend at least one full day acclimatizing in Leh (3,500m) before heading to higher passes. Stay hydrated, avoid alcohol on arrival, and travel with an operator who builds acclimatization days into the itinerary.",
      },
    ],
    scenic: { pattern: "mountains", tone: "charcoal" },
    published: true,
  },
  {
    id: "dest-himachal",
    name: "Manali & Spiti",
    slug: "himachal-pradesh",
    state: "Himachal Pradesh",
    region: "NORTH",
    summary: "Pine valleys, high mountain passes and the cold desert of Spiti.",
    description:
      "Himachal Pradesh spans lush Kullu-Manali valleys to the stark high-altitude desert of Spiti. It's a favorite for road trips, monastery visits, and easy treks, with infrastructure that suits both first-time and experienced mountain travelers.",
    bestSeason: "March to June and September to November; Spiti is best May to October.",
    thingsToDo: [
      "Solang Valley",
      "Rohtang Pass",
      "Key Monastery in Spiti",
      "Old Manali cafes",
      "Chandratal Lake",
    ],
    experiences: ["Riverside camping", "Spiti homestay", "Paragliding in Solang"],
    faqs: [
      {
        question: "Can Spiti be visited with Manali in one trip?",
        answer:
          "Yes — the Manali-Kaza road connects both regions during summer months, making a combined Manali-Spiti circuit a popular 8-9 day itinerary.",
      },
    ],
    scenic: { pattern: "mountains", tone: "sand" },
    published: true,
  },
  {
    id: "dest-uttarakhand",
    name: "Rishikesh & Uttarakhand",
    slug: "uttarakhand",
    state: "Uttarakhand",
    region: "NORTH",
    summary: "The yoga capital of the world, Himalayan pilgrimage towns and white-water rafting.",
    description:
      "Uttarakhand blends spiritual towns like Rishikesh and Haridwar on the banks of the Ganga with the high Himalayan char dham circuit and hill stations like Nainital and Mussoorie.",
    bestSeason: "March to June and September to November.",
    thingsToDo: [
      "White-water rafting in Rishikesh",
      "Ganga Aarti at Triveni Ghat",
      "Nainital lake boating",
      "Valley of Flowers trek",
    ],
    experiences: ["Yoga retreat", "River rafting", "Himalayan trek"],
    faqs: [
      {
        question: "Is rafting in Rishikesh suitable for beginners?",
        answer:
          "Yes, the 16km stretch from Shivpuri to Rishikesh is beginner-friendly with grade II-III rapids and is done under trained guide supervision.",
      },
    ],
    scenic: { pattern: "hills", tone: "forest" },
    published: true,
  },
  {
    id: "dest-rajasthan",
    name: "Rajasthan",
    slug: "rajasthan",
    state: "Rajasthan",
    region: "WEST",
    summary: "Desert forts, royal palaces and the golden dunes of Jaisalmer.",
    description:
      "Rajasthan's circuit of Jaipur, Jodhpur, Udaipur and Jaisalmer delivers grand forts, lake palaces, vibrant bazaars and desert camps under open skies — India's most complete heritage and culture journey.",
    bestSeason: "October to March.",
    thingsToDo: [
      "Amber Fort, Jaipur",
      "Lake Pichola, Udaipur",
      "Mehrangarh Fort, Jodhpur",
      "Desert camp, Jaisalmer",
      "Pushkar Camel Fair (seasonal)",
    ],
    experiences: ["Desert camel safari", "Heritage haveli stay", "Rajasthani folk dinner"],
    faqs: [
      {
        question: "What's the ideal Rajasthan itinerary length?",
        answer:
          "10-12 days covers the full Jaipur-Jodhpur-Udaipur-Jaisalmer circuit comfortably. A 6-7 day trip can cover Jaipur and Udaipur alone.",
      },
    ],
    scenic: { pattern: "dunes", tone: "terracotta" },
    published: true,
  },
  {
    id: "dest-goa",
    name: "Goa",
    slug: "goa",
    state: "Goa",
    region: "WEST",
    summary: "Sun-soaked beaches, Portuguese heritage and India's most relaxed coastline.",
    description:
      "Goa's beaches range from the lively shores of Baga and Calangute to the quiet coves of the south. Add Portuguese-era churches, spice plantations and a thriving food scene for a well-rounded coastal escape.",
    bestSeason: "November to February.",
    thingsToDo: [
      "Baga and Anjuna beaches",
      "Basilica of Bom Jesus",
      "Dudhsagar Waterfalls",
      "Spice plantation tour",
      "Fontainhas Latin Quarter",
    ],
    experiences: ["Sunset cruise", "Beach shack dining", "Water sports"],
    faqs: [
      {
        question: "North Goa or South Goa — which is better?",
        answer:
          "North Goa suits travelers wanting nightlife and water sports; South Goa is quieter, with upscale resorts and calmer beaches. Many trips combine both.",
      },
    ],
    scenic: { pattern: "waves", tone: "sand" },
    published: true,
  },
  {
    id: "dest-gujarat",
    name: "Gujarat",
    slug: "gujarat",
    state: "Gujarat",
    region: "WEST",
    summary: "The white salt desert of the Rann of Kutch and Gir's Asiatic lions.",
    description:
      "Gujarat offers the surreal white expanse of the Rann of Kutch (best during the Rann Utsav season), the last wild home of the Asiatic lion at Gir, and vibrant craft villages across Kutch district.",
    bestSeason: "November to February for the Rann; December to March for Gir.",
    thingsToDo: [
      "White Rann of Kutch",
      "Gir National Park safari",
      "Rann Utsav tented camp",
      "Kutch handicraft villages",
    ],
    experiences: ["Desert tent stay", "Wildlife safari", "Craft village tour"],
    faqs: [
      {
        question: "When does Rann Utsav happen?",
        answer:
          "Rann Utsav typically runs from around late October/November through February, coinciding with the dry, moonlit season best for viewing the salt desert.",
      },
    ],
    scenic: { pattern: "dunes", tone: "sand" },
    published: true,
  },
  {
    id: "dest-kerala",
    name: "Kerala",
    slug: "kerala",
    state: "Kerala",
    region: "SOUTH",
    summary: "Backwaters, tea-carpeted hills and Ayurvedic wellness on India's tropical coast.",
    description:
      "Kerala's houseboat cruises through Alleppey's backwaters, Munnar's rolling tea estates, and Kovalam's beaches make it India's most relaxing green escape, often paired with authentic Ayurvedic treatments.",
    bestSeason: "September to March.",
    thingsToDo: [
      "Alleppey houseboat cruise",
      "Munnar tea gardens",
      "Periyar wildlife sanctuary",
      "Kovalam beach",
      "Kathakali performance",
    ],
    experiences: ["Houseboat stay", "Ayurvedic spa", "Backwater village walk"],
    faqs: [
      {
        question: "Is Kerala a good honeymoon destination?",
        answer:
          "Yes — the combination of private houseboat stays, hill station resorts and beach properties makes Kerala one of India's most popular honeymoon circuits.",
      },
    ],
    scenic: { pattern: "waves", tone: "forest" },
    published: true,
  },
  {
    id: "dest-karnataka",
    name: "Coorg & Karnataka",
    slug: "karnataka",
    state: "Karnataka",
    region: "SOUTH",
    summary: "Coffee estates, misty hills and ancient temple towns.",
    description:
      "Karnataka spans the coffee country of Coorg, the ruins of Hampi, and the palaces of Mysuru — a state that mixes hill-station calm with deep historical texture.",
    bestSeason: "October to March.",
    thingsToDo: [
      "Coorg coffee estate walk",
      "Abbey Falls",
      "Mysuru Palace",
      "Hampi ruins",
    ],
    experiences: ["Plantation stay", "Heritage temple tour"],
    faqs: [
      {
        question: "How far is Coorg from Bangalore?",
        answer: "Coorg is roughly a 5-6 hour drive from Bangalore, making it a popular long-weekend destination.",
      },
    ],
    scenic: { pattern: "hills", tone: "forest" },
    published: true,
  },
  {
    id: "dest-tamilnadu",
    name: "Tamil Nadu",
    slug: "tamil-nadu",
    state: "Tamil Nadu",
    region: "SOUTH",
    summary: "Dravidian temple towns, hill stations and the tip of the subcontinent.",
    description:
      "Tamil Nadu's Chola-era temple towns, the tea hills of Ooty and Kodaikanal, and coastal Kanyakumari at India's southern tip offer a deep cultural and scenic mix.",
    bestSeason: "November to March.",
    thingsToDo: [
      "Meenakshi Temple, Madurai",
      "Ooty toy train",
      "Kanyakumari sunset point",
      "Mahabalipuram shore temples",
    ],
    experiences: ["Temple heritage walk", "Tea estate stay"],
    faqs: [
      {
        question: "What is Tamil Nadu best known for?",
        answer: "Its Dravidian temple architecture, classical arts, and hill stations like Ooty and Kodaikanal.",
      },
    ],
    scenic: { pattern: "heritage", tone: "terracotta" },
    published: true,
  },
  {
    id: "dest-sikkim",
    name: "Sikkim",
    slug: "sikkim",
    state: "Sikkim",
    region: "NORTHEAST",
    summary: "Himalayan monasteries, alpine lakes and views of Kanchenjunga.",
    description:
      "Sikkim offers some of the Northeast's most accessible high-Himalayan scenery — Gangtok's monasteries, the alpine lake at Tsomgo, and the dramatic Kanchenjunga views from Pelling.",
    bestSeason: "March to June and September to December.",
    thingsToDo: [
      "Tsomgo Lake",
      "Nathula Pass",
      "Rumtek Monastery",
      "Yumthang Valley",
    ],
    experiences: ["Monastery visit", "Yak ride", "Village homestay"],
    faqs: [
      {
        question: "Do I need permits for Sikkim?",
        answer:
          "Indian citizens need an Inner Line Permit for certain areas like Tsomgo Lake and Nathula, typically arranged by your travel operator.",
      },
    ],
    scenic: { pattern: "mountains", tone: "forest" },
    published: true,
  },
  {
    id: "dest-meghalaya",
    name: "Meghalaya",
    slug: "meghalaya",
    state: "Meghalaya",
    region: "NORTHEAST",
    summary: "Living root bridges, waterfalls and the wettest place on Earth.",
    description:
      "Meghalaya's Khasi and Jaintia hills are home to centuries-old living root bridges at Cherrapunji and Mawlynnong, dramatic waterfalls, and some of India's cleanest villages.",
    bestSeason: "October to May (monsoon months bring the heaviest rainfall).",
    thingsToDo: [
      "Double Decker Living Root Bridge",
      "Nohkalikai Falls",
      "Mawlynnong village",
      "Dawki river boating",
    ],
    experiences: ["Root bridge trek", "Clear-water river boating", "Village homestay"],
    faqs: [
      {
        question: "Is Meghalaya good to visit during monsoon?",
        answer:
          "Waterfalls are at their most dramatic during monsoon, but trekking to root bridges is easier in the drier months of October-May.",
      },
    ],
    scenic: { pattern: "forest", tone: "forest" },
    published: true,
  },
];
