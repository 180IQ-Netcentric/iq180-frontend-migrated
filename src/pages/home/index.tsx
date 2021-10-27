import React, { useContext } from "react";
import { Button } from "@mui/material";
import GameContainer from "../../components/containers/GameContainer";

import CoverImg from "../../assets/images/coverImg.png";
import BouncingArrow from "../../components/common/BouncingArrow";
import Scoreboard from "../../components/scoreboard/Scoreboard";
import { Theme, ThemeContext } from "../../contexts/themeContext";
import { useHistory } from "react-router";
import Tips from "../../components/tips/Tips";
import { useTranslation } from "react-i18next";

const Home = () => {
  const { t } = useTranslation();
  const { theme: appTheme } = useContext(ThemeContext);
  const history = useHistory();

  return (
    <div>
      <GameContainer>
        <div className="game-padding">
          <div className="game-cover">
            <img src={CoverImg} alt="IQ180 Cover" />
          </div>
          <div className="game-description">
            <h1>{t("7")} 🧠</h1>
            <h4>{t("8")}</h4>
            <p>{t("9")}</p>
            <Button
              variant="contained"
              size="large"
              sx={{ width: "100%", borderRadius: "15px" }}
              onClick={() => history.push("/lobby")}
            >
              {t("10")}
            </Button>
          </div>
          <BouncingArrow />
          <div className="home-options-container">
            <Scoreboard small={false} />
            <div
              className={`tutorial-container${
                appTheme === Theme.DARK ? "-dark" : ""
              }`}
            >
              <h2>{t("17")}</h2>
              <Tips />
            </div>
          </div>
        </div>
      </GameContainer>
    </div>
  );
};

export default Home;
