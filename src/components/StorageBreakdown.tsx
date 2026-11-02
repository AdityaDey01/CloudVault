"use client";

import React from "react";
import { PieChart, Image, FileText, Film, Archive, Code, HelpCircle } from "lucide-react";
import { StorageStats, FileCategory } from "@/types/file";

interface StorageBreakdownProps {
  stats: StorageStats | null;
  onFilterCategory?: (category: FileCategory) => void;
}

export function StorageBreakdown({ stats, onFilterCategory }: StorageBreakdownProps) {
  const categoryConfig: Record<
    FileCategory,
    { label: string; color: string; bgBar: string; icon: React.ElementType }
  > = {
    image: {
      label: "Images",
      color: "text-emerald-400",
      bgBar: "bg-emerald-500",
      icon: Image,
    },
    document: {
      label: "Documents",
      color: "text-sky-400",
      bgBar: "bg-sky-500",
      icon: FileText,
    },
    media: {
      label: "Media",
      color: "text-purple-400",
      bgBar: "bg-purple-500",
      icon: Film,
    },
    archive: {
      label: "Archives",
      color: "text-orange-400",
      bgBar: "bg-orange-500",
      icon: Archive,
    },
    code: {
      label: "Code",
      color: "text-indigo-400",
      bgBar: "bg-indigo-500",
      icon: Code,
    },
    other: {
      label: "Others",
      color: "text-slate-400",
      bgBar: "bg-slate-500",
      icon: HelpCircle,
    },
  };

  const categories = (["image", "document", "media", "archive", "code", "other"] as FileCategory[])
    .map((cat) => {
      const data = stats?.categories?.[cat] || {
        count: 0,
        sizeBytes: 0,
        sizeFormatted: "0 B",
        percentage: 0,
      };
      return {
        key: cat,
        ...categoryConfig[cat],
        ...data,
      };
    });

  const totalFiles = stats?.totalFiles ?? 0;

  return (
    <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
      {/* Title */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <PieChart className="w-5 h-5 text-sky-400" />
          <h2 className="text-base font-semibold text-white">
            Storage Distribution by Category
          </h2>
        </div>
        <span className="text-xs text-slate-400 font-mono">
          {totalFiles} total file{totalFiles === 1 ? "" : "s"}
        </span>
      </div>

      {/* Multi-segment Proportion Bar */}
      <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden flex mb-6">
        {totalFiles === 0 ? (
          <div className="w-full h-full bg-slate-800/80" />
        ) : (
          categories.map((cat) => {
            if (cat.percentage <= 0) return null;
            return (
              <div
                key={cat.key}
                style={{ width: `${Math.max(cat.percentage, 2)}%` }}
                className={`h-full ${cat.bgBar} transition-all duration-500`}
                title={`${cat.label}: ${cat.sizeFormatted} (${cat.percentage}%)`}
              />
            );
          })
        )}
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <button
              key={cat.key}
              onClick={() => onFilterCategory?.(cat.key)}
              className="p-3 rounded-xl bg-slate-800/40 hover:bg-slate-800 border border-slate-700/50 hover:border-slate-600 transition-all text-left flex flex-col justify-between cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <Icon className={`w-4 h-4 ${cat.color}`} />
                  <span className="text-xs font-medium text-slate-300 group-hover:text-white">
                    {cat.label}
                  </span>
                </div>
                <span className="text-[10px] font-mono font-semibold text-slate-400">
                  {cat.percentage}%
                </span>
              </div>
              <div>
                <p className="text-sm font-bold text-white font-mono">
                  {cat.sizeFormatted}
                </p>
                <p className="text-[11px] text-slate-400">
                  {cat.count} file{cat.count === 1 ? "" : "s"}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
