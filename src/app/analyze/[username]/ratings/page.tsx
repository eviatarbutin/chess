import { getChessUser, getChessRatingHistory, parsePlatform, platformLabel } from "@/lib/chess-provider";
import { RatingHistoryChart } from "@/components/analyze/RatingHistoryChart";
import { RatingCards } from "@/components/analyze/RatingCards";
import { AnalysisTracker } from "@/components/analyze/AnalysisTracker";
import { Card } from "@/components/ui/Card";

export default async function RatingsPage({
  params,
  searchParams,
}: {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ platform?: string }>;
}) {
  const { username } = await params;
  const sp = await searchParams;
  const platform = parsePlatform(sp.platform);

  let user, history;
  try {
    [user, history] = await Promise.all([
      getChessUser(platform, username),
      getChessRatingHistory(platform, username),
    ]);
  } catch {
    return (
      <div className="rounded-xl border border-red-500/30 bg-red-900/10 p-8 text-center">
        <h2 className="text-lg font-bold text-red-400">
          Failed to load rating data
        </h2>
        <p className="mt-2 text-sm text-muted">
          Could not fetch rating history for &ldquo;{decodeURIComponent(username)}&rdquo; on {platformLabel(platform)}.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AnalysisTracker username={decodeURIComponent(username)} analysisType="ratings" />
      <div>
        <h2 className="text-xl font-bold">Rating History</h2>
        <p className="mt-1 text-sm text-muted">
          Track rating progression across all time controls.
        </p>
      </div>

      {user.perfs && <RatingCards perfs={user.perfs} />}
      {history ? (
        <RatingHistoryChart history={history} />
      ) : (
        <Card>
          <p className="text-sm text-muted">
            Rating history charts are not available for {platformLabel(platform)} — only current ratings are shown above.
          </p>
        </Card>
      )}
    </div>
  );
}
