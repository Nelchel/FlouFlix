import { Tooltip, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import React from "react";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import StarIcon from "@mui/icons-material/Star";
import { Link } from "react-router-dom";
import "react-alice-carousel/lib/alice-carousel.css";
import Carousel from "react-multi-carousel";
import { makeStyles } from "@mui/styles";
import "../css/CustomCaroussel.css";

const makeClass = makeStyles((theme) => ({
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
    borderRadius: "10px !important",
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

  return (
    <>
      {movies.length !== 0 && (
        <>
          <Typography variant="h5" className={classes.titleCategory}>
            {title}
          </Typography>
          <Carousel
            showDots={true}
            responsive={responsive}
            itemClass="carousel-item"
          >
            {movies.map((movie, index) => {
              return (
                <Box maxWidth="300px" marginLeft="20px" position="relative">
                  <Card className={classes.cardContainer} elevation={0}>
                    <Tooltip
                      title={
                        isFavoris(movie.id)
                          ? "Retirer des favoris"
                          : "Ajouter en favoris"
                      }
                    >
                      <StarIcon
                        className={classes.starFavoris}
                        style={
                          isFavoris(movie.id)
                            ? { fill: "yellow" }
                            : { fill: "#282828" }
                        }
                        onClick={() => handleSubmit(movie.id)}
                      />
                    </Tooltip>
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
        </>
      )}
    </>
  );
}

export default Cards;
