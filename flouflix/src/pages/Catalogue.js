import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { makeStyles } from "@mui/styles";
import React, { useState, useEffect } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { collection, getDocs } from "firebase/firestore";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { CardActionArea } from "@mui/material";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

const makeClass = makeStyles((theme) => ({
  signupButton: {
    marginRight: "10px",
  },
}));

function Catalogue() {
  const db = firebase.firestore();
  let movies = [];

  const [getMovies, setMovies] = useState([]);

  db.collection("movies")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        movies.push(doc.data());
      });
      setMovies(movies);
    });


  return (
    <Box>
      <Typography variant="h1">Catalogue</Typography>
      <Box display="flex" justifyContent="space-evenly">
        {getMovies.map((movie, index) => {
          return (
            <Box maxWidth="345px">
              <Card style={{ minWidth: "345px" }}>
                <CardMedia
                  component="img"
                  height="140"
                  image={movie.url}
                  alt="green iguana"
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {movie.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {movie.description}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}

export default Catalogue;
