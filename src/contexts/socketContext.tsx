import React, { createContext, useState } from "react";
import { Socket } from "socket.io-client";
import { UserInfo } from "../dto/Authentication.dto";

export interface Settings {
  digit: number;
  round: number;
  timeLimit: number;
  isClassicMode: boolean;
}

export type PlayerInfos = PlayerInfo[];
export interface PlayerInfo {
  id: string;
  username: string;
  win: number;
  lose: number;
  score: number;
}

export interface PlayerGameInfo {
  username: string;
  score: number;
  timeUsed: number;
}

export interface Question {
  number: number[];
  numberShuffle: number[];
  operator: number[];
  result: number;
}

export interface GameInfo {
  setting: Settings;
  player1: PlayerGameInfo;
  player2: PlayerGameInfo;
  firstPlayer: string;
  currentRound: number;
  questions: Question[];
}

export interface NextTurn {
  username: string;
  timeUsed: number;
}

export interface EndRound {
  username: string;
  timeUsed: number;
}

export interface SocketConstruct {
  socket: Socket | undefined;
  setSocket: (value: Socket | undefined) => void;
  socketOpen: boolean;
  setSocketOpen: (value: boolean) => void;
  settings: Settings | undefined;
  setSettings: (value: Settings) => void;
  playerInfos: PlayerInfos | undefined;
  setPlayerInfos: (value: PlayerInfos) => void;
  gameInfo: GameInfo | undefined;
  setGameInfo: (value: GameInfo | undefined) => void;
  winnerUsername: string | undefined;
  setWinnerUsername: (value: string) => void;
  joinRoom: (value: UserInfo) => void;
  updateSettings: (value: Settings) => void;
  startGame: () => void;
  nextTurn: (value: NextTurn) => void;
  endRound: (value: EndRound) => void;
  nextRound: () => void;
  disconnectSocket: (value: string) => void;
}

export const SocketContext = createContext({} as SocketConstruct);

const SocketContextProvider = ({ ...props }) => {
  const [socket, setSocket] = useState<Socket>();
  const [socketOpen, setSocketOpen] = useState<boolean>(false);
  const [settings, setSettings] = useState<Settings>();
  const [playerInfos, setPlayerInfos] = useState<PlayerInfos>([]);
  const [gameInfo, setGameInfo] = useState<GameInfo>();
  const [winnerUsername, setWinnerUsername] = useState<string>();

  const joinRoom = (userInfo: UserInfo) => {
    if (socket) {
      socket.emit("joinRoom", userInfo);
    }
  };

  const updateSettings = (settings: Settings) => {
    console.log("updateSettings", settings);
    if (socket) socket.emit("updateSetting", settings);
  };

  const startGame = () => {
    console.log("startGame");
    if (socket) socket.emit("playerStartGame");
  };

  const nextTurn = (nextTurnInfo: NextTurn) => {
    console.log("nextTurn", nextTurnInfo);
    if (socket) socket.emit("nextTurn", nextTurnInfo);
  };

  const endRound = (endRoundInfo: EndRound) => {
    console.log("endRound", endRoundInfo);
    if (socket) socket.emit("endRound", endRoundInfo);
  };

  const nextRound = () => {
    console.log("nextRound");
    if (socket) socket.emit("nextRound");
  };

  const disconnectSocket = (username: string) => {
    console.log("disconnectSocket", username);
    if (socket) socket.emit("disconnect", username);
  };

  const value = {
    socket,
    setSocket,
    socketOpen,
    setSocketOpen,
    settings,
    setSettings,
    playerInfos,
    setPlayerInfos,
    gameInfo,
    setGameInfo,
    winnerUsername,
    setWinnerUsername,
    joinRoom,
    updateSettings,
    startGame,
    nextTurn,
    endRound,
    nextRound,
    disconnectSocket,
  };
  return <SocketContext.Provider value={value} {...props} />;
};

export default SocketContextProvider;
