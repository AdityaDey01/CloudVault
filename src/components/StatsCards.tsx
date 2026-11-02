"use client";

import React from "react";
import {
  Files,
  HardDrive,
  Database,
  CloudLightning,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";
import { StorageStats } from "@/types/file";

interface StatsCardsProps {
  stats: StorageStats | null;
  isLoading: boolean;
  onViewFiles: () => void;
  onOpenUpload: () => void;
}

export function StatsCards({
  stats,
  isLoading,
  onViewFiles,
  onOpenUpload,
}: StatsCardsProps) {
  const cards = [
    {
      title: "Total Files",
      value: isLoading ? "..." : (stats?.totalFiles ?? 0).toLocaleString(),
      subtext: "Objects stored in S3",
      icon: Files,
      color: "from-sky-500/20 to-sky-500/5 text-sky-400 border-sky-500/20",
      action: { label: "View all files", onClick: onViewFiles },
    },
    {
      title: "Storage Consumed",
      value: isLoading ? "..." : (stats?.totalSizeFormatted ?? "0 B"),
      subtext: `${(stats?.totalSizeBytes ?? 0).toLocaleString()} bytes`,
      icon: HardDrive,
      color: "from-indigo-500/20 to-indigo-500/5 text-indigo-400 border-indigo-500/20",
      action: { label: "Upload more", onClick: onOpenUpload },
    },
    {
      title: "Amazon S3 Bucket",
      value: stats?.bucketName || "tushardevx01",
      subtext: `Region: ${stats?.region || "ap-south-1"} (Private)`,
      icon: Database,
      color: "from-emerald-500/20 to-emerald-500/5 text-emerald-400 border-emerald-500/20",
    },
    {
      title: "Cloud Architecture",
      value: "Decoupled S3",
      subtext: "Browser → Next.js → AWS S3",
      icon: CloudLightning,
      color: "from-amber-500/20 to-amber-500/5 text-amber-400 border-amber-500/20",
      badge: "Elastic 11 9's",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700/80 transition-all duration-200 flex flex-col justify-between shadow-xs relative overflow-hidden group"
          >
            {/* Top Row: Title & Icon */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                {card.title}
              </span>
              <div
                className={`w-9 h-9 rounded-xl bg-gradient-to-br ${card.color} border flex items-center justify-center`}
              >
                <Icon className="w-4 h-4" />
              </div>
            </div>

            {/* Middle: Value & Subtext */}
            <div className="mt-4">
              <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight truncate">
                {card.value}
              </div>
              <div className="text-xs text-slate-400 mt-1 flex items-center gap-1.5 truncate">
                {card.badge && (
                  <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    {card.badge}
                  </span>
                )}
                <span>{card.subtext}</span>
              </div>
            </div>

            {/* Bottom Row Action Link if present */}
            {card.action && (
              <div className="mt-4 pt-3 border-t border-slate-800/80">
                <button
                  onClick={card.action.onClick}
                  className="text-xs font-medium text-sky-400 hover:text-sky-300 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <span>{card.action.label}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
