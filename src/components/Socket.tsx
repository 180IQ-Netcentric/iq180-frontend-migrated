import React, { useContext, useEffect } from "react";
import { useHistory, useLocation } from "react-router";
import {
  GameInfo,
  PlayerInfos,
  Settings,
  SocketContext,
} from "../contexts/socketContext";
import { UserContext } from "../contexts/userContext";

const Socket = ({ children }: any) => {
  const { setSettings, setPlayerInfos, gameInfo, setGameInfo } =
    useContext(SocketContext);
  const location = useLocation();
  const inSocketPages = () => {
    return (
      window.location.pathname === "/lobby" ||
      window.location.pathname === "/game"
    );
  };

  const { socket } = useContext(SocketContext);
  const { user } = useContext(UserContext);
  const history = useHistory();

  useEffect(() => {
    if (gameInfo && !inSocketPages()) {
      socket?.emit("disconnectUser", user);
      setGameInfo(undefined);
      setPlayerInfos([]);
    }

    if (!socket) return;

    socket.on("updatePlayerList", (playerInfos: PlayerInfos) => {
      setPlayerInfos(playerInfos);
      const isInSettingsPage = history.location.pathname === "/lobby";
      if (
        !isInSettingsPage &&
        playerInfos[0] &&
        playerInfos[0].username === user?.username &&
        playerInfos.length <= 1
      ) {
        history.push("/lobby");
      }
    });

    socket.on("updateSetting", (settings: Settings) => {
      setSettings(settings);
    });

    socket.on("startRound", (gameInfo: GameInfo) => {
      if (history.location.pathname !== "/game") history.push("/game");
    });

    socket.on("endGame", (gameInfo: GameInfo) => {
      setGameInfo(gameInfo);
    });

    socket.on("updateGameInfo", (gameInfo: GameInfo) => {
      setGameInfo(gameInfo);
    });
  }, [location, socket]);

  return <>{children}</>;
};

export default Socket;
