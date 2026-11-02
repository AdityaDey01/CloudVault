"use client";

import React from "react";
import {
  Files,
  HardDrive,
  Database,
  ArrowUpRight,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { StorageStats } from "@/types/file";
import { DEFAULT_BUCKET_NAME, DEFAULT_AWS_REGION } from "@/lib/constants";

interface StatsCardsProps {
  stats: StorageStats | null;
  isLoading: boolean;
  onViewFiles: () => void;
  onOpenUpload: () => void;
  connectionStatus?: "connected" | "disconnected" | "checking";
}

export function StatsCards({
  stats,
  isLoading,
  onViewFiles,
  onOpenUpload,
  connectionStatus = "connected",
}: StatsCardsProps) {
  const cards = [
    {
      title: "Total Files",
      value: isLoading ? "..." : (stats?.totalFiles ?? 0).toLocaleString(),
      subtext: "Stored in Amazon S3",
      icon: Files,
      color: "text-sky-400 bg-sky-500/10 border-sky-500/20",
      action: { label: "View all files", onClick: onViewFiles },
    },
    {
      title: "Storage Consumed",
      value: isLoading ? "..." : (stats?.totalSizeFormatted ?? "0 B"),
      subtext: `${(stats?.totalSizeBytes ?? 0).toLocaleString()} bytes`,
      icon: HardDrive,
      color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
      action: { label: "Upload more", onClick: onOpenUpload },
    },
    {
      title: "Target S3 Bucket",
      value: stats?.bucketName || DEFAULT_BUCKET_NAME,
      subtext: `Region: ${stats?.region || DEFAULT_AWS_REGION} (Private)`,
      icon: Database,
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
      badge: "Private Access",
    },
    {
      title: "S3 Connection Status",
      value: connectionStatus === "connected" ? "Operational" : "Action Required",
      subtext: connectionStatus === "connected" ? "SigV4 API connected" : "Check credentials in .env",
      icon: connectionStatus === "connected" ? CheckCircle2 : AlertTriangle,
      color: connectionStatus === "connected"
        ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
        : "text-amber-400 bg-amber-500/10 border-amber-500/20",
      badge: connectionStatus === "connected" ? "Live S3" : "Offline",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors flex flex-col justify-between shadow-xs"
          >
            {/* Top Row: Title & Icon */}
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                {card.title}
              </span>
              <div
                className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 ${card.color}`}
              >
                <Icon className="w-4 h-4" />
              </div>
            </div>

            {/* Middle Row: Value & Subtext */}
            <div className="my-3">
              <div className="text-xl sm:text-2xl font-bold text-white tracking-tight font-mono truncate">
                {card.value}
              </div>
              <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1.5 truncate">
                {card.badge && (
                  <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                    {card.badge}
                  </span>
                )}
                <span className="truncate">{card.subtext}</span>
              </div>
            </div>

            {/* Bottom Row: Action or Status */}
            {card.action ? (
              <div className="pt-2.5 border-t border-slate-800/80">
                <button
                  onClick={card.action.onClick}
                  className="text-[11px] font-medium text-sky-400 hover:text-sky-300 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <span>{card.action.label}</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <div className="pt-2.5 border-t border-slate-800/80 text-[11px] text-slate-500 font-mono">
                Decoupled AWS Storage
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
