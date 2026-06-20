import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import NextAuthProvider from "@/providers/NextAuthProvider";
import ThemeProvider from "@/providers/ThemeProvider";

const openSans = Open_Sans({ weight: ['300', '400', '600', '700'], subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "TN Schools AI Smart Learning Ecosystem",
  description:
    "State-wide digital learning, governance, and student success platform for Tamil Nadu Government Schools (Class 6–12).",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={openSans.className}>
        <ThemeProvider>
          <NextAuthProvider>{children}</NextAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

