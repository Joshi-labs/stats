"use client"; // Required for hooks like useState and useSWR

import useSWR from 'swr';
import { getCpuUsage } from "@/lib/metrics";

export default function DashboardClient({ initialData }: { initialData: any }) {
  // SWR automatically fetches fresh data every 10 seconds (10000ms)
  const { data } = useSWR('cpu-metrics', getCpuUsage, {
    fallbackData: initialData,
    refreshInterval: 10000, 
  });

  const value = data?.data?.result[0]?.value[1] || "0";

  return (
    <div className="bg-white p-6 rounded-xl border shadow-sm">
      <h3 className="text-zinc-500 text-sm">CPU Total</h3>
      <p className="text-4xl font-mono font-bold">{parseFloat(value).toFixed(2)}s</p>
    </div>
  );
}