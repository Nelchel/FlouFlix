import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import React, { useState, useEffect } from "react";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import StarIcon from "@mui/icons-material/Star";
import { BrowserRouter as Router, Link, Outlet } from "react-router-dom";
import { Button } from "@mui/material";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import Carousel from "react-multi-carousel";
import { makeStyles } from "@mui/styles";

const makeClass = makeStyles((theme) => ({
  cardContainer: {
    backgroundColor: `${theme.palette.primary.main} !important`,
    minWidth: "320px",
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
    backgroundColor: theme.palette.primary.dark,
    padding: "10px !important",
  },
}));

function Cards(props) {
  const { title, movies, isCardFavori } = props;

  //Action button
  const handleSubmit = (movieId) => {
    if (!isFavoris(movieId)) props.setUpFavoris([movieId]);
    else {
      props.setDownFavoris(movieId);
    }
  };

  const classes = makeClass();
  const handleDragStart = (e) => e.preventDefault();

  const isFavoris = (movieId) => {
    return props.userData?.favoris?.includes(movieId);
  };

  // console.log(props.userData?.favoris?.length)

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

  // console.log(movies);

  // console.log(movie)
  return (
    <>
      <Typography variant="h5" className={classes.titleCategory}>
        {title}
      </Typography>
      <Carousel responsive={responsive}>
        {movies.map((movie, index) => {
          return (
            <Box maxWidth="370px" marginLeft="20px" position="relative">
              <Card className={classes.cardContainer} elevation={0}>
                <StarIcon
                  className={classes.starFavoris}
                  style={
                    isFavoris(movie.id)
                      ? { fill: "yellow" }
                      : { fill: "#282828" }
                  }
                  onClick={() => handleSubmit(movie.id)}
                />
                <CardMedia
                  component="img"
                  height="360"
                  image={movie.url}
                  alt={movie.name}
                />
                <CardContent className={classes.cardContentContainer}>
                  <div className={classes.cardContent}>
                    <Typography color="white" variant="h5">
                      {movie.name}
                    </Typography>
                    <Link to={"/movie/" + movie.id} className={classes.link}>
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
    </>
  );
}

export default Cards;
