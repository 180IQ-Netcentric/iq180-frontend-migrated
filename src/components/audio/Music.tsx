import React, { useContext } from "react";
import { GameSettingsContext } from "../../contexts/gameSettingsContext";
import { musicTracks } from "../../dto/SoundTrack";
import ReactAudioPlayer from "react-audio-player";

type Props = {
  track?: string;
};

const Music = ({ track }: Props) => {
  const { musicOn, musicTrack } = useContext(GameSettingsContext);
  const shouldEnableMusic = () => musicOn && musicTrack !== 0;
  return (
    <>
      {shouldEnableMusic() && (
        <ReactAudioPlayer
          style={{ display: "none" }}
          src={track ?? musicTracks[musicTrack]?.toString()}
          volume={0.2}
          autoPlay
          controls
          loop={true}
        />
      )}
    </>
  );
};

export default Music;
