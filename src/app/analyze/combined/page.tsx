import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getChessUser, getChessGames } from "@/lib/chess-provider";
import type { ChessUser, ChessGame, PerfStat } from "@/lib/chess-provider";
import {
  computeGameStats,
  computeOpeningStats,
  detectWeaknesses,
  type GameStats,
  type OpeningStat,
  type Weakness,
} from "@/lib/analysis";
import { CombinedAnalysis } from "@/components/analyze/CombinedAnalysis";
import { Card } from "@/components/ui/Card";
import { Link2 } from "lucide-react";
import Link from "next/link";

function mergeGameStats(a: GameStats, b: GameStats): GameStats {
  const total = a.total + b.total;
  const wins = a.wins + b.wins;
  const losses = a.losses + b.losses;
  const draws = a.draws + b.draws;
  return {
    total,
    wins,
    losses,
    draws,
    winRate: total > 0 ? (wins / total) * 100 : 0,
    asWhite: {
      wins: a.asWhite.wins + b.asWhite.wins,
      losses: a.asWhite.losses + b.asWhite.losses,
      draws: a.asWhite.draws + b.asWhite.draws,
    },
    asBlack: {
      wins: a.asBlack.wins + b.asBlack.wins,
      losses: a.asBlack.losses + b.asBlack.losses,
      draws: a.asBlack.draws + b.asBlack.draws,
    },
  };
}

function mergeOpeningStats(a: OpeningStat[], b: OpeningStat[]): OpeningStat[] {
  const map = new Map<string, OpeningStat>();
  for (const o of [...a, ...b]) {
    const existing = map.get(o.eco);
    if (existing) {
      existing.games += o.games;
      existing.wins += o.wins;
      existing.losses += o.losses;
      existing.draws += o.draws;
      existing.winRate =
        existing.games > 0 ? (existing.wins / existing.games) * 100 : 0;
    } else {
      map.set(o.eco, { ...o });
    }
  }
  return Array.from(map.values()).sort((a, b) => b.games - a.games);
}

function mergePerfs(
  a: Record<string, PerfStat> | undefined,
  b: Record<string, PerfStat> | undefined
): Record<string, { lichess?: PerfStat; chesscom?: PerfStat; best: PerfStat }> {
  const result: Record<string, { lichess?: PerfStat; chesscom?: PerfStat; best: PerfStat }> = {};
  const allKeys = new Set([
    ...Object.keys(a ?? {}),
    ...Object.keys(b ?? {}),
  ]);
  for (const key of allKeys) {
    const lp = a?.[key];
    const cp = b?.[key];
    const best =
      lp && cp
        ? lp.rating >= cp.rating
          ? lp
          : cp
        : lp ?? cp!;
    result[key] = { lichess: lp, chesscom: cp, best };
  }
  return result;
}

export default async function CombinedPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("lichess_username, chess_com_username")
    .eq("id", user.id)
    .single();

  const lichessName = profile?.lichess_username;
  const chesscomName = profile?.chess_com_username;

  if (!lichessName || !chesscomName) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <Card className="text-center">
          <div className="flex justify-center mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-muted">
              <Link2 className="h-6 w-6 text-accent" />
            </div>
          </div>
          <h2 className="text-lg font-bold">Link Both Accounts</h2>
          <p className="mt-2 text-sm text-muted max-w-md mx-auto">
            Combined analysis requires both a Lichess and Chess.com username linked to your profile.
            {lichessName
              ? " You still need to add your Chess.com username."
              : chesscomName
                ? " You still need to add your Lichess username."
                : " You haven't linked either account yet."}
          </p>
          <div className="mt-6">
            <Link
              href="/profile"
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-background hover:bg-accent/90 transition-colors"
            >
              Go to Profile Settings
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  let lichessUser: ChessUser,
    chesscomUser: ChessUser,
    lichessGames: ChessGame[],
    chesscomGames: ChessGame[];

  try {
    [lichessUser, chesscomUser, lichessGames, chesscomGames] = await Promise.all(
      [
        getChessUser("lichess", lichessName),
        getChessUser("chesscom", chesscomName),
        getChessGames("lichess", lichessName, { max: 200, opening: true }),
        getChessGames("chesscom", chesscomName, { max: 200, opening: true }),
      ]
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-red-500/30 bg-red-900/10 p-8 text-center">
          <h2 className="text-lg font-bold text-red-400">
            Failed to load data
          </h2>
          <p className="mt-2 text-sm text-muted">
            Could not fetch data from one or both platforms. {message}
          </p>
        </div>
      </div>
    );
  }

  const lichessStats = computeGameStats(lichessGames, lichessName);
  const chesscomStats = computeGameStats(chesscomGames, chesscomName);
  const combinedStats = mergeGameStats(lichessStats, chesscomStats);

  const lichessOpenings = computeOpeningStats(lichessGames, lichessName);
  const chesscomOpenings = computeOpeningStats(chesscomGames, chesscomName);
  const combinedOpenings = mergeOpeningStats(lichessOpenings, chesscomOpenings);

  const combinedWeaknesses = detectWeaknesses(combinedStats, combinedOpenings, lichessUser);
  const lichessWeaknesses = detectWeaknesses(lichessStats, lichessOpenings, lichessUser);
  const chesscomWeaknesses = detectWeaknesses(chesscomStats, chesscomOpenings, chesscomUser);

  const mergedPerfs = mergePerfs(lichessUser.perfs, chesscomUser.perfs);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <CombinedAnalysis
        lichessUsername={lichessName}
        chesscomUsername={chesscomName}
        lichessUser={lichessUser}
        chesscomUser={chesscomUser}
        lichessStats={lichessStats}
        chesscomStats={chesscomStats}
        combinedStats={combinedStats}
        combinedWeaknesses={combinedWeaknesses}
        lichessWeaknesses={lichessWeaknesses}
        chesscomWeaknesses={chesscomWeaknesses}
        mergedPerfs={mergedPerfs}
        lichessGameCount={lichessGames.length}
        chesscomGameCount={chesscomGames.length}
      />
    </div>
  );
}
