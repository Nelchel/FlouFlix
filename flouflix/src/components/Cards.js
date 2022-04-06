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
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';

function Cards(props) {
    const { title, movies, isCardFavori } = props;

    //Action button
    const handleSubmit = (movieId) => {
        if (!isFavoris(movieId)) props.setUpFavoris([movieId]);
        else {
          props.setDownFavoris(movieId);
        }
    };

    const handleDragStart = (e) => e.preventDefault();

    const isFavoris = (movieId) => {
        return props.userData?.favoris?.includes(movieId);
    };

    const createCard = (movie) => {
      return (
        <Box maxWidth="345px" marginLeft="20px">
          <Card style={{ minWidth: "345px" }}>
            <StarIcon
              style={
                isFavoris(movie.id) ? { fill: "red" } : { fill: "grey" }
              }
              onClick={() => handleSubmit(movie.id)}
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
    }
    
    return (<>
    {/* {(!isCardFavori || (props.userData?.favoris?.length > 0)) && <Typography variant="h5">{title}</Typography>} */}
    {movies.map((movie, index) => {
      if (isCardFavori){
        if(props.userData?.favoris?.includes(movie.id)) return createCard(movie)
      }
      else return createCard(movie)
    })}</>) || <></>
}

export default Cards;