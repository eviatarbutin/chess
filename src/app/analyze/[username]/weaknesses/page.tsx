import { getChessUser, getChessGames, parsePlatform, platformLabel } from "@/lib/chess-provider";
import {
  computeGameStats,
  computeOpeningStats,
  detectWeaknesses,
} from "@/lib/analysis";
import { WeaknessCards } from "@/components/analyze/WeaknessCards";
import { Card } from "@/components/ui/Card";
import { ShieldAlert } from "lucide-react";
import { AnalysisTracker } from "@/components/analyze/AnalysisTracker";

export default async function WeaknessesPage({
  params,
  searchParams,
}: {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ platform?: string }>;
}) {
  const { username } = await params;
  const sp = await searchParams;
  const platform = parsePlatform(sp.platform);

  let user, games;
  try {
    [user, games] = await Promise.all([
      getChessUser(platform, username),
      getChessGames(platform, username, { max: 200, opening: true }),
    ]);
  } catch {
    return (
      <div className="rounded-xl border border-red-500/30 bg-red-900/10 p-8 text-center">
        <h2 className="text-lg font-bold text-red-400">
          Failed to load data
        </h2>
        <p className="mt-2 text-sm text-muted">
          Could not fetch data for &ldquo;{decodeURIComponent(username)}&rdquo; on {platformLabel(platform)}.
        </p>
      </div>
    );
  }

  const stats = computeGameStats(games, username);
  const openings = computeOpeningStats(games, username);
  const weaknesses = detectWeaknesses(stats, openings, user);

  const highCount = weaknesses.filter((w) => w.severity === "high").length;
  const mediumCount = weaknesses.filter((w) => w.severity === "medium").length;

  return (
    <div className="space-y-6">
      <AnalysisTracker username={decodeURIComponent(username)} analysisType="weaknesses" />
      <div>
        <h2 className="text-xl font-bold">Weakness Detection</h2>
        <p className="mt-1 text-sm text-muted">
          Patterns identified from your last {games.length} games.
        </p>
      </div>

      <Card className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-muted">
          <ShieldAlert className="h-6 w-6 text-accent" />
        </div>
        <div>
          <div className="font-semibold">
            {weaknesses.length} area{weaknesses.length !== 1 ? "s" : ""}{" "}
            identified
          </div>
          <div className="text-sm text-muted">
            {highCount > 0 && (
              <span className="text-red-400">{highCount} critical</span>
            )}
            {highCount > 0 && mediumCount > 0 && " · "}
            {mediumCount > 0 && (
              <span className="text-yellow-400">{mediumCount} moderate</span>
            )}
            {(highCount > 0 || mediumCount > 0) && " · "}
            {weaknesses.length - highCount - mediumCount} minor
          </div>
        </div>
      </Card>

      <WeaknessCards weaknesses={weaknesses} />
    </div>
  );
}
