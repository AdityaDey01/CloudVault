"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Search,
  Filter,
  ArrowUpDown,
  LayoutGrid,
  List,
  Upload,
  RefreshCw,
  FolderOpen,
  Cloud,
  FileQuestion,
  AlertCircle,
  Clock,
  Sparkles,
} from "lucide-react";
import { Sidebar, ActiveTab } from "@/components/Sidebar";
import { Navbar } from "@/components/Navbar";
import { StatsCards } from "@/components/StatsCards";
import { StorageBreakdown } from "@/components/StorageBreakdown";
import { FileList } from "@/components/FileList";
import { FileGrid } from "@/components/FileGrid";
import { UploadModal } from "@/components/UploadModal";
import { FilePreviewModal } from "@/components/FilePreviewModal";
import { DeleteConfirmModal } from "@/components/DeleteConfirmModal";
import { CloudVsLocalSection } from "@/components/CloudVsLocalSection";
import { SystemHealthSection } from "@/components/SystemHealthSection";
import { ToastContainer, ToastMessage } from "@/components/Toast";
import { S3FileItem, StorageStats, FileCategory } from "@/types/file";

export default function CloudVaultApp() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Data states
  const [stats, setStats] = useState<StorageStats | null>(null);
  const [files, setFiles] = useState<S3FileItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filters and Sorting
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<FileCategory | "all">("all");
  const [sortBy, setSortBy] = useState<"date" | "name" | "size">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  // Modals state
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState<S3FileItem | null>(null);
  const [deleteTargetFile, setDeleteTargetFile] = useState<S3FileItem | null>(null);

  // S3 Connectivity
  const [connectionStatus, setConnectionStatus] = useState<
    "connected" | "disconnected" | "checking"
  >("checking");
  const [connectionMessage, setConnectionMessage] = useState<string>("");

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback(
    (toast: { type: "success" | "error" | "info"; title: string; message?: string }) => {
      const id = `${Date.now()}-${Math.random()}`;
      setToasts((prev) => [...prev, { id, ...toast }]);
    },
    []
  );

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Fetch Health & Connectivity
  const checkHealth = useCallback(async () => {
    try {
      const res = await fetch("/api/health");
      const data = await res.json();
      if (data.connected) {
        setConnectionStatus("connected");
        setConnectionMessage(data.message || `Connected to Amazon S3 bucket "${data.bucket}"`);
      } else {
        setConnectionStatus("disconnected");
        setConnectionMessage(data.message || "AWS credentials required in .env");
      }
    } catch {
      setConnectionStatus("disconnected");
      setConnectionMessage("Health check failed. Check server logs.");
    }
  }, []);

  // Fetch Stats & Files
  const fetchData = useCallback(async () => {
    try {
      const [statsRes, filesRes] = await Promise.all([
        fetch("/api/stats"),
        fetch("/api/files"),
      ]);

      const statsData = await statsRes.json();
      const filesData = await filesRes.json();

      if (statsData.success && statsData.stats) {
        setStats(statsData.stats);
      }

      if (filesData.success && filesData.files) {
        setFiles(filesData.files);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    checkHealth();
    fetchData();
  }, [checkHealth, fetchData]);

  // Handle Refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([checkHealth(), fetchData()]);
    addToast({
      type: "info",
      title: "Data Synced",
      message: "Refreshed file list and metrics from Amazon S3.",
    });
  };

  // Filtered and Sorted Files
  const processedFiles = useMemo(() => {
    let result = [...files];

    // Search filter
    if (searchTerm.trim()) {
      const lower = searchTerm.toLowerCase().trim();
      result = result.filter(
        (f) =>
          f.originalName.toLowerCase().includes(lower) ||
          f.key.toLowerCase().includes(lower)
      );
    }

    // Category filter
    if (categoryFilter !== "all") {
      result = result.filter((f) => f.category === categoryFilter);
    }

    // Sorting
    result.sort((a, b) => {
      let cmp = 0;
      if (sortBy === "name") {
        cmp = a.originalName.localeCompare(b.originalName);
      } else if (sortBy === "size") {
        cmp = a.size - b.size;
      } else {
        cmp =
          new Date(a.lastModified).getTime() - new Date(b.lastModified).getTime();
      }
      return sortOrder === "asc" ? cmp : -cmp;
    });

    return result;
  }, [files, searchTerm, categoryFilter, sortBy, sortOrder]);

  // File Actions
  const handleDownload = (file: S3FileItem) => {
    // Direct redirect to download endpoint which issues presigned URL with attachment Content-Disposition
    const downloadUrl = `/api/files/download?key=${encodeURIComponent(
      file.key
    )}&name=${encodeURIComponent(file.originalName)}`;
    window.location.href = downloadUrl;

    addToast({
      type: "info",
      title: "Download Initiated",
      message: `Fetching "${file.originalName}" from Amazon S3.`,
    });
  };

  const handleDeleteConfirm = async (file: S3FileItem) => {
    try {
      const res = await fetch(
        `/api/files?key=${encodeURIComponent(file.key)}`,
        { method: "DELETE" }
      );
      const data = await res.json();

      if (res.ok && data.success) {
        addToast({
          type: "success",
          title: "File Deleted",
          message: `"${file.originalName}" was permanently removed from S3.`,
        });
        await fetchData();
      } else {
        addToast({
          type: "error",
          title: "Deletion Failed",
          message: data.error || "Could not delete file from S3.",
        });
      }
    } catch {
      addToast({
        type: "error",
        title: "Network Error",
        message: "Failed to connect to delete endpoint.",
      });
    }
  };

  const categoriesList: { id: FileCategory | "all"; label: string }[] = [
    { id: "all", label: "All Files" },
    { id: "image", label: "Images" },
    { id: "document", label: "Documents" },
    { id: "media", label: "Media" },
    { id: "archive", label: "Archives" },
    { id: "code", label: "Code" },
    { id: "other", label: "Others" },
  ];

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 flex">
      {/* Toast System */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenUpload={() => setIsUploadOpen(true)}
        stats={stats}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        {/* Navbar */}
        <Navbar
          activeTab={activeTab}
          onToggleSidebar={() => setSidebarOpen(true)}
          onOpenUpload={() => setIsUploadOpen(true)}
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          connectionStatus={connectionStatus}
          connectionMessage={connectionMessage}
          region={stats?.region || "ap-south-1"}
        />

        {/* Content View Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full space-y-6">
          {/* Missing Credentials Diagnostic Banner */}
          {connectionStatus === "disconnected" && (
            <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-4 text-amber-200">
              <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="flex-1 text-xs sm:text-sm">
                <p className="font-bold text-amber-100">
                  Amazon S3 Credentials Pending in .env
                </p>
                <p className="text-amber-300/80 mt-1 leading-relaxed">
                  To interact with the live AWS S3 bucket{" "}
                  <code className="bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-500/30 text-amber-200 font-mono">
                    tushardevx01
                  </code>
                  , configure your <code className="font-mono text-amber-100 font-bold">.env</code> file with valid AWS credentials.
                </p>
              </div>
            </div>
          )}

          {/* TAB: DASHBOARD */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              {/* Stat Cards */}
              <StatsCards
                stats={stats}
                isLoading={isLoading}
                onViewFiles={() => setActiveTab("files")}
                onOpenUpload={() => setIsUploadOpen(true)}
                connectionStatus={connectionStatus}
              />

              {/* Storage Category Distribution */}
              <StorageBreakdown
                stats={stats}
                onFilterCategory={(cat) => {
                  setCategoryFilter(cat);
                  setActiveTab("files");
                }}
              />

              {/* Recent Uploads Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-sky-400" />
                    <h2 className="text-base font-bold text-white tracking-tight">
                      Recent Uploads to Amazon S3
                    </h2>
                  </div>
                  {files.length > 5 && (
                    <button
                      onClick={() => setActiveTab("files")}
                      className="text-xs font-semibold text-sky-400 hover:text-sky-300 transition-colors cursor-pointer"
                    >
                      View all {files.length} files →
                    </button>
                  )}
                </div>

                <FileList
                  files={files.slice(0, 5)}
                  isLoading={isLoading}
                  onPreview={(f) => setPreviewFile(f)}
                  onDownload={handleDownload}
                  onDelete={(f) => setDeleteTargetFile(f)}
                  onOpenUpload={() => setIsUploadOpen(true)}
                />
              </div>
            </div>
          )}

          {/* TAB: ALL FILES */}
          {activeTab === "files" && (
            <div className="space-y-4">
              {/* Filter & Search Toolbar */}
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                {/* Search & Actions Row */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search files by name or object key..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-sky-500 transition-colors"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Sort Dropdown */}
                    <div className="flex items-center bg-slate-800/80 border border-slate-700/80 rounded-xl px-2 py-1.5 text-xs">
                      <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 mr-1.5" />
                      <select
                        value={sortBy}
                        onChange={(e) =>
                          setSortBy(e.target.value as "date" | "name" | "size")
                        }
                        className="bg-transparent text-slate-200 focus:outline-none cursor-pointer text-xs"
                      >
                        <option value="date" className="bg-slate-900">
                          Date
                        </option>
                        <option value="name" className="bg-slate-900">
                          Name
                        </option>
                        <option value="size" className="bg-slate-900">
                          Size
                        </option>
                      </select>
                      <button
                        onClick={() =>
                          setSortOrder((prev) =>
                            prev === "asc" ? "desc" : "asc"
                          )
                        }
                        className="ml-1 text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-700 text-slate-300 hover:text-white"
                        title="Toggle sort direction"
                      >
                        {sortOrder.toUpperCase()}
                      </button>
                    </div>

                    {/* View Switch: Table / Grid */}
                    <div className="flex items-center bg-slate-800/80 border border-slate-700/80 rounded-xl p-0.5">
                      <button
                        onClick={() => setViewMode("table")}
                        className={`p-1.5 rounded-lg transition-colors ${
                          viewMode === "table"
                            ? "bg-slate-700 text-white"
                            : "text-slate-400 hover:text-slate-200"
                        }`}
                        title="Table View"
                      >
                        <List className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setViewMode("grid")}
                        className={`p-1.5 rounded-lg transition-colors ${
                          viewMode === "grid"
                            ? "bg-slate-700 text-white"
                            : "text-slate-400 hover:text-slate-200"
                        }`}
                        title="Grid View"
                      >
                        <LayoutGrid className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Category Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1">
                  {categoriesList.map((cat) => {
                    const isSelected = categoryFilter === cat.id;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setCategoryFilter(cat.id)}
                        className={`px-3 py-1 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                          isSelected
                            ? "bg-sky-500 text-white shadow-xs"
                            : "bg-slate-800/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                        }`}
                      >
                        {cat.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Results Summary */}
              <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                <span>
                  Showing {processedFiles.length} of {files.length} file(s)
                </span>
                {(searchTerm || categoryFilter !== "all") && (
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setCategoryFilter("all");
                    }}
                    className="text-sky-400 hover:text-sky-300 transition-colors"
                  >
                    Reset filters
                  </button>
                )}
              </div>

              {/* View Rendering */}
              {viewMode === "table" ? (
                <FileList
                  files={processedFiles}
                  isLoading={isLoading}
                  onPreview={(f) => setPreviewFile(f)}
                  onDownload={handleDownload}
                  onDelete={(f) => setDeleteTargetFile(f)}
                  onOpenUpload={() => setIsUploadOpen(true)}
                />
              ) : (
                <FileGrid
                  files={processedFiles}
                  isLoading={isLoading}
                  onPreview={(f) => setPreviewFile(f)}
                  onDownload={handleDownload}
                  onDelete={(f) => setDeleteTargetFile(f)}
                  onOpenUpload={() => setIsUploadOpen(true)}
                />
              )}
            </div>
          )}

          {/* TAB: ACADEMIC CLOUD CONCEPTS */}
          {activeTab === "cloud-concepts" && <CloudVsLocalSection />}

          {/* TAB: SYSTEM & S3 HEALTH */}
          {activeTab === "system" && (
            <SystemHealthSection
              stats={stats}
              connectionStatus={connectionStatus}
              connectionMessage={connectionMessage}
              onCheckHealth={async () => {
                await checkHealth();
                await fetchData();
              }}
            />
          )}
        </main>
      </div>

      {/* Upload Modal */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUploadSuccess={fetchData}
        onAddToast={addToast}
      />

      {/* File Preview Modal */}
      <FilePreviewModal
        file={previewFile}
        isOpen={Boolean(previewFile)}
        onClose={() => setPreviewFile(null)}
        onDownload={handleDownload}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        file={deleteTargetFile}
        isOpen={Boolean(deleteTargetFile)}
        onClose={() => setDeleteTargetFile(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
