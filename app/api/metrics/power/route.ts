import { NextResponse } from "next/server";
import { getPowerRange, parseRangeValues } from "@/src/lib/metrics";

export async function GET() {
  const data = await getPowerRange();
  return NextResponse.json(parseRangeValues(data));
}