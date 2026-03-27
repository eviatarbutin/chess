import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProfileClient } from "@/components/profile/ProfileClient";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const { data: history } = await supabase
    .from("analysis_history")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(10);

  const { data: allHistory } = await supabase
    .from("analysis_history")
    .select("analyzed_username, analysis_type")
    .eq("user_id", user.id);

  const { data: savedGames } = await supabase
    .from("saved_games")
    .select("*")
    .eq("user_id", user.id)
    .order("saved_at", { ascending: false });

  const rows = allHistory ?? [];
  const uniquePlayers = new Set(
    rows.map((r: { analyzed_username: string }) =>
      r.analyzed_username.toLowerCase()
    )
  );
  const comparisons = rows.filter(
    (r: { analysis_type: string }) => r.analysis_type === "compare"
  ).length;

  const usageStats = {
    total_analyses: rows.length,
    total_comparisons: comparisons,
    unique_players: uniquePlayers.size,
    member_since: profile?.created_at ?? user.created_at,
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold mb-8">My Profile</h1>
      <ProfileClient
        initialProfile={profile}
        usageStats={usageStats}
        recentHistory={history ?? []}
        savedGames={savedGames ?? []}
        userEmail={user.email ?? ""}
      />
    </div>
  );
}
