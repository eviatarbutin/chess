"use client";

import { useState } from "react";
import { Bookmark } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function SaveGameButton({
  gameId,
  username,
  initialSaved,
}: {
  gameId: string;
  username: string;
  initialSaved: boolean;
}) {
  const [saved, setSaved] = useState(initialSaved);
  const [loading, setLoading] = useState(false);

  const toggle = async () => {
    setLoading(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }

    if (saved) {
      await supabase
        .from("saved_games")
        .delete()
        .eq("user_id", user.id)
        .eq("lichess_game_id", gameId);
      setSaved(false);
    } else {
      await supabase.from("saved_games").upsert(
        {
          user_id: user.id,
          lichess_game_id: gameId,
          lichess_username: username,
        },
        { onConflict: "user_id,lichess_game_id" }
      );
      setSaved(true);
    }
    setLoading(false);
  };

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`p-1 transition-colors cursor-pointer disabled:opacity-50 ${
        saved
          ? "text-accent hover:text-accent-hover"
          : "text-muted hover:text-accent"
      }`}
      title={saved ? "Remove bookmark" : "Bookmark game"}
    >
      <Bookmark
        className="h-3.5 w-3.5"
        fill={saved ? "currentColor" : "none"}
      />
    </button>
  );
}
