export const site = {
  name: "MORA",
  tagline: "More Cacao. More Taste.",
  description:
    "MORA dark chocolate — deep cacao, silky texture and four moods to choose from: Bold, Crush, Chill and Midnight.",
  // Edit freely. Avoid shipping/discount promises until confirmed.
  announcement: "A little indulgence goes a long way.",
  // PLACEHOLDER: replace with the real business contact before launch.
  contactEmail: "hello@example.com",
  nav: [
    { label: "Shop", href: "#shop" },
    { label: "Our Story", href: "#story" },
    { label: "Find Your Flavour", href: "#flavour" },
    { label: "Gifting", href: "#gifting" },
  ],
} as const;

export type NavItem = (typeof site.nav)[number];
