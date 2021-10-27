import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { PlayerGameInfo, SocketContext } from "../../../contexts/socketContext";

type Props = {
  player1: PlayerGameInfo;
  player2: PlayerGameInfo;
  winnerUsername?: string;
};
export const RoundEnd = (props: Props) => {
  const { winnerUsername } = props;
  const { t } = useTranslation();
  const { gameInfo } = useContext(SocketContext);

  if (!gameInfo) return null;
  const { player1, player2 } = gameInfo;

  const winnerName = (player1: PlayerGameInfo, player2: PlayerGameInfo) => {
    if (player1.timeUsed === player2.timeUsed) return null;
    else if (player1.timeUsed < player2.timeUsed) return player1.username;
    else return player2.username;
  };

  if (!gameInfo.setting.isClassicMode)
    return (
      <div className="round-end">
        <div className="show-winner">
          <div>
            {!winnerUsername && (
              <div style={{ fontSize: "36px" }}>{t("70")}</div>
            )}
            {winnerUsername && (
              <div>
                <div style={{ fontSize: "24px" }}>{t("43")}</div>
                <div style={{ fontSize: "36px" }}>{winnerUsername}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    );

  return (
    <div className="round-end">
      <span style={{ fontSize: "24px" }}>{t("42")}</span>
      <div className="game-result">
        <div className="player-name">{player1.username}</div>
        <div className="score-value">{player1.timeUsed}</div>
      </div>
      <div className="game-result">
        <div className="player-name">{player2.username}</div>
        <div className="score-value">{player2.timeUsed}</div>
      </div>
      <hr />
      <div className="show-winner">
        <div>
          {winnerName(player1, player2) === null && (
            <div style={{ fontSize: "36px" }}>{t("70")}</div>
          )}
          {winnerName(player1, player2) !== null && (
            <div>
              <div style={{ fontSize: "24px" }}>{t("43")}</div>
              <div style={{ fontSize: "36px" }}>
                {winnerName(player1, player2)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
