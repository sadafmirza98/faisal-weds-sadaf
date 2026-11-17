import type { MetadataRoute } from "next";
import { wedding } from "@/config/wedding";

export default function robots(): MetadataRoute.Robots {
  return wedding.seo.allowIndexing ? { rules: { userAgent: "*", allow: "/" } } : { rules: { userAgent: "*", disallow: "/" } };
}
