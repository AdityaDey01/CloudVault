"use client";

import React, { useState, useRef } from "react";
import {
  UploadCloud,
  X,
  File,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Trash2,
  Cloud,
} from "lucide-react";
import { formatBytes } from "@/lib/utils";
import { FileIcon } from "./FileIcon";
import { getFileCategory } from "@/lib/utils";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: () => void;
  onAddToast: (toast: {
    type: "success" | "error" | "info";
    title: string;
    message?: string;
  }) => void;
}

interface QueuedFile {
  id: string;
  file: File;
  status: "idle" | "uploading" | "success" | "error";
  errorMessage?: string;
}

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export function UploadModal({
  isOpen,
  onClose,
  onUploadSuccess,
  onAddToast,
}: UploadModalProps) {
  const [dragActive, setDragActive] = useState(false);
  const [queue, setQueue] = useState<QueuedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const newItems: QueuedFile[] = [];

    Array.from(files).forEach((file) => {
      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        onAddToast({
          type: "error",
          title: "File Exceeds Limit",
          message: `${file.name} is larger than the 50MB limit.`,
        });
        return;
      }

      if (file.size === 0) {
        onAddToast({
          type: "error",
          title: "Empty File",
          message: `${file.name} is empty and cannot be uploaded.`,
        });
        return;
      }

      newItems.push({
        id: `${file.name}-${file.lastModified}-${Math.random()}`,
        file,
        status: "idle",
      });
    });

    setQueue((prev) => [...prev, ...newItems]);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const removeQueuedFile = (id: string) => {
    if (isUploading) return;
    setQueue((prev) => prev.filter((item) => item.id !== id));
  };

  const clearQueue = () => {
    if (isUploading) return;
    setQueue([]);
  };

  const startUpload = async () => {
    const pendingFiles = queue.filter((item) => item.status === "idle");
    if (pendingFiles.length === 0) return;

    setIsUploading(true);

    let successCount = 0;
    let failCount = 0;

    // Upload files sequentially or batch
    const formData = new FormData();
    pendingFiles.forEach((item) => {
      formData.append("files", item.file);
    });

    // Mark as uploading
    setQueue((prev) =>
      prev.map((item) =>
        item.status === "idle" ? { ...item, status: "uploading" } : item
      )
    );

    try {
      const response = await fetch("/api/files/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok && result.success) {
        successCount = result.uploaded?.length || pendingFiles.length;
        setQueue((prev) =>
          prev.map((item) => ({ ...item, status: "success" }))
        );
        onAddToast({
          type: "success",
          title: "Upload Completed",
          message: `Successfully uploaded ${successCount} file(s) to Amazon S3.`,
        });
        onUploadSuccess();
        setTimeout(() => {
          onClose();
          setQueue([]);
        }, 1200);
      } else {
        failCount = pendingFiles.length;
        setQueue((prev) =>
          prev.map((item) => ({
            ...item,
            status: "error",
            errorMessage: result.error || "Upload failed.",
          }))
        );
        onAddToast({
          type: "error",
          title: "Upload Error",
          message: result.error || "Could not complete upload to S3.",
        });
      }
    } catch (err: unknown) {
      const error = err as { message?: string };
      setQueue((prev) =>
        prev.map((item) => ({
          ...item,
          status: "error",
          errorMessage: error.message || "Network error.",
        }))
      );
      onAddToast({
        type: "error",
        title: "Network Error",
        message: "Failed to connect to upload endpoint.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const totalQueuedBytes = queue.reduce((acc, curr) => acc + curr.file.size, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
              <Cloud className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Upload to Amazon S3
              </h2>
              <p className="text-xs text-slate-400">
                Target Bucket: <span className="text-slate-200 font-mono">tushardevx01</span> (ap-south-1)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isUploading}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors disabled:opacity-40"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {/* Dropzone */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center ${
              dragActive
                ? "border-sky-400 bg-sky-500/10 scale-[0.99]"
                : "border-slate-700/80 hover:border-slate-600 bg-slate-800/30 hover:bg-slate-800/50"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={(e) => handleFiles(e.target.files)}
              className="hidden"
            />
            <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 mb-3">
              <UploadCloud className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-white">
              Drag and drop files here, or{" "}
              <span className="text-sky-400 underline underline-offset-2">
                browse
              </span>
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Supports multiple files up to 50MB each. Stored directly in S3.
            </p>
          </div>

          {/* Queue List */}
          {queue.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                <span>
                  Files to upload: {queue.length} ({formatBytes(totalQueuedBytes)})
                </span>
                {!isUploading && (
                  <button
                    onClick={clearQueue}
                    className="text-rose-400 hover:text-rose-300 transition-colors"
                  >
                    Clear all
                  </button>
                )}
              </div>

              <div className="max-h-52 overflow-y-auto space-y-2 pr-1">
                {queue.map((item) => {
                  const category = getFileCategory(item.file.name, item.file.type);
                  return (
                    <div
                      key={item.id}
                      className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <FileIcon
                          category={category}
                          mimeType={item.file.type}
                          className="w-4 h-4 shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-white truncate">
                            {item.file.name}
                          </p>
                          <p className="text-[11px] text-slate-400 font-mono">
                            {formatBytes(item.file.size)}
                          </p>
                        </div>
                      </div>

                      {/* Status indicator */}
                      <div className="flex items-center gap-2 shrink-0">
                        {item.status === "uploading" && (
                          <span className="flex items-center gap-1 text-sky-400">
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Uploading...</span>
                          </span>
                        )}
                        {item.status === "success" && (
                          <span className="flex items-center gap-1 text-emerald-400">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Uploaded</span>
                          </span>
                        )}
                        {item.status === "error" && (
                          <span
                            className="flex items-center gap-1 text-rose-400"
                            title={item.errorMessage}
                          >
                            <AlertCircle className="w-4 h-4" />
                            <span>Failed</span>
                          </span>
                        )}
                        {item.status === "idle" && !isUploading && (
                          <button
                            onClick={() => removeQueuedFile(item.id)}
                            className="p-1 rounded text-slate-400 hover:text-rose-400 transition-colors"
                            aria-label="Remove file"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/80 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isUploading}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={startUpload}
            disabled={isUploading || queue.length === 0}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 disabled:bg-slate-800 disabled:text-slate-500 text-white text-xs font-semibold shadow-md shadow-sky-500/20 transition-all cursor-pointer disabled:cursor-not-allowed"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Uploading to S3...</span>
              </>
            ) : (
              <>
                <UploadCloud className="w-4 h-4" />
                <span>Upload {queue.length > 0 ? `(${queue.length})` : ""}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
