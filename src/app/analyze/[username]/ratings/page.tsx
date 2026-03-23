import { getRatingHistory, getUser } from "@/lib/lichess";
import { RatingHistoryChart } from "@/components/analyze/RatingHistoryChart";
import { RatingCards } from "@/components/analyze/RatingCards";

export default async function RatingsPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  let user, history;
  try {
    [user, history] = await Promise.all([
      getUser(username),
      getRatingHistory(username),
    ]);
  } catch {
    return (
      <div className="rounded-xl border border-red-500/30 bg-red-900/10 p-8 text-center">
        <h2 className="text-lg font-bold text-red-400">
          Failed to load rating data
        </h2>
        <p className="mt-2 text-sm text-muted">
          Could not fetch rating history for &ldquo;{decodeURIComponent(username)}&rdquo;.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">Rating History</h2>
        <p className="mt-1 text-sm text-muted">
          Track rating progression across all time controls.
        </p>
      </div>

      {user.perfs && <RatingCards perfs={user.perfs} />}
      <RatingHistoryChart history={history} />
    </div>
  );
}
