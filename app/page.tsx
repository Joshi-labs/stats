import TempChart from "@/src/components/TempChart";
import StatCard from "@/src/components/StatCard";
import { Activity, Clock, Cpu, Server } from "lucide-react";

export default function Page() {
  return (
    <main className="min-h-screen bg-[#111217] p-10 text-white">
      <div className="max-w-[1600px] mx-auto">
        <header className="mb-8 mt-[-10px]">
          <h1 className="text-3xl font-bold tracking-tighter">Infrastructure Stats</h1>
        </header>

        {/* Stats Row - 80px high cards */}
        <div className="flex"><div className="w-1 h-5 bg-[#22c55e] rounded-full" /><div className="ml-[5]">Sdas</div></div>
        <div className="flex gap-4 mb-8">
          <StatCard label="Uptime" value="12d 4h" iconName="Clock" width="w-1/4" color="#3b82f6" />
          <StatCard label="CPU Load" value="14%" iconName="Cpu" width="w-1/4" color="#a855f7" />
          <StatCard label="Status" value="Online" iconName="Activity" width="w-1/4" color="#22c55e" />
          <StatCard label="Nodes" value="3" iconName="Server" width="w-1/4" color="#eab308" />
        </div>
        <div className="flex gap-4 mb-8">
          <StatCard label="Uptime" value="12d 4h" iconName="Clock" width="w-1/4" color="#3b82f6" />
          <StatCard label="CPU Load" value="14%" iconName="Cpu" width="w-1/4" color="#a855f7" />
          <StatCard label="Status" value="Online" iconName="Activity" width="w-1/4" color="#22c55e" />
          <StatCard label="Nodes" value="3" iconName="Server" width="w-1/4" color="#eab308" />
        </div>

        {/* Charts Row */}
        
        <div className="flex"><div className="w-1 h-5 bg-[#22c55e] rounded-full" /><div className="ml-[5]">Sdas</div></div>
        <div className="flex gap-4 mb-5">
          <TempChart />
          <TempChart />
        </div>

                {/* Charts Row */}
        
        <div className="flex"><div className="w-1 h-5 bg-[#22c55e] rounded-full" /><div className="ml-[5]">Sdas</div></div>
        <div className="flex gap-4 mb-5">
          <TempChart />
          <TempChart />
        </div>

              {/* Stats Row - 80px high cards */}
        <div className="flex"><div className="w-1 h-5 bg-[#22c55e] rounded-full" /><div className="ml-[5]">Sdas</div></div>
        <div className="flex gap-4 mb-8">
          <StatCard label="Uptimezxczxczxc" value="12d 4h" iconName="Clock" width="w-1/4" color="#3b82f6" />
          <StatCard label="CPU Load" value="14%" iconName="Cpu" width="w-1/4" color="#a855f7" />
          <StatCard label="Status" value="Online" iconName="Activity" width="w-1/4" color="#22c55e" />
          <StatCard label="Nodes" value="3" iconName="Server" width="w-1/4" color="#eab308" />
        </div>
        <div className="flex gap-4 mb-8">
          <StatCard label="Uptime" value="12d 4h" iconName="Clock" width="w-1/4" color="#3b82f6" />
          <StatCard label="CPU Load" value="14%" iconName="Cpu" width="w-1/4" color="#a855f7" />
          <StatCard label="Status" value="Online" iconName="Activity" width="w-1/4" color="#22c55e" />
          <StatCard label="Nodes" value="3" iconName="Server" width="w-1/4" color="#eab308" />
        </div>
      </div>
    </main>
  );
}