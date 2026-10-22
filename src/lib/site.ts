// Public site facts used across pages. Set these before going live; Google's OAuth
// reviewers check that the privacy policy names a working contact.
export const SITE = {
  name: "Roastube",
  /** The one public address; canonical links, robots.txt and the sitemap all point here. */
  url: "https://roastube.lol",
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "privacy@example.com",
  policyUpdated: "October 17, 2026",
};
