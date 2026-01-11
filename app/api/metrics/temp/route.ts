import { NextResponse } from "next/server";
import { getCpuTempRange } from "@/src/lib/metrics";

export async function GET() {
  const data = await getCpuTempRange();
  
  const chartData = data.data.result[0]?.values.map((val: [number, string]) => {
    const date = new Date(val[0] * 1000);
    return {
      // Precise 24h format: 14:05:10, 14:05:20, etc.
      time: date.toLocaleTimeString('en-GB', { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit', // Added seconds for verification
        hour12: false 
      }),
      temp: parseFloat(val[1]),
    };
  }) || [];

  return NextResponse.json(chartData);
}