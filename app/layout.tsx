import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers/providers";

export const metadata: Metadata = {
  title: "School Management System",
  description: "AI powered School Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="">
        <div className="flex h-screen">
          <div className="flex-1 min-w-0 relative">
            <div className="absolute inset-0">
              <Providers>{children}</Providers>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
