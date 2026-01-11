"use client";

import * as Icons from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  iconName: keyof typeof Icons; // Pass the name of the icon as a string
  color?: string;
  width?: string;
}

export default function StatCard({ label, value, iconName, color = "#22c55e", width = "w-1/4" }: StatCardProps) {
  // Dynamically get the icon component
  const Icon = Icons[iconName] as Icons.LucideIcon;

  return (
    <div className={`h-[80px] ${width} bg-[#22252b] border border-zinc-800 rounded-lg p-4 flex items-center gap-4 mb-[-10]`}>
      <div className="p-2 rounded-md bg-white/5">
        {Icon && <Icon size={20} style={{ color }} />}
      </div>
      <div className="flex flex-col">
        <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">{label}</span>
        <span className="text-xl font-bold text-white tabular-nums">{value}</span>
      </div>
    </div>
  );
}