"use client";

import { User, BookOpen, Briefcase } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full h-12 bg-[#0b0c10] border-b border-zinc-800 flex items-center justify-between px-4 sticky top-0 z-50">
      {/* Left Side: Logos and Title */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          {/* Grafana Logo */}
          <img 
            src="https://grafana.com/media/docs/home/logos/grafana-sm.svg" 
            alt="Grafana" 
            className="h-6 w-6 object-contain"
          />
          {/* Prometheus Logo */}
          <img 
            src="https://prometheus.io/_next/static/media/prometheus-logo.7aa022e5.svg" 
            alt="Prometheus" 
            className="h-6 w-6 object-contain"
          />
        </div>
        
        <div className="h-4 w-[1px] bg-zinc-700 mx-1" />
        
        <h1 className="text-sm font-medium text-zinc-200 tracking-tight">
          Grafana Prometheus <span className="text-zinc-500 font-normal">based Monitoring System</span>
        </h1>
      </div>

      {/* Right Side: Actions & User */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer group">
            <Briefcase size={14} className="group-hover:text-blue-400 transition-colors" />
            <span>Portfolio</span>
          </button>
          <button className="flex items-center gap-2 text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer group">
            <BookOpen size={14} className="group-hover:text-orange-400 transition-colors" />
            <span>Documentation</span>
          </button>
        </div>

        <div className="h-4 w-[1px] bg-zinc-700" />

        {/* User Icon with Tooltip */}
        <div className="relative group flex items-center gap-2 cursor-pointer">
          <div className="w-7 h-7 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center overflow-hidden transition-colors group-hover:border-zinc-500">
            <User size={16} className="text-zinc-400 group-hover:text-white" />
          </div>
          
          {/* Tooltip */}
          <div className="absolute top-10 right-0 hidden group-hover:block bg-[#1c1d24] border border-zinc-700 text-[10px] text-white px-2 py-1.5 rounded shadow-2xl whitespace-nowrap z-50">
            Guest User
          </div>
        </div>
      </div>
    </nav>
  );
}