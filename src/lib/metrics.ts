const BASE_URL = process.env.PROMETHEUS_URL || "http://prometheus:9090";

async function queryInstant(query: string) {
  const url = `${BASE_URL}/api/v1/query?query=${encodeURIComponent(query)}`;
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`Instant query failed: ${query}`);
    return await res.json();
  } catch (err) {
    console.error("Prometheus instant error:", err);
    return { data: { result: [] } };
  }
}

async function queryRange(query: string, step = "10s") {
  const now = Math.floor(Date.now() / 1000);
  const start = now - 3600;
  const url = `${BASE_URL}/api/v1/query_range?query=${encodeURIComponent(query)}&start=${start}&end=${now}&step=${step}`;
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`Range query failed: ${query}`);
    return await res.json();
  } catch (err) {
    console.error("Prometheus range error:", err);
    return { data: { result: [] } };
  }
}

export function parseInstantValue(data: any): number | null {
  const result = data?.data?.result?.[0];
  if (!result) return null;
  return parseFloat(result.value?.[1] ?? "0");
}

export function parseRangeValues(data: any): { time: string; value: number }[] {
  const values: [number, string][] = data?.data?.result?.[0]?.values ?? [];
  return values.map(([ts, val]) => ({
    time: new Date(ts * 1000).toLocaleTimeString("en-GB", {
      hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false,
    }),
    value: parseFloat(val),
  }));
}

// ─── Instant ────────────────────────────────────────────────────────────────

export const getCpuUsage = () =>
  queryInstant('100 - (avg(rate(node_cpu_seconds_total{mode="idle"}[2m])) * 100)');
export const getRamUsagePercent = () =>
  queryInstant("(1 - node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes) * 100");
export const getRamTotal = () =>
  queryInstant("node_memory_MemTotal_bytes / 1073741824");
export const getDiskUsagePercent = () =>
  queryInstant('100 - (node_filesystem_avail_bytes{mountpoint="/"} / node_filesystem_size_bytes{mountpoint="/"}) * 100');
export const getDiskFree = () =>
  queryInstant('node_filesystem_avail_bytes{mountpoint="/"} / 1073741824');
export const getDiskTotal = () =>
  queryInstant('node_filesystem_size_bytes{mountpoint="/"} / 1073741824');
export const getUptime = () =>
  queryInstant("time() - node_boot_time_seconds");
export const getCpuTempInstant = () =>
  queryInstant('node_hwmon_temp_celsius{chip="platform_coretemp_0", sensor="temp1"}');
export const getPowerInstant = () =>
  queryInstant("scaph_host_power_microwatts / 1000000 + 5");
export const getSwapUsed = () =>
  queryInstant("(node_memory_SwapTotal_bytes - node_memory_SwapFree_bytes) / 1073741824");
export const getSwapTotal = () =>
  queryInstant("node_memory_SwapTotal_bytes / 1073741824");
export const getSwapUsedPercent = () =>
  queryInstant("100 * (1 - node_memory_SwapFree_bytes / node_memory_SwapTotal_bytes)");
export const getAvgPowerLastHour = () =>
  queryInstant("avg_over_time((scaph_host_power_microwatts / 1000000 + 5)[1h:10s])");

// Load averages
export const getLoadAvg1m  = () => queryInstant("node_load1");
export const getLoadAvg5m  = () => queryInstant("node_load5");

// CPU & RAM pressure (60s window — more stable than 10s)
export const getCpuPressureAvg60 = () =>
  queryInstant('rate(node_pressure_cpu_waiting_seconds_total[60s]) * 100');
export const getRamPressureAvg60 = () =>
  queryInstant('rate(node_pressure_memory_waiting_seconds_total[60s]) * 100');

// Context switches per second
export const getContextSwitches = () =>
  queryInstant("rate(node_context_switches_total[1m])");

// Network packets dropped (in + out combined, per second)
export const getNetworkDrops = () =>
  queryInstant('rate(node_network_receive_drop_total{device!="lo"}[1m]) + rate(node_network_transmit_drop_total{device!="lo"}[1m])');

// Disk read speed KB/s
export const getDiskReadSpeed = () =>
  queryInstant('sum(rate(node_disk_read_bytes_total[1m])) / 1024');

// Disk write speed KB/s
export const getDiskWriteSpeed = () =>
  queryInstant('sum(rate(node_disk_written_bytes_total[1m])) / 1024');

// ─── Range ───────────────────────────────────────────────────────────────────

export const getCpuTempRange = () =>
  queryRange('node_hwmon_temp_celsius{chip="platform_coretemp_0", sensor="temp1"}');
export const getPowerRange = () =>
  queryRange("scaph_host_power_microwatts / 1000000 + 5");
export const getRamRange = () =>
  queryRange("(1 - node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes) * 100");
export const getNetworkInRange = () =>
  queryRange('sum(rate(node_network_receive_bytes_total{device!="lo"}[1m])) / 1024');
export const getNetworkOutRange = () =>
  queryRange('sum(rate(node_network_transmit_bytes_total{device!="lo"}[1m])) / 1024');