const BASE_URL = "https://lichess.org/api";

export interface LichessUser {
  id: string;
  username: string;
  createdAt: number;
  seenAt: number;
  playTime?: { total: number; tv: number };
  count?: {
    all: number;
    rated: number;
    win: number;
    loss: number;
    draw: number;
  };
  perfs?: Record<string, PerfStat>;
  profile?: {
    country?: string;
    bio?: string;
    firstName?: string;
    lastName?: string;
  };
}

export interface PerfStat {
  games: number;
  rating: number;
  rd: number;
  prog: number;
  prov?: boolean;
}

export interface LichessGame {
  id: string;
  rated: boolean;
  variant: string;
  speed: string;
  perf: string;
  createdAt: number;
  lastMoveAt: number;
  status: string;
  players: {
    white: GamePlayer;
    black: GamePlayer;
  };
  winner?: "white" | "black";
  moves?: string;
  opening?: { eco: string; name: string; ply: number };
  clock?: { initial: number; increment: number };
}

export interface GamePlayer {
  user?: { name: string; id: string };
  rating?: number;
  ratingDiff?: number;
}

async function lichessFetch<T>(path: string, ndjson = false): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      Accept: ndjson ? "application/x-ndjson" : "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`Lichess API error: ${res.status} ${res.statusText}`);
  }

  if (ndjson) {
    const text = await res.text();
    return text
      .trim()
      .split("\n")
      .map((line) => JSON.parse(line)) as T;
  }

  return res.json() as Promise<T>;
}

export async function getUser(username: string): Promise<LichessUser> {
  return lichessFetch<LichessUser>(`/user/${username}`);
}

export async function getUserGames(
  username: string,
  params: {
    max?: number;
    rated?: boolean;
    perfType?: string;
    opening?: boolean;
  } = {}
): Promise<LichessGame[]> {
  const searchParams = new URLSearchParams();
  if (params.max) searchParams.set("max", String(params.max));
  if (params.rated !== undefined) searchParams.set("rated", String(params.rated));
  if (params.perfType) searchParams.set("perfType", params.perfType);
  if (params.opening) searchParams.set("opening", "true");

  const query = searchParams.toString();
  return lichessFetch<LichessGame[]>(
    `/games/user/${username}${query ? `?${query}` : ""}`,
    true
  );
}

export async function getRatingHistory(
  username: string
): Promise<{ name: string; points: [number, number, number, number][] }[]> {
  return lichessFetch(`/user/${username}/rating-history`);
}
