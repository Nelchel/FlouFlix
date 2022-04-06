import Box from "@mui/material/Box";
import React, { useState, useEffect } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import Cards from "./Cards"

function CardsLists(props) {
    
    const { userData, movies, isResearch } = props;

    return (<>
        {!isResearch && <Box display="flex" justifyContent="space-evenly">
            <Cards 
                title={"Favoris"} 
                movies={movies} 
                isCardFavori={true} 
                userData={userData} 
                setUpFavoris={(movie) => props.setUpFavoris(movie)} 
                setDownFavoris={(movie) => props.setDownFavoris(movie)}>
            </Cards>
        </Box>}
        {<Box display="flex" justifyContent="space-evenly">
            <Cards 
                title={"Tous"} 
                movies={movies} 
                isCardFavori={false}
                userData={userData} 
                setUpFavoris={(movie) => props.setUpFavoris(movie)} 
                setDownFavoris={(movie) => props.setDownFavoris(movie)}>
            </Cards>
        </Box>}
        </>
    )
}

export default CardsLists;