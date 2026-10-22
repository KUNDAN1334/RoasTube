import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

// /roast is personal and bounces signed-out crawlers to the landing page, and the API has
// nothing to index, so crawlers skip both.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/roast", "/api/"],
    },
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
