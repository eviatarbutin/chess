const BASE_URL = "https://api.chess.com/pub";

interface ChessComProfile {
  username: string;
  player_id: number;
  url: string;
  joined: number;
  last_online: number;
  followers: number;
  country?: string;
  name?: string;
  avatar?: string;
}

interface ChessComStatsCategory {
  last?: { rating: number; date: number; rd: number };
  best?: { rating: number; date: number };
  record?: { win: number; loss: number; draw: number };
}

interface ChessComStats {
  chess_bullet?: ChessComStatsCategory;
  chess_blitz?: ChessComStatsCategory;
  chess_rapid?: ChessComStatsCategory;
  chess_daily?: ChessComStatsCategory;
  tactics?: { highest?: { rating: number } };
  puzzle_rush?: { best?: { score: number } };
}

interface ChessComGameRaw {
  url: string;
  pgn?: string;
  time_control: string;
  end_time: number;
  rated: boolean;
  rules: string;
  white: {
    username: string;
    rating: number;
    result: string;
  };
  black: {
    username: string;
    rating: number;
    result: string;
  };
  initial_setup?: string;
}

async function chessComFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) {
    throw new Error(`Chess.com API error: ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}

export interface ChessComUser {
  username: string;
  joinedAt: number;
  lastOnline: number;
  name?: string;
  avatar?: string;
  country?: string;
  followers: number;
  stats: ChessComStats;
}

export async function getChessComUser(
  username: string
): Promise<ChessComUser> {
  const [profile, stats] = await Promise.all([
    chessComFetch<ChessComProfile>(`/player/${username.toLowerCase()}`),
    chessComFetch<ChessComStats>(
      `/player/${username.toLowerCase()}/stats`
    ),
  ]);

  return {
    username: profile.username,
    joinedAt: profile.joined * 1000,
    lastOnline: profile.last_online * 1000,
    name: profile.name,
    avatar: profile.avatar,
    country: profile.country,
    followers: profile.followers,
    stats,
  };
}

function timeControlToSpeed(tc: string): string {
  if (tc === "-") return "correspondence";
  const parts = tc.split(/[/+]/);
  const base = parseInt(parts[0], 10);
  if (isNaN(base)) return "rapid";
  if (base < 180) return "bullet";
  if (base < 600) return "blitz";
  if (base < 1800) return "rapid";
  return "classical";
}

function resultFromChessCom(
  result: string
): "win" | "loss" | "draw" {
  switch (result) {
    case "win":
      return "win";
    case "checkmated":
    case "timeout":
    case "resigned":
    case "abandoned":
      return "loss";
    case "agreed":
    case "stalemate":
    case "repetition":
    case "insufficient":
    case "50move":
    case "timevsinsufficient":
      return "draw";
    default:
      return "loss";
  }
}

function extractOpening(pgn?: string): { eco: string; name: string; ply: number } | undefined {
  if (!pgn) return undefined;
  const ecoMatch = pgn.match(/\[ECO\s+"([^"]+)"\]/);
  const nameMatch = pgn.match(/\[ECOUrl\s+"[^"]*\/([^"]+)"\]/) ||
    pgn.match(/\[Opening\s+"([^"]+)"\]/);
  if (!ecoMatch && !nameMatch) return undefined;
  return {
    eco: ecoMatch?.[1] ?? "",
    name: nameMatch?.[1]?.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()) ?? "Unknown",
    ply: 0,
  };
}

function extractGameId(url: string): string {
  const match = url.match(/\/game\/(?:live|daily)\/(\d+)/);
  return match?.[1] ?? url;
}

export interface NormalizedChessComGame {
  id: string;
  rated: boolean;
  variant: string;
  speed: string;
  perf: string;
  createdAt: number;
  lastMoveAt: number;
  status: string;
  players: {
    white: {
      user?: { name: string; id: string };
      rating?: number;
      ratingDiff?: number;
    };
    black: {
      user?: { name: string; id: string };
      rating?: number;
      ratingDiff?: number;
    };
  };
  winner?: "white" | "black";
  opening?: { eco: string; name: string; ply: number };
  clock?: { initial: number; increment: number };
}

function normalizeGame(raw: ChessComGameRaw): NormalizedChessComGame {
  const speed = timeControlToSpeed(raw.time_control);
  const whiteResult = resultFromChessCom(raw.white.result);
  const blackResult = resultFromChessCom(raw.black.result);

  let winner: "white" | "black" | undefined;
  if (whiteResult === "win") winner = "white";
  else if (blackResult === "win") winner = "black";

  const tcParts = raw.time_control.split(/[/+]/);
  const initial = parseInt(tcParts[0], 10) || 0;
  const increment = parseInt(tcParts[1], 10) || 0;

  return {
    id: extractGameId(raw.url),
    rated: raw.rated,
    variant: raw.rules === "chess" ? "standard" : raw.rules,
    speed,
    perf: speed,
    createdAt: raw.end_time * 1000,
    lastMoveAt: raw.end_time * 1000,
    status: raw.white.result === "win" || raw.black.result === "win" ? "mate" : "draw",
    players: {
      white: {
        user: {
          name: raw.white.username,
          id: raw.white.username.toLowerCase(),
        },
        rating: raw.white.rating,
      },
      black: {
        user: {
          name: raw.black.username,
          id: raw.black.username.toLowerCase(),
        },
        rating: raw.black.rating,
      },
    },
    winner,
    opening: extractOpening(raw.pgn),
    clock: { initial, increment },
  };
}

export async function getChessComGames(
  username: string,
  max = 50
): Promise<NormalizedChessComGame[]> {
  const archives = await chessComFetch<{ archives: string[] }>(
    `/player/${username.toLowerCase()}/games/archives`
  );

  if (!archives.archives || archives.archives.length === 0) return [];

  const recentArchives = archives.archives.slice(-3).reverse();

  const allGames: NormalizedChessComGame[] = [];

  for (const archiveUrl of recentArchives) {
    if (allGames.length >= max) break;
    const path = archiveUrl.replace("https://api.chess.com/pub", "");
    const data = await chessComFetch<{ games: ChessComGameRaw[] }>(path);
    const normalized = data.games
      .filter((g) => g.rules === "chess")
      .map(normalizeGame)
      .reverse();
    allGames.push(...normalized);
  }

  return allGames.slice(0, max);
}

export function getChessComPerfs(stats: ChessComStats): Record<string, {
  games: number;
  rating: number;
  rd: number;
  prog: number;
  prov?: boolean;
}> {
  const perfs: Record<string, { games: number; rating: number; rd: number; prog: number; prov?: boolean }> = {};

  const mapping: [string, string][] = [
    ["chess_bullet", "bullet"],
    ["chess_blitz", "blitz"],
    ["chess_rapid", "rapid"],
    ["chess_daily", "classical"],
  ];

  for (const [apiKey, perfKey] of mapping) {
    const cat = stats[apiKey as keyof ChessComStats] as ChessComStatsCategory | undefined;
    if (cat?.last) {
      const record = cat.record;
      const totalGames = record
        ? record.win + record.loss + record.draw
        : 0;
      perfs[perfKey] = {
        games: totalGames,
        rating: cat.last.rating,
        rd: cat.last.rd ?? 0,
        prog: 0,
        prov: totalGames < 10,
      };
    }
  }

  if (stats.tactics?.highest) {
    perfs.puzzle = {
      games: 0,
      rating: stats.tactics.highest.rating,
      rd: 0,
      prog: 0,
    };
  }

  return perfs;
}
