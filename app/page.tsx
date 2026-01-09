import { getCpuUsage } from "@/lib/metrics";
import DashboardClient from "@/components/DashboardClient";

export default async function Page() {
  // 1. Initial Fetch on the SERVER (SSR)
  const initialData = await getCpuUsage();

  return (
    <main className="p-10">
      <h1 className="text-2xl font-bold mb-6">System Stats</h1>
      {/* 2. Pass initial data to a CLIENT component for live updates */}
      <DashboardClient initialData={initialData} />
    </main>
  );
}