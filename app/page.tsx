import TempChart from "@/src/components/TempChart";

export default function Page() {
  return (
    <main className="min-h-screen bg-black p-10 text-white">
      <div className="max-w-5xl mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-bold tracking-tighter">Infrastructure Stats</h1>
        </header>
        
        <div className="grid grid-cols-1 gap-8">
          <TempChart />
        </div>
      </div>
    </main>
  );
}