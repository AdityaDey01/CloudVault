import { NextResponse } from "next/server";
import { listS3Files, getS3ConfigStatus, getBucketName } from "@/lib/s3";
import { formatBytes } from "@/lib/utils";
import { FileCategory, StorageStats } from "@/types/file";

export async function GET() {
  const config = getS3ConfigStatus();
  const bucketName = getBucketName();
  const region = config.region;

  if (!config.isValid) {
    const emptyCategories: StorageStats["categories"] = {
      image: { count: 0, sizeBytes: 0, sizeFormatted: "0 B", percentage: 0 },
      document: { count: 0, sizeBytes: 0, sizeFormatted: "0 B", percentage: 0 },
      media: { count: 0, sizeBytes: 0, sizeFormatted: "0 B", percentage: 0 },
      archive: { count: 0, sizeBytes: 0, sizeFormatted: "0 B", percentage: 0 },
      code: { count: 0, sizeBytes: 0, sizeFormatted: "0 B", percentage: 0 },
      other: { count: 0, sizeBytes: 0, sizeFormatted: "0 B", percentage: 0 },
    };

    return NextResponse.json({
      success: false,
      configured: false,
      error: config.errorMessage,
      stats: {
        totalFiles: 0,
        totalSizeBytes: 0,
        totalSizeFormatted: "0 B",
        categories: emptyCategories,
        recentUploads: [],
        bucketName,
        region,
        storageHealth: config.missingVariables.length > 0 ? "credentials_missing" : "misconfigured",
      },
    });
  }

  try {
    const files = await listS3Files();

    let totalSizeBytes = 0;
    const catMap: Record<FileCategory, { count: number; sizeBytes: number }> = {
      image: { count: 0, sizeBytes: 0 },
      document: { count: 0, sizeBytes: 0 },
      media: { count: 0, sizeBytes: 0 },
      archive: { count: 0, sizeBytes: 0 },
      code: { count: 0, sizeBytes: 0 },
      other: { count: 0, sizeBytes: 0 },
    };

    for (const f of files) {
      totalSizeBytes += f.size;
      const cat = f.category || "other";
      if (!catMap[cat]) {
        catMap[cat] = { count: 0, sizeBytes: 0 };
      }
      catMap[cat].count += 1;
      catMap[cat].sizeBytes += f.size;
    }

    const categories = Object.fromEntries(
      (Object.keys(catMap) as FileCategory[]).map((cat) => {
        const item = catMap[cat];
        const percentage =
          totalSizeBytes > 0
            ? Math.round((item.sizeBytes / totalSizeBytes) * 100)
            : 0;
        return [
          cat,
          {
            count: item.count,
            sizeBytes: item.sizeBytes,
            sizeFormatted: formatBytes(item.sizeBytes),
            percentage,
          },
        ];
      })
    ) as StorageStats["categories"];

    const recentUploads = files.slice(0, 5);

    const stats: StorageStats = {
      totalFiles: files.length,
      totalSizeBytes,
      totalSizeFormatted: formatBytes(totalSizeBytes),
      categories,
      recentUploads,
      bucketName,
      region,
      storageHealth: "connected",
    };

    return NextResponse.json({
      success: true,
      stats,
    });
  } catch (error: unknown) {
    const err = error as { message?: string };
    console.error("Error generating stats:", err);

    return NextResponse.json(
      {
        success: false,
        error: err.message || "Failed to calculate storage statistics.",
      },
      { status: 500 }
    );
  }
}
