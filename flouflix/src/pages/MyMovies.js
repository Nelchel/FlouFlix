import { Container, Typography } from "@mui/material";
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
import { BrowserRouter as Router, Link, Outlet } from "react-router-dom";
import Button from "@mui/material/Button";
import { collection, query, where, getDocs } from "firebase/firestore";
import "react-alice-carousel/lib/alice-carousel.css";
import Carousel from "react-multi-carousel";
import Tooltip from "@mui/material";

const makeClass = makeStyles((theme) => ({
  link: {
    textDecoration: "unset !important",
  },
  button: {
    boxShadow: "unset !important",
    textTransform: "unset !important",
  },
  cardContainer: {
    borderRadius: "10px !important",
    backgroundColor: `transparent !important`,
    color: theme.palette.text.white,
  },
  linkToFilm: {
    color: theme.palette.text.white,
    textDecoration: "unset",
    textTransform: "initial",
    "&:hover": {
      textDecoration: "underline",
    },
  },
  link: {
    color: theme.palette.text.white,
    textDecoration: "unset",
  },
  cardContent: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    paddingRight: "0 !important",
    paddingLeft: "0 !important",
  },
  starFavoris: {
    position: "absolute",
    right: "10px",
    top: "10px",
    cursor: "pointer",
  },
  titleCategory: {
    marginLeft: "20px !important",
    padding: "25px 0 15px 0",
  },
  cardContentContainer: {
    backgroundColor: "transparent",
    padding: "10px !important",
  },
  cardMedia: {
    borderRadius: "10px",
  },
}));

function MyMovies() {
  const db = firebase.firestore();
  const classes = makeClass();

  const [uid, setUid] = useState("");
  const [movies, setMovies] = useState([]);
  const getMovies = [];

  const auth = getAuth();

  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 5,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

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
        console.log(getMovies);
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
  }, [uid]);

  return (
    <section>
      <Container maxWidth="1250px">
        <Box paddingTop="20px">
          <Box
            paddingBottom="50px"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h2">Mes films</Typography>
            <Link to="/add/movie" className={classes.link}>
              <Button
                variant="contained"
                color="secondary"
                className={classes.button}
              >
                <Typography variant="body1">Ajouter un film</Typography>
              </Button>
            </Link>
          </Box>
          <Carousel
            showDots={true}
            responsive={responsive}
            itemClass="carousel-item"
          >
            {movies.map((movie, index) => {
              return (
                <Box maxWidth="300px" marginLeft="20px" position="relative">
                  <Card className={classes.cardContainer} elevation={0}>
                    <CardMedia
                      component="img"
                      height="400"
                      image={movie.url}
                      alt={movie.name}
                      className={classes.cardMedia}
                    />
                    <CardContent className={classes.cardContentContainer}>
                      <div className={classes.cardContent}>
                        <Typography color="white" variant="h5">
                          {movie.name}
                        </Typography>
                        <Link
                          to={"/movie/" + movie.id}
                          className={classes.link}
                        >
                          <Typography
                            variant="body1"
                            className={classes.linkToFilm}
                          >
                            Plus d'infos →
                          </Typography>
                        </Link>
                      </div>
                      <Typography variant="body2" color="gray">
                        {movie.releaseDate}
                      </Typography>
                    </CardContent>
                  </Card>
                </Box>
              );
            })}
          </Carousel>
        </Box>
      </Container>
    </section>
  );
}

export default MyMovies;
