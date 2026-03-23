import { getUserGames } from "@/lib/lichess";
import { computeOpeningStats } from "@/lib/analysis";
import { OpeningTable } from "@/components/analyze/OpeningTable";
import { Card } from "@/components/ui/Card";

export default async function OpeningsPage({
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
        <h2 className="text-lg font-bold text-red-400">
          Failed to load games
        </h2>
        <p className="mt-2 text-sm text-muted">
          Could not fetch game data for &ldquo;{decodeURIComponent(username)}&rdquo;.
        </p>
      </div>
    );
  }

  const openings = computeOpeningStats(games, username);

  const bestOpening = openings.find((o) => o.games >= 3);
  const worstOpening = [...openings]
    .filter((o) => o.games >= 3)
    .sort((a, b) => a.winRate - b.winRate)[0];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">Opening Repertoire</h2>
        <p className="mt-1 text-sm text-muted">
          Analysis based on your last {games.length} games.
        </p>
      </div>

      {(bestOpening || worstOpening) && (
        <div className="grid gap-4 sm:grid-cols-2">
          {bestOpening && (
            <Card className="border-green-500/20">
              <div className="text-xs font-medium text-green-400 uppercase tracking-wider">
                Best Opening
              </div>
              <div className="mt-2 font-semibold">{bestOpening.name}</div>
              <div className="mt-1 text-sm text-muted">
                {bestOpening.winRate.toFixed(1)}% win rate across{" "}
                {bestOpening.games} games
              </div>
            </Card>
          )}
          {worstOpening && (
            <Card className="border-red-500/20">
              <div className="text-xs font-medium text-red-400 uppercase tracking-wider">
                Weakest Opening
              </div>
              <div className="mt-2 font-semibold">{worstOpening.name}</div>
              <div className="mt-1 text-sm text-muted">
                {worstOpening.winRate.toFixed(1)}% win rate across{" "}
                {worstOpening.games} games
              </div>
            </Card>
          )}
        </div>
      )}

      <OpeningTable openings={openings} />
    </div>
  );
}
