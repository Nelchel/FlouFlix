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
import { doc, updateDoc, getDoc } from "firebase/firestore";
import StarIcon from "@mui/icons-material/Star";
import { BrowserRouter as Router, Link, Outlet } from "react-router-dom";
import { Button } from "@mui/material";

const makeClass = makeStyles((theme) => ({
  signupButton: {
    marginRight: "10px",
  },
}));

function Catalogue() {
  const db = firebase.firestore();
  const auth = getAuth();

  const [getMovies, setMovies] = useState([]);
  const [uidUser, setUidUser] = useState("");
  const [userRef, setRefUser] = useState("");
  const [userData, setUserData] = useState([]);
  const [upFavoris, setUpFavoris] = useState([]);
  const [downFavoris, setDownFavoris] = useState("");

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

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUidUser(user.uid);
      }
    });
  }, []);

  useEffect(async () => {
    setRefUser(await doc(db, "users", uidUser));
    setUserData(await (await getDoc(userRef)).data());
  }, [uidUser, getMovies, upFavoris, downFavoris]);

  useEffect(async () => {
    if (userRef && userData && upFavoris.length > 0) {
      await updateDoc(userRef, {
        favoris: userData.favoris
          ? userData.favoris.concat(upFavoris)
          : upFavoris,
      });
      setUpFavoris([]);
    }
  }, [upFavoris]);

  useEffect(async () => {
    if (downFavoris) {
      await updateDoc(userRef, {
        favoris: userData.favoris.filter((e) => e !== downFavoris),
      });
      setDownFavoris("");
    }
  }, [downFavoris]);

  const handleSubmit = (movieId, method) => {
    if (!method) setUpFavoris([movieId]);
    else {
      setDownFavoris(movieId);
    }
  };

  const isFavoris = (movieId) => {
    return userData?.favoris?.includes(movieId);
  };

  return (
    <Box>
      <Typography variant="h1">Catalogue</Typography>
      <Box display="flex" justifyContent="space-evenly">
        {getMovies.map((movie, index) => {
          return (
            <Box maxWidth="345px">
              <Card style={{ minWidth: "345px" }}>
                <StarIcon
                  style={
                    isFavoris(movie.id) ? { fill: "red" } : { fill: "grey" }
                  }
                  onClick={() => handleSubmit(movie.id, isFavoris(movie.id))}
                />
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
                  <Link to={"/movie/" + movie.id}>
                    <Button>Voir la fiche</Button>
                  </Link>
                </CardContent>
              </Card>
            </Box>
          );
        })}
      </Box>
      <Outlet />
    </Box>
  );
}

export default Catalogue;
