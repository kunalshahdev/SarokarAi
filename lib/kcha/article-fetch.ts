// On-demand article fetcher for K Cha Ta? news summaries.
//
// Summaries only ever run on URLs that came from our own trending/news feeds,
// so we defend against SSRF with a strict host allowlist derived from the
// publisher domains in news-index.ts. Anything off-list (metadata IPs,
// localhost, private ranges, arbitrary hosts) is rejected before any fetch.

const FETCH_TIMEOUT_MS = 8000;
const MAX_BYTES = 1_500_000; // ~1.5 MB HTML cap
const MAX_TEXT = 8000;

// Base registrable domains we trust. Any subdomain of these is allowed too,
// which covers www./english./amp. variants without enumerating them.
const ALLOWED_BASE_DOMAINS = [
  "onlinekhabar.com",
  "ratopati.com",
  "nagariknetwork.com",
  "kathmandupost.com",
  "setopati.com",
  "bbc.co.uk",
  "bbci.co.uk",
  "ictframe.com",
  "deshsanchar.com",
  "merolagani.com",
  "thehimalayantimes.com",
];

function hostIsAllowed(hostname: string): boolean {
  const host = hostname.toLowerCase().replace(/\.$/, "");
  return ALLOWED_BASE_DOMAINS.some(
    (base) => host === base || host.endsWith(`.${base}`)
  );
}

export function isAllowedArticleUrl(raw: string): boolean {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return false;
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") return false;
  return hostIsAllowed(url.hostname);
}

function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&#x27;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

// Pull the most article-like region out of a full HTML document before
// stripping tags, so we summarize body copy rather than nav/footer chrome.
function extractMainRegion(html: string): string {
  const article = /<article[\s\S]*?<\/article>/i.exec(html);
  if (article && article[0].length > 400) return article[0];
  const main = /<main[\s\S]*?<\/main>/i.exec(html);
  if (main && main[0].length > 400) return main[0];
  return html;
}

async function readCapped(res: Response): Promise<string | null> {
  const body = res.body;
  if (!body) {
    const text = await res.text();
    return text.length > MAX_BYTES ? text.slice(0, MAX_BYTES) : text;
  }
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let out = "";
  let total = 0;
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > MAX_BYTES) {
        out += decoder.decode(value.slice(0, Math.max(0, MAX_BYTES - (total - value.byteLength))));
        break;
      }
      out += decoder.decode(value, { stream: true });
    }
  } catch {
    return null;
  } finally {
    reader.cancel().catch(() => {});
  }
  return out;
}

async function fetchOnce(url: string): Promise<Response | null> {
  try {
    return await fetch(url, {
      redirect: "manual",
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      headers: {
        "User-Agent":
          "Sarokar/1.0 (Nepal AI Assistant; +https://sarokar.app)",
        Accept: "text/html,application/xhtml+xml",
      },
    });
  } catch {
    return null;
  }
}

/**
 * Fetch an allowlisted article URL and return extracted body text, or null on
 * any failure. Follows at most one redirect, re-validating the target host.
 */
export async function fetchArticleText(rawUrl: string): Promise<string | null> {
  if (!isAllowedArticleUrl(rawUrl)) return null;

  let res = await fetchOnce(rawUrl);
  if (!res) return null;

  // Follow a single redirect only if the destination is still allowlisted.
  if (res.status >= 300 && res.status < 400) {
    const location = res.headers.get("location");
    if (!location) return null;
    let next: string;
    try {
      next = new URL(location, rawUrl).toString();
    } catch {
      return null;
    }
    if (!isAllowedArticleUrl(next)) return null;
    res = await fetchOnce(next);
    if (!res) return null;
  }

  if (!res.ok) return null;
  const contentType = res.headers.get("content-type") || "";
  if (contentType && !/html|xml|text/i.test(contentType)) return null;

  const html = await readCapped(res);
  if (!html) return null;

  const text = stripHtml(extractMainRegion(html));
  if (text.length < 120) return null; // too thin to be a real article body
  return text.slice(0, MAX_TEXT);
}
