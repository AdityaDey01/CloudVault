import React from "react";
import {
  FileText,
  FileImage,
  Film,
  Music,
  Archive,
  Code,
  FileCode,
  FileQuestion,
  LucideProps,
} from "lucide-react";
import { FileCategory } from "@/types/file";

interface FileIconProps extends LucideProps {
  category: FileCategory;
  mimeType?: string;
  className?: string;
}

export function FileIcon({ category, mimeType, className = "w-5 h-5", ...props }: FileIconProps) {
  if (category === "image") {
    return <FileImage className={`${className} text-emerald-400`} {...props} />;
  }

  if (category === "document") {
    return <FileText className={`${className} text-sky-400`} {...props} />;
  }

  if (category === "media") {
    if (mimeType?.startsWith("audio/")) {
      return <Music className={`${className} text-amber-400`} {...props} />;
    }
    return <Film className={`${className} text-purple-400`} {...props} />;
  }

  if (category === "archive") {
    return <Archive className={`${className} text-orange-400`} {...props} />;
  }

  if (category === "code") {
    return <FileCode className={`${className} text-indigo-400`} {...props} />;
  }

  return <FileQuestion className={`${className} text-slate-400`} {...props} />;
}
