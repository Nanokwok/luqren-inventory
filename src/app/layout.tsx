import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Glasses Inventory",
  description: "High-speed data entry system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased text-foreground bg-background">
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}