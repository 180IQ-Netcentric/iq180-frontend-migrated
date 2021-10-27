import React, { useContext } from "react";
import { Button } from "@mui/material";
import useSound from "use-sound";
import { GameSettingsContext } from "../../contexts/gameSettingsContext";
// @ts-ignore
import clickSfx from "../../assets/audio/click.mp3";

interface Props {
  onClick?: (value?: any) => void;
  disabled: boolean;
  children: any;
}

const RigidButton = (props: Props) => {
  const { onClick, disabled } = props;
  const [play] = useSound(clickSfx);
  const { soundEffectOn } = useContext(GameSettingsContext);
  return (
    <Button
      disableElevation
      disabled={disabled}
      variant="contained"
      color="secondary"
      className="rigid-button"
      size="small"
      onClick={() => {
        if (soundEffectOn) play();
        if (onClick) onClick();
      }}
      sx={{ height: "48px", minWidth: "20px !important", width: "48px" }}
    >
      {props.children}
    </Button>
  );
};

export default RigidButton;
