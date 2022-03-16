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
import Cards from "./Cards"

function CardsLists(props) {
const db = firebase.firestore();
    const auth = getAuth();
    const { movies } = props;


    const [uidUser, setUidUser] = useState("");
    const [userRef, setRefUser] = useState("");
    const [userData, setUserData] = useState([]);
    const [upFavoris, setUpFavoris] = useState([]);
    const [downFavoris, setDownFavoris] = useState("");

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
        if(uidUser) setUserData(await (await getDoc(userRef)).data());
    }, [uidUser, movies, upFavoris, downFavoris]);

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

    console.log(movies)

    return (<>
        <Box display="flex" justifyContent="space-evenly">
            <Cards 
                title={"Favoris"} 
                movies={movies} 
                isCardFavori={true} 
                userData={userData} 
                setUpFavoris={(movie) => setUpFavoris(movie)} 
                setDownFavoris={(movie) => setDownFavoris(movie)}>
            </Cards>
        </Box>
        <Box display="flex" justifyContent="space-evenly">
            <Cards 
                title={"Tous"} 
                movies={movies} 
                isCardFavori={false}
                userData={userData} 
                setUpFavoris={(movie) => setUpFavoris(movie)} 
                setDownFavoris={(movie) => setDownFavoris(movie)}>
            </Cards>
        </Box>
        </>
    )
}

export default CardsLists;