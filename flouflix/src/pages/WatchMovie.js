import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { makeStyles } from "@mui/styles";

import { useParams } from "react-router-dom";
import React, { useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import firebase from "firebase/compat/app";
import { collection, query, where, getDocs } from "firebase/firestore";

const makeClass = makeStyles((theme) => ({
  signOut: {
    float: "right",
  },
}));

function WatchMovie() {
  const classes = makeClass();
  const auth = getAuth();
  const db = firebase.firestore();

  const [uid, setUid] = React.useState("");
  const [idFilm, setIdFilm] = React.useState("");
  const [userData, setUserData] = React.useState([]);
  const getMovies = [];
  const [movies, setMovies] = React.useState([]);

  let { id } = useParams();
  useEffect(() => {
    onAuthStateChanged(
      auth,
      (user) => {
        if (user) {
          const uid = user.uid;
          setUid(uid);
        } else {
        }
      },
      [auth]
    );

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
    <Box>
      {movies.length !== undefined && movies.length > 0 && (
        <video controls>
          <source src={movies[0].movieUrl} type="video/mp4"></source>
        </video>
      )}
    </Box>
  );
}

export default WatchMovie;
