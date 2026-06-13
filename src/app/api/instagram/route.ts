import { NextResponse } from "next/server";

// Simple in-memory cache for API requests
let cache: {
  data: any;
  timestamp: number;
} | null = null;

const CACHE_DURATION_MS = 60 * 60 * 1000; // 1 hour caching

const fallbackInstagram = [
  { id: "ig1", url: "/images/star_relief_cup.png", link: "https://instagram.com" },
  { id: "ig2", url: "/images/three_small_bowls.png", link: "https://instagram.com" },
  { id: "ig3", url: "/images/twisted_incense_burner.png", link: "https://instagram.com" },
  { id: "ig4", url: "/images/organic_fluid_holder.png", link: "https://instagram.com" },
  { id: "ig5", url: "/images/fleshy_eyeball_tower.png", link: "https://instagram.com" },
  { id: "ig6", url: "/images/four_textured_cups.png", link: "https://instagram.com" },
];

export async function GET() {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  const userId = process.env.INSTAGRAM_USER_ID;

  // Fallback to mock data if keys are not defined
  if (!token || !userId || token === "mock_instagram_access_token") {
    return NextResponse.json(fallbackInstagram);
  }

  const now = Date.now();
  if (cache && now - cache.timestamp < CACHE_DURATION_MS) {
    return NextResponse.json(cache.data);
  }

  try {
    const response = await fetch(
      `https://graph.instagram.com/v12.0/${userId}/media?fields=id,media_type,media_url,permalink,thumbnail_url&access_token=${token}&limit=6`,
      { next: { revalidate: 3600 } } // Next.js Fetch Caching
    );

    const result = await response.json();

    if (result && result.data) {
      const feed = result.data.map((item: any) => ({
        id: item.id,
        url: item.media_type === "VIDEO" ? item.thumbnail_url : item.media_url,
        link: item.permalink,
      }));

      // Cache it
      cache = {
        data: feed,
        timestamp: now,
      };

      return NextResponse.json(feed);
    }

    throw new Error(result.error?.message || "Invalid response structure from Instagram Graph API");
  } catch (error) {
    console.warn("Instagram API request failed, using local mock feed:", error);
    return NextResponse.json(fallbackInstagram);
  }
}
