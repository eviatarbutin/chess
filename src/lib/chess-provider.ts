import type { LichessUser, PerfStat, LichessGame } from "./lichess";
import { getUser as getLichessUser, getUserGames as getLichessGames, getRatingHistory as getLichessRatingHistory } from "./lichess";
import { getChessComUser, getChessComGames, getChessComPerfs } from "./chesscom";

export type Platform = "lichess" | "chesscom";

export type ChessUser = LichessUser;
export type ChessGame = LichessGame;
export type { PerfStat };

export function parsePlatform(value: string | undefined | null): Platform {
  if (value === "chesscom") return "chesscom";
  return "lichess";
}

export async function getChessUser(
  platform: Platform,
  username: string
): Promise<ChessUser> {
  if (platform === "chesscom") {
    const ccUser = await getChessComUser(username);
    const perfs = getChessComPerfs(ccUser.stats);

    const totalGames = Object.values(perfs).reduce((sum, p) => sum + p.games, 0);
    const record = Object.values(ccUser.stats)
      .filter((v): v is { record?: { win: number; loss: number; draw: number } } => typeof v === "object" && v !== null && "record" in v)
      .reduce(
        (acc, cat) => {
          if (cat.record) {
            acc.win += cat.record.win;
            acc.loss += cat.record.loss;
            acc.draw += cat.record.draw;
          }
          return acc;
        },
        { win: 0, loss: 0, draw: 0 }
      );

    return {
      id: ccUser.username.toLowerCase(),
      username: ccUser.username,
      createdAt: ccUser.joinedAt,
      seenAt: ccUser.lastOnline,
      count: {
        all: totalGames,
        rated: totalGames,
        win: record.win,
        loss: record.loss,
        draw: record.draw,
      },
      perfs,
      profile: {
        firstName: ccUser.name,
        country: ccUser.country,
      },
    };
  }

  return getLichessUser(username);
}

export async function getChessGames(
  platform: Platform,
  username: string,
  opts: { max?: number; opening?: boolean } = {}
): Promise<ChessGame[]> {
  if (platform === "chesscom") {
    return getChessComGames(username, opts.max ?? 50) as unknown as ChessGame[];
  }

  return getLichessGames(username, { max: opts.max, opening: opts.opening });
}

export async function getChessRatingHistory(
  platform: Platform,
  username: string
): Promise<{ name: string; points: [number, number, number, number][] }[] | null> {
  if (platform === "chesscom") {
    return null;
  }

  return getLichessRatingHistory(username);
}

export function platformLabel(platform: Platform): string {
  return platform === "chesscom" ? "Chess.com" : "Lichess";
}

export function platformProfileUrl(platform: Platform, username: string): string {
  if (platform === "chesscom") {
    return `https://www.chess.com/member/${username}`;
  }
  return `https://lichess.org/@/${username}`;
}

export function platformGameUrl(platform: Platform, gameId: string): string {
  if (platform === "chesscom") {
    return `https://www.chess.com/game/live/${gameId}`;
  }
  return `https://lichess.org/${gameId}`;
}
