import { Card } from "@/components/ui/Card";
import type { ChessUser } from "@/lib/chess-provider";
import type { Platform } from "@/lib/chess-provider";
import { formatPlayTime } from "@/lib/analysis";
import { Clock, Gamepad2, Calendar } from "lucide-react";

export function ProfileCard({ user, platform = "lichess" }: { user: ChessUser; platform?: Platform }) {
  void platform;
  return (
    <Card>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold">{user.username}</h2>
          {user.profile?.bio && (
            <p className="mt-1 text-sm text-muted line-clamp-2">
              {user.profile.bio}
            </p>
          )}
        </div>

        <div className="flex flex-wrap gap-4 text-sm">
          {user.count && (
            <div className="flex items-center gap-1.5 text-muted">
              <Gamepad2 className="h-4 w-4" />
              <span>
                <span className="font-semibold text-foreground">
                  {user.count.all.toLocaleString()}
                </span>{" "}
                games
              </span>
            </div>
          )}
          {user.playTime && (
            <div className="flex items-center gap-1.5 text-muted">
              <Clock className="h-4 w-4" />
              <span>
                <span className="font-semibold text-foreground">
                  {formatPlayTime(user.playTime.total)}
                </span>{" "}
                played
              </span>
            </div>
          )}
          <div className="flex items-center gap-1.5 text-muted">
            <Calendar className="h-4 w-4" />
            <span>
              Joined{" "}
              <span className="font-semibold text-foreground">
                {new Date(user.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
