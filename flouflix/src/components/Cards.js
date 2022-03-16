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

function Cards(props) {
    const db = firebase.firestore();
    const auth = getAuth();
    const { title, movies, isCardFavori } = props;

    //Action button
    const handleSubmit = (movieId) => {
        if (!isFavoris(movieId)) props.setUpFavoris([movieId]);
        else {
          props.setDownFavoris(movieId);
        }
    };

    const isFavoris = (movieId) => {
        return props.userData?.favoris?.includes(movieId);
    };

    const createCard = (movie) => {
      return (
        <Box maxWidth="345px">
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
    {(!isCardFavori || (props.userData?.favoris?.length > 0)) && <Typography variant="h2">{title}</Typography>}
    {movies.map((movie, index) => {
      if (isCardFavori){
        if(props.userData?.favoris?.includes(movie.id)) return createCard(movie)
      }
      else return createCard(movie)
    })}</>) || <></>
}

export default Cards;