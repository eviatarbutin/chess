export type TimeControlPref =
  | "bullet"
  | "blitz"
  | "rapid"
  | "classical"
  | "correspondence";

export type ColorPref = "white" | "black" | "random";

export type AnalysisType =
  | "dashboard"
  | "ratings"
  | "openings"
  | "games"
  | "activity"
  | "weaknesses"
  | "compare";

export interface Profile {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  lichess_username: string | null;
  chess_com_username: string | null;
  favorite_time_control: TimeControlPref;
  preferred_color: ColorPref;
  created_at: string;
  updated_at: string;
}

export interface AnalysisHistoryRow {
  id: string;
  user_id: string;
  analyzed_username: string;
  analysis_type: AnalysisType;
  created_at: string;
}

export interface SavedGame {
  id: string;
  user_id: string;
  lichess_game_id: string;
  lichess_username: string;
  notes: string | null;
  saved_at: string;
}

export interface UsageStats {
  total_analyses: number;
  total_comparisons: number;
  unique_players: number;
  member_since: string;
}
