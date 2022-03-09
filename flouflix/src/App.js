import logo from "./logo.svg";
import React, { Fragment } from "react";
import "./App.css";
import { initializeApp } from "firebase/app";
import Box from "@mui/material/Box";
import { CircularProgress, Typography } from "@mui/material";
import { Routes, Route, Outlet, Link, BrowserRouter } from "react-router-dom";
import Nav from "./components/Nav";
import Home from "./components/Home";
import Inscription from "./pages/Inscription";

function App({ firebaseConfig }) {
  return (
    <BrowserRouter>
      <React.Fragment>
        <div className="App">
          <header className="App-header">
            <link
              rel="stylesheet"
              href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
            />
          </header>
          <body>
            <Routes>
              <Route path="/" element={<Nav />}>
                <Route index element={<Home />} />
                <Route path="inscription" element={<Inscription />} />
                {/* <Route path="*" element={<NoMatch />} /> */}
              </Route>
            </Routes>
          </body>
        </div>
      </React.Fragment>
    </BrowserRouter>
  );
}

export default App;


