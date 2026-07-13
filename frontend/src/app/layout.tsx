import type { Metadata } from "next";
import { IBM_Plex_Mono, Public_Sans, Sora } from "next/font/google";

import { AppShell } from "@/components/app-shell";
import { Toaster } from "@/components/ui/sonner";
import { MockStateProvider } from "@/providers/mock-state-provider";

import "./globals.css";

const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: {
    default: "FOSS YOLO MLOps",
    template: "%s · FOSS YOLO",
  },
  description: "A navigable Release 0 mock of a self-hosted MLOps workspace.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${publicSans.variable} ${sora.variable} ${ibmPlexMono.variable}`}
    >
      <body>
        <MockStateProvider>
          <AppShell>{children}</AppShell>
        </MockStateProvider>
        <Toaster richColors position="bottom-right" />
      </body>
    </html>
  );
}
