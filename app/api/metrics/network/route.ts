import { NextResponse } from "next/server";
import { getNetworkInRange, getNetworkOutRange, parseRangeValues } from "@/src/lib/metrics";

export async function GET() {
  const [inData, outData] = await Promise.all([
    getNetworkInRange(),
    getNetworkOutRange(),
  ]);

  const inValues = parseRangeValues(inData);
  const outValues = parseRangeValues(outData);

  // Merge into { time, in, out } by index (same timestamps from same step)
  const merged = inValues.map((entry, i) => ({
    time: entry.time,
    in: entry.value,
    out: outValues[i]?.value ?? 0,
  }));

  return NextResponse.json(merged);
}