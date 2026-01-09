"use server"; // This ensures this code ONLY runs on your server

export async function getCpuUsage() {
  const PROM_URL = "http://prometheus-service.monitoring:9090/api/v1/query?query=node_cpu_seconds_total";
  
  const res = await fetch(PROM_URL, { cache: 'no-store' }); // Don't cache metrics!
  if (!res.ok) throw new Error("Failed to fetch Prometheus");
  
  return res.json();
}