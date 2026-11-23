import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { restaurant } from "../lib/restaurant";
import "./globals.css";

export const metadata: Metadata = {
  title: restaurant.copy.pt.title,
  description: restaurant.copy.pt.description,
};

export const viewport: Viewport = {
  themeColor: "#f8f5ee",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-PT" data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}
