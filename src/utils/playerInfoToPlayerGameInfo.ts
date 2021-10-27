import { PlayerInfo } from "../contexts/socketContext";

export const playerInfoToPlayerGameInfo = (user: PlayerInfo) => {
  return {
    username: user.username,
    score: user.score,
    timeUsed: 0,
  };
};
