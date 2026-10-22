import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

/** The public pages worth indexing. Keep in step with each page's canonical link. */
export default function sitemap(): MetadataRoute.Sitemap {
  return ["/", "/nuclear", "/privacy", "/terms"].map((path) => ({ url: `${SITE.url}${path === "/" ? "" : path}` }));
}
