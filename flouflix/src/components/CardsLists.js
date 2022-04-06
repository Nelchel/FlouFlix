import Box from "@mui/material/Box";
import React, { useState, useEffect } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import Cards from "./Cards";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import Typography from "@mui/material/Typography";

function CardsLists(props) {
  const { userData, movies, isResearch } = props;

  const items = [];

  return (
    <>
      {!isResearch && (
        <>
          <Typography variant="h5">Favoris</Typography>
          <AliceCarousel mouseTracking>
            <Cards
              title={"Favoris"}
              movies={movies}
              isCardFavori={true}
              userData={userData}
              setUpFavoris={(movie) => props.setUpFavoris(movie)}
              setDownFavoris={(movie) => props.setDownFavoris(movie)}
            />
          </AliceCarousel>
        </>
      )}
      {
        <>
          <Typography variant="h5">Nouveautés</Typography>
          <AliceCarousel mouseTracking>
            <Box display="flex" justifyContent="flex-start">
              <Cards
                title={"Nouveautés"}
                movies={movies}
                isCardFavori={false}
                userData={userData}
                setUpFavoris={(movie) => props.setUpFavoris(movie)}
                setDownFavoris={(movie) => props.setDownFavoris(movie)}
              />
            </Box>
          </AliceCarousel>
        </>
      }
    </>
  );
}

export default CardsLists;
