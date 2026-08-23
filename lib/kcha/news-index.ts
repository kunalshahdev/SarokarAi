import RssParser from "rss-parser";

export interface NewsArticle {
  id: string;
  title: string;
  snippet: string;
  text: string;
  source: string;
  url: string;
  publishedAt: number;
}

interface FeedDef {
  url: string;
  source: string;
}

const FEEDS: FeedDef[] = [
  { url: "https://www.onlinekhabar.com/feed", source: "OnlineKhabar" },
  { url: "https://english.onlinekhabar.com/feed", source: "OnlineKhabar EN" },
  { url: "https://ratopati.com/feed", source: "Ratopati" },
  { url: "https://nagariknews.nagariknetwork.com/feed", source: "Nagarik News" },
  { url: "https://kathmandupost.com/rss", source: "Kathmandu Post" },
  { url: "https://www.setopati.com/feed", source: "Setopati" },
  { url: "https://feeds.bbci.co.uk/nepali/rss.xml", source: "BBC Nepali" },
  { url: "https://ictframe.com/feed/", source: "ICT Frame" },
  { url: "https://deshsanchar.com/feed/", source: "Deshsanchar" },
  { url: "https://merolagani.com/RssFeed.aspx", source: "MeroLagani" },
  { url: "https://thehimalayantimes.com/rss", source: "Himalayan Times" },
];

const parser = new RssParser({
  timeout: 8000,
  headers: {
    "User-Agent": "Sarokar/1.0 (Nepal AI Assistant; +https://sarokar.app)",
  },
  customFields: {
    item: ["content:encoded"],
  },
});

const INDEX_TTL_MS = 15 * 60 * 1000;
const ARTICLE_WINDOW_MS = 72 * 60 * 60 * 1000;
const MAX_ARTICLES = 240;
const TEXT_CAP = 4000;

const STOPWORDS = new Set([
  "the", "a", "an", "is", "are", "was", "were", "be", "been", "being",
  "of", "in", "on", "at", "to", "for", "with", "about", "by", "from",
  "and", "or", "but", "not", "no", "do", "does", "did", "can", "could",
  "will", "would", "should", "what", "why", "how", "when", "who", "whom",
  "this", "that", "these", "those", "it", "its", "as", "if", "so",
  "cha", "chha", "chaincha", "chaina", "huncha", "hudaina", "garne", "garna",
  "garnu", "kasari", "kina", "ke", "ko", "ka", "ma", "bata", "lai", "ra",
  "yo", "tyo", "yesko", "tyasko", "mero", "hamro", "khoi", "k", "ni",
  "hai", "hola", "bhayo", "vayo", "sakeo", "sakchau", "bhanne", "bhanya",
  "kura", "kuro", "barema", "bare", "aba", "ahile", "pachi", "agadi",
]);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RawItem = Record<string, any> & {
  title?: string;
  link?: string;
  guid?: string;
  pubDate?: string;
  isoDate?: string;
  contentSnippet?: string;
  content?: string;
  description?: string;
};

function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeTitle(title: string): string {
  return title.toLowerCase().replace(/[^\w\u0900-\u097F]/g, "");
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\u0900-\u097F]+/g, " ")
    .split(" ")
    .filter((t) => t.length > 1 && !STOPWORDS.has(t));
}

interface IndexState {
  articles: NewsArticle[];
  fetchedAt: number;
}

let indexCache: IndexState | null = null;
let refreshFlight: Promise<NewsArticle[]> | null = null;

async function fetchFeed(feed: FeedDef): Promise<NewsArticle[]> {
  try {
    const result = await parser.parseURL(feed.url);
    const items: RawItem[] = (result.items || []) as RawItem[];

    return items.map((item, i) => {
      const title = stripHtml(item.title || "");
      const rawContent =
        item["content:encoded"] || item.content || item.description || "";
      const fullText = stripHtml(String(rawContent)).slice(0, TEXT_CAP);
      const snippet = (
        stripHtml(item.contentSnippet || String(rawContent)) || fullText
      ).slice(0, 280);
      const publishedMs = item.isoDate
        ? Date.parse(item.isoDate)
        : item.pubDate
          ? Date.parse(item.pubDate)
          : NaN;

      return {
        id: `${feed.source}:${item.guid || item.link || i}`,
        title,
        snippet: snippet || title,
        text: fullText || title,
        source: feed.source,
        url: item.link || "",
        publishedAt: Number.isNaN(publishedMs) ? Date.now() : publishedMs,
      };
    });
  } catch {
    return [];
  }
}

async function refreshIndex(): Promise<NewsArticle[]> {
  const results = await Promise.allSettled(FEEDS.map(fetchFeed));
  const all = results
    .filter((r): r is PromiseFulfilledResult<NewsArticle[]> => r.status === "fulfilled")
    .flatMap((r) => r.value);

  const now = Date.now();
  const seenTitles = new Set<string>();
  const seenUrls = new Set<string>();
  const unique: NewsArticle[] = [];

  for (const article of all) {
    if (!article.title || !article.url) continue;
    if (now - article.publishedAt > ARTICLE_WINDOW_MS) continue;
    const normTitle = normalizeTitle(article.title);
    if (seenTitles.has(normTitle)) continue;
    if (seenUrls.has(article.url)) continue;
    seenTitles.add(normTitle);
    seenUrls.add(article.url);
    unique.push(article);
  }

  unique.sort((a, b) => b.publishedAt - a.publishedAt);
  return unique.slice(0, MAX_ARTICLES);
}

export async function getNewsArticles(): Promise<NewsArticle[]> {
  const now = Date.now();
  if (indexCache && now - indexCache.fetchedAt < INDEX_TTL_MS) {
    return indexCache.articles;
  }

  if (!refreshFlight) {
    refreshFlight = refreshIndex()
      .then((articles) => {
        if (articles.length > 0 || !indexCache) {
          indexCache = { articles, fetchedAt: Date.now() };
        }
        return articles;
      })
      .finally(() => {
        refreshFlight = null;
      });
  }

  const articles = await refreshFlight;
  if (articles.length === 0 && indexCache) {
    return indexCache.articles;
  }
  return articles;
}

export async function getArticleById(id: string): Promise<NewsArticle | null> {
  const articles = await getNewsArticles();
  return articles.find((a) => a.id === id) ?? null;
}

export function searchArticlesSync(
  articles: NewsArticle[],
  query: string,
  k = 6
): NewsArticle[] {
  const tokens = tokenize(query);
  if (tokens.length === 0) return [];
  const queryLower = query.toLowerCase();

  const scored = articles.map((article) => {
    const titleL = article.title.toLowerCase();
    const snippetL = article.snippet.toLowerCase();
    const textL = article.text.toLowerCase();

    let score = 0;
    for (const token of tokens) {
      if (titleL.includes(token)) score += 3;
      else if (snippetL.includes(token)) score += 2;
      else if (textL.includes(token)) score += 1;
    }

    if (queryLower.length > 6) {
      if (titleL.includes(queryLower)) score += 5;
      else if (textL.includes(queryLower)) score += 2;
    }

    const ageHours = (Date.now() - article.publishedAt) / 3_600_000;
    score += Math.exp(-Math.max(ageHours, 0) / 24) * 2;

    return { article, score };
  });

  return scored
    .filter((s) => s.score >= 3)
    .sort((a, b) => b.score - a.score)
    .slice(0, k)
    .map((s) => s.article);
}

export async function searchArticles(
  query: string,
  k = 6
): Promise<NewsArticle[]> {
  const articles = await getNewsArticles();
  if (articles.length === 0) return [];
  return searchArticlesSync(articles, query, k);
}

export function timeAgoLabel(ms: number): string {
  const diffMin = Math.floor((Date.now() - ms) / 60000);
  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  return `${Math.floor(diffHr / 24)}d ago`;
}

export function formatNewsContext(hits: NewsArticle[]): string {
  return hits
    .map((a, i) => {
      const body = a.text.slice(0, 1200);
      return `[${i + 1}] ${a.title}\nSource: ${a.source} (${timeAgoLabel(a.publishedAt)})\nURL: ${a.url}\n${body}`;
    })
    .join("\n\n");
}
