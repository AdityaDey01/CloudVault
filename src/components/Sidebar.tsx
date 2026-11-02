"use client";

import React from "react";
import {
  LayoutDashboard,
  FolderOpen,
  Cloud,
  Layers,
  Upload,
  HardDrive,
  ShieldCheck,
  Server,
  X,
} from "lucide-react";
import { StorageStats } from "@/types/file";

export type ActiveTab = "dashboard" | "files" | "cloud-concepts" | "system";

interface SidebarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  onOpenUpload: () => void;
  stats: StorageStats | null;
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({
  activeTab,
  onSelectTab,
  onOpenUpload,
  stats,
  isOpen,
  onClose,
}: SidebarProps) {
  const navItems = [
    {
      id: "dashboard" as ActiveTab,
      label: "Dashboard",
      icon: LayoutDashboard,
      badge: stats ? `${stats.totalFiles}` : undefined,
    },
    {
      id: "files" as ActiveTab,
      label: "All Files",
      icon: FolderOpen,
    },
    {
      id: "cloud-concepts" as ActiveTab,
      label: "Cloud vs Local",
      icon: Layers,
      highlight: true,
    },
    {
      id: "system" as ActiveTab,
      label: "Bucket Health",
      icon: Server,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-72 bg-slate-900 border-r border-slate-800 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="h-18 px-6 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/20">
              <Cloud className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-lg text-white tracking-tight flex items-center gap-1.5">
                CloudVault
                <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
                  S3
                </span>
              </span>
              <p className="text-xs text-slate-400">AWS Cloud Storage</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Primary Action Button */}
        <div className="p-4">
          <button
            onClick={() => {
              onOpenUpload();
              if (isOpen) onClose();
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 active:scale-[0.98] text-white font-medium shadow-lg shadow-sky-500/25 transition-all duration-200 cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            <span>Upload New Files</span>
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
            Menu
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  if (isOpen) onClose();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                  isActive
                    ? "bg-slate-800 text-sky-400 shadow-xs border border-slate-700/60"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? "text-sky-400" : "text-slate-400"
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                    {item.badge}
                  </span>
                )}
                {item.highlight && !item.badge && (
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    25 Marks
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* AWS S3 Bucket Summary Card */}
        <div className="p-4 border-t border-slate-800">
          <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/50 text-xs space-y-2.5">
            <div className="flex items-center justify-between text-slate-300">
              <span className="font-medium flex items-center gap-1.5">
                <HardDrive className="w-3.5 h-3.5 text-sky-400" />
                Active S3 Bucket
              </span>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Private
              </span>
            </div>
            <div className="font-mono text-slate-200 bg-slate-900/80 px-2 py-1 rounded border border-slate-700/60 truncate">
              {stats?.bucketName || "tushardevx01"}
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
              <span>Region:</span>
              <span className="font-mono text-slate-300">
                {stats?.region || "ap-south-1"}
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>Storage Used:</span>
              <span className="font-mono text-sky-300 font-medium">
                {stats?.totalSizeFormatted || "0 B"}
              </span>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="px-6 py-3 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            AWS SDK v3
          </span>
          <span className="font-mono">Next.js 16</span>
        </div>
      </aside>
    </>
  );
}
