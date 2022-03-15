import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { makeStyles } from "@mui/styles";
import React, { useState, useEffect } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";

const makeClass = makeStyles((theme) => ({
  signupButton: {
    marginRight: "10px",
  },
}));

function MyMovies() {
  const db = firebase.firestore();

  const [uid, setUid] = useState("");
  const [movies, setMovies] = useState([]);
  const getMovies = [];

  const auth = getAuth();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        setUid(uid);
      } else {
      }
    });
    db.collection("movies")
    .where("seller", "==", uid)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        // console.log(doc.id, " => ", doc.data());
        getMovies.push(doc.data());
      });
      setMovies(getMovies);
      console.log(getMovies)
    })
    .catch((error) => {
      console.log("Error getting documents: ", error);
    });
  }, [uid]) 


  return (
    <Box>
      <Typography variant="h1">Mes films</Typography>
      <Box display="flex" justifyContent="space-evenly">
        {movies.map((movie, index) => {
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

export default MyMovies;
