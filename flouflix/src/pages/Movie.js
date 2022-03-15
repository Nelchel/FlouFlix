import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { makeStyles } from "@mui/styles";
import React, { useState, useEffect } from "react";
import firebase from "firebase/compat/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useSearchParams } from "react-router-dom";
import { useParams } from "react-router-dom";
import { Button } from "@mui/material";

const makeClass = makeStyles((theme) => ({
  signupButton: {
    marginRight: "10px",
  },
}));

function Movie() {
  const db = firebase.firestore();
  let { id } = useParams();
  const [uid, setUid] = useState("");
  const getMovies = [];
  const [movies, setMovies] = useState([]);

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
      .where("id", "==", id)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          // console.log(doc.id, " => ", doc.data());
          getMovies.push(doc.data());
        });
        setMovies(getMovies);
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
  }, [uid]);
  console.log(movies);
  return (
    <section>
      <Box>
        <Box>
          <Typography variant="h2">{movies[0].name}</Typography>
          <img src={movies[0].url} width="300" height="300" />
          <Typography variant="body1">{movies[0].description}</Typography>
        </Box>
        <Button>Ajouter au panier</Button>
      </Box>
    </section>
  );
}

export default Movie;
