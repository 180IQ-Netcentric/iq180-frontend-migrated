import React, { useContext, useState } from "react";
import GameToggleButton from "../../components/buttons/GameToggleButton";
import RoundedSecondaryButton from "../../components/common/RoundedSecondaryButton";
import RoundedTextField from "../../components/common/RoundedTextField";
import { GameSettingsContext } from "../../contexts/gameSettingsContext";
import { Theme, ThemeContext } from "../../contexts/themeContext";
import { IconButton, Switch } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { musicTrackNames } from "../../dto/SoundTrack";
import { UserContext } from "../../contexts/userContext";
import { client } from "../../config/axiosConfig";
import { AuthenticationErrorMessage, usernameError } from "../../utils/errors";
import ErrorAlert from "../../components/alerts/ErrorAlert";
import { useTranslation } from "react-i18next";
import { Language, useLanguage } from "../../locales/i18n";

const GameSettings = ({ onClose }: any) => {
  const {
    musicOn,
    toggleMusic,
    soundEffectOn,
    toggleSoundEffect,
    musicTrack,
    toggleMusicTrack,
    background: appBackground,
    toggleBackground,
    toggleLanguage,
  } = useContext(GameSettingsContext);
  const { theme, setAppTheme } = useContext(ThemeContext);
  const { user: player, setUser } = useContext(UserContext);
  const { t } = useTranslation();
  const { changeLanguage } = useLanguage();
  const { language: appLanguage } = useLanguage();
  const [showError, setShowError] = useState(false);
  const [error, setError] = useState<AuthenticationErrorMessage>();

  const musicTracks = [0, 1, 2, 3, 4];
  const backgrounds = [0, 1, 2, 3, 4];
  const languages = ["en", "th"];

  const onUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (player)
      setUser({ ...player, username: e?.target?.value ?? player.username });
  };

  const changeBackground = (value: number) => {
    document.body.classList.forEach((className) => {
      if (className.startsWith("page-background-")) {
        document.body.classList.remove(className);
      }
    });
    document.body.classList.add(`page-background-${value}`);
  };

  const updateUserName = () => {
    client
      .put("/username", { username: player?.username })
      .then(() => {
        alert("Username has been changed successfullly.");
      })
      .catch((err) => {
        setError(err.response.data);
        setShowError(true);
      });
  };

  const switchLanguage = (lang: Language) => {
    changeLanguage(lang);
    toggleLanguage(lang);
  };

  return (
    <>
      {error && (
        <ErrorAlert
          open={showError}
          setOpen={setShowError}
          title={usernameError(error.reason).title}
          description={usernameError(error.reason).description}
          primaryAction={() => setShowError(false)}
        />
      )}
      <div className="home-content-container settings-container">
        <div className="settings-header">
          <h1>{t("18")}</h1>
          <IconButton
            size="large"
            edge="end"
            color="inherit"
            aria-label="menu"
            sx={{ height: "48px", width: "48px", alignSelf: "center" }}
            onClick={onClose}
          >
            <CloseIcon />
          </IconButton>
        </div>
        <hr />
        <h2>{t("1")}</h2>
        <div>
          <RoundedTextField
            required
            id="outlined-required"
            label="Required"
            defaultValue={player?.username ?? ""}
            onChange={onUsernameChange}
            sx={{ width: "100%", maxWidth: "300px", margin: "0 15px 15px 0" }}
          />
          <RoundedSecondaryButton onClick={updateUserName}>
            {t("19")}
          </RoundedSecondaryButton>
        </div>
        <hr />
        <h2>{t("20")}</h2>
        <div className="settings-item">
          <span>{t("21")}</span>
          <Switch
            checked={musicOn}
            onChange={() => toggleMusic(!musicOn)}
            inputProps={{ "aria-label": "controlled" }}
          />
        </div>
        <div className="settings-item">
          <h4>{t("23")}</h4>
          <Switch
            checked={soundEffectOn}
            onChange={() => toggleSoundEffect(!soundEffectOn)}
            inputProps={{ "aria-label": "controlled" }}
          />
        </div>
        <div>
          <h4>{t("22")}</h4>
          <div className="settings-toggle-item">
            {musicTracks.map((track) => (
              <GameToggleButton
                key={track}
                item={track}
                matcher={musicTrack}
                toggleCallback={(track) => toggleMusicTrack(track)}
              >
                <p style={{ fontSize: "10px" }}>{musicTrackNames[track]}</p>
              </GameToggleButton>
            ))}
          </div>
        </div>
        <h2>{t("24")}</h2>
        <div>
          <div className="settings-toggle-item">
            {backgrounds.map((background) => (
              <GameToggleButton
                key={background}
                item={background}
                matcher={appBackground}
                toggleCallback={(background) => {
                  toggleBackground(background);
                  changeBackground(background);
                }}
              >
                {background + 1}
              </GameToggleButton>
            ))}
          </div>
          <div className="settings-item">
            <h4>{t("25")}</h4>
            <Switch
              checked={theme === Theme.DARK}
              onChange={() =>
                setAppTheme(theme === Theme.DARK ? Theme.LIGHT : Theme.DARK)
              }
              inputProps={{ "aria-label": "controlled" }}
            />
          </div>
        </div>
        <hr />
        <div>
          <h4>{t("26")}</h4>
          <div className="settings-toggle-language">
            {languages.map((language) => (
              <div key={language} style={{ marginRight: "20px" }}>
                <GameToggleButton
                  item={language}
                  matcher={appLanguage}
                  toggleCallback={(language) => switchLanguage(language)}
                >
                  {language}
                </GameToggleButton>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default GameSettings;
