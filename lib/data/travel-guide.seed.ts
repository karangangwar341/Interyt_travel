import type { TravelGuideArticle } from "./types";

// Source-of-truth content used by prisma/seed.ts to populate the database.
// The live app reads articles from the database, not this file — this is
// the migration record.
export const guideCategories = [
  "Travel Guides",
  "Things To Do",
  "Best Time To Visit",
  "Food",
  "Hotels",
  "Road Trips",
  "Trekking",
  "Family Travel",
  "Honeymoon",
  "Budget Travel",
] as const;

export const articles: TravelGuideArticle[] = [
  {
    id: "guide-kashmir-places",
    title: "Best Places to Visit in Kashmir",
    slug: "best-places-to-visit-in-kashmir",
    category: "Travel Guides",
    destinationSlug: "kashmir",
    excerpt:
      "From Dal Lake's houseboats to Gulmarg's snow slopes, here's how to plan a first-time trip through the Kashmir valley.",
    readTimeMinutes: 6,
    scenic: { pattern: "mountains", tone: "forest" },
    content: [
      {
        heading: "Srinagar: where every trip begins",
        paragraphs: [
          "Most Kashmir itineraries start in Srinagar, and for good reason — a night on a houseboat on Dal Lake, drifting past floating vegetable markets in a shikara at sunrise, sets the tone for everything that follows. Set aside a full day for the Mughal Gardens (Nishat Bagh and Shalimar Bagh are the standouts), terraced lawns backed by the Zabarwan hills.",
        ],
      },
      {
        heading: "Gulmarg for the views, Pahalgam for the valleys",
        paragraphs: [
          "Gulmarg is built around its gondola — one of the highest cable cars in the world — which climbs toward Apharwat Peak in two stages. In winter this is Kashmir's ski hub; in summer the same slopes turn into rolling green meadows.",
          "Pahalgam trades altitude for scenery: Betaab Valley and Aru Valley are both easy half-day trips along the Lidder river, and the town itself makes a relaxed base for two or three nights.",
        ],
      },
      {
        heading: "How much time do you need",
        paragraphs: [
          "A well-paced first trip covering Srinagar, Gulmarg and Pahalgam typically runs 6-7 days. Trying to compress it into 4-5 days is possible but means less time in each place and more days spent driving.",
        ],
        list: [
          "2 nights Srinagar (houseboat + hotel)",
          "2 nights Gulmarg",
          "2 nights Pahalgam",
          "1 night buffer for weather-dependent plans",
        ],
      },
    ],
    published: true,
  },
  {
    id: "guide-ladakh-best-time",
    title: "Best Time to Visit Ladakh",
    slug: "best-time-to-visit-ladakh",
    category: "Best Time To Visit",
    destinationSlug: "ladakh",
    excerpt:
      "Ladakh's high-altitude roads are only open a few months a year — here's how to time your trip around Manali-Leh, Srinagar-Leh, and winter travel.",
    readTimeMinutes: 5,
    scenic: { pattern: "mountains", tone: "charcoal" },
    content: [
      {
        heading: "May to September: the main season",
        paragraphs: [
          "The Manali-Leh and Srinagar-Leh highways typically open by late May or early June and stay open through September, sometimes into early October depending on snowfall. This is when Pangong Tso, Nubra Valley and the high passes are all accessible by road, and it's by far the most popular window to visit.",
        ],
      },
      {
        heading: "June-August: peak season, peak crowds",
        paragraphs: [
          "July and August see the highest footfall — school holidays, clear roads, and warm (if still crisp) daytime temperatures. Book accommodation and permits in advance if traveling in this window.",
        ],
      },
      {
        heading: "Winter (December-February): Chadar and snow leopards",
        paragraphs: [
          "Ladakh doesn't close in winter — Leh stays accessible by flight year-round — but road travel becomes limited to a handful of specialist routes. This is when the frozen Zanskar river (Chadar) trek runs, and Hemis National Park offers some of the best snow leopard tracking in the world. It's a completely different, more demanding kind of trip suited to experienced travelers.",
        ],
      },
    ],
    published: true,
  },
  {
    id: "guide-rajasthan-7day",
    title: "7-Day Rajasthan Itinerary",
    slug: "7-day-rajasthan-itinerary",
    category: "Travel Guides",
    destinationSlug: "rajasthan",
    excerpt: "A realistic one-week route through Jaipur, Jodhpur and Udaipur — what to prioritize and what to skip.",
    readTimeMinutes: 7,
    scenic: { pattern: "dunes", tone: "terracotta" },
    content: [
      {
        heading: "Why 7 days means picking three cities, not four",
        paragraphs: [
          "Rajasthan's full circuit (Jaipur, Jodhpur, Jaisalmer, Udaipur) really needs 10-12 days once you account for travel time between cities. With 7 days, the better move is to drop Jaisalmer and focus on Jaipur, Jodhpur and Udaipur — each gets 2 full days instead of a rushed one.",
        ],
      },
      {
        heading: "A sample 7-day route",
        paragraphs: [],
        list: [
          "Day 1-2: Jaipur — Amber Fort, City Palace, Hawa Mahal, old city bazaars",
          "Day 3: Drive Jaipur → Jodhpur (~5-6 hrs)",
          "Day 4-5: Jodhpur — Mehrangarh Fort, Jaswant Thada, the blue old city",
          "Day 6: Drive Jodhpur → Udaipur (~5-6 hrs)",
          "Day 7: Udaipur — City Palace, Lake Pichola boat ride",
        ],
      },
      {
        heading: "If you'd rather add Jaisalmer",
        paragraphs: [
          "Swap the Jodhpur-Udaipur road leg for a Jodhpur-Jaisalmer-Udaipur route by flight or overnight train between Jaisalmer and Udaipur — it adds a desert camp night but is a tighter, more expensive itinerary than the 3-city version above.",
        ],
      },
    ],
    published: true,
  },
  {
    id: "guide-kerala-places",
    title: "Best Places to Visit in Kerala",
    slug: "best-places-to-visit-in-kerala",
    category: "Travel Guides",
    destinationSlug: "kerala",
    excerpt: "Backwaters, hill stations and beaches — how to combine Kerala's three signature landscapes in one trip.",
    readTimeMinutes: 6,
    scenic: { pattern: "waves", tone: "forest" },
    content: [
      {
        heading: "Alleppey: the backwaters everyone comes for",
        paragraphs: [
          "A night on a private houseboat, cruising Alleppey's network of canals and paddy fields, is Kerala's signature experience. Boats range from simple to genuinely luxurious, and most include all meals cooked on board.",
        ],
      },
      {
        heading: "Munnar for altitude and tea",
        paragraphs: [
          "Munnar's rolling tea estates sit at a cool 1,600m, a welcome break from the coastal humidity. Eravikulam National Park (home to the endangered Nilgiri tahr) and the Mattupetty viewpoint are both easy half-day additions.",
        ],
      },
      {
        heading: "Putting it together",
        paragraphs: [
          "A 6-day route of Munnar (2N) → Thekkady (1N) → Alleppey (1N houseboat) → Kochi (1N) hits all three landscapes without excessive driving, and works equally well as a family trip or a honeymoon.",
        ],
      },
    ],
    published: true,
  },
  {
    id: "guide-manali-leh-road-trip",
    title: "Manali to Leh Road Trip: Everything You Need to Know",
    slug: "manali-to-leh-road-trip",
    category: "Road Trips",
    destinationSlug: "himachal-pradesh",
    excerpt: "One of India's great road trips — the passes, the timing, and what to actually expect on the Manali-Leh highway.",
    readTimeMinutes: 7,
    scenic: { pattern: "mountains", tone: "sand" },
    content: [
      {
        heading: "The route in brief",
        paragraphs: [
          "The Manali-Leh highway runs roughly 470km and crosses five high passes — Rohtang, Baralacha La, Nakee La, Lachulung La and Tanglang La — most above 4,500m. Done non-stop it's a grueling single push; most travelers split it over 2 days with an overnight in Sarchu or Pang.",
        ],
      },
      {
        heading: "When it's open",
        paragraphs: [
          "The highway is typically open from mid-June to early October, depending on snow clearance. Attempting it outside this window is not advisable — sections can be impassable or genuinely dangerous.",
        ],
      },
      {
        heading: "Acclimatization matters more than speed",
        paragraphs: [
          "The single biggest mistake is rushing. Spending a day in Manali before departure, and treating Sarchu (4,290m) as a proper overnight rather than a quick stop, meaningfully reduces the risk of altitude sickness on the passes that follow.",
        ],
        list: [
          "Carry warm layers even in July — nights at Sarchu regularly drop below freezing",
          "Fuel up fully in Manali and Keylong — the next reliable pump is in Leh",
          "Keep cash on hand; card payments are unreliable along the route",
        ],
      },
    ],
    published: true,
  },
  {
    id: "guide-honeymoon-destinations",
    title: "Best Honeymoon Destinations in India",
    slug: "best-honeymoon-destinations-in-india",
    category: "Honeymoon",
    excerpt: "From Kerala's private houseboats to Kashmir's houseboat-and-mountain combo — India's best honeymoon circuits.",
    readTimeMinutes: 6,
    scenic: { pattern: "waves", tone: "sand" },
    content: [
      {
        heading: "Kerala: privacy and pace",
        paragraphs: [
          "A private houseboat in Alleppey, followed by a couple of nights in a Munnar hill resort, is hard to beat for a relaxed honeymoon that doesn't feel rushed. Kerala's resorts are also generally well set up for couples specifically, with private pool villas widely available.",
        ],
      },
      {
        heading: "Kashmir: houseboats and mountain views",
        paragraphs: [
          "Kashmir offers a different register — a houseboat night on Dal Lake followed by Gulmarg or Pahalgam gives a honeymoon real visual variety, from lake to snow-capped peaks, within a single week-long trip.",
        ],
      },
      {
        heading: "Goa: for a shorter, beach-first trip",
        paragraphs: [
          "For couples with less time, Goa's beach resorts and relaxed pace make a strong 3-4 day honeymoon add-on, especially paired with a longer trip elsewhere.",
        ],
      },
    ],
    published: true,
  },
  {
    id: "guide-weekend-trips-delhi",
    title: "Best Weekend Trips from Delhi",
    slug: "best-weekend-trips-from-delhi",
    category: "Road Trips",
    destinationSlug: "uttarakhand",
    excerpt: "Rishikesh, Jaipur, and other short escapes reachable from Delhi in under 6 hours.",
    readTimeMinutes: 5,
    scenic: { pattern: "hills", tone: "forest" },
    content: [
      {
        heading: "Rishikesh: rafting and the riverside",
        paragraphs: [
          "At around 6 hours by road, Rishikesh is Delhi's classic weekend escape — white-water rafting on the Ganga, riverside camping, and an evening Ganga Aarti all fit comfortably into a 2-night trip.",
        ],
      },
      {
        heading: "Jaipur: heritage without the long haul",
        paragraphs: [
          "Jaipur is roughly 5-6 hours by road or under 2 hours by train, making it an easy weekend for Amber Fort, City Palace and the old city bazaars without needing a full Rajasthan itinerary.",
        ],
      },
      {
        heading: "Planning tip",
        paragraphs: [
          "For a genuine 2-day weekend, anywhere within a 5-6 hour drive works best — beyond that, the travel time starts to eat into the trip itself. Leaving Friday night or very early Saturday makes the most of a short window.",
        ],
      },
    ],
    published: true,
  },
  {
    id: "guide-himalayan-trekking",
    title: "A Beginner's Guide to Trekking in the Indian Himalayas",
    slug: "beginners-guide-to-trekking-in-the-indian-himalayas",
    category: "Trekking",
    excerpt: "What first-time trekkers should know before attempting a Himalayan trail — fitness, gear, and altitude.",
    readTimeMinutes: 6,
    scenic: { pattern: "mountains", tone: "forest" },
    content: [
      {
        heading: "Start with a graded, well-trodden trail",
        paragraphs: [
          "Routes like the Meghalaya living root bridge trek or lower-altitude sections in Himachal are good first outings — clear paths, established rest points, and altitudes low enough that acclimatization isn't a major concern.",
        ],
      },
      {
        heading: "Altitude changes everything above 3,000m",
        paragraphs: [
          "Above roughly 3,000m, altitude sickness becomes a real factor regardless of fitness level. The rule that matters most is not gaining more than 300-500m of sleeping altitude per day once above that threshold, and treating any headache or nausea as a signal to stop ascending, not push through.",
        ],
      },
      {
        heading: "What to actually pack",
        paragraphs: [],
        list: [
          "Layered clothing — a base layer, insulating mid-layer, and a waterproof/windproof shell",
          "Broken-in trekking boots — never a brand-new pair on trek day",
          "A basic first-aid kit and any personal medication",
          "A reusable water bottle and purification tablets or a filter",
        ],
      },
    ],
    published: true,
  },
  {
    id: "guide-family-travel",
    title: "Family Travel in India: Top Kid-Friendly Destinations",
    slug: "family-travel-in-india-kid-friendly-destinations",
    category: "Family Travel",
    excerpt: "Destinations that work well with children in tow — easy pacing, engaging activities, and reliable comfort.",
    readTimeMinutes: 5,
    scenic: { pattern: "hills", tone: "sand" },
    content: [
      {
        heading: "Kerala's backwaters",
        paragraphs: [
          "A houseboat is an instant hit with kids — space to move around, calm water, and enough novelty (fishing nets, village life along the banks) to hold attention without needing a packed schedule.",
        ],
      },
      {
        heading: "Goa for easy logistics",
        paragraphs: [
          "Goa's short transfer times, beach-and-pool resort options, and relaxed pace make it one of the lowest-stress family destinations in India, especially for a first international-feeling trip with younger kids.",
        ],
      },
      {
        heading: "Rajasthan, with the right pacing",
        paragraphs: [
          "Forts and palaces genuinely engage older children, but the itinerary needs breathing room — fewer cities, more downtime at the hotel pool, and camel rides or puppet shows built in rather than back-to-back monument visits.",
        ],
      },
    ],
    published: true,
  },
  {
    id: "guide-south-india-food",
    title: "Where to Eat: A Regional Food Guide to South India",
    slug: "regional-food-guide-to-south-india",
    category: "Food",
    excerpt: "What to order in Kerala, Tamil Nadu and Karnataka — beyond the dosa and idli you already know.",
    readTimeMinutes: 6,
    scenic: { pattern: "waves", tone: "terracotta" },
    content: [
      {
        heading: "Kerala: coconut, seafood, and the Sadya",
        paragraphs: [
          "Kerala cuisine leans heavily on coconut and curry leaves — try appam with stew, a Kerala-style fish curry, or if you're there during Onam, a full Sadya (a multi-course vegetarian feast served on a banana leaf).",
        ],
      },
      {
        heading: "Tamil Nadu: beyond breakfast",
        paragraphs: [
          "Idli and dosa get the attention, but a Chettinad meal — built around a distinct blend of roasted spices — is worth actively seeking out in Madurai or Chennai, especially the pepper chicken or mutton versions.",
        ],
      },
      {
        heading: "Karnataka: Coorg's pork curry",
        paragraphs: [
          "Coorg's cuisine stands apart from the rest of Karnataka — pandi curry (a tangy pork curry made with a local souring agent called kachampuli) is the dish to try if you're visiting a coffee estate homestay.",
        ],
      },
    ],
    published: true,
  },
];
