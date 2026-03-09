import { NextResponse } from "next/server";
import {
  getCpuUsage, getRamUsagePercent, getRamTotal,
  getDiskUsagePercent, getDiskFree, getDiskTotal,
  getUptime, getCpuTempInstant, getPowerInstant,
  getSwapUsed, getSwapTotal, getSwapUsedPercent,
  getAvgPowerLastHour,
  getLoadAvg1m, getLoadAvg5m,
  getCpuPressureAvg60, getRamPressureAvg60,
  getContextSwitches, getNetworkDrops,
  getDiskReadSpeed, getDiskWriteSpeed,
  parseInstantValue,
} from "@/src/lib/metrics";

function fmt(value: number | null, unit: string): string {
  if (value === null) return "—";
  return `${value.toFixed(1)}${unit}`;
}
function fmt2(value: number | null, unit = ""): string {
  if (value === null) return "—";
  return `${value.toFixed(2)}${unit}`;
}
function fmtK(value: number | null, unit = "/s"): string {
  // Format large numbers like context switches nicely
  if (value === null) return "—";
  if (value >= 1000) return `${(value / 1000).toFixed(1)}k${unit}`;
  return `${Math.round(value)}${unit}`;
}

function formatUptime(seconds: number): string {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (d > 0) return `${d}d ${h}h`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

const SERVER_BIRTH = new Date("2026-02-01T03:03:00Z");
function formatTotalUptime(): string {
  const diffSecs = Math.floor((Date.now() - SERVER_BIRTH.getTime()) / 1000);
  const d = Math.floor(diffSecs / 86400);
  const h = Math.floor((diffSecs % 86400) / 3600);
  return `${d}d ${h}h`;
}

function calcMonthlyCost(avgWatts: number): string {
  const cost = (avgWatts * 24 * 30 / 1000) * 6;
  return `₹${cost.toFixed(0)}`;
}

export async function GET() {
  try {
    const [
      cpuData, ramPercentData, ramTotalData,
      diskPercentData, diskFreeData, diskTotalData,
      uptimeData, cpuTempData, powerData,
      swapUsedData, swapTotalData, swapPercentData,
      avgPowerData,
      load1Data, load5Data,
      cpuP60Data, ramP60Data,
      ctxData, netDropData,
      diskReadData, diskWriteData,
    ] = await Promise.all([
      getCpuUsage(), getRamUsagePercent(), getRamTotal(),
      getDiskUsagePercent(), getDiskFree(), getDiskTotal(),
      getUptime(), getCpuTempInstant(), getPowerInstant(),
      getSwapUsed(), getSwapTotal(), getSwapUsedPercent(),
      getAvgPowerLastHour(),
      getLoadAvg1m(), getLoadAvg5m(),
      getCpuPressureAvg60(), getRamPressureAvg60(),
      getContextSwitches(), getNetworkDrops(),
      getDiskReadSpeed(), getDiskWriteSpeed(),
    ]);

    const uptimeSecs  = parseInstantValue(uptimeData) ?? 0;
    const avgWatts    = parseInstantValue(avgPowerData) ?? 0;
    const swapUsedGB  = parseInstantValue(swapUsedData);
    const swapTotalGB = parseInstantValue(swapTotalData);
    const swapLabel   = swapUsedGB !== null && swapTotalGB !== null
      ? `${swapUsedGB.toFixed(1)} / ${swapTotalGB.toFixed(1)} GB`
      : "—";

    return NextResponse.json({
      // Overview row 1
      totalUptime:     formatTotalUptime(),
      sessionUptime:   formatUptime(uptimeSecs),
      cpu:             fmt(parseInstantValue(cpuData), "%"),
      cpuTemp:         fmt(parseInstantValue(cpuTempData), "°C"),
      // Overview row 2
      power:           fmt(parseInstantValue(powerData), "W"),
      avgPower:        fmt(avgWatts, "W"),
      electricityCost: calcMonthlyCost(avgWatts),
      swapPercent:     fmt(parseInstantValue(swapPercentData), "%"),
      swapLabel,
      // Memory & storage
      ram:             fmt(parseInstantValue(ramPercentData), "%"),
      ramTotal:        fmt(parseInstantValue(ramTotalData), " GB"),
      diskUsed:        fmt(parseInstantValue(diskPercentData), "%"),
      diskFree:        fmt(parseInstantValue(diskFreeData), " GB"),
      diskTotal:       fmt(parseInstantValue(diskTotalData), " GB"),
      // Pressure & load section (8 cards)
      load1m:          fmt2(parseInstantValue(load1Data)),
      load5m:          fmt2(parseInstantValue(load5Data)),
      cpuPressure60s:  fmt(parseInstantValue(cpuP60Data), "%"),
      ramPressure60s:  fmt(parseInstantValue(ramP60Data), "%"),
      contextSwitches: fmtK(parseInstantValue(ctxData)),
      netDrops:        fmtK(parseInstantValue(netDropData), "/s"),
      diskRead:        fmt(parseInstantValue(diskReadData), " KB/s"),
      diskWrite:       fmt(parseInstantValue(diskWriteData), " KB/s"),
    });
  } catch (err) {
    console.error("Stats API error:", err);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}