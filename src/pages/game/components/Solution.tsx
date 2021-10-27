import { Button } from "@mui/material";
import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { SocketContext } from "../../../contexts/socketContext";

type Props = {
  startNextRound: () => void;
};

export default function Solution(props: Props) {
  const { t } = useTranslation();
  const { startNextRound } = props;
  const OPERATION_SIGNS = ["+", "-", "×", "÷"];
  const { gameInfo } = useContext(SocketContext);

  const formattedSolution = () => {
    if (!gameInfo) return null;
    const currentQuestion = gameInfo.questions[gameInfo.currentRound - 1];
    let sol = "";
    for (let i = 0; i < currentQuestion.operator.length; i++) {
      sol += currentQuestion.number[i].toString() + " ";
      sol += OPERATION_SIGNS[currentQuestion.operator[i]] + " ";
    }
    sol += currentQuestion.number[currentQuestion.number.length - 1];
    sol += " = " + currentQuestion.result;
    return sol;
  };

  return (
    <div className="show-solution">
      <div>
        <div style={{ fontSize: "24px" }}>{t("45")}</div>
        <div style={{ fontSize: "32px", fontWeight: "bold" }}>
          <span>{formattedSolution()}</span>
        </div>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "primary",
            height: "48px",
            width: "100%",
          }}
          className="button-row"
          onClick={startNextRound}
        >
          {t("60")}
        </Button>
      </div>
    </div>
  );
}
