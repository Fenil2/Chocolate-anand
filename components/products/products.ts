/**
 * Central product catalogue.
 * DEMO CONTENT: names, descriptions and prices are proposals until the real range is confirmed.
 */

export type FlavourProfile = "rich-bold" | "fruity-playful" | "smooth-salty" | "deep-intense";

export type ProductKind = "bar" | "gift";

export interface Product {
  id: string;
  name: string;
  kind: ProductKind;
  subtitle: string;
  description: string;
  cacao?: number;
  /** Demo price in INR */
  price: number;
  weight: string;
  image: { src: string; alt: string };
  /** Accent colour drawn from the matching foil */
  accent: string;
  profile?: FlavourProfile;
}

export const bars: Product[] = [
  {
    id: "bold",
    name: "Bold",
    kind: "bar",
    subtitle: "70% Dark Chocolate",
    description: "Our house dark. Round, roasted and quietly intense.",
    cacao: 70,
    price: 280,
    weight: "50 g",
    image: { src: "/images/mora/bar-bold.jpg", alt: "MORA Bold 70% dark chocolate bar in black wrapper with copper foil" },
    accent: "#B87345",
    profile: "rich-bold",
  },
  {
    id: "crush",
    name: "Crush",
    kind: "bar",
    subtitle: "Dark Chocolate with Strawberry",
    description: "Bright strawberry pieces folded into deep, silky dark.",
    cacao: 60,
    price: 320,
    weight: "50 g",
    image: { src: "/images/mora/bar-crush.jpg", alt: "MORA Crush dark chocolate with strawberry, black wrapper with red foil" },
    accent: "#C24A55",
    profile: "fruity-playful",
  },
  {
    id: "chill",
    name: "Chill",
    kind: "bar",
    subtitle: "Dark Chocolate with Sea Salt",
    description: "A whisper of sea salt that makes the cacao sing.",
    cacao: 65,
    price: 300,
    weight: "50 g",
    image: { src: "/images/mora/bar-chill.jpg", alt: "MORA Chill dark chocolate with sea salt, black wrapper with blue foil" },
    accent: "#7F9BC4",
    profile: "smooth-salty",
  },
  {
    id: "midnight",
    name: "Midnight",
    kind: "bar",
    subtitle: "Extra Dark, 85% Cacao",
    description: "Low sugar, long finish. For the ones who go all the way.",
    cacao: 85,
    price: 340,
    weight: "50 g",
    image: { src: "/images/mora/bar-midnight.jpg", alt: "MORA Midnight 85% extra dark chocolate, black wrapper with violet foil" },
    accent: "#9A7BC8",
    profile: "deep-intense",
  },
];

export const gifts: Product[] = [
  {
    id: "four-moods",
    name: "The Four Moods",
    kind: "gift",
    subtitle: "One of every bar",
    description: "Bold, Crush, Chill and Midnight, boxed together.",
    price: 1190,
    weight: "4 × 50 g",
    image: { src: "/images/mora/range-lineup.jpg", alt: "All four MORA bars laid out side by side on dark stone" },
    accent: "#C9A66B",
  },
  {
    id: "after-dark",
    name: "After Dark Duo",
    kind: "gift",
    subtitle: "Bold and Midnight",
    description: "Two shades of serious cacao for the dark-chocolate devoted.",
    price: 590,
    weight: "2 × 50 g",
    image: { src: "/images/mora/bar-midnight.jpg", alt: "MORA Midnight 85% extra dark chocolate bar in violet foil" },
    accent: "#9A7BC8",
  },
];

export const allProducts: Product[] = [...bars, ...gifts];

export const getProduct = (id: string) => allProducts.find((p) => p.id === id);

export interface FlavourChoice {
  id: FlavourProfile;
  label: string;
  line: string;
  productId: string;
}

export const flavourChoices: FlavourChoice[] = [
  { id: "rich-bold", label: "Rich & Bold", line: "You like it roasted, round and unapologetic.", productId: "bold" },
  { id: "fruity-playful", label: "Fruity & Playful", line: "A little sweetness, a little mischief.", productId: "crush" },
  { id: "smooth-salty", label: "Smooth & Salty", line: "Silk first, then that tiny salty spark.", productId: "chill" },
  { id: "deep-intense", label: "Deep & Intense", line: "Dark, long and nowhere near sweet.", productId: "midnight" },
];
