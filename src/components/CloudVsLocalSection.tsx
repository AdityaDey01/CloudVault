"use client";

import React, { useState } from "react";
import {
  HardDrive,
  Cloud,
  CheckCircle2,
  Shield,
  Layers,
  Zap,
  Globe,
  Terminal,
  Server,
  ArrowRight,
  Database,
  Lock,
} from "lucide-react";

export function CloudVsLocalSection() {
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({
    1: true,
    2: true,
    3: true,
  });

  const toggleStep = (stepNumber: number) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [stepNumber]: !prev[stepNumber],
    }));
  };

  const demonstrationSteps = [
    {
      step: 1,
      title: "Upload from Local Computer",
      desc: "User selects a file from their local disk (Fedora, Windows, or Mac) and streams it via HTTP POST.",
    },
    {
      step: 2,
      title: "Storage in Amazon S3 Bucket",
      desc: "Next.js backend receives payload and dispatches PutObjectCommand to private bucket 'tushardevx01' in AWS Mumbai (ap-south-1).",
    },
    {
      step: 3,
      title: "Real-time Verification in CloudVault",
      desc: "Application queries ListObjectsV2 to reflect the new object key, size, category, and timestamp in the dashboard.",
    },
    {
      step: 4,
      title: "Download from Cloud Storage",
      desc: "Browser requests file via secure presigned GET URL with preserved original filename header.",
    },
    {
      step: 5,
      title: "Permanent Deletion from S3",
      desc: "DeleteObjectCommand executes against S3. Metrics and storage counters update immediately.",
    },
    {
      step: 6,
      title: "Cross-Environment Remote Access",
      desc: "Clone this repository on an Ubuntu VirtualBox VM, run 'npm run dev' with identical .env, and observe identical files without copying local disk files.",
    },
    {
      step: 7,
      title: "Architectural Differentiation Defense",
      desc: "Articulate the fundamental shift from local block/POSIX filesystems to distributed, durable cloud object storage.",
    },
  ];

  const comparisonMatrix = [
    {
      attribute: "Core Abstraction",
      local: "Hierarchical Tree: Directories, files, and filesystem inodes (Ext4, NTFS, APFS).",
      cloud: "Flat Object Storage: Bucket + Unique Keys with associated User Metadata (Amazon S3).",
    },
    {
      attribute: "Access Protocol",
      local: "Kernel POSIX system calls (open(), read(), write(), close()) over local SATA/NVMe bus.",
      cloud: "Stateless REST API over HTTPS (GET, PUT, DELETE) & short-lived presigned URLs.",
    },
    {
      attribute: "Durability & Redundancy",
      local: "Single Point of Failure (SPOF): Disk failure, sector corruption, or OS crash causes data loss without manual RAID.",
      cloud: "99.999999999% (11 9's) durability. Objects automatically replicated across at least 3 geographically separated Availability Zones (AZs).",
    },
    {
      attribute: "Capacity & Elasticity",
      local: "Hard limit bound to physical drive partition. Expansion requires repartitioning, LVM, or hardware replacement.",
      cloud: "Virtually infinite on-demand scalability with zero capacity planning or partition management.",
    },
    {
      attribute: "Compute Decoupling",
      local: "Storage is tightly coupled to the host OS. Shutting down the machine prevents any external access.",
      cloud: "Decoupled architecture: Any authorized compute instance (Localhost, VirtualBox, EC2, Lambda) accesses the identical data layer.",
    },
    {
      attribute: "Security & Access Control",
      local: "Local OS file permissions (chmod, chown, POSIX ACLs) tied to local system user IDs.",
      cloud: "Cloud IAM policies, Bucket Policies, fine-grained KMS encryption at rest, and presigned time-limited access tokens.",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Overview Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold mb-4">
            <Layers className="w-3.5 h-3.5" />
            <span>Academic Demonstration Evaluation Guide.</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Local Storage vs. Cloud Object Storage
          </h2>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed">
            CloudVault demonstrates the transition from traditional host-bound block storage to scalable, highly available Amazon S3 cloud storage. The application decouples file persistence from application runtime, ensuring zero data loss across restarts or multi-host deployments.
          </p>
        </div>
      </div>

      {/* 7-Step Academic Demonstration Rubric */}
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Live Academic Demonstration Checklist
              </h3>
              <p className="text-xs text-slate-400">
                Click steps to mark demonstration progress during project viva/evaluation
              </p>
            </div>
          </div>
          <div className="text-xs font-mono text-sky-400 bg-sky-500/10 px-3 py-1 rounded-full border border-sky-500/20">
            {Object.values(completedSteps).filter(Boolean).length} / 7 Completed
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {demonstrationSteps.map((item) => {
            const isDone = Boolean(completedSteps[item.step]);
            return (
              <div
                key={item.step}
                onClick={() => toggleStep(item.step)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                  isDone
                    ? "bg-slate-800/80 border-sky-500/40 shadow-sm"
                    : "bg-slate-900/40 border-slate-800 hover:border-slate-700"
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold font-mono transition-colors ${
                    isDone
                      ? "bg-sky-500 text-white"
                      : "bg-slate-800 text-slate-400 border border-slate-700"
                  }`}
                >
                  {isDone ? "✓" : item.step}
                </div>
                <div className="flex-1 min-w-0">
                  <h4
                    className={`text-xs sm:text-sm font-semibold truncate ${
                      isDone ? "text-white" : "text-slate-300"
                    }`}
                  >
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Comparison Matrix Table */}
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              Technical Comparison Matrix
            </h3>
            <p className="text-xs text-slate-400">
              POSIX Local Disk Filesystems vs. AWS Amazon S3 Object Storage
            </p>
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-800">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/90 text-slate-300 font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-4 sm:px-6 w-1/4">Evaluation Parameter</th>
                <th className="py-3.5 px-4 sm:px-6 w-3/8 text-amber-400 flex items-center gap-1.5">
                  <HardDrive className="w-4 h-4 inline" />
                  Local File Storage
                </th>
                <th className="py-3.5 px-4 sm:px-6 w-3/8 text-sky-400">
                  <Cloud className="w-4 h-4 inline mr-1.5" />
                  Amazon S3 Cloud Storage
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {comparisonMatrix.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3.5 px-4 sm:px-6 font-semibold text-white whitespace-nowrap">
                    {row.attribute}
                  </td>
                  <td className="py-3.5 px-4 sm:px-6 text-slate-400 leading-relaxed">
                    {row.local}
                  </td>
                  <td className="py-3.5 px-4 sm:px-6 text-sky-200/90 leading-relaxed font-medium">
                    {row.cloud}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ubuntu VirtualBox Demonstration Instructions */}
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              Ubuntu VirtualBox Demonstration Instructions
            </h3>
            <p className="text-xs text-slate-400">
              Demonstrating cloud decoupling by accessing the exact same S3 files from a VM
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 font-mono text-xs text-slate-300 space-y-2.5 overflow-x-auto">
          <div className="text-slate-500"># 1. Inside Ubuntu VirtualBox, clone repository</div>
          <div className="text-sky-300 font-bold">git clone https://github.com/tushardevx01/CloudVault.git</div>
          <div className="text-sky-300 font-bold">cd CloudVault</div>
          <div className="text-slate-500 mt-2"># 2. Configure the identical single .env file</div>
          <div className="text-emerald-300">nano .env</div>
          <div className="text-slate-400 pl-4">
            AWS_REGION=ap-south-1<br />
            AWS_ACCESS_KEY_ID=your_access_key_here<br />
            AWS_SECRET_ACCESS_KEY=your_secret_key_here<br />
            AWS_S3_BUCKET_NAME=tushardevx01
          </div>
          <div className="text-slate-500 mt-2"># 3. Install dependencies and start server</div>
          <div className="text-sky-300 font-bold">npm install</div>
          <div className="text-sky-300 font-bold">npm run dev</div>
          <div className="text-slate-500 mt-2"># 4. Open http://localhost:3000 to see all files synced via S3!</div>
        </div>
      </div>
    </div>
  );
}
