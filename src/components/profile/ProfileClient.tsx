"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import type {
  Profile,
  AnalysisHistoryRow,
  SavedGame,
  UsageStats,
  TimeControlPref,
  ColorPref,
} from "@/lib/supabase/types";
import {
  User,
  Link2,
  Settings,
  BarChart3,
  Clock,
  Bookmark,
  Save,
  Loader2,
  Trash2,
  ExternalLink,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";

const TIME_CONTROLS: TimeControlPref[] = [
  "bullet",
  "blitz",
  "rapid",
  "classical",
  "correspondence",
];
const COLORS: ColorPref[] = ["white", "black", "random"];

interface Props {
  initialProfile: Profile | null;
  usageStats: UsageStats;
  recentHistory: AnalysisHistoryRow[];
  savedGames: SavedGame[];
  userEmail: string;
}

export function ProfileClient({
  initialProfile,
  usageStats,
  recentHistory,
  savedGames: initialSavedGames,
  userEmail,
}: Props) {
  const [profile, setProfile] = useState<Profile | null>(initialProfile);
  const [savedGames, setSavedGames] = useState(initialSavedGames);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [displayName, setDisplayName] = useState(
    profile?.display_name ?? ""
  );
  const [bio, setBio] = useState(profile?.bio ?? "");
  const [lichessUsername, setLichessUsername] = useState(
    profile?.lichess_username ?? ""
  );
  const [chessComUsername, setChessComUsername] = useState(
    profile?.chess_com_username ?? ""
  );
  const [favoriteTimeControl, setFavoriteTimeControl] =
    useState<TimeControlPref>(profile?.favorite_time_control ?? "rapid");
  const [preferredColor, setPreferredColor] = useState<ColorPref>(
    profile?.preferred_color ?? "random"
  );

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setSaving(false);
      return;
    }

    const { data } = await supabase
      .from("profiles")
      .update({
        display_name: displayName || null,
        bio: bio || null,
        lichess_username: lichessUsername || null,
        chess_com_username: chessComUsername || null,
        favorite_time_control: favoriteTimeControl,
        preferred_color: preferredColor,
      })
      .eq("id", user.id)
      .select()
      .single();

    if (data) setProfile(data as Profile);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleUnsaveGame = async (lichessGameId: string) => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
      .from("saved_games")
      .delete()
      .eq("user_id", user.id)
      .eq("lichess_game_id", lichessGameId);

    setSavedGames((prev) =>
      prev.filter((g) => g.lichess_game_id !== lichessGameId)
    );
  };

  const avatarUrl = profile?.avatar_url;
  const initial = (displayName || userEmail || "U").charAt(0).toUpperCase();

  return (
    <div className="space-y-6">
      {/* Personal Info */}
      <Card>
        <div className="flex items-center gap-3 mb-5">
          <User className="h-5 w-5 text-accent" />
          <h2 className="text-lg font-semibold">Personal Information</h2>
        </div>

        <div className="flex items-center gap-4 mb-6">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="Avatar"
              className="h-16 w-16 rounded-full border-2 border-border"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent-muted text-accent text-2xl font-bold">
              {initial}
            </div>
          )}
          <div>
            <p className="text-sm font-medium">
              {displayName || userEmail}
            </p>
            <p className="text-xs text-muted">{userEmail}</p>
            {avatarUrl && (
              <p className="text-xs text-muted mt-0.5">
                Avatar synced from Google
              </p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-muted mb-1">
              Display Name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your name"
              className="w-full rounded-lg border border-border bg-background py-2.5 px-4 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted mb-1">
              Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about your chess journey..."
              rows={3}
              className="w-full rounded-lg border border-border bg-background py-2.5 px-4 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-colors resize-none"
            />
          </div>
        </div>
      </Card>

      {/* Linked Accounts */}
      <Card>
        <div className="flex items-center gap-3 mb-5">
          <Link2 className="h-5 w-5 text-accent" />
          <h2 className="text-lg font-semibold">Linked Accounts</h2>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-xs font-medium text-muted mb-1">
              Lichess Username
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={lichessUsername}
                onChange={(e) => setLichessUsername(e.target.value)}
                placeholder="e.g. DrNykterstein"
                className="flex-1 rounded-lg border border-border bg-background py-2.5 px-4 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-colors"
              />
              {lichessUsername && (
                <Link
                  href={`/analyze/${encodeURIComponent(lichessUsername)}`}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-sm text-muted hover:text-accent hover:border-accent/30 transition-colors"
                >
                  View Stats <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-muted mb-1">
              Chess.com Username
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={chessComUsername}
                onChange={(e) => setChessComUsername(e.target.value)}
                placeholder="e.g. MagnusCarlsen"
                className="flex-1 rounded-lg border border-border bg-background py-2.5 px-4 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-colors"
              />
              {chessComUsername && (
                <Link
                  href={`/analyze/${encodeURIComponent(chessComUsername)}?platform=chesscom`}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-sm text-muted hover:text-accent hover:border-accent/30 transition-colors"
                >
                  View Stats <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              )}
            </div>
          </div>

          <p className="text-xs text-muted">
            Link your accounts so we can auto-load your analysis dashboard.
          </p>

          {lichessUsername && chessComUsername && (
            <div className="pt-2">
              <Link
                href="/analyze/combined"
                className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-background hover:bg-accent/90 transition-colors"
              >
                View Combined Analysis <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            </div>
          )}
        </div>
      </Card>

      {/* Chess Preferences */}
      <Card>
        <div className="flex items-center gap-3 mb-5">
          <Settings className="h-5 w-5 text-accent" />
          <h2 className="text-lg font-semibold">Chess Preferences</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-muted mb-2">
              Favorite Time Control
            </label>
            <div className="flex flex-wrap gap-2">
              {TIME_CONTROLS.map((tc) => (
                <Button
                  key={tc}
                  variant={
                    favoriteTimeControl === tc ? "primary" : "secondary"
                  }
                  size="sm"
                  onClick={() => setFavoriteTimeControl(tc)}
                  className="capitalize"
                >
                  {tc}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-muted mb-2">
              Preferred Color
            </label>
            <div className="flex gap-2">
              {COLORS.map((c) => (
                <Button
                  key={c}
                  variant={preferredColor === c ? "primary" : "secondary"}
                  size="sm"
                  onClick={() => setPreferredColor(c)}
                  className="capitalize"
                >
                  {c}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : saved ? (
            <>
              <CheckCircle className="h-4 w-4" /> Saved
            </>
          ) : (
            <>
              <Save className="h-4 w-4" /> Save Changes
            </>
          )}
        </Button>
      </div>

      {/* Usage Stats */}
      <Card>
        <div className="flex items-center gap-3 mb-5">
          <BarChart3 className="h-5 w-5 text-accent" />
          <h2 className="text-lg font-semibold">My Stats</h2>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            {
              label: "Total Analyses",
              value: usageStats.total_analyses,
            },
            {
              label: "Comparisons",
              value: usageStats.total_comparisons,
            },
            {
              label: "Players Analyzed",
              value: usageStats.unique_players,
            },
            {
              label: "Member Since",
              value: new Date(usageStats.member_since).toLocaleDateString(
                "en-US",
                { month: "short", year: "numeric" }
              ),
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-lg border border-border bg-background p-4 text-center"
            >
              <div className="text-2xl font-bold text-accent">
                {stat.value}
              </div>
              <div className="mt-1 text-xs text-muted">{stat.label}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Recent Activity */}
      <Card>
        <div className="flex items-center gap-3 mb-5">
          <Clock className="h-5 w-5 text-accent" />
          <h2 className="text-lg font-semibold">Recent Activity</h2>
        </div>

        {recentHistory.length === 0 ? (
          <p className="text-sm text-muted">
            No analysis history yet. Start by analyzing a Lichess player!
          </p>
        ) : (
          <div className="divide-y divide-border">
            {recentHistory.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between py-3"
              >
                <div>
                  <Link
                    href={
                      entry.analysis_type === "compare"
                        ? "/compare"
                        : `/analyze/${encodeURIComponent(entry.analyzed_username)}`
                    }
                    className="text-sm font-medium hover:text-accent transition-colors"
                  >
                    {entry.analyzed_username}
                  </Link>
                  <span className="ml-2 inline-flex items-center rounded bg-accent-muted px-1.5 py-0.5 text-xs text-accent capitalize">
                    {entry.analysis_type}
                  </span>
                </div>
                <span className="text-xs text-muted">
                  {new Date(entry.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Saved Games */}
      <Card>
        <div className="flex items-center gap-3 mb-5">
          <Bookmark className="h-5 w-5 text-accent" />
          <h2 className="text-lg font-semibold">Saved Games</h2>
        </div>

        {savedGames.length === 0 ? (
          <p className="text-sm text-muted">
            No saved games yet. Bookmark games from any analysis page to see
            them here.
          </p>
        ) : (
          <div className="divide-y divide-border">
            {savedGames.map((game) => (
              <div
                key={game.id}
                className="flex items-center justify-between py-3"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`https://lichess.org/${game.lichess_game_id}`}
                      target="_blank"
                      className="text-sm font-medium hover:text-accent transition-colors truncate"
                    >
                      Game {game.lichess_game_id}
                    </Link>
                    <span className="text-xs text-muted">
                      ({game.lichess_username})
                    </span>
                  </div>
                  {game.notes && (
                    <p className="text-xs text-muted mt-0.5 truncate">
                      {game.notes}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 ml-3">
                  <span className="text-xs text-muted whitespace-nowrap">
                    {new Date(game.saved_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  <button
                    onClick={() => handleUnsaveGame(game.lichess_game_id)}
                    className="p-1 text-muted hover:text-danger transition-colors cursor-pointer"
                    title="Remove saved game"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
