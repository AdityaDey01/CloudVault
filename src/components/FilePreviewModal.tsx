"use client";

import React, { useEffect, useState } from "react";
import {
  X,
  Download,
  Calendar,
  HardDrive,
  FileCode,
  ExternalLink,
  Loader2,
  Copy,
  Check,
  ShieldCheck,
} from "lucide-react";
import { S3FileItem } from "@/types/file";
import { FileIcon } from "./FileIcon";
import { formatBytes, formatDate } from "@/lib/utils";

interface FilePreviewModalProps {
  file: S3FileItem | null;
  isOpen: boolean;
  onClose: () => void;
  onDownload: (file: S3FileItem) => void;
}

export function FilePreviewModal({
  file,
  isOpen,
  onClose,
  onDownload,
}: FilePreviewModalProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);

  useEffect(() => {
    if (!isOpen || !file) {
      setPreviewUrl(null);
      setPreviewError(null);
      return;
    }

    const isPreviewable =
      file.category === "image" ||
      file.originalName.toLowerCase().endsWith(".pdf") ||
      file.category === "code";

    if (!isPreviewable) {
      return;
    }

    let isMounted = true;
    setIsLoadingPreview(true);
    setPreviewError(null);

    // Fetch presigned preview URL from API
    fetch(
      `/api/files/preview?key=${encodeURIComponent(file.key)}&name=${encodeURIComponent(file.originalName)}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (isMounted) {
          if (data.success && data.previewUrl) {
            setPreviewUrl(data.previewUrl);
          } else {
            setPreviewError(data.error || "Unable to generate preview.");
          }
        }
      })
      .catch((err) => {
        if (isMounted) {
          setPreviewError(err.message || "Failed to load preview.");
        }
      })
      .finally(() => {
        if (isMounted) setIsLoadingPreview(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, file]);

  if (!isOpen || !file) return null;

  const isImage = file.category === "image";
  const isPdf = file.originalName.toLowerCase().endsWith(".pdf");

  const copyKeyToClipboard = () => {
    navigator.clipboard.writeText(file.key);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0 pr-4">
            <div className="p-2 rounded-xl bg-slate-800 border border-slate-700/60 shrink-0">
              <FileIcon
                category={file.category}
                mimeType={file.contentType}
                className="w-5 h-5"
              />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm sm:text-base font-bold text-white truncate">
                {file.originalName}
              </h2>
              <p className="text-xs text-slate-400 flex items-center gap-2">
                <span>{formatBytes(file.size)}</span>
                <span>•</span>
                <span className="capitalize">{file.category}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onDownload(file)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-semibold shadow-md shadow-sky-500/20 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Preview Area */}
        <div className="p-6 overflow-y-auto flex-1 flex flex-col items-center justify-center bg-slate-950/60 min-h-[260px] max-h-[500px]">
          {isLoadingPreview ? (
            <div className="flex flex-col items-center gap-3 py-12 text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin text-sky-400" />
              <p className="text-xs">Generating secure preview from Amazon S3...</p>
            </div>
          ) : previewError ? (
            <div className="text-center py-10 px-4">
              <p className="text-rose-400 text-xs mb-2">{previewError}</p>
              <p className="text-slate-400 text-xs">
                You can still download the original file directly below.
              </p>
            </div>
          ) : isImage && previewUrl ? (
            <div className="relative max-h-full max-w-full flex items-center justify-center p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrl}
                alt={file.originalName}
                className="max-h-[380px] max-w-full object-contain rounded-xl shadow-lg border border-slate-800"
              />
            </div>
          ) : isPdf && previewUrl ? (
            <div className="w-full h-[400px] rounded-xl overflow-hidden border border-slate-800">
              <iframe
                src={`${previewUrl}#toolbar=0`}
                className="w-full h-full bg-slate-900"
                title={`Preview ${file.originalName}`}
              />
            </div>
          ) : (
            <div className="text-center py-12 px-4 max-w-md">
              <div className="w-16 h-16 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center mx-auto mb-3 text-slate-400">
                <FileIcon
                  category={file.category}
                  mimeType={file.contentType}
                  className="w-8 h-8"
                />
              </div>
              <p className="text-sm font-semibold text-white">
                Inline preview not available for this format
              </p>
              <p className="text-xs text-slate-400 mt-1 mb-4">
                This file is securely stored in Amazon S3. Download the original object to view it on your machine.
              </p>
              <button
                onClick={() => onDownload(file)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-medium transition-all"
              >
                <Download className="w-4 h-4 text-sky-400" />
                <span>Download Original ({formatBytes(file.size)})</span>
              </button>
            </div>
          )}
        </div>

        {/* Metadata Details Drawer */}
        <div className="p-6 border-t border-slate-800 bg-slate-900/90 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase tracking-wider">
            <span>S3 Object Details</span>
            <span className="flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Encrypted at Rest</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
              <span className="text-slate-400 text-[11px] block mb-1">
                S3 Object Key
              </span>
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-slate-200 truncate" title={file.key}>
                  {file.key}
                </span>
                <button
                  onClick={copyKeyToClipboard}
                  className="p-1 rounded text-slate-400 hover:text-white shrink-0"
                  title="Copy Key"
                >
                  {copiedKey ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
              <span className="text-slate-400 text-[11px] block mb-1">
                MIME Content-Type
              </span>
              <span className="font-mono text-slate-200">
                {file.contentType || "application/octet-stream"}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
              <span className="text-slate-400 text-[11px] block mb-1">
                Uploaded Timestamp
              </span>
              <span className="font-mono text-slate-200">
                {formatDate(file.lastModified)}
              </span>
            </div>

            {file.eTag && (
              <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
                <span className="text-slate-400 text-[11px] block mb-1">
                  ETag / Checksum
                </span>
                <span className="font-mono text-slate-200 truncate block">
                  {file.eTag}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
