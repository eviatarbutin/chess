import type { ChessGame as LichessGame, ChessUser as LichessUser } from "./chess-provider";

export interface GameStats {
  total: number;
  wins: number;
  losses: number;
  draws: number;
  winRate: number;
  asWhite: { wins: number; losses: number; draws: number };
  asBlack: { wins: number; losses: number; draws: number };
}

export interface OpeningStat {
  name: string;
  eco: string;
  games: number;
  wins: number;
  losses: number;
  draws: number;
  winRate: number;
  avgRatingDiff: number;
}

export interface Weakness {
  category: string;
  severity: "high" | "medium" | "low";
  title: string;
  description: string;
  suggestion: string;
}

export function computeGameStats(
  games: LichessGame[],
  username: string
): GameStats {
  const uid = username.toLowerCase();
  let wins = 0,
    losses = 0,
    draws = 0;
  const asWhite = { wins: 0, losses: 0, draws: 0 };
  const asBlack = { wins: 0, losses: 0, draws: 0 };

  for (const game of games) {
    const isWhite =
      game.players.white.user?.id?.toLowerCase() === uid ||
      game.players.white.user?.name?.toLowerCase() === uid;
    const color = isWhite ? "white" : "black";
    const side = isWhite ? asWhite : asBlack;

    if (!game.winner) {
      draws++;
      side.draws++;
    } else if (game.winner === color) {
      wins++;
      side.wins++;
    } else {
      losses++;
      side.losses++;
    }
  }

  const total = games.length;
  return {
    total,
    wins,
    losses,
    draws,
    winRate: total > 0 ? (wins / total) * 100 : 0,
    asWhite,
    asBlack,
  };
}

export function computeOpeningStats(
  games: LichessGame[],
  username: string
): OpeningStat[] {
  const uid = username.toLowerCase();
  const map = new Map<
    string,
    {
      name: string;
      eco: string;
      games: number;
      wins: number;
      losses: number;
      draws: number;
      ratingDiffs: number[];
    }
  >();

  for (const game of games) {
    if (!game.opening) continue;

    const key = game.opening.eco;
    const entry = map.get(key) || {
      name: game.opening.name,
      eco: game.opening.eco,
      games: 0,
      wins: 0,
      losses: 0,
      draws: 0,
      ratingDiffs: [],
    };

    entry.games++;

    const isWhite =
      game.players.white.user?.id?.toLowerCase() === uid ||
      game.players.white.user?.name?.toLowerCase() === uid;
    const player = isWhite ? game.players.white : game.players.black;
    const color = isWhite ? "white" : "black";

    if (!game.winner) entry.draws++;
    else if (game.winner === color) entry.wins++;
    else entry.losses++;

    if (player.ratingDiff !== undefined) {
      entry.ratingDiffs.push(player.ratingDiff);
    }

    map.set(key, entry);
  }

  return Array.from(map.values())
    .map((e) => ({
      name: e.name,
      eco: e.eco,
      games: e.games,
      wins: e.wins,
      losses: e.losses,
      draws: e.draws,
      winRate: e.games > 0 ? (e.wins / e.games) * 100 : 0,
      avgRatingDiff:
        e.ratingDiffs.length > 0
          ? e.ratingDiffs.reduce((a, b) => a + b, 0) / e.ratingDiffs.length
          : 0,
    }))
    .sort((a, b) => b.games - a.games);
}

export function detectWeaknesses(
  stats: GameStats,
  openings: OpeningStat[],
  user: LichessUser
): Weakness[] {
  const weaknesses: Weakness[] = [];

  if (stats.total >= 10) {
    const whiteTotal =
      stats.asWhite.wins + stats.asWhite.losses + stats.asWhite.draws;
    const blackTotal =
      stats.asBlack.wins + stats.asBlack.losses + stats.asBlack.draws;
    const whiteWR = whiteTotal > 0 ? (stats.asWhite.wins / whiteTotal) * 100 : 50;
    const blackWR = blackTotal > 0 ? (stats.asBlack.wins / blackTotal) * 100 : 50;

    if (Math.abs(whiteWR - blackWR) > 10) {
      const worse = whiteWR < blackWR ? "White" : "Black";
      weaknesses.push({
        category: "Color Imbalance",
        severity: Math.abs(whiteWR - blackWR) > 20 ? "high" : "medium",
        title: `Weaker as ${worse}`,
        description: `Your win rate as ${worse} (${Math.round(worse === "White" ? whiteWR : blackWR)}%) is significantly lower than as ${worse === "White" ? "Black" : "White"} (${Math.round(worse === "White" ? blackWR : whiteWR)}%).`,
        suggestion: `Study ${worse === "White" ? "1.e4/1.d4 systems" : "defensive setups"} and practice ${worse.toLowerCase()} games in training.`,
      });
    }

    if (stats.winRate < 45) {
      weaknesses.push({
        category: "Overall Performance",
        severity: stats.winRate < 35 ? "high" : "medium",
        title: "Win Rate Below Average",
        description: `Your overall win rate is ${stats.winRate.toFixed(1)}%, which suggests you may be facing opponents above your skill level or have systematic weaknesses.`,
        suggestion:
          "Focus on tactical puzzles and review your lost games to find recurring patterns.",
      });
    }

    const drawRate = (stats.draws / stats.total) * 100;
    if (drawRate > 30) {
      weaknesses.push({
        category: "Decisive Games",
        severity: "low",
        title: "High Draw Rate",
        description: `${drawRate.toFixed(1)}% of your games end in draws. While draws aren't bad, this may indicate passive play.`,
        suggestion:
          "Try more aggressive openings and practice converting winning endgames.",
      });
    }
  }

  const badOpenings = openings.filter(
    (o) => o.games >= 5 && o.winRate < 35
  );
  if (badOpenings.length > 0) {
    const worst = badOpenings[0];
    weaknesses.push({
      category: "Opening Repertoire",
      severity: "medium",
      title: `Struggling with ${worst.name}`,
      description: `You have a ${worst.winRate.toFixed(0)}% win rate in ${worst.games} games with the ${worst.name} (${worst.eco}).`,
      suggestion: `Consider studying this opening's main lines or switching to an alternative system.`,
    });
  }

  const lossStreak = stats.losses > stats.wins * 1.5;
  if (lossStreak && stats.total >= 20) {
    weaknesses.push({
      category: "Mental Game",
      severity: "medium",
      title: "Loss Ratio Elevated",
      description:
        "You're losing significantly more games than you win, which may indicate tilt or fatigue-related issues.",
      suggestion:
        "Take breaks after 2 consecutive losses, and avoid playing when tired or frustrated.",
    });
  }

  if (weaknesses.length === 0) {
    weaknesses.push({
      category: "General",
      severity: "low",
      title: "Keep It Up!",
      description:
        "No major weaknesses detected in your recent games. You have a balanced playing style.",
      suggestion:
        "Continue reviewing your games, studying endgames, and practicing tactical puzzles to maintain improvement.",
    });
  }

  return weaknesses;
}

export interface TimeStats {
  byDayOfWeek: {
    day: string;
    games: number;
    wins: number;
    winRate: number;
  }[];
  byHour: {
    hour: number;
    label: string;
    games: number;
    wins: number;
    winRate: number;
  }[];
  bestDay: string;
  worstDay: string;
  bestHour: string;
  worstHour: string;
  peakActivity: string;
}

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function hourLabel(h: number): string {
  if (h === 0) return "12 AM";
  if (h < 12) return `${h} AM`;
  if (h === 12) return "12 PM";
  return `${h - 12} PM`;
}

export function computeTimeStats(
  games: LichessGame[],
  username: string
): TimeStats {
  const uid = username.toLowerCase();

  const dayBuckets = DAYS.map((day) => ({ day, games: 0, wins: 0 }));
  const hourBuckets = Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    label: hourLabel(i),
    games: 0,
    wins: 0,
  }));

  for (const game of games) {
    const date = new Date(game.createdAt);
    const dow = date.getDay();
    const hour = date.getHours();

    const isWhite =
      game.players.white.user?.id?.toLowerCase() === uid ||
      game.players.white.user?.name?.toLowerCase() === uid;
    const color = isWhite ? "white" : "black";
    const won = game.winner === color;

    dayBuckets[dow].games++;
    if (won) dayBuckets[dow].wins++;

    hourBuckets[hour].games++;
    if (won) hourBuckets[hour].wins++;
  }

  const byDayOfWeek = dayBuckets.map((d) => ({
    ...d,
    winRate: d.games > 0 ? (d.wins / d.games) * 100 : 0,
  }));

  const byHour = hourBuckets.map((h) => ({
    ...h,
    winRate: h.games > 0 ? (h.wins / h.games) * 100 : 0,
  }));

  const activeDays = byDayOfWeek.filter((d) => d.games > 0);
  const bestDayEntry = [...activeDays].sort((a, b) => b.winRate - a.winRate)[0];
  const worstDayEntry = [...activeDays].sort((a, b) => a.winRate - b.winRate)[0];
  const peakDayEntry = [...activeDays].sort((a, b) => b.games - a.games)[0];

  const activeHours = byHour.filter((h) => h.games > 0);
  const bestHourEntry = [...activeHours].sort((a, b) => b.winRate - a.winRate)[0];
  const worstHourEntry = [...activeHours].sort((a, b) => a.winRate - b.winRate)[0];

  return {
    byDayOfWeek,
    byHour,
    bestDay: bestDayEntry?.day ?? "N/A",
    worstDay: worstDayEntry?.day ?? "N/A",
    bestHour: bestHourEntry?.label ?? "N/A",
    worstHour: worstHourEntry?.label ?? "N/A",
    peakActivity: peakDayEntry?.day ?? "N/A",
  };
}

export function formatPlayTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  if (hours > 24) {
    const days = Math.floor(hours / 24);
    return `${days}d ${hours % 24}h`;
  }
  const mins = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${mins}m`;
}

export const PERF_LABELS: Record<string, string> = {
  bullet: "Bullet",
  blitz: "Blitz",
  rapid: "Rapid",
  classical: "Classical",
  correspondence: "Correspondence",
  chess960: "Chess960",
  crazyhouse: "Crazyhouse",
  antichess: "Antichess",
  atomic: "Atomic",
  horde: "Horde",
  kingOfTheHill: "King of the Hill",
  racingKings: "Racing Kings",
  threeCheck: "Three-check",
  puzzle: "Puzzles",
  ultraBullet: "UltraBullet",
};
