"use client";

import { useSearchParams } from "next/navigation";
import { AnalyzeSidebar } from "@/components/analyze/AnalyzeSidebar";
import { parsePlatform, platformLabel, platformProfileUrl } from "@/lib/chess-provider";
import { Crown, ExternalLink } from "lucide-react";
import Link from "next/link";

export function AnalyzeLayoutInner({
  username,
  children,
}: {
  username: string;
  children: React.ReactNode;
}) {
  const searchParams = useSearchParams();
  const platform = parsePlatform(searchParams.get("platform"));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-muted">
            <Crown className="h-5 w-5 text-accent" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold">{decodeURIComponent(username)}</h1>
              <span className="inline-flex items-center rounded-full bg-card border border-border px-2 py-0.5 text-xs text-muted">
                {platformLabel(platform)}
              </span>
            </div>
            <Link
              href={platformProfileUrl(platform, username)}
              target="_blank"
              className="flex items-center gap-1 text-xs text-muted hover:text-accent transition-colors"
            >
              View on {platformLabel(platform)} <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6 md:flex-row">
        <AnalyzeSidebar username={username} platform={platform} />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
