import Box from "@mui/material/Box";
import React, { useState, useEffect } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, updateDoc, getDocs, collection } from "firebase/firestore";
import Cards from "./Cards";

import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Typography from "@mui/material/Typography";

function CardsLists(props) {
  const { userData, movies, isResearch } = props;

  const db = firebase.firestore();

  const [favoris, setFavoris] = useState([]);
  const [arrayFavoris, setArrayFavoris] = useState([]);
  const test = [];

  useEffect(() => {
    setFavoris(userData.favoris);
  }, [userData]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    let movies = [];
    db.collection("movies")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          favoris.forEach((item, index) => {
            if (doc.id === item) {
              test.push(doc.data());
            }
          });
        });
        setArrayFavoris(test);
      });
  }, [favoris]);

  return (
    <>
      {!isResearch && (
        <>
          {arrayFavoris !== [] && (
            <Cards
              title={"Favoris"}
              movies={arrayFavoris}
              isCardFavori={true}
              userData={userData}
              setUpFavoris={(movie) => props.setUpFavoris(movie)}
              setDownFavoris={(movie) => props.setDownFavoris(movie)}
            />
          )}
        </>
      )}
      {
        <>
          <Cards
            title={"Nouveautés"}
            movies={movies}
            isCardFavori={false}
            userData={userData}
            setUpFavoris={(movie) => props.setUpFavoris(movie)}
            setDownFavoris={(movie) => props.setDownFavoris(movie)}
          />
        </>
      }
    </>
  );
}

export default CardsLists;
