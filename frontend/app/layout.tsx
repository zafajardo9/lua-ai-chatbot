import type { Metadata } from "next";
import { ReactNode } from "react";
import { LuaChatWidget } from "@/components/luapop-widget";
import "./globals.css";

export const metadata: Metadata = {
  title: "Automation Sales",
  description: "Talk to our Lua-powered sales assistant.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <LuaChatWidget />
      </body>
    </html>
  );
}
