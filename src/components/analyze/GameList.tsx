"use client";

import { useState, useMemo, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { SaveGameButton } from "@/components/analyze/SaveGameButton";
import type { ChessGame as LichessGame } from "@/lib/chess-provider";
import type { Platform } from "@/lib/chess-provider";
import { platformGameUrl } from "@/lib/chess-provider";
import { ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

const PER_PAGE = 15;

const SPEED_OPTIONS = ["all", "bullet", "blitz", "rapid", "classical"] as const;
const RESULT_OPTIONS = ["all", "win", "loss", "draw"] as const;

function getResult(game: LichessGame, uid: string) {
  const isWhite =
    game.players.white.user?.id?.toLowerCase() === uid ||
    game.players.white.user?.name?.toLowerCase() === uid;
  const color = isWhite ? "white" : "black";
  if (!game.winner) return "draw";
  return game.winner === color ? "win" : "loss";
}

export function GameList({
  games,
  username,
  platform = "lichess",
}: {
  games: LichessGame[];
  username: string;
  platform?: Platform;
}) {
  const uid = username.toLowerCase();
  const [page, setPage] = useState(0);
  const [speedFilter, setSpeedFilter] = useState<string>("all");
  const [resultFilter, setResultFilter] = useState<string>("all");
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

  const filtered = useMemo(() => {
    return games.filter((g) => {
      if (speedFilter !== "all" && g.speed !== speedFilter) return false;
      if (resultFilter !== "all" && getResult(g, uid) !== resultFilter)
        return false;
      return true;
    });
  }, [games, speedFilter, resultFilter, uid]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const pageGames = filtered.slice(page * PER_PAGE, (page + 1) * PER_PAGE);

  const resultBadge = (result: string) => {
    switch (result) {
      case "win":
        return "bg-green-900/40 text-green-400";
      case "loss":
        return "bg-red-900/40 text-red-400";
      default:
        return "bg-zinc-700 text-muted";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-muted">Speed:</span>
          {SPEED_OPTIONS.map((s) => (
            <Button
              key={s}
              variant={speedFilter === s ? "primary" : "ghost"}
              size="sm"
              onClick={() => {
                setSpeedFilter(s);
                setPage(0);
              }}
              className="capitalize text-xs"
            >
              {s}
            </Button>
          ))}
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-muted">Result:</span>
          {RESULT_OPTIONS.map((r) => (
            <Button
              key={r}
              variant={resultFilter === r ? "primary" : "ghost"}
              size="sm"
              onClick={() => {
                setResultFilter(r);
                setPage(0);
              }}
              className="capitalize text-xs"
            >
              {r}
            </Button>
          ))}
        </div>
      </div>

      <Card className="overflow-hidden p-0">
        {pageGames.length === 0 ? (
          <p className="p-6 text-sm text-muted">
            No games match the selected filters.
          </p>
        ) : (
          <div className="divide-y divide-border">
            {pageGames.map((game) => {
              const result = getResult(game, uid);
              const isWhite =
                game.players.white.user?.id?.toLowerCase() === uid ||
                game.players.white.user?.name?.toLowerCase() === uid;
              const opponent = isWhite
                ? game.players.black.user?.name ?? "Anonymous"
                : game.players.white.user?.name ?? "Anonymous";
              const player = isWhite
                ? game.players.white
                : game.players.black;

              return (
                <div
                  key={game.id}
                  className="flex items-center gap-3 px-6 py-3 hover:bg-card-hover transition-colors"
                >
                  <span
                    className={`inline-flex h-6 w-14 items-center justify-center rounded text-xs font-semibold capitalize ${resultBadge(result)}`}
                  >
                    {result}
                  </span>
                  <div
                    className={`h-3 w-3 rounded-full border ${isWhite ? "bg-white border-zinc-400" : "bg-zinc-800 border-zinc-500"}`}
                    title={isWhite ? "White" : "Black"}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium truncate">
                      vs {opponent}
                    </div>
                    <div className="text-xs text-muted">
                      {game.opening?.name ?? game.variant} &middot;{" "}
                      {game.speed}
                      {game.rated ? " • Rated" : " • Casual"}
                    </div>
                  </div>
                  <div className="hidden sm:block text-xs tabular-nums">
                    {player.rating && (
                      <span className="text-muted">{player.rating}</span>
                    )}
                    {player.ratingDiff !== undefined && (
                      <span
                        className={`ml-1 ${player.ratingDiff > 0 ? "text-green-400" : player.ratingDiff < 0 ? "text-red-400" : "text-muted"}`}
                      >
                        ({player.ratingDiff > 0 ? "+" : ""}
                        {player.ratingDiff})
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-muted whitespace-nowrap">
                    {new Date(game.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "2-digit",
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
        )}
      </Card>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted">
            {filtered.length} games &middot; page {page + 1} of {totalPages}
          </span>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              disabled={page >= totalPages - 1}
              onClick={() => setPage((p) => p + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
