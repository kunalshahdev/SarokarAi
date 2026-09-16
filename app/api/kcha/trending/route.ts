import { NextResponse } from "next/server";
import { getTrendingTopics } from "@/lib/kcha/trending";

export const maxDuration = 60;

export async function GET() {
  const now = Date.now();

  try {
    const topics = await getTrendingTopics();

    return NextResponse.json({
      topics,
      cachedAt: now,
      live: true,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch trending topics", topics: [], live: false },
      { status: 503 }
    );
  }
}
