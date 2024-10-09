import type { Metadata } from "next";
import "./globals.css";
import {ThemeProvider} from "@/components/theme-provider";
import {ReactNode} from "react";

export const metadata: Metadata = {
  title: "Font fixer",
  description: "App to fix fonts line height by Aleksandar",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
      <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
      >
          {children}
      </ThemeProvider>
      </body>
    </html>
  );
}
