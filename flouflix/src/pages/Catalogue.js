import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { makeStyles } from "@mui/styles";
import React, { useState, useEffect } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { BrowserRouter as Router, Link, Outlet } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import Cards from "../components/Cards"

const makeClass = makeStyles((theme) => ({
  signupButton: {
    marginRight: "10px",
  },
}));

function Catalogue() {
  const db = firebase.firestore();
  
  const [getMovies, setMovies] = useState([]);

  useEffect(() => {
    let movies = [];
    db.collection("movies")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          movies.push(doc.data());
        });
        setMovies(movies);
      });
  }, []);

  return (
    <Box>
      <Typography variant="h1">Catalogue</Typography>
      <Box display="flex" justifyContent="space-evenly">
        <Cards movies={getMovies} isCardFavori={true}></Cards>
      </Box>
      <Box display="flex" justifyContent="space-evenly">
        <Cards movies={getMovies} isCardFavori={false}></Cards>

      </Box>
      <Outlet />
    </Box>
  );
}

export default Catalogue;
