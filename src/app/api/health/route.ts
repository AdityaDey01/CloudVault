import { NextResponse } from "next/server";
import { getS3ConfigStatus, testS3Connectivity } from "@/lib/s3";

export async function GET() {
  const config = getS3ConfigStatus();

  if (!config.isValid) {
    return NextResponse.json({
      success: false,
      configured: false,
      connected: false,
      missingVariables: config.missingVariables,
      bucket: config.bucketName,
      region: config.region,
      message: config.errorMessage,
    });
  }

  const connectivity = await testS3Connectivity();

  return NextResponse.json({
    success: connectivity.connected,
    configured: true,
    connected: connectivity.connected,
    bucket: connectivity.bucket,
    region: connectivity.region,
    message: connectivity.message,
  });
}
