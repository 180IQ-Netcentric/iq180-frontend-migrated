import React from "react";
import { useTranslation } from "react-i18next";
import { UserInfo, User } from "../../dto/Authentication.dto";

type Props = {
  player: UserInfo | User | undefined;
};

const PlayerInfoCard = ({ player }: Props) => {
  const { t } = useTranslation();
  if (!player) return <p>{t("64")}</p>;
  return (
    <div className="player-card">
      <div className="player-card-header">
        <span className="player-icon">
          {player.username.charAt(0).toUpperCase()}
        </span>
        <span className="player-card-title">{player.username}</span>
      </div>
      <div className="player-score-column">
        <div>
          <div className="score-category">W</div>
          <div className="score-value">{player.win}</div>
        </div>

        <div>
          <div className="score-category">L</div>
          <div className="score-value">{player.lose}</div>
        </div>

        <div>
          <div className="score-category">Score</div>
          <div className="score-value">{player.score}</div>
        </div>
      </div>
    </div>
  );
};

export default PlayerInfoCard;
