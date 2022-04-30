import React from "react";
import "./App.css";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import firebase from "firebase/compat/app";
import { getStorage } from "firebase/storage";
import { initializeApp } from "firebase/app";
import { SnackbarProvider } from "notistack";
import { GeoapifyContext } from "@geoapify/react-geocoder-autocomplete";

import Nav from "./components/Nav";
import Home from "./components/Home";

import Inscription from "./pages/Inscription";
import Connexion from "./pages/Connexion";
import Catalogue from "./pages/Catalogue";
import AddMovie from "./pages/AddMovie";
import MyMovies from "./pages/MyMovies";
import MyCart from "./pages/MyCart";
import Movie from "./pages/Movie";
import Modify from "./pages/Modify";
import MyAccount from "./pages/MyAccount";

import { createTheme, ThemeProvider } from "@mui/material/styles";

function App({ firebaseConfig }) {
  firebase.initializeApp(firebaseConfig);
  const firebaseApp = initializeApp(firebaseConfig);
  const storage = getStorage(firebaseApp);

  const theme = createTheme({
    palette: {
      primary: {
        main: "#212121",
        light: "#484848",
        dark: "#000000",
      },
      secondary: {
        main: "#E50914",
        light: "#ff5740",
        dark: "#aa0000",
      },
      text: {
        white: "#FFF",
        black: "#333",
      },
      succes: "#FFF",
    },
  });

  const state = {
    videosMetaInfo: [],
    selectedVideoId: null,
  };

  function onPlaceSelect(value) {
    console.log(value);
  }

  function onSuggectionChange(value) {
    console.log(value);
  }

  function preprocessHook(value) {
    return `${value}, Munich, Germany`;
  }

  function postprocessHook(feature) {
    return feature.properties.street;
  }

  function suggestionsFilter(suggestions) {
    const processedStreets = [];

    const filtered = suggestions.filter((value) => {
      if (
        !value.properties.street ||
        processedStreets.indexOf(value.properties.street) >= 0
      ) {
        return false;
      } else {
        processedStreets.push(value.properties.street);
        return true;
      }
    });

    return filtered;
  }

  return (
    <GeoapifyContext apiKey="f99dc96855554b5e94169e8f6015c05c">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <SnackbarProvider
            anchorOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
          >
            <React.Fragment>
              <Routes>
                <Route path="/" element={<Nav />}>
                  <Route index element={<Home />} />
                  <Route path="inscription" element={<Inscription />} />
                  <Route path="connexion" element={<Connexion />} />
                  <Route path="catalogue" element={<Catalogue />} />
                  <Route
                    path="ajouter-film"
                    element={<AddMovie storage={storage} />}
                  />
                  <Route path="mes-films" element={<MyMovies />} />
                  <Route path="mon-panier" element={<MyCart />} />
                  <Route path="movie/:id" element={<Movie />} />
                  <Route path="modifier-film/:id" element={<Modify />} />
                  <Route path="mon-compte" element={<MyAccount />} />
                  {/* <Route path="*" element={<NoMatch />} /> */}
                </Route>
              </Routes>
            </React.Fragment>
          </SnackbarProvider>
        </ThemeProvider>
      </BrowserRouter>
    </GeoapifyContext>
  );
}

export default App;
