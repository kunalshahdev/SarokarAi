export interface TrendingTopic {
  id: string;
  title: string;
  explanation: string;
  category: string;
  time: string;
  source?: string;
  link?: string;
  image?: string;
  isDemo?: boolean;
}

interface TrendingResult {
  topics: TrendingTopic[];
  live: boolean;
  cachedAt: number | null;
}

const CACHE_KEY = "sarokar-trending";
export const TRENDING_CACHE_TTL_MS = 10 * 60 * 1000;
const CACHE_TTL_MS = TRENDING_CACHE_TTL_MS;

let inflight: Promise<TrendingResult> | null = null;

export function loadCachedTrending(): { topics: TrendingTopic[]; cachedAt: number } | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveCachedTrending(topics: TrendingTopic[], cachedAt: number) {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ topics, cachedAt }));
  } catch {}
}

function fromCache(): TrendingResult | null {
  const cached = loadCachedTrending();
  if (!cached || !cached.topics.some((t) => !t.isDemo)) return null;
  return { topics: cached.topics, live: true, cachedAt: cached.cachedAt };
}

export async function getTrending(force = false): Promise<TrendingResult> {
  if (!force) {
    const cached = loadCachedTrending();
    if (cached && Date.now() - cached.cachedAt < CACHE_TTL_MS) {
      const result = fromCache();
      if (result) return result;
    }
  }

  if (!inflight) {
    inflight = (async () => {
      try {
        const res = await fetch("/api/kcha/trending");
        const data = await res.json();
        if (data.topics && data.topics.length > 0) {
          const topics = (data.topics as TrendingTopic[]).map((t) => ({ ...t, isDemo: false }));
          const cachedAt = typeof data.cachedAt === "number" ? data.cachedAt : Date.now();
          saveCachedTrending(topics, cachedAt);
          return { topics, live: true, cachedAt };
        }
      } catch {
        // fall through to cache/demo handling by caller
      } finally {
        setTimeout(() => {
          inflight = null;
        }, 250);
      }
      const cached = fromCache();
      return cached ?? { topics: [], live: false, cachedAt: null };
    })();
  }

  return inflight;
}
