import { NextResponse } from "next/server";
//import { getCpuUsage } from "@/src/lib/metrics";

export async function GET() {
  try {
    //const data = await getCpuUsage();
    return NextResponse.json({ data: { result: [] } });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}