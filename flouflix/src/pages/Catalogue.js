/* eslint-disable react-hooks/exhaustive-deps */
import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { makeStyles } from "@mui/styles";
import React, { useState, useEffect } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { BrowserRouter as Router, Link, Outlet } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import CardsLists from "../components/CardsLists";
import ResearchBar from "../components/ResearchBar";
import { Container } from "@mui/material";
import Footer from "../components/Footer";

const makeClass = makeStyles((theme) => ({
  signupButton: {
    marginRight: "10px",
  },
}));

function Catalogue() {
  const db = firebase.firestore();
  const auth = getAuth();

  //Get User
  const [uidUser, setUidUser] = useState("");
  const [userRef, setRefUser] = useState("");
  const [userData, setUserData] = useState([]);

  //Set Favori
  const [getMovies, setMovies] = useState([]);
  const [upFavoris, setUpFavoris] = useState([]);
  const [downFavoris, setDownFavoris] = useState("");

  //Set Filter
  const [inputText, setInputText] = useState("");
  const [inputFilter, setFilter] = useState({});

  const [displayList, setDisplayList] = useState("");

  //Set UID  User
  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUidUser(user.uid);
      }
    });
  }, []);

  //Get data User
  useEffect(async () => {
    setRefUser(await doc(db, "users", uidUser));
    if (uidUser) setUserData(await (await getDoc(userRef)).data());
  }, [uidUser, upFavoris, downFavoris, getMovies]);

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

  //Add film favori
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

  //Remove film favori
  useEffect(async () => {
    if (userRef && userData && downFavoris.length > 0) {
      await updateDoc(userRef, {
        favoris: userData.favoris.filter((e) => e !== downFavoris),
      });
      setDownFavoris("");
    }
  }, [downFavoris]);

  return (
    <>
      <section>
        <Container maxWidth="1250px">
          <Box paddingTop="50px">
            <ResearchBar
              userData={userData}
              setUpFavoris={(movie) => setUpFavoris(movie)}
              setDownFavoris={(movie) => setDownFavoris(movie)}
              setInputText={(text) => setInputText(text)}
              setFilter={(filter) => setFilter(filter)}
              setDisplayList={(isDisplay) => setDisplayList(isDisplay)}
              allInput={{ getMovies, inputText, inputFilter, displayList }}
            ></ResearchBar>
            {/* <Typography variant="h1">Catalogue</Typography> */}
            {!displayList && (
              <CardsLists
                userData={userData}
                movies={getMovies}
                setUpFavoris={(movie) => setUpFavoris(movie)}
                setDownFavoris={(movie) => setDownFavoris(movie)}
              ></CardsLists>
            )}
            <Outlet />
          </Box>
        </Container>
      </section>
      <Footer />
    </>
  );
}

export default Catalogue;
