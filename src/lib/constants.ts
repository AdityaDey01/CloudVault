import { FileCategory } from "@/types/file";

/**
 * Amazon S3 and Application Constants
 */

export const DEFAULT_BUCKET_NAME = "tushardevx01";
export const DEFAULT_AWS_REGION = "ap-south-1";

/**
 * 50MB maximum single file size limit for standard route handler uploads
 */
export const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024;
export const MAX_FILE_SIZE_FORMATTED = "50 MB";

/**
 * Presigned URL lifetime in seconds (15 minutes)
 */
export const PRESIGNED_URL_EXPIRY_SECONDS = 900;

/**
 * S3 Key prefix where all user files reside
 */
export const S3_UPLOAD_PREFIX = "uploads/";

/**
 * Supported File Categories and metadata
 */
export const FILE_CATEGORIES: { id: FileCategory | "all"; label: string }[] = [
  { id: "all", label: "All Files" },
  { id: "image", label: "Images" },
  { id: "document", label: "Documents" },
  { id: "media", label: "Media" },
  { id: "archive", label: "Archives" },
  { id: "code", label: "Code" },
  { id: "other", label: "Others" },
];

/**
 * Navigation views
 */
export type ActiveTab = "dashboard" | "files" | "cloud-concepts" | "system";
