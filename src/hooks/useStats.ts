"use client";

import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export interface StatsData {
  totalUptime:     string;
  sessionUptime:   string;
  cpu:             string;
  cpuTemp:         string;
  power:           string;
  avgPower:        string;
  electricityCost: string;
  swapPercent:     string;
  swapLabel:       string;
  ram:             string;
  ramTotal:        string;
  diskUsed:        string;
  diskFree:        string;
  diskTotal:       string;
  load1m:          string;
  load5m:          string;
  cpuPressure60s:  string;
  ramPressure60s:  string;
  contextSwitches: string;
  netDrops:        string;
  diskRead:        string;
  diskWrite:       string;
}

export function useStats(refreshInterval = 10000) {
  const { data, error, isLoading } = useSWR<StatsData>(
    "/api/metrics/stats",
    fetcher,
    { refreshInterval }
  );
  return { stats: data, error, isLoading };
}