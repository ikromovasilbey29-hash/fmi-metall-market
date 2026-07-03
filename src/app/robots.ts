import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://fmimetall.uz";
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/catalog", "/product", "/blog", "/calculator"],
        disallow: ["/admin", "/api", "/profile", "/cart", "/checkout"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
