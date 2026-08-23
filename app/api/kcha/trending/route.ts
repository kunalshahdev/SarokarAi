import { NextResponse } from "next/server";
import RssParser from "rss-parser";

const parser = new RssParser({
  timeout: 10000,
  headers: {
    "User-Agent": "Sarokar/1.0 (Nepal AI Assistant)",
  },
});

const FEEDS = [
  {
    url: "https://www.onlinekhabar.com/feed",
    source: "OnlineKhabar",
  },
  {
    url: "https://ratopati.com/feed",
    source: "Ratopati",
  },
  {
    url: "https://nagariknews.nagariknetwork.com/feed",
    source: "Nagarik News",
  },
  {
    url: "https://kathmandupost.com/rss",
    source: "Kathmandu Post",
  },
];

const CATEGORY_MAP: Record<string, string> = {
  राजनीति: "Nepal",
  politics: "Nepal",
  Politics: "Nepal",
  अर्थ: "Money",
  economy: "Money",
  Economy: "Money",
  बिजनेस: "Money",
  business: "Money",
  Business: "Money",
  प्रविधि: "Tech",
  technology: "Tech",
  Technology: "Tech",
  tech: "Tech",
  Tech: "Tech",
  खेलकुद: "Sports",
  sports: "Sports",
  Sports: "Sports",
  मनोरञ्जन: "Entertainment",
  entertainment: "Entertainment",
  Entertainment: "Entertainment",
  समाज: "Trending",
  society: "Trending",
  Society: "Trending",
  स्वास्थ्य: "Trending",
  health: "Trending",
  शिक्षा: "Nepal",
  education: "Nepal",
  अन्तर्राष्ट्रिय: "Trending",
  international: "Trending",
  International: "Trending",
  विदेश: "Trending",
  धर्म: "Trending",
  religion: "Trending",
};

const FALLBACK_CATEGORIES = ["Nepal", "Tech", "Trending", "Sports", "Money", "Entertainment"];

let cache: { topics: TrendingTopic[]; cachedAt: number } | null = null;
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

interface TrendingTopic {
  id: string;
  title: string;
  explanation: string;
  category: string;
  time: string;
  source: string;
  link: string;
  image?: string;
}

function mapCategory(rssCategory: string, index: number): string {
  if (CATEGORY_MAP[rssCategory]) return CATEGORY_MAP[rssCategory];
  for (const [key, val] of Object.entries(CATEGORY_MAP)) {
    if (rssCategory.toLowerCase().includes(key.toLowerCase())) return val;
  }
  return FALLBACK_CATEGORIES[index % FALLBACK_CATEGORIES.length];
}

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  if (isNaN(then)) return "";
  const diffMs = now - then;
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  return `${diffDay}d ago`;
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

async function fetchFeed(feed: (typeof FEEDS)[0]): Promise<TrendingTopic[]> {
  try {
    const result = await parser.parseURL(feed.url);
    const items = (result.items || []).slice(0, 15);

    return items
      .filter((item) => item.title && item.title.trim().length > 0)
      .map((item, i) => {
        const category = item.category
          ? mapCategory(item.category, i)
          : FALLBACK_CATEGORIES[i % FALLBACK_CATEGORIES.length];

        const rawDesc = item.contentSnippet || item.content || item.description || "";
        const explanation = stripHtml(rawDesc).slice(0, 200);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const rawItem = item as any;
        const image =
          rawItem.mediaThumbnail?.url ||
          rawItem.enclosure?.url ||
          undefined;

        return {
          id: `${feed.source}-${item.guid || item.link || i}`,
          title: stripHtml(item.title || ""),
          explanation: explanation || "No description available.",
          category,
          time: item.pubDate ? timeAgo(item.pubDate) : "",
          source: feed.source,
          link: item.link || "#",
          image,
        };
      });
  } catch {
    return [];
  }
}

async function getTrendingTopics(): Promise<TrendingTopic[]> {
  const results = await Promise.allSettled(FEEDS.map(fetchFeed));
  const allTopics = results
    .filter((r): r is PromiseFulfilledResult<TrendingTopic[]> => r.status === "fulfilled")
    .flatMap((r) => r.value);

  const seen = new Set<string>();
  const unique: TrendingTopic[] = [];

  for (const topic of allTopics) {
    const normalized = topic.title.toLowerCase().replace(/[^\w\u0900-\u097F]/g, "");
    if (seen.has(normalized)) continue;
    seen.add(normalized);
    unique.push(topic);
  }

  return unique.slice(0, 9);
}

export async function GET() {
  const now = Date.now();

  if (cache && now - cache.cachedAt < CACHE_TTL_MS) {
    return NextResponse.json({
      topics: cache.topics,
      cachedAt: cache.cachedAt,
      live: true,
    });
  }

  try {
    const topics = await getTrendingTopics();
    cache = { topics, cachedAt: now };

    return NextResponse.json({
      topics,
      cachedAt: now,
      live: true,
    });
  } catch {
    if (cache) {
      return NextResponse.json({
        topics: cache.topics,
        cachedAt: cache.cachedAt,
        live: true,
        stale: true,
      });
    }

    return NextResponse.json(
      { error: "Failed to fetch trending topics", topics: [], live: false },
      { status: 503 }
    );
  }
}
