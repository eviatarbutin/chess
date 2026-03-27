"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { SaveGameButton } from "@/components/analyze/SaveGameButton";
import type { ChessGame as LichessGame } from "@/lib/chess-provider";
import type { Platform } from "@/lib/chess-provider";
import { platformGameUrl } from "@/lib/chess-provider";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

function resultFor(game: LichessGame, username: string) {
  const uid = username.toLowerCase();
  const isWhite =
    game.players.white.user?.id?.toLowerCase() === uid ||
    game.players.white.user?.name?.toLowerCase() === uid;
  const color = isWhite ? "white" : "black";

  if (!game.winner) return { label: "Draw", color: "text-muted", bg: "bg-zinc-700" };
  if (game.winner === color)
    return { label: "Win", color: "text-green-400", bg: "bg-green-900/40" };
  return { label: "Loss", color: "text-red-400", bg: "bg-red-900/40" };
}

function opponentName(game: LichessGame, username: string) {
  const uid = username.toLowerCase();
  const isWhite =
    game.players.white.user?.id?.toLowerCase() === uid ||
    game.players.white.user?.name?.toLowerCase() === uid;
  const opp = isWhite ? game.players.black : game.players.white;
  return opp.user?.name ?? "Anonymous";
}

export function RecentGames({
  games,
  username,
  platform = "lichess",
}: {
  games: LichessGame[];
  username: string;
  platform?: Platform;
}) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) return;
      setIsLoggedIn(true);
      const { data: saved } = await supabase
        .from("saved_games")
        .select("lichess_game_id")
        .eq("user_id", data.user.id);
      if (saved) {
        setSavedIds(
          new Set(saved.map((r: { lichess_game_id: string }) => r.lichess_game_id))
        );
      }
    });
  }, []);

  if (games.length === 0) {
    return (
      <Card>
        <p className="text-sm text-muted">No recent games found.</p>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden p-0">
      <div className="border-b border-border px-6 py-4">
        <h3 className="text-sm font-semibold">Recent Games</h3>
      </div>
      <div className="divide-y divide-border">
        {games.slice(0, 10).map((game) => {
          const result = resultFor(game, username);
          const opponent = opponentName(game, username);
          return (
            <div
              key={game.id}
              className="flex items-center gap-3 px-6 py-3 hover:bg-card-hover transition-colors"
            >
              <span
                className={`inline-flex h-6 w-14 items-center justify-center rounded text-xs font-semibold ${result.bg} ${result.color}`}
              >
                {result.label}
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium truncate">
                  vs {opponent}
                </div>
                <div className="text-xs text-muted">
                  {game.opening?.name ?? game.variant} &middot;{" "}
                  {game.speed}
                  {game.rated ? " • Rated" : ""}
                </div>
              </div>
              <div className="text-xs text-muted whitespace-nowrap">
                {new Date(game.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </div>
              {isLoggedIn && (
                <SaveGameButton
                  gameId={game.id}
                  username={username}
                  initialSaved={savedIds.has(game.id)}
                />
              )}
              <Link
                href={platformGameUrl(platform, game.id)}
                target="_blank"
                className="text-muted hover:text-accent transition-colors"
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
