import { NextRequest, NextResponse } from "next/server";
import { getPresignedFileUrl, extractOriginalName, getS3ConfigStatus } from "@/lib/s3";
import { getFileCategory } from "@/lib/utils";

export async function GET(request: NextRequest) {
  const config = getS3ConfigStatus();
  if (!config.isValid) {
    return NextResponse.json(
      { success: false, error: config.errorMessage },
      { status: 503 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get("key");
    const nameParam = searchParams.get("name");

    if (!key) {
      return NextResponse.json(
        { success: false, error: "Missing required query parameter: key" },
        { status: 400 }
      );
    }

    if (!key.startsWith("uploads/") || key.includes("..")) {
      return NextResponse.json(
        { success: false, error: "Invalid object key." },
        { status: 400 }
      );
    }

    const filename = nameParam || extractOriginalName(key);
    const category = getFileCategory(filename);

    // Presigned inline preview URL valid for 15 minutes
    const previewUrl = await getPresignedFileUrl(key, "inline", filename, 900);

    return NextResponse.json({
      success: true,
      key,
      filename,
      previewUrl,
      category,
    });
  } catch (error: unknown) {
    const err = error as { message?: string };
    console.error("Error generating preview URL:", err);
    return NextResponse.json(
      {
        success: false,
        error: err.message || "Failed to generate preview URL.",
      },
      { status: 500 }
    );
  }
}
