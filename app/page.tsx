"use client";

import { useState } from "react";
import { RefreshCw, ChevronDown } from "lucide-react";
import TempChart from "@/src/components/TempChart";
import StatCard from "@/src/components/StatCard";
import { useStats, StatsData } from "@/src/hooks/useStats";

// ─── Refresh options ─────────────────────────────────────────────────────────

const REFRESH_OPTIONS = [
  { label: "10s", ms: 10_000 },
  { label: "20s", ms: 20_000 },
  { label: "30s", ms: 30_000 },
  { label: "1m",  ms: 60_000 },
  { label: "5m",  ms: 300_000 },
] as const;

type RefreshOption = typeof REFRESH_OPTIONS[number];

function RefreshSelector({
  selected,
  onChange,
}: {
  selected: RefreshOption;
  onChange: (opt: RefreshOption) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-3 py-1.5 bg-[#22252b] border border-zinc-700 rounded-md text-xs text-zinc-300 hover:border-zinc-500 hover:text-white transition-colors"
      >
        <RefreshCw size={12} className="text-[#22c55e]" />
        <span className="tabular-nums">{selected.label}</span>
        <ChevronDown size={12} className={`text-zinc-500 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-9 bg-[#1c1d24] border border-zinc-700 rounded-md shadow-2xl z-50 overflow-hidden min-w-[80px]">
          {REFRESH_OPTIONS.map((opt) => (
            <button
              key={opt.ms}
              onClick={() => { onChange(opt); setOpen(false); }}
              className={`w-full text-left px-3 py-2 text-xs transition-colors flex items-center justify-between gap-3
                ${opt.ms === selected.ms
                  ? "text-[#22c55e] bg-white/5"
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
                }`}
            >
              <span className="tabular-nums">{opt.label}</span>
              {opt.ms === selected.ms && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] shrink-0" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Layout helpers ──────────────────────────────────────────────────────────

function SectionLabel({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 mb-3 mt-1">
      <div className="w-1 h-5 bg-[#22c55e] rounded-full" />
      <span className="text-xs text-zinc-400 uppercase tracking-widest font-medium">{label}</span>
    </div>
  );
}

function CardGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
      {children}
    </div>
  );
}

function ChartGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-6">
      {children}
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function Page() {
  const [refreshOpt, setRefreshOpt] = useState<RefreshOption>(REFRESH_OPTIONS[0]);
  const { stats, isLoading } = useStats(refreshOpt.ms);

  const val = (key: keyof StatsData): string =>
    isLoading ? "..." : (stats?.[key] ?? "—");

  return (
    <main className="min-h-screen bg-[#111217] px-4 py-6 md:px-10 md:py-10 text-white">
      <div className="max-w-[1600px] mx-auto">

        {/* Header with refresh selector */}
        <header className="mb-6 flex items-center justify-between gap-4">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tighter">
            Infrastructure Stats
          </h1>
          <RefreshSelector selected={refreshOpt} onChange={setRefreshOpt} />
        </header>

        {/* ── System Overview ──────────────────────────────────────── */}
        <SectionLabel label="System Overview" />
        <CardGrid>
          <StatCard label="Total Uptime"   value={val("totalUptime")}   iconName="CalendarClock" color="#3b82f6" />
          <StatCard label="Session Uptime" value={val("sessionUptime")} iconName="Clock"         color="#60a5fa" />
          <StatCard label="CPU Load"       value={val("cpu")}           iconName="Cpu"           color="#a855f7" />
          <StatCard label="CPU Temp"       value={val("cpuTemp")}       iconName="Flame"         color="#f97316" />
        </CardGrid>
        <CardGrid>
          <StatCard label="Power Draw"        value={val("power")}           iconName="Zap"      color="#eab308" />
          <StatCard label="Avg Power (1hr)"   value={val("avgPower")}        iconName="Activity" color="#facc15" />
          <StatCard label="Est. Monthly Electricity Cost" value={val("electricityCost")} iconName="Wallet"   color="#22d3ee" />
          <StatCard label={`Swap (${val("swapLabel")})`} value={val("swapPercent")} iconName="Layers" color="#f43f5e" />
        </CardGrid>

        {/* ── Memory & Storage ─────────────────────────────────────── */}
        <SectionLabel label="Memory & Storage" />
        <CardGrid>
          <StatCard label="RAM Usage"  value={val("ram")}      iconName="Server"    color="#22c55e" />
          <StatCard label="Total RAM"  value={val("ramTotal")} iconName="Server"    color="#22c55e" />
          <StatCard label="Disk Used"  value={val("diskUsed")} iconName="HardDrive" color="#ef4444" />
          <StatCard label="Disk Free"  value={val("diskFree")} iconName="Database"  color="#06b6d4" />
        </CardGrid>

        {/* ── Thermal & Power Charts ────────────────────────────────── */}
        <SectionLabel label="Thermal & Power" />
        <ChartGrid>
          <TempChart apiUrl="/api/metrics/temp"  label="CPU Temperature (°C)" color="#f97316" refreshInterval={refreshOpt.ms} />
          <TempChart apiUrl="/api/metrics/power" label="Power Draw (W)"       color="#eab308" refreshInterval={refreshOpt.ms} />
        </ChartGrid>

        {/* ── Memory & Network Charts ───────────────────────────────── */}
        <SectionLabel label="Memory & Network" />
        <ChartGrid>
          <TempChart apiUrl="/api/metrics/ram"     label="RAM Usage (%)"      color="#22c55e" refreshInterval={refreshOpt.ms} />
          <TempChart apiUrl="/api/metrics/network" label="Network I/O (KB/s)" color="#3b82f6" refreshInterval={refreshOpt.ms} isNetwork />
        </ChartGrid>

        {/* ── System Pressure & Load ────────────────────────────────── */}
        <SectionLabel label="System Pressure & Load" />
        <CardGrid>
          <StatCard label="Load Avg 1m"   value={val("load1m")}         iconName="TrendingUp" color="#a3e635" />
          <StatCard label="Load Avg 5m"   value={val("load5m")}         iconName="TrendingUp" color="#84cc16" />
          <StatCard label="CPU Press 60s" value={val("cpuPressure60s")} iconName="Gauge"      color="#fb923c" />
          <StatCard label="RAM Press 60s" value={val("ramPressure60s")} iconName="Gauge"      color="#38bdf8" />
        </CardGrid>
        <CardGrid>
          <StatCard label="Ctx Switches" value={val("contextSwitches")} iconName="Shuffle"          color="#c084fc" />
          <StatCard label="Net Drops"    value={val("netDrops")}        iconName="PackageX"         color="#f87171" />
          <StatCard label="Disk Read"    value={val("diskRead")}        iconName="ArrowDownToLine"  color="#34d399" />
          <StatCard label="Disk Write"   value={val("diskWrite")}       iconName="ArrowUpFromLine"  color="#fb7185" />
        </CardGrid>

      </div>
    </main>
  );
}