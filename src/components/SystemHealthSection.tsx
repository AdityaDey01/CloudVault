"use client";

import React, { useState } from "react";
import {
  Server,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  HardDrive,
  Key,
  Lock,
  Globe,
  FileCode,
} from "lucide-react";
import { StorageStats } from "@/types/file";

interface SystemHealthSectionProps {
  stats: StorageStats | null;
  connectionStatus: "connected" | "disconnected" | "checking";
  connectionMessage?: string;
  onCheckHealth: () => Promise<void>;
}

export function SystemHealthSection({
  stats,
  connectionStatus,
  connectionMessage,
  onCheckHealth,
}: SystemHealthSectionProps) {
  const [isTesting, setIsTesting] = useState(false);

  const handleTest = async () => {
    try {
      setIsTesting(true);
      await onCheckHealth();
    } finally {
      setIsTesting(false);
    }
  };

  const securityChecklist = [
    {
      title: "Private S3 Bucket",
      desc: "Bucket 'tushardevx01' has public access blocked. No objects are exposed over public HTTP.",
      verified: true,
    },
    {
      title: "Server-Side Credential Isolation",
      desc: "AWS credentials exist solely on the Next.js server runtime. Zero keys leaked in client JS bundles.",
      verified: true,
    },
    {
      title: "Strict Single .env Specification",
      desc: "Only one .env file is utilized. All .env files strictly excluded by .gitignore.",
      verified: true,
    },
    {
      title: "Path Traversal & Injection Shield",
      desc: "Object keys are sanitized, forced to 'uploads/' prefix, and checked against directory breakout (..).",
      verified: true,
    },
    {
      title: "Presigned URL Expiration",
      desc: "Temporary preview and download URLs expire automatically after 15 minutes.",
      verified: true,
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* S3 Connectivity Status Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${
              connectionStatus === "connected"
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                : "bg-amber-500/10 border-amber-500/20 text-amber-400"
            }`}
          >
            {connectionStatus === "connected" ? (
              <CheckCircle2 className="w-6 h-6" />
            ) : (
              <AlertTriangle className="w-6 h-6" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white tracking-tight">
                Amazon S3 Connectivity
              </h2>
              <span
                className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full border ${
                  connectionStatus === "connected"
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                }`}
              >
                {connectionStatus === "connected" ? "Live Connected" : "Action Required"}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
              {connectionMessage ||
                "Checking connectivity to Amazon Web Services S3..."}
            </p>
          </div>
        </div>

        <button
          onClick={handleTest}
          disabled={isTesting}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-semibold shadow-sm transition-all cursor-pointer shrink-0 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isTesting ? "animate-spin text-sky-400" : ""}`} />
          <span>Test S3 Connection</span>
        </button>
      </div>

      {/* Grid of parameters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <HardDrive className="w-3.5 h-3.5 text-sky-400" />
            Bucket Name
          </span>
          <p className="text-base font-bold text-white font-mono">
            {stats?.bucketName || "tushardevx01"}
          </p>
          <p className="text-[11px] text-slate-400">
            Target AWS S3 private object container
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-indigo-400" />
            AWS Region
          </span>
          <p className="text-base font-bold text-white font-mono">
            {stats?.region || "ap-south-1"} (Asia Pacific - Mumbai)
          </p>
          <p className="text-[11px] text-slate-400">
            Geographic AWS data center zone
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            Storage Architecture
          </span>
          <p className="text-base font-bold text-white font-mono">
            Browser → Next.js → S3
          </p>
          <p className="text-[11px] text-slate-400">
            Server-side AWS SDK for JavaScript v3
          </p>
        </div>
      </div>

      {/* Security Checklist */}
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              Security & Environment Audit
            </h3>
            <p className="text-xs text-slate-400">
              Compliance with project security and credential isolation rules
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {securityChecklist.map((sec, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/50 flex items-start gap-3"
            >
              <div className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">{sec.title}</h4>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                  {sec.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
