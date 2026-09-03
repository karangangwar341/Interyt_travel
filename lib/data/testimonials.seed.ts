export interface Testimonial {
  tripSlug: string;
  name: string;
  location: string;
  rating: number;
  quote: string;
  travelMonth: string;
}

// Source-of-truth content used by prisma/seed.ts to populate the Review
// table. The live app reads reviews from the database, not this file — this
// is the migration record. These are sample/placeholder testimonials for
// preview purposes — replace with real, verified customer feedback before
// this site goes live (see Review.isSample and Testimonials.tsx).
export const testimonials: Testimonial[] = [
  {
    tripSlug: "kashmir-complete-escape",
    name: "Priya & Arjun Mehta",
    location: "Mumbai",
    rating: 5,
    quote: "The houseboat night on Dal Lake was magical, and Gulmarg's gondola ride was the highlight of our honeymoon. Everything was well organized end to end.",
    travelMonth: "May 2026",
  },
  {
    tripSlug: "kashmir-complete-escape",
    name: "Sanjana Rao",
    location: "Hyderabad",
    rating: 4,
    quote: "Traveled with my parents and the pace was perfect for them — comfortable hotels and a driver who really knew the routes well.",
    travelMonth: "April 2026",
  },
  {
    tripSlug: "ladakh-bike-expedition",
    name: "Rohan Deshpande",
    location: "Pune",
    rating: 5,
    quote: "The support vehicle made a huge difference on the Pangong stretch. Khardung La at sunrise is something I'll never forget.",
    travelMonth: "July 2025",
  },
  {
    tripSlug: "ladakh-bike-expedition",
    name: "Kunal Verma",
    location: "Delhi",
    rating: 5,
    quote: "Well-paced acclimatization days meant nobody in our group struggled with the altitude. Bikes were well maintained throughout.",
    travelMonth: "August 2025",
  },
  {
    tripSlug: "spiti-valley-circuit",
    name: "Ananya Iyer",
    location: "Bangalore",
    rating: 5,
    quote: "Chandratal camping under a sky full of stars was surreal. The Atal Tunnel crossing saved us a lot of travel time too.",
    travelMonth: "June 2026",
  },
  {
    tripSlug: "rishikesh-rafting-yoga-weekend",
    name: "Karan Malhotra",
    location: "Delhi",
    rating: 4,
    quote: "Perfect quick escape from the city. Rafting guides were experienced and the riverside camp had a great vibe.",
    travelMonth: "October 2025",
  },
  {
    tripSlug: "royal-rajasthan-heritage-trail",
    name: "Meera & Vikram Singh",
    location: "Ahmedabad",
    rating: 5,
    quote: "Ten days flew by. The desert camp in Jaisalmer and the lake-view room in Udaipur were both unforgettable.",
    travelMonth: "December 2025",
  },
  {
    tripSlug: "royal-rajasthan-heritage-trail",
    name: "Ritika Chawla",
    location: "Chandigarh",
    rating: 5,
    quote: "Every hotel felt like a piece of history. Our guide's knowledge of Jodhpur's old city made the walk so much richer.",
    travelMonth: "January 2026",
  },
  {
    tripSlug: "goa-beach-getaway",
    name: "Neha Kapoor",
    location: "Mumbai",
    rating: 4,
    quote: "Relaxed, well-priced, and the sunset cruise was a nice surprise addition. Would book again for a quick beach break.",
    travelMonth: "December 2025",
  },
  {
    tripSlug: "kerala-backwaters-and-hills",
    name: "Divya & Arjun Nair",
    location: "Chennai",
    rating: 5,
    quote: "The private houseboat exceeded expectations — the crew cooked fresh Kerala meals onboard. Munnar's tea gardens were stunning too.",
    travelMonth: "November 2025",
  },
  {
    tripSlug: "kerala-backwaters-and-hills",
    name: "Fatima Sheikh",
    location: "Kochi",
    rating: 5,
    quote: "Booked this for our anniversary and it delivered on every front — scenery, comfort, and genuinely helpful support throughout.",
    travelMonth: "February 2026",
  },
  {
    tripSlug: "meghalaya-living-root-trek",
    name: "Aditya Bose",
    location: "Kolkata",
    rating: 5,
    quote: "The root bridge trek was tough but so worth it. Mawlynnong village was unlike anywhere else I've traveled in India.",
    travelMonth: "November 2025",
  },
  {
    tripSlug: "coorg-coffee-trails",
    name: "Ritu Sharma",
    location: "Bangalore",
    rating: 4,
    quote: "Easy long-weekend trip from Bangalore. The plantation walk and Abbey Falls were both lovely, low-key, and relaxing.",
    travelMonth: "January 2026",
  },
  {
    tripSlug: "sikkim-monastery-and-mountains",
    name: "Farhan Sheikh",
    location: "Guwahati",
    rating: 5,
    quote: "Yumthang Valley in bloom was breathtaking. Our driver navigated the mountain roads confidently even with kids in the car.",
    travelMonth: "May 2026",
  },
];
