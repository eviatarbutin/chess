import { getChessGames, parsePlatform, platformLabel } from "@/lib/chess-provider";
import { computeTimeStats } from "@/lib/analysis";
import { ActivityCharts } from "@/components/analyze/ActivityCharts";
import { AnalysisTracker } from "@/components/analyze/AnalysisTracker";

export default async function ActivityPage({
  params,
  searchParams,
}: {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ platform?: string }>;
}) {
  const { username } = await params;
  const sp = await searchParams;
  const platform = parsePlatform(sp.platform);

  let games;
  try {
    games = await getChessGames(platform, username, { max: 200, opening: true });
  } catch {
    return (
      <div className="rounded-xl border border-red-500/30 bg-red-900/10 p-8 text-center">
        <h2 className="text-lg font-bold text-red-400">Failed to load games</h2>
        <p className="mt-2 text-sm text-muted">
          Could not fetch game data for &ldquo;{decodeURIComponent(username)}&rdquo; on {platformLabel(platform)}.
        </p>
      </div>
    );
  }

  const timeStats = computeTimeStats(games, username);

  return (
    <div className="space-y-6">
      <AnalysisTracker username={decodeURIComponent(username)} analysisType="activity" />
      <div>
        <h2 className="text-xl font-bold">Activity Patterns</h2>
        <p className="mt-1 text-sm text-muted">
          When you play and how it affects your results — based on your last{" "}
          {games.length} games.
        </p>
      </div>
      <ActivityCharts stats={timeStats} />
    </div>
  );
}
