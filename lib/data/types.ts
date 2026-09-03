export type Region = "NORTH" | "WEST" | "SOUTH" | "EAST" | "NORTHEAST";

export type TripType = "ADVENTURE" | "LEISURE" | "CULTURAL" | "ROAD_TRIP" | "WEEKEND";

export type Difficulty = "EASY" | "MODERATE" | "CHALLENGING";

export type DepartureStatus =
  | "SEATS_AVAILABLE"
  | "ALMOST_FULL"
  | "SOLD_OUT"
  | "COMPLETED"
  | "CANCELLED";

export type ScenicPattern = "mountains" | "waves" | "dunes" | "hills" | "forest" | "heritage";
export type ScenicTone = "forest" | "terracotta" | "sand" | "charcoal";

export interface GalleryImage {
  url: string;
  alt: string;
  width?: number;
  height?: number;
  credit?: string;
  creditUrl?: string;
}

export interface Destination {
  id: string;
  name: string;
  slug: string;
  state: string;
  region: Region;
  summary: string;
  description: string;
  bestSeason: string;
  thingsToDo: string[];
  experiences: string[];
  faqs: { question: string; answer: string }[];
  scenic: { pattern: ScenicPattern; tone: ScenicTone };
  heroImage?: GalleryImage;
  gallery?: GalleryImage[];
  seoTitle?: string;
  seoDescription?: string;
  published: boolean;
}

export interface TripItineraryDay {
  dayNumber: number;
  title: string;
  location: string;
  activities: string[];
  travelDistance?: string;
  travelTime?: string;
  hotel?: string;
  meals?: string;
  notes?: string;
}

export interface TripFaq {
  question: string;
  answer: string;
}

export interface Trip {
  id: string;
  title: string;
  slug: string;
  destinationSlug: string;
  states: string[];
  durationDays: number;
  durationNights: number;
  price: number;
  currency: "INR";
  scenic: { pattern: ScenicPattern; tone: ScenicTone };
  heroImage?: GalleryImage;
  gallery?: GalleryImage[];
  overview: string;
  highlights: string[];
  itinerary: TripItineraryDay[];
  inclusions: string[];
  exclusions: string[];
  hotels: string[];
  transport?: string;
  meals?: string;
  bestSeason?: string;
  difficulty: Difficulty;
  tripType: TripType;
  tags: string[];
  faqs: TripFaq[];
  rating?: number;
  seoTitle?: string;
  seoDescription?: string;
  published: boolean;
}

export type GuideCategory =
  | "Travel Guides"
  | "Things To Do"
  | "Best Time To Visit"
  | "Food"
  | "Hotels"
  | "Road Trips"
  | "Trekking"
  | "Family Travel"
  | "Honeymoon"
  | "Budget Travel";

export interface GuideSection {
  heading?: string;
  paragraphs: string[];
  list?: string[];
}

export interface TravelGuideArticle {
  id: string;
  title: string;
  slug: string;
  category: GuideCategory;
  destinationSlug?: string;
  excerpt: string;
  content: GuideSection[];
  readTimeMinutes: number;
  scenic: { pattern: ScenicPattern; tone: ScenicTone };
  heroImage?: GalleryImage;
  seoTitle?: string;
  seoDescription?: string;
  published: boolean;
}

export interface UpcomingTrip {
  id: string;
  tripSlug: string;
  departureDate: string;
  returnDate: string;
  departureLocation: string;
  totalSeats: number;
  availableSeats: number;
  price: number;
  bookingDeadline: string;
  status: DepartureStatus;
  featured: boolean;
}
