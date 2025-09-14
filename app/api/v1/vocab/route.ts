import { NextRequest, NextResponse } from "next/server";
import { getVocabPage } from "@/lib/vocab";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const topic = url.searchParams.get("topic") ?? undefined;
  const q     = url.searchParams.get("q") ?? "";
  const page  = Number(url.searchParams.get("page") || "1");
  const limit = Number(url.searchParams.get("limit") || "20");

  const data = await getVocabPage({ topic, q, page, limit });
  return NextResponse.json(data, { headers: { "cache-control": "no-store" } });
}