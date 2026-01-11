import TempChart from "@/src/components/TempChart";

export default function Page() {
  return (
    <main className="min-h-screen bg-[#111217] p-10 text-white">
      <div className="">
        <header className="mb-10">
          <h1 className="text-3xl font-bold tracking-tighter">Infrastructure Stats</h1>
        </header>

        <div className="flex gap-8">
          <TempChart /><TempChart />
        </div>
      </div>
    </main>
  );
}