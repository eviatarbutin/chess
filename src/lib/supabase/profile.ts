import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  Profile,
  AnalysisHistoryRow,
  AnalysisType,
  SavedGame,
  UsageStats,
} from "./types";

// ---------------------------------------------------------------------------
// Profile
// ---------------------------------------------------------------------------

export async function getProfile(
  supabase: SupabaseClient
): Promise<Profile | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return (data as Profile) ?? null;
}

export async function updateProfile(
  supabase: SupabaseClient,
  updates: Partial<
    Pick<
      Profile,
      | "display_name"
      | "bio"
      | "lichess_username"
      | "favorite_time_control"
      | "preferred_color"
    >
  >
): Promise<Profile | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", user.id)
    .select()
    .single();

  return (data as Profile) ?? null;
}

// ---------------------------------------------------------------------------
// Analysis history
// ---------------------------------------------------------------------------

export async function trackAnalysis(
  supabase: SupabaseClient,
  analyzedUsername: string,
  analysisType: AnalysisType
): Promise<void> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("analysis_history").insert({
    user_id: user.id,
    analyzed_username: analyzedUsername,
    analysis_type: analysisType,
  });
}

export async function getAnalysisHistory(
  supabase: SupabaseClient,
  limit = 20
): Promise<AnalysisHistoryRow[]> {
  const { data } = await supabase
    .from("analysis_history")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  return (data as AnalysisHistoryRow[]) ?? [];
}

export async function getUsageStats(
  supabase: SupabaseClient
): Promise<UsageStats | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: history } = await supabase
    .from("analysis_history")
    .select("analyzed_username, analysis_type, created_at")
    .eq("user_id", user.id);

  const rows = (history ?? []) as Pick<
    AnalysisHistoryRow,
    "analyzed_username" | "analysis_type" | "created_at"
  >[];

  const uniquePlayers = new Set(rows.map((r) => r.analyzed_username.toLowerCase()));
  const comparisons = rows.filter((r) => r.analysis_type === "compare").length;

  const { data: profile } = await supabase
    .from("profiles")
    .select("created_at")
    .eq("id", user.id)
    .single();

  return {
    total_analyses: rows.length,
    total_comparisons: comparisons,
    unique_players: uniquePlayers.size,
    member_since: (profile as { created_at: string } | null)?.created_at ?? user.created_at,
  };
}

// ---------------------------------------------------------------------------
// Saved games
// ---------------------------------------------------------------------------

export async function getSavedGames(
  supabase: SupabaseClient
): Promise<SavedGame[]> {
  const { data } = await supabase
    .from("saved_games")
    .select("*")
    .order("saved_at", { ascending: false });

  return (data as SavedGame[]) ?? [];
}

export async function getSavedGameIds(
  supabase: SupabaseClient
): Promise<Set<string>> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return new Set();

  const { data } = await supabase
    .from("saved_games")
    .select("lichess_game_id")
    .eq("user_id", user.id);

  return new Set(
    ((data ?? []) as { lichess_game_id: string }[]).map((r) => r.lichess_game_id)
  );
}

export async function saveGame(
  supabase: SupabaseClient,
  lichessGameId: string,
  lichessUsername: string,
  notes?: string
): Promise<SavedGame | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("saved_games")
    .upsert(
      {
        user_id: user.id,
        lichess_game_id: lichessGameId,
        lichess_username: lichessUsername,
        notes: notes ?? null,
      },
      { onConflict: "user_id,lichess_game_id" }
    )
    .select()
    .single();

  return (data as SavedGame) ?? null;
}

export async function unsaveGame(
  supabase: SupabaseClient,
  lichessGameId: string
): Promise<void> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from("saved_games")
    .delete()
    .eq("user_id", user.id)
    .eq("lichess_game_id", lichessGameId);
}
