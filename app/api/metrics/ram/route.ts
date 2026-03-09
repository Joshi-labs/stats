import { NextResponse } from "next/server";
import { getRamRange, parseRangeValues } from "@/src/lib/metrics";

export async function GET() {
  const data = await getRamRange();
  return NextResponse.json(parseRangeValues(data));
}