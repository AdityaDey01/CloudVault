"use client";

import React from "react";
import { Eye, Download, Trash2, Copy, Check, FileQuestion } from "lucide-react";
import { S3FileItem } from "@/types/file";
import { FileIcon } from "./FileIcon";
import { formatBytes, formatDate, formatRelativeTime } from "@/lib/utils";

interface FileListProps {
  files: S3FileItem[];
  onPreview: (file: S3FileItem) => void;
  onDownload: (file: S3FileItem) => void;
  onDelete: (file: S3FileItem) => void;
  onOpenUpload: () => void;
}

export function FileList({
  files,
  onPreview,
  onDownload,
  onDelete,
  onOpenUpload,
}: FileListProps) {
  const [copiedKey, setCopiedKey] = React.useState<string | null>(null);

  const handleCopyKey = (key: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  if (files.length === 0) {
    return (
      <div className="py-16 px-4 text-center rounded-2xl bg-slate-900/40 border border-slate-800">
        <div className="w-14 h-14 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center mx-auto mb-4 text-slate-400">
          <FileQuestion className="w-7 h-7" />
        </div>
        <h3 className="text-base font-semibold text-white">No files found</h3>
        <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-5">
          Your Amazon S3 bucket does not contain matching files. Upload your first document, image, or media asset to begin.
        </p>
        <button
          onClick={onOpenUpload}
          className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-medium shadow-md shadow-sky-500/20 transition-all cursor-pointer"
        >
          Upload to Amazon S3
        </button>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60 shadow-xs">
      <table className="w-full text-left text-xs border-collapse">
        <thead>
          <tr className="border-b border-slate-800 bg-slate-900/80 text-slate-400 font-semibold uppercase tracking-wider">
            <th className="py-3.5 px-4 sm:px-6">Name</th>
            <th className="py-3.5 px-4">Size</th>
            <th className="py-3.5 px-4 hidden md:table-cell">Type</th>
            <th className="py-3.5 px-4 hidden lg:table-cell">Uploaded</th>
            <th className="py-3.5 px-4 hidden xl:table-cell">S3 Object Key</th>
            <th className="py-3.5 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60 text-slate-300">
          {files.map((file) => {
            const isPreviewable =
              file.category === "image" ||
              file.originalName.toLowerCase().endsWith(".pdf") ||
              file.category === "code";

            return (
              <tr
                key={file.key}
                onClick={() => onPreview(file)}
                className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
              >
                {/* Filename & Icon */}
                <td className="py-3 px-4 sm:px-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-slate-800 border border-slate-700/60 shrink-0">
                      <FileIcon
                        category={file.category}
                        mimeType={file.contentType}
                        className="w-4 h-4"
                      />
                    </div>
                    <div className="min-w-0 max-w-xs sm:max-w-sm md:max-w-md">
                      <p className="font-medium text-white truncate group-hover:text-sky-300 transition-colors">
                        {file.originalName}
                      </p>
                      <p className="text-[11px] text-slate-400 lg:hidden">
                        {formatRelativeTime(file.lastModified)}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Size */}
                <td className="py-3 px-4 font-mono text-slate-300 whitespace-nowrap">
                  {formatBytes(file.size)}
                </td>

                {/* Category / MIME */}
                <td className="py-3 px-4 hidden md:table-cell whitespace-nowrap">
                  <span className="capitalize px-2 py-0.5 rounded text-[11px] font-medium bg-slate-800 text-slate-300 border border-slate-700/60">
                    {file.category}
                  </span>
                </td>

                {/* Upload Date */}
                <td className="py-3 px-4 hidden lg:table-cell text-slate-400 whitespace-nowrap">
                  <span title={formatDate(file.lastModified)}>
                    {formatRelativeTime(file.lastModified)}
                  </span>
                </td>

                {/* S3 Object Key */}
                <td className="py-3 px-4 hidden xl:table-cell max-w-xs truncate text-[11px] font-mono text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <span className="truncate" title={file.key}>
                      {file.key}
                    </span>
                    <button
                      onClick={(e) => handleCopyKey(file.key, e)}
                      className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white shrink-0"
                      title="Copy S3 Key"
                    >
                      {copiedKey === file.key ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </td>

                {/* Action Buttons */}
                <td className="py-3 px-4 text-right whitespace-nowrap">
                  <div
                    className="flex items-center justify-end gap-1.5"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Preview Button */}
                    <button
                      onClick={() => onPreview(file)}
                      disabled={!isPreviewable}
                      className={`p-2 rounded-lg border transition-colors ${
                        isPreviewable
                          ? "border-slate-700/80 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white"
                          : "border-transparent text-slate-600 cursor-not-allowed"
                      }`}
                      title={isPreviewable ? "Preview file" : "Preview not supported"}
                      aria-label="Preview file"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>

                    {/* Download Button */}
                    <button
                      onClick={() => onDownload(file)}
                      className="p-2 rounded-lg border border-slate-700/80 bg-slate-800/80 hover:bg-sky-500/20 hover:border-sky-500/40 text-slate-300 hover:text-sky-300 transition-colors"
                      title="Download from Amazon S3"
                      aria-label="Download file"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>

                    {/* Delete Button */}
                    <button
                      onClick={() => onDelete(file)}
                      className="p-2 rounded-lg border border-slate-700/80 bg-slate-800/80 hover:bg-rose-500/20 hover:border-rose-500/40 text-slate-300 hover:text-rose-300 transition-colors"
                      title="Delete from Amazon S3"
                      aria-label="Delete file"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
