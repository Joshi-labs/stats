"use client";

import * as Icons from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  iconName: keyof typeof Icons;
  color?: string;
  width?: string; // kept for backward compat, ignored
}

export default function StatCard({ label, value, iconName, color = "#22c55e" }: StatCardProps) {
  const Icon = Icons[iconName] as Icons.LucideIcon;

  return (
    <div className="h-[80px] w-full bg-[#22252b] border border-zinc-800 rounded-lg p-4 flex items-center gap-3">
      <div className="p-2 rounded-md bg-white/5 shrink-0">
        {Icon && <Icon size={18} style={{ color }} />}
      </div>
      <div className="flex flex-col min-w-0">
        <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider truncate">
          {label}
        </span>
        <span className="text-lg font-bold text-white tabular-nums truncate">{value}</span>
      </div>
    </div>
  );
}