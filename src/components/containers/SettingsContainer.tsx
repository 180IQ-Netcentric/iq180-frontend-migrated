import { Paper } from "@mui/material";
import React from "react";

const SettingsContainer = ({ children }: any) => {
  return (
    <div className="paper-container">
      <Paper elevation={0} className="game-container main-layer">
        <div className="home-content-container">{children}</div>
      </Paper>
      <Paper elevation={0} className="game-container highlight-layer"></Paper>
    </div>
  );
};

export default SettingsContainer;
