"use client";

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import useSWR from "swr";
import { useEffect, useState } from "react";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

interface TempChartProps {
  apiUrl: string;
  label?: string;
  color?: string;
  isNetwork?: boolean;
  refreshInterval?: number;
}

export default function TempChart({
  apiUrl,
  label = "Metric",
  color = "#22c55e",
  isNetwork = false,
  refreshInterval = 10000,
}: TempChartProps) {
  const { data } = useSWR(apiUrl, fetcher, { refreshInterval });
  const gradientId = `grad-${color.replace("#", "")}`;

  const [tickInterval, setTickInterval] = useState(50);
  useEffect(() => {
    const update = () => setTickInterval(window.innerWidth < 768 ? 120 : 50);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return (
    <div className="flex flex-col h-[240px] w-full bg-[#22252b] p-4 border border-zinc-800 rounded-lg">
      <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-widest mb-3">
        {label}
      </span>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
            {isNetwork && (
              <linearGradient id="grad-net-out" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#f97316" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
              </linearGradient>
            )}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#18181b" vertical={false} />
          <XAxis dataKey="time" stroke="#81818b" fontSize={11} tickLine={false} axisLine={false} interval={tickInterval} />
          <YAxis stroke="#81818b" fontSize={11} tickLine={false} axisLine={false} domain={["auto", "auto"]} />
          <Tooltip
            contentStyle={{ backgroundColor: "#09090b", border: "1px solid #27272a", borderRadius: "4px" }}
            labelStyle={{ color: "#a1a1aa", marginBottom: "4px", fontSize: "11px" }}
            itemStyle={{ fontSize: "12px" }}
          />
          {isNetwork && <Legend wrapperStyle={{ fontSize: "11px", color: "#a1a1aa" }} />}
          {isNetwork ? (
            <>
              <Area type="linear" dataKey="in"  name="In (KB/s)"  stroke={color}   strokeWidth={1.5} fill={`url(#${gradientId})`} fillOpacity={1} isAnimationActive={false} />
              <Area type="linear" dataKey="out" name="Out (KB/s)" stroke="#f97316" strokeWidth={1.5} fill="url(#grad-net-out)"    fillOpacity={1} isAnimationActive={false} />
            </>
          ) : (
            <Area type="linear" dataKey="value" stroke={color} strokeWidth={1.5} fill={`url(#${gradientId})`} fillOpacity={1} isAnimationActive={false} />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}