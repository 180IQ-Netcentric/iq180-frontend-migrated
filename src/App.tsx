import React, { useContext } from "react";
import "./App.css";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import Game from "./pages/game/index";
import Home from "./pages/home/index";
import Page404 from "./pages/common/Page404";
import useMediaQuery from "@mui/material/useMediaQuery";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MenuAppBar from "./components/common/NavBar";
import GameSettingsContextProvider from "./contexts/gameSettingsContext";
import Music from "./components/audio/Music";
import SignIn from "./pages/authentication/Signin";
import SignUp from "./pages/authentication/Signup";
import UserContextProvider from "./contexts/userContext";
import AuthProvider from "./contexts/authContext";
import Wrapper from "./components/Wrapper";
import { ThemeContext } from "./contexts/themeContext";
import Lobby from "./pages/lobby";
import { I18nextProvider } from "react-i18next";
import i18n from "./locales/i18n";
import SocketContextProvider from "./contexts/socketContext";
import Socket from "./components/Socket";

function App() {
  const prefersColorSchemeDark = useMediaQuery("(prefers-color-scheme: dark)");
  const prefersDarkMode =
    localStorage.getItem("isDarkTheme") === "true" ?? prefersColorSchemeDark;

  const { theme: appTheme } = useContext(ThemeContext);

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode && appTheme === "dark" ? "dark" : "light",
          primary: {
            main: "#F56F54",
            contrastText: "#fff",
          },
          secondary: {
            main: "#F3C18E",
          },
        },
        breakpoints: {
          values: {
            xs: 0,
            sm: 600,
            md: 1000,
            lg: 1100,
            xl: 1536,
          },
        },
      }),
    [prefersDarkMode, appTheme]
  );

  return (
    <BrowserRouter>
      <UserContextProvider>
        <AuthProvider>
          <ThemeProvider theme={theme}>
            <GameSettingsContextProvider>
              <I18nextProvider i18n={i18n}>
                <SocketContextProvider>
                  <Wrapper>
                    <Socket>
                      <CssBaseline />
                      <MenuAppBar />
                      <Music />
                      <div style={{ marginTop: "90px" }}>
                        <div className="page-background">
                          <Switch>
                            <Route path="/" component={Home} exact />
                            <Route path="/signin" component={SignIn} exact />
                            <Route path="/signup" component={SignUp} exact />
                            <Route path="/game" component={Game} exact />
                            <Route path="/lobby" component={Lobby} exact />
                            <Route path="/404" component={Page404} />
                            <Redirect from="*" to="/404" />
                          </Switch>
                        </div>
                      </div>
                    </Socket>
                  </Wrapper>
                </SocketContextProvider>
              </I18nextProvider>
            </GameSettingsContextProvider>
          </ThemeProvider>
        </AuthProvider>
      </UserContextProvider>
    </BrowserRouter>
  );
}

export default App;
