import React, { useContext } from "react";
import { Button } from "@mui/material";
import useSound from "use-sound";
import { GameSettingsContext } from "../../contexts/gameSettingsContext";
// @ts-ignore
import clickSfx from "../../assets/audio/click.mp3";

interface Props {
  onClick?: (value?: any) => void;
  children: any;
}

const OperationButton = (props: Props) => {
  const { onClick } = props;
  const [play] = useSound(clickSfx);
  const { soundEffectOn } = useContext(GameSettingsContext);

  return (
    <Button
      disableElevation
      variant="contained"
      color="primary"
      className="operation-button"
      onClick={() => {
        if (soundEffectOn) play();
        if (onClick) onClick();
      }}
      sx={{ minWidth: "60px", width: "60px" }}
    >
      {props.children}
    </Button>
  );
};

export default OperationButton;
