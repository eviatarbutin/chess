import { getUser, getUserGames } from "@/lib/lichess";
import { computeGameStats } from "@/lib/analysis";
import { ProfileCard } from "@/components/analyze/ProfileCard";
import { RatingCards } from "@/components/analyze/RatingCards";
import { WinLossChart } from "@/components/analyze/WinLossChart";
import { RecentGames } from "@/components/analyze/RecentGames";

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  let user, games;
  try {
    [user, games] = await Promise.all([
      getUser(username),
      getUserGames(username, { max: 50, opening: true }),
    ]);
  } catch {
    return (
      <div className="rounded-xl border border-red-500/30 bg-red-900/10 p-8 text-center">
        <h2 className="text-lg font-bold text-red-400">User not found</h2>
        <p className="mt-2 text-sm text-muted">
          Could not fetch data for &ldquo;{decodeURIComponent(username)}&rdquo;.
          Make sure the Lichess username is correct.
        </p>
      </div>
    );
  }

  const stats = computeGameStats(games, username);

  return (
    <div className="space-y-6">
      <ProfileCard user={user} />
      {user.perfs && <RatingCards perfs={user.perfs} />}
      <WinLossChart stats={stats} />
      <RecentGames games={games} username={username} />
    </div>
  );
}
