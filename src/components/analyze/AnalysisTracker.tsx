"use client";

import { useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import type { AnalysisType } from "@/lib/supabase/types";

export function AnalysisTracker({
  username,
  analysisType,
}: {
  username: string;
  analysisType: AnalysisType;
}) {
  const tracked = useRef(false);

  useEffect(() => {
    if (tracked.current) return;
    tracked.current = true;

    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) return;
      const { error } = await supabase.from("analysis_history").insert({
        user_id: data.user.id,
        analyzed_username: username,
        analysis_type: analysisType,
      });
      if (error) console.error("AnalysisTracker insert failed:", error.message, error.details, error.hint);
    });
  }, [username, analysisType]);

  return null;
}
