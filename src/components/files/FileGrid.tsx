"use client";

import React from "react";
import { Eye, Download, Trash2, Calendar, HardDrive, FileQuestion } from "lucide-react";
import { S3FileItem } from "@/types/file";
import { FileIcon } from "./FileIcon";
import { formatBytes, formatRelativeTime } from "@/lib/utils";

interface FileGridProps {
  files: S3FileItem[];
  isLoading?: boolean;
  onPreview: (file: S3FileItem) => void;
  onDownload: (file: S3FileItem) => void;
  onDelete: (file: S3FileItem) => void;
  onOpenUpload?: () => void;
}

export function FileGrid({
  files,
  isLoading,
  onPreview,
  onDownload,
  onDelete,
  onOpenUpload,
}: FileGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 animate-pulse space-y-4"
          >
            <div className="flex justify-between items-center">
              <div className="w-14 h-4 bg-slate-800 rounded" />
              <div className="w-12 h-4 bg-slate-800 rounded" />
            </div>
            <div className="py-6 flex justify-center">
              <div className="w-14 h-14 bg-slate-800 rounded-2xl" />
            </div>
            <div className="pt-3 border-t border-slate-800 space-y-2">
              <div className="h-3.5 bg-slate-800 rounded w-3/4" />
              <div className="h-3 bg-slate-800 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div className="py-16 px-4 text-center rounded-2xl bg-slate-900/40 border border-slate-800 col-span-full">
        <div className="w-14 h-14 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center mx-auto mb-4 text-slate-400">
          <FileQuestion className="w-7 h-7" />
        </div>
        <h3 className="text-base font-semibold text-white">No files found</h3>
        <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-5">
          Your Amazon S3 bucket does not contain matching files. Upload your first document, image, or media asset to begin.
        </p>
        {onOpenUpload && (
          <button
            onClick={onOpenUpload}
            className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-medium shadow-md shadow-sky-500/20 transition-all cursor-pointer"
          >
            Upload to Amazon S3
          </button>
        )}
      </div>
    );
  }

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
