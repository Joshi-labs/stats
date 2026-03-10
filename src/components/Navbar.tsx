"use client";

import { User, BookOpen, Briefcase, Menu, X } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav className="w-full h-12 bg-[#0b0c10] border-b border-zinc-800 flex items-center justify-between px-4 sticky top-0 z-50">

        {/* Left: Logos + Title */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center gap-2 shrink-0">
            <img src="https://grafana.com/media/docs/home/logos/grafana-sm.svg" alt="Grafana" className="h-6 w-6 object-contain" />
            <img src="https://prometheus.io/_next/static/media/prometheus-logo.7aa022e5.svg" alt="Prometheus" className="h-6 w-6 object-contain" />
          </div>
          <div className="h-4 w-[1px] bg-zinc-700 mx-1 shrink-0" />
          <h1 className="text-sm font-medium text-zinc-200 tracking-tight truncate">
            <span className="hidden sm:inline">
              Grafana Prometheus <span className="text-zinc-500 font-normal">based Monitoring System</span>
            </span>
            <span className="sm:hidden text-zinc-400 font-normal">Monitoring</span>
          </h1>
        </div>

        {/* Right: Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          <div className="flex items-center gap-4">
            <Link
              href="https://vpjoshi.in"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs text-zinc-400 hover:text-white transition-colors group"
            >
              <Briefcase size={14} className="group-hover:text-blue-400 transition-colors" />
              <span>Portfolio</span>
            </Link>
            <Link
              href="https://docs.vpjoshi.in/#/server"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs text-zinc-400 hover:text-white transition-colors group"
            >
              <BookOpen size={14} className="group-hover:text-orange-400 transition-colors" />
              <span>Documentation</span>
            </Link>
          </div>
          <div className="h-4 w-[1px] bg-zinc-700" />
          <div className="relative group flex items-center gap-2 cursor-pointer">
            <div className="w-7 h-7 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center transition-colors group-hover:border-zinc-500">
              <User size={16} className="text-zinc-400 group-hover:text-white" />
            </div>
            <div className="absolute top-10 right-0 hidden group-hover:block bg-[#1c1d24] border border-zinc-700 text-[10px] text-white px-2 py-1.5 rounded shadow-2xl whitespace-nowrap z-50">
              Guest User
            </div>
          </div>
        </div>

        {/* Right: Mobile — user + hamburger */}
        <div className="flex md:hidden items-center gap-3">
          <div className="relative group cursor-pointer">
            <div className="w-7 h-7 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center transition-colors group-hover:border-zinc-500">
              <User size={15} className="text-zinc-400 group-hover:text-white" />
            </div>
            <div className="absolute top-9 right-0 hidden group-hover:block bg-[#1c1d24] border border-zinc-700 text-[10px] text-white px-2 py-1.5 rounded shadow-2xl whitespace-nowrap z-50">
              Guest User
            </div>
          </div>
          <button onClick={() => setMenuOpen((v) => !v)} className="text-zinc-400 hover:text-white transition-colors" aria-label="Toggle menu">
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {/* Mobile dropdown — buttons centered */}
      {menuOpen && (
        <div className="md:hidden bg-[#0b0c10] border-b border-zinc-800 px-4 py-4 flex flex-col items-center gap-4 sticky top-12 z-40">
          <Link
            href="https://vpjoshi.in"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs text-zinc-400 hover:text-white transition-colors group"
          >
            <Briefcase size={14} className="group-hover:text-blue-400 transition-colors" />
            <span>Portfolio</span>
          </Link>
          <Link
            href="https://docs.vpjoshi.in/#/server"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs text-zinc-400 hover:text-white transition-colors group"
          >
            <BookOpen size={14} className="group-hover:text-orange-400 transition-colors" />
            <span>Documentation</span>
          </Link>
        </div>
      )}
    </>
  );
}