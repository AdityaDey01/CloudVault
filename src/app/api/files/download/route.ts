import { NextRequest, NextResponse } from "next/server";
import { getPresignedFileUrl, extractOriginalName, getS3ConfigStatus, getS3ObjectStream } from "@/lib/s3";

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
    const stream = searchParams.get("stream") === "true";
    const json = searchParams.get("json") === "true";

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

    if (stream) {
      const s3Response = await getS3ObjectStream(key);
      const headers = new Headers();
      headers.set("Content-Type", s3Response.ContentType || "application/octet-stream");
      headers.set(
        "Content-Disposition",
        `attachment; filename="${encodeURIComponent(filename)}"`
      );
      if (s3Response.ContentLength) {
        headers.set("Content-Length", s3Response.ContentLength.toString());
      }

      // Convert readable stream to web stream
      const streamBody = s3Response.Body as unknown as ReadableStream;
      return new NextResponse(streamBody, {
        status: 200,
        headers,
      });
    }

    // Presigned download URL valid for 15 minutes
    const downloadUrl = await getPresignedFileUrl(key, "attachment", filename, 900);

    if (json) {
      return NextResponse.json({
        success: true,
        downloadUrl,
        filename,
      });
    }

    // Redirect browser directly to presigned URL
    return NextResponse.redirect(downloadUrl, 307);
  } catch (error: unknown) {
    const err = error as { message?: string };
    console.error("Error generating download URL:", err);
    return NextResponse.json(
      {
        success: false,
        error: err.message || "Failed to generate download URL.",
      },
      { status: 500 }
    );
  }
}
