import React, { createContext, useState } from "react";

export enum Theme {
  LIGHT = "light",
  DARK = "dark",
}

export enum Background {
  BACKGROUND0 = 0,
  BACKGROUND1 = 1,
  BACKGROUND2 = 2,
  BACKGROUND3 = 3,
  BACKGROUND4 = 4,
}

export interface ThemeConstruct {
  theme: string;
  setAppTheme: (value: string) => void;
  background: number;
  setBackground: (value: number) => void;
}

export const ThemeContext = createContext({} as ThemeConstruct);

const ThemeContextProvider = ({ ...props }) => {
  const recentTheme =
    window.localStorage.getItem("isDarkTheme") === "false"
      ? Theme.LIGHT
      : Theme.DARK;
  const [theme, setTheme] = useState<string>(recentTheme);
  const [background, setBackground] = useState<Background>(
    Background.BACKGROUND0
  );
  const setAppTheme = (theme: string) => {
    window.localStorage.setItem(
      "isDarkTheme",
      (theme === Theme.DARK).toString()
    );
    setTheme(theme);
  };

  const value = { theme, setAppTheme, background, setBackground };
  return <ThemeContext.Provider value={value} {...props} />;
};

export default ThemeContextProvider;
