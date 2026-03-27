import { getChessUser, getChessGames, parsePlatform, platformLabel } from "@/lib/chess-provider";
import { computeGameStats } from "@/lib/analysis";
import { ProfileCard } from "@/components/analyze/ProfileCard";
import { RatingCards } from "@/components/analyze/RatingCards";
import { WinLossChart } from "@/components/analyze/WinLossChart";
import { RecentGames } from "@/components/analyze/RecentGames";
import { AnalysisTracker } from "@/components/analyze/AnalysisTracker";

export default async function DashboardPage({
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
      getChessGames(platform, username, { max: 50, opening: true }),
    ]);
  } catch {
    return (
      <div className="rounded-xl border border-red-500/30 bg-red-900/10 p-8 text-center">
        <h2 className="text-lg font-bold text-red-400">User not found</h2>
        <p className="mt-2 text-sm text-muted">
          Could not fetch data for &ldquo;{decodeURIComponent(username)}&rdquo; on {platformLabel(platform)}.
          Make sure the username is correct.
        </p>
      </div>
    );
  }

  const stats = computeGameStats(games, username);

  return (
    <div className="space-y-6">
      <AnalysisTracker username={decodeURIComponent(username)} analysisType="dashboard" />
      <ProfileCard user={user} platform={platform} />
      {user.perfs && <RatingCards perfs={user.perfs} />}
      <WinLossChart stats={stats} />
      <RecentGames games={games} username={username} platform={platform} />
    </div>
  );
}
