import { NextResponse } from "next/server";
import { getNewsArticles, timeAgoLabel } from "@/lib/kcha/news-index";

export const maxDuration = 30;

const LIST_LIMIT = 18;

export async function GET() {
  try {
    const articles = await getNewsArticles();
    const list = articles.slice(0, LIST_LIMIT).map((a) => ({
      id: a.id,
      title: a.title,
      snippet: a.snippet,
      source: a.source,
      url: a.url,
      time: timeAgoLabel(a.publishedAt),
    }));

    return NextResponse.json(
      { live: list.length > 0, count: list.length, articles: list },
      {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        },
      }
    );
  } catch (e) {
    console.error("[kcha/news] list failed", e);
    return NextResponse.json(
      { error: "News ahile load huna sakena. Ali pachi try garnus." },
      { status: 503 }
    );
  }
}
