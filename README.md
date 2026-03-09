<div align="center">

<img src="https://grafana.com/media/docs/home/logos/grafana-sm.svg" height="40" />
&nbsp;&nbsp;
<img src="https://prometheus.io/_next/static/media/prometheus-logo.7aa022e5.svg" height="40" />

# infrastructure stats

**A self-hosted, real-time server monitoring dashboard**  
built on Next.js · Prometheus · Grafana · k3s

[![Live](https://img.shields.io/badge/live-stats.vpjoshi.in-22c55e?style=flat-square&logo=vercel&logoColor=white)](https://stats.vpjoshi.in)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Prometheus](https://img.shields.io/badge/Prometheus-node__exporter-e6522c?style=flat-square&logo=prometheus&logoColor=white)](https://prometheus.io)
[![k3s](https://img.shields.io/badge/k3s-self--hosted-ffc61a?style=flat-square&logo=kubernetes&logoColor=black)](https://k3s.io)

</div>

---

## screenshots

> *(replace with your actual screenshots)*

| Desktop | Mobile |
|---|---|
| ![Desktop View](screenshots/desktop.png) | ![Mobile View](screenshots/mobile.png) |

---

## what is this

Grafana dashboards aren't shareable to the public — so I built my own.

This is a **production monitoring dashboard** for my self-hosted homelab server running a k3s cluster. It queries Prometheus directly via server-side Next.js API routes, formats the data, and serves a fully responsive dark UI — no Grafana, no auth walls, just raw metrics at [stats.vpjoshi.in](https://stats.vpjoshi.in).

Everything runs on my own hardware. The k3s cluster handles orchestration, Prometheus scrapes node_exporter every 10 seconds, and this Next.js app sits in front as the public-facing dashboard.

---

## metrics on display

### system overview
| Metric | Source |
|--------|--------|
| Total Uptime (since 1 Feb 2026) | Hardcoded start date · `Date.now()` diff |
| Session Uptime | `node_boot_time_seconds` |
| CPU Load % | `node_cpu_seconds_total{mode="idle"}` |
| CPU Temperature | `node_hwmon_temp_celsius` |
| Power Draw (live) | `scaph_host_power_microwatts` |
| Avg Power (1hr) | `avg_over_time(...)` subquery |
| Est. Monthly Electricity Cost | Avg W × 24h × 30d ÷ 1000 × ₹6/unit |
| Swap Usage | `node_memory_SwapFree_bytes` |

### memory & storage
`RAM %` · `Total RAM` · `Disk Used %` · `Disk Free`

### charts (last 1 hour · 10s resolution)
- CPU Temperature
- Power Draw
- RAM Usage %
- Network I/O (in/out KB/s)

### system pressure & load
`Load Avg 1m/5m` · `CPU/RAM Pressure (PSI)` · `Context Switches/s` · `Network Drops` · `Disk Read/Write KB/s`

---

## tech stack

```
Frontend      Next.js 15 (App Router) · TypeScript · Tailwind CSS v4
Charts        Recharts (AreaChart)
Data fetching SWR — with configurable refresh interval (10s → 5m)
Metrics       Prometheus · node_exporter · scaphandre (power)
Infra         k3s (self-hosted) · Docker · Cloudflare Tunnel
CI/CD         GitHub Actions → k3s (deploy on commit message [prod])
```

---

## architecture

```
┌─────────────────────────────────────────────────┐
│                  homelab server                  │
│                                                  │
│  ┌──────────────┐     ┌───────────────────────┐  │
│  │ node_exporter│     │     scaphandre        │  │
│  │ (port 9100)  │     │  (power metrics)      │  │
│  └──────┬───────┘     └──────────┬────────────┘  │
│         │                        │               │
│         └──────────┬─────────────┘               │
│                    ▼                             │
│            ┌───────────────┐                     │
│            │  Prometheus   │  ← scrapes every 10s│
│            │  (port 9090)  │                     │
│            └───────┬───────┘                     │
│                    │  HTTP query API             │
│                    ▼                             │
│        ┌───────────────────────┐                 │
│        │   Next.js API routes  │                 │
│        │  /api/metrics/stats   │                 │
│        │  /api/metrics/temp    │                 │
│        │  /api/metrics/power   │                 │
│        │  /api/metrics/ram     │                 │
│        │  /api/metrics/network │                 │
│        └───────────┬───────────┘                 │
│                    │                             │
│        ┌───────────▼───────────┐                 │
│        │    Next.js frontend   │                 │
│        │   (SWR · Recharts)    │                 │
│        └───────────────────────┘                 │
│                    │                             │
└────────────────────┼────────────────────────────┘
                     │ Cloudflare Tunnel
                     ▼
            stats.vpjoshi.in
```

---

## ci/cd

This project uses **GitHub Actions** with a commit-message-based deployment trigger.

```
push to main
    │
    ├── commit message contains [prod]?
    │       │
    │       yes → build Docker image → push to registry → kubectl rollout on k3s
    │
    └── no [prod] → skip deploy (lint/type-check only)
```

To deploy:
```bash
git commit -m "feat: add new metric card [prod]"
git push
```

---

## local development

### prerequisites
- Node.js 20+
- Access to a Prometheus instance (or use the mock)

### setup

```bash
git clone https://github.com/vpjoshi/infrastructure-stats
cd stats
npm install
```

Create `.env.local`:
```env
PROMETHEUS_URL=http://your-prometheus-ip:9090
```

Run dev server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## project structure

```
stats/
├── app/
│   ├── api/
│   │   └── metrics/
│   │       ├── stats/route.ts     # all stat card values (instant queries)
│   │       ├── temp/route.ts      # CPU temp time series
│   │       ├── power/route.ts     # power draw time series
│   │       ├── ram/route.ts       # RAM % time series
│   │       └── network/route.ts   # network I/O time series
│   ├── layout.tsx
│   └── page.tsx                   # main dashboard page
├── src/
│   ├── components/
│   │   ├── Navbar.tsx             # responsive navbar
│   │   ├── StatCard.tsx           # metric card component
│   │   └── TempChart.tsx          # generic area chart component
│   ├── hooks/
│   │   └── useStats.ts            # SWR hook for stat cards
│   ├── lib/
│   │   └── metrics.ts             # all Prometheus query functions
│   └── types/
│       └── prometheus.ts          # Prometheus response types
├── Dockerfile
└── .env.local
```

---

## key design decisions

**Single `/api/metrics/stats` endpoint** — all 20+ card values fetched in one `Promise.all` call instead of individual endpoints per card. Reduces round trips, simplifies client code.

**Server-side Prometheus queries** — `PROMETHEUS_URL` never exposed to the client. The browser only talks to `/api/*` routes on the same origin.

**SWR with configurable interval** — refresh interval is controlled from the UI (10s to 5m) and passed down to both `useStats()` and each `TempChart` so everything refreshes in sync.

**Generic `TempChart`** — one component handles all 4 charts via props (`apiUrl`, `color`, `isNetwork`). The network chart uses dual `Area` series for in/out.

---

<div align="center">

built by **[@vpjoshi](https://github.com/Joshi-labs)** · running on a self-hosted k3s homelab

</div>