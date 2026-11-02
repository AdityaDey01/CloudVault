"use client";

import React from "react";
import {
  Menu,
  RefreshCw,
  Search,
  Upload,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
} from "lucide-react";
import { ActiveTab } from "./Sidebar";

interface NavbarProps {
  activeTab: ActiveTab;
  onToggleSidebar: () => void;
  onOpenUpload: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  searchTerm: string;
  onSearchChange: (val: string) => void;
  connectionStatus: "connected" | "disconnected" | "checking";
  connectionMessage?: string;
}

export function Navbar({
  activeTab,
  onToggleSidebar,
  onOpenUpload,
  onRefresh,
  isRefreshing,
  searchTerm,
  onSearchChange,
  connectionStatus,
  connectionMessage,
}: NavbarProps) {
  const titles: Record<ActiveTab, { title: string; subtitle: string }> = {
    dashboard: {
      title: "Storage Dashboard",
      subtitle: "Overview of your files, storage allocation, and cloud status",
    },
    files: {
      title: "File Management",
      subtitle: "Browse, filter, preview, download, and delete files in S3",
    },
    "cloud-concepts": {
      title: "Cloud vs Local Storage",
      subtitle: "Academic analysis & architectural demonstration for Cloud Computing",
    },
    system: {
      title: "System & AWS Health",
      subtitle: "Bucket connectivity diagnostics and environment status",
    },
  };

  return (
    <header className="sticky top-0 z-30 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 lg:px-8 py-3.5">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Page Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              {titles[activeTab].title}
            </h1>
            <p className="hidden sm:block text-xs text-slate-400">
              {titles[activeTab].subtitle}
            </p>
          </div>
        </div>

        {/* Right Actions & Search */}
        <div className="flex items-center gap-3">
          {/* Quick Search */}
          <div className="relative hidden md:block w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search files..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-sky-500 transition-colors"
            />
          </div>

          {/* S3 Connectivity Badge */}
          <div
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium cursor-help"
            title={connectionMessage || "S3 Status"}
          >
            {connectionStatus === "connected" ? (
              <span className="flex items-center gap-1.5 text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>S3 Connected</span>
              </span>
            ) : connectionStatus === "checking" ? (
              <span className="flex items-center gap-1.5 text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-lg border border-sky-500/20 animate-pulse">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Connecting...</span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                <span>Credentials Needed</span>
              </span>
            )}
          </div>

          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="p-2 rounded-xl border border-slate-700/80 bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer disabled:opacity-50"
            title="Refresh files from Amazon S3"
            aria-label="Refresh files"
          >
            <RefreshCw
              className={`w-4 h-4 ${isRefreshing ? "animate-spin text-sky-400" : ""}`}
            />
          </button>

          {/* Upload Button */}
          <button
            onClick={onOpenUpload}
            className="flex items-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs sm:text-sm font-medium shadow-md shadow-sky-500/20 transition-all cursor-pointer active:scale-95"
          >
            <Upload className="w-4 h-4" />
            <span className="hidden sm:inline">Upload</span>
          </button>
        </div>
      </div>
    </header>
  );
}
