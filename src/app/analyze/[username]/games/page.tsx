import { getChessGames, parsePlatform, platformLabel } from "@/lib/chess-provider";
import { GameList } from "@/components/analyze/GameList";
import { AnalysisTracker } from "@/components/analyze/AnalysisTracker";

export default async function GamesPage({
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
        <h2 className="text-lg font-bold text-red-400">
          Failed to load games
        </h2>
        <p className="mt-2 text-sm text-muted">
          Could not fetch games for &ldquo;{decodeURIComponent(username)}&rdquo; on {platformLabel(platform)}.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AnalysisTracker username={decodeURIComponent(username)} analysisType="games" />
      <div>
        <h2 className="text-xl font-bold">Game Browser</h2>
        <p className="mt-1 text-sm text-muted">
          Browse and filter your last {games.length} games.
        </p>
      </div>

      <GameList games={games} username={username} platform={platform} />
    </div>
  );
}
