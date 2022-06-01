import React, { useEffect, useState } from "react";
import "./App.css";
import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
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
import WatchMovie from "./pages/WatchMovie";
import ConfirmationSale from "./pages/ConfirmationSale";
import PurchaseHistory from "./pages/PurchaseHistory";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import { getAuth, onAuthStateChanged } from "firebase/auth";

function App({ firebaseConfig, stripeConfig }) {
  firebase.initializeApp(firebaseConfig);
  const firebaseApp = initializeApp(firebaseConfig);
  const storage = getStorage(firebaseApp);

  const auth = getAuth();

  const [user, setUser] = useState();
  const [uid, setUid] = useState();
  const [exist, setExist] = useState();

  const theme = createTheme({
    palette: {
      primary: {
        main: "#212121",
        light: "#484848",
        dark: "#000000",
        contrastText: "#FFF",
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

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setExist(true);
        const uid = user.uid;
        setUid(uid);
      } else {
        setExist(false);
      }
    });
  }, [auth]);

  const ProtectedRoute = ({ children }) => {
    if (!exist) {
      return <Navigate to="/" replace />;
    }

    return children;
  };

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
                    path="mes-films"
                    element={
                      <ProtectedRoute>
                        <MyMovies />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="mon-panier"
                    element={
                      <ProtectedRoute>
                        <MyCart stripeConfig={stripeConfig} />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="confirmation-commande"
                    element={
                      // <ProtectedRoute>
                        <ConfirmationSale/>
                      // </ProtectedRoute>
                    }
                  />
                  <Route
                    path="Historique-achat"
                    element={
                      // <ProtectedRoute>
                        <PurchaseHistory/>
                      // </ProtectedRoute>
                    }
                  />
                  <Route path="movie/:id" element={<Movie />} />
                  <Route
                    path="modifier-film/:id"
                    element={
                      <ProtectedRoute>
                        <Modify />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="mon-compte"
                    element={
                      <ProtectedRoute>
                        <MyAccount />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/add">
                    <Route
                      path="/add/movie"
                      element={
                        <ProtectedRoute>
                          <AddMovie />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/add/dvd-movie"
                      element={
                        <ProtectedRoute>
                          <AddMovie />
                        </ProtectedRoute>
                      }
                    />
                  </Route>
                  <Route
                    path="/watch/:id"
                    element={
                      <ProtectedRoute>
                        <WatchMovie />
                      </ProtectedRoute>
                    }
                  />
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
