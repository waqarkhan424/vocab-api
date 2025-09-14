import { NextResponse } from "next/server";
import { getTopics } from "@/lib/vocab";

export async function GET() {
  const data = await getTopics();
  return NextResponse.json(data, { headers: { "cache-control": "no-store" } });
}