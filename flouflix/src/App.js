import logo from "./logo.svg";
import React, { Fragment } from "react";
import "./App.css";
import { initializeApp } from "firebase/app";
import Box from "@mui/material/Box";
import { CircularProgress, Typography } from "@mui/material";
import { Routes, Route, Outlet, Link, BrowserRouter } from "react-router-dom";
import firebase from 'firebase/compat/app'
import Nav from "./components/Nav";
// import Home from "./components/Home";
import Inscription from "./pages/Inscription";
import Connexion from "./pages/Connexion";


function App({ firebaseConfig }) {
  const app = initializeApp(firebaseConfig);
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
                <Route path="connexion" element={<Connexion />} />
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

function Layout() {
  return (
    <div>
      {/* A "layout route" is a good place to put markup you want to
          share across all the pages on your site, like navigation. */}
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/dashboard">Dashboard</Link>
          </li>
          <li>
            <Link to="/nothing-here">Nothing Here</Link>
          </li>
        </ul>
      </nav>

      <hr />

      {/* An <Outlet> renders whatever child route is currently active,
          so you can think about this <Outlet> as a placeholder for
          the child routes we defined above. */}
      <Outlet />
    </div>
  );
}

function Home() {
  return (
    <div>
      <h2>Home</h2>
    </div>
  );
}

function About() {
  return (
    <div>
      <h2>About</h2>
    </div>
  );
}

function Dashboard() {
  return (
    <div>
      <h2>Dashboard</h2>
    </div>
  );
}

function NoMatch() {
  return (
    <div>
      <h2>Nothing to see here!</h2>
      <p>
        <Link to="/">Go to the home page</Link>
      </p>
    </div>
  );
}
