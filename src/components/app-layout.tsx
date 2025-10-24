"use client";

import { cn } from "@/lib/utils";
import { Header } from "@/components/header";
import {
  FullscreenProvider,
  useFullscreenContext,
} from "@/context/fullscreen-context";

function MainLayout({ children }: { children: React.ReactNode }) {
  const { isFullscreen } = useFullscreenContext();

  return (
    <div
      className={cn(
        "relative mx-auto flex min-h-screen flex-col bg-background shadow-2xl",
        !isFullscreen && "max-w-md border-x border-neutral-700"
      )}
    >
      {!isFullscreen && <Header />}
      <main className="flex-1">{children}</main>
    </div>
  );
}

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <FullscreenProvider>
      <MainLayout>{children}</MainLayout>
    </FullscreenProvider>
  );
}
