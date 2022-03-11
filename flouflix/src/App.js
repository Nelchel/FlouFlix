import React from "react";
import "./App.css";
import { Routes, Route, Outlet, Link, BrowserRouter } from "react-router-dom";
import firebase from "firebase/compat/app";
import Nav from "./components/Nav";
import Home from "./components/Home";
import Inscription from "./pages/Inscription";
import Connexion from "./pages/Connexion";
import Catalogue from "./pages/Catalogue";
import AddMovie from "./pages/AddMovie";

function App({ firebaseConfig }) {
  firebase.initializeApp(firebaseConfig);

  return (
    <BrowserRouter>
      <React.Fragment>
        <Routes>
          <Route path="/" element={<Nav />}>
            <Route index element={<Home />} />
            <Route path="inscription" element={<Inscription />} />
            <Route path="connexion" element={<Connexion />} />
            <Route path="catalogue" element={<Catalogue />} />
            <Route path="ajouter-film" element={<AddMovie />} />
            {/* <Route path="*" element={<NoMatch />} /> */}
          </Route>
        </Routes>
      </React.Fragment>
    </BrowserRouter>
  );
}

export default App;