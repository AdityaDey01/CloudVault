"use client";

import React from "react";
import { Eye, Download, Trash2, Calendar, HardDrive } from "lucide-react";
import { S3FileItem } from "@/types/file";
import { FileIcon } from "./FileIcon";
import { formatBytes, formatRelativeTime } from "@/lib/utils";

interface FileGridProps {
  files: S3FileItem[];
  onPreview: (file: S3FileItem) => void;
  onDownload: (file: S3FileItem) => void;
  onDelete: (file: S3FileItem) => void;
}

export function FileGrid({
  files,
  onPreview,
  onDownload,
  onDelete,
}: FileGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {files.map((file) => {
        const isPreviewable =
          file.category === "image" ||
          file.originalName.toLowerCase().endsWith(".pdf") ||
          file.category === "code";

        return (
          <div
            key={file.key}
            onClick={() => onPreview(file)}
            className="group p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700/80 hover:shadow-lg transition-all flex flex-col justify-between cursor-pointer"
          >
            {/* Top row: Category badge & Actions */}
            <div className="flex items-center justify-between mb-3">
              <span className="capitalize px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700/60">
                {file.category}
              </span>
              <div
                className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity"
                onClick={(e) => e.stopPropagation()}
              >
                {isPreviewable && (
                  <button
                    onClick={() => onPreview(file)}
                    className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
                    title="Preview"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  onClick={() => onDownload(file)}
                  className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-sky-300"
                  title="Download"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onDelete(file)}
                  className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-rose-400"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Center: Large Icon */}
            <div className="py-6 flex flex-col items-center justify-center">
              <div className="w-14 h-14 rounded-2xl bg-slate-800/80 border border-slate-700/50 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
                <FileIcon
                  category={file.category}
                  mimeType={file.contentType}
                  className="w-7 h-7"
                />
              </div>
            </div>

            {/* Bottom: Name & Meta */}
            <div className="mt-2 pt-3 border-t border-slate-800/80">
              <p
                className="text-xs font-semibold text-white truncate group-hover:text-sky-300 transition-colors"
                title={file.originalName}
              >
                {file.originalName}
              </p>
              <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1 font-mono">
                  <HardDrive className="w-3 h-3 text-slate-400" />
                  {formatBytes(file.size)}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  {formatRelativeTime(file.lastModified)}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
