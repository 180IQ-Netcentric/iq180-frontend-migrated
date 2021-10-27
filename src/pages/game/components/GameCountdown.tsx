import React, { useState, useEffect, useContext } from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import useSound from "use-sound";
import { GameSettingsContext } from "../../../contexts/gameSettingsContext";
// @ts-ignore
import timeWarning from "../../../assets/audio/timeWarning.mp3";

type Props = {
  onComplete: (value: number) => void;
  duration: number;
};

const CountDownTimer = (props: Props) => {
  const { onComplete, duration } = props;
  const [play] = useSound(timeWarning);
  let canPlaySound = true;
  const { soundEffectOn } = useContext(GameSettingsContext);

  return (
    <div className="countdown-timer">
      <CountdownCircleTimer
        isPlaying
        duration={duration}
        size={80}
        colors={[
          ["#004777", 0.33],
          ["#F7B801", 0.33],
          ["#A30000", 0.33],
        ]}
        onComplete={onComplete}
      >
        {({ remainingTime }) => {
          if (remainingTime === 10) {
            if (soundEffectOn && canPlaySound) play();
            canPlaySound = false;
          }
          return remainingTime;
        }}
      </CountdownCircleTimer>
    </div>
  );
};

export default CountDownTimer;
