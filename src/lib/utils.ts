import { FileCategory } from "@/types/file";

/**
 * Format bytes into human readable format (B, KB, MB, GB, TB)
 */
export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return "0 B";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["B", "KB", "MB", "GB", "TB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

/**
 * Detect file category based on extension or mime type
 */
export function getFileCategory(filename: string, mimeType?: string): FileCategory {
  const extension = filename.split(".").pop()?.toLowerCase() || "";

  if (
    mimeType?.startsWith("image/") ||
    ["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp", "ico", "tiff"].includes(extension)
  ) {
    return "image";
  }

  if (
    mimeType?.includes("pdf") ||
    mimeType?.includes("word") ||
    mimeType?.includes("document") ||
    mimeType?.includes("sheet") ||
    mimeType?.includes("presentation") ||
    mimeType?.includes("text/plain") ||
    ["pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "txt", "rtf", "csv", "md"].includes(extension)
  ) {
    return "document";
  }

  if (
    mimeType?.startsWith("video/") ||
    mimeType?.startsWith("audio/") ||
    ["mp4", "webm", "mkv", "avi", "mov", "mp3", "wav", "ogg", "flac", "aac", "m4a"].includes(extension)
  ) {
    return "media";
  }

  if (
    mimeType?.includes("zip") ||
    mimeType?.includes("compressed") ||
    mimeType?.includes("tar") ||
    ["zip", "rar", "7z", "tar", "gz", "bz2", "xz"].includes(extension)
  ) {
    return "archive";
  }

  if (
    ["json", "xml", "html", "css", "js", "ts", "jsx", "tsx", "py", "java", "c", "cpp", "go", "rs", "sql", "sh", "yaml", "yml"].includes(extension)
  ) {
    return "code";
  }

  return "other";
}

/**
 * Sanitize filename to prevent directory traversal and illegal characters
 */
export function sanitizeFileName(name: string): string {
  // Strip paths
  const baseName = name.replace(/^.*[\\/]/, "");
  // Replace illegal characters with underscore, keeping letters, numbers, dots, dashes, underscores
  return baseName.replace(/[^a-zA-Z0-9._-]/g, "_");
}

/**
 * Format date into readable string with time
 */
export function formatDate(dateString: string | Date): string {
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return "Unknown date";
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(d);
  } catch {
    return "Unknown date";
  }
}

/**
 * Format relative time (e.g. "5 minutes ago", "yesterday")
 */
export function formatRelativeTime(dateString: string | Date): string {
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return "";
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffSecs = Math.floor(diffMs / 1000);

    if (diffSecs < 60) return "Just now";
    const diffMins = Math.floor(diffSecs / 60);
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 30) return `${diffDays}d ago`;
    return formatDate(d);
  } catch {
    return "";
  }
}
