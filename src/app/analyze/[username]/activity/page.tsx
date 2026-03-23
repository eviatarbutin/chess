import { getUserGames } from "@/lib/lichess";
import { computeTimeStats } from "@/lib/analysis";
import { ActivityCharts } from "@/components/analyze/ActivityCharts";

export default async function ActivityPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  let games;
  try {
    games = await getUserGames(username, { max: 200, opening: true });
  } catch {
    return (
      <div className="rounded-xl border border-red-500/30 bg-red-900/10 p-8 text-center">
        <h2 className="text-lg font-bold text-red-400">Failed to load games</h2>
        <p className="mt-2 text-sm text-muted">
          Could not fetch game data for &ldquo;{decodeURIComponent(username)}&rdquo;.
        </p>
      </div>
    );
  }

  const timeStats = computeTimeStats(games, username);

  return (
    <div className="space-y-6">
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
