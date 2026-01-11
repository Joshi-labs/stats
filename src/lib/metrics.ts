export async function getCpuTempRange() {
  const baseUrl = process.env.PROMETHEUS_URL || "http://prometheus-service.monitoring:9090";
  const now = Math.floor(Date.now() / 1000);
  const oneHourAgo = now - 3600;
  
  const query = 'node_hwmon_temp_celsius{chip="platform_coretemp_0", sensor="temp1"}';
  
  // Changed step=60s to step=10s for higher precision
  const url = `${baseUrl}/api/v1/query_range?query=${encodeURIComponent(query)}&start=${oneHourAgo}&end=${now}&step=10s`;

  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error("Range fetch failed");
    return await res.json();
  } catch (error) {
    console.error("Temp Fetch Error:", error);
    return { data: { result: [] } };
  }
}