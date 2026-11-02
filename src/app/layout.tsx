import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CloudVault - Cloud File Storage & Management (Amazon S3)",
  description:
    "Enterprise-grade cloud storage and file management system powered by Amazon S3 and Next.js. Academic Cloud Computing demonstration project.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#0b0f17] text-slate-100">
        {children}
      </body>
    </html>
  );
}
