import { MetadataRoute } from "next";
import { getPayload } from "payload";
import config from "@/payload.config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ferbm.com";

  // Base static paths
  const staticPaths = [
    { url: `${siteUrl}/`, lastModified: new Date() },
    { url: `${siteUrl}/shop`, lastModified: new Date() },
    { url: `${siteUrl}/blog`, lastModified: new Date() },
    { url: `${siteUrl}/wishlist`, lastModified: new Date() },
    { url: `${siteUrl}/account`, lastModified: new Date() },
  ];

  let dynamicPaths: any[] = [];

  try {
    const payload = await getPayload({ config });
    
    // Fetch products
    const products = await payload.find({
      collection: "products",
      limit: 500,
    });

    // Fetch blog posts
    const posts = await payload.find({
      collection: "blogposts",
      limit: 500,
    });

    const productPaths = products.docs.map((p: any) => ({
      url: `${siteUrl}/shop/${p.slug}`,
      lastModified: new Date(p.updatedAt || p.createdAt),
    }));

    const postPaths = posts.docs.map((p: any) => ({
      url: `${siteUrl}/blog/${p.slug}`,
      lastModified: new Date(p.updatedAt || p.createdAt),
    }));

    dynamicPaths = [...productPaths, ...postPaths];
  } catch (error) {
    console.warn("Could not query payload for dynamic sitemap generation, using static fallbacks:", error);
  }

  return [...staticPaths, ...dynamicPaths];
}
