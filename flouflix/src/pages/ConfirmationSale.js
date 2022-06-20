import { Typography } from "@mui/material";
import { makeStyles,useTheme } from "@mui/styles";
import TextField from "@mui/material/TextField";

import React, { useState, useEffect } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import {
  getAuth,
  onAuthStateChanged,
} from "firebase/auth";
import {
  doc,
  updateDoc,
  setDoc,
  where,
  collection,
  getDocs, 
  query,
  arrayRemove,
} from "firebase/firestore";


const ConfirmationSale = (props) => {

  const db = firebase.firestore();
  const auth = getAuth();
  const [uid, setUid] = useState("");
  const [moovieInMyCart, setMoovieInMyCart] = useState([]);
  const [finalPrice,setFinalPrice] = useState(0);
  const [movieId, setMovieId] = useState("");
  const [valdiate,setValidate] = useState(false);
  const [quantity, setQuantity] = useState([]);
  const [userCurrent, setUserCurrent] = useState(undefined);

//Récupération des informations de la BDD
  useEffect(() => {
    onAuthStateChanged(
      auth,
      (user) => {
        if (user) {
          const uid = user.uid;
          setUid(uid);
        } else {
        }
      },
      [auth]
    );
    let user = [];
    db.collection("users")
      .where("uid", "==", uid)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          user.push(doc.data());
        });
        console.log(user[0])
        if(user[0]!== undefined){
            const quantityArray = user[0].myCart
            purchaseHisorty(user[0],quantityArray)
            suppr(quantityArray);
        }
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });

  }, [uid]);
//Suppréssion du panier
  const suppr = async (quantityArray) => {
      for (let index = 0; index < quantityArray.length; index++) {
          await updateDoc(doc(db, "users", uid),{
              "myCart":arrayRemove({idMoovie :quantityArray[index].idMoovie,Quantity : quantityArray[index].Quantity})
          }); 
      }
  }
//Ajout dans la table transaction
const purchaseHisorty = async(userCurrent,quantityArray) => {
    let movies = [];
    if (userCurrent !== undefined) {
      const cart = userCurrent.myCart;
      await Promise.all(
        cart.map(async (carte, index) => {
          const q = query(collection(db, "movies"), where("id", "==", carte.idMoovie));
          const querySnapshot = await getDocs(q);
          querySnapshot.forEach((doc) => {
            movies.push(doc.data());
          });
        })
      );
      console.log(movies)
      console.log(quantityArray)
      purchase(movies,quantityArray)
    }
}
const purchase = async(movies,quantityArray) => {
    let infoMovie = []
    for (let index = 0; index < movies.length; index++) {
        infoMovie.push({
            name : movies[index].name,
            idMoovie :quantityArray[index].idMoovie,
            quantity :quantityArray[index].Quantity,
            price : movies[index].price,
            idPrice : movies[index].id_price,
        })
        
    }
    console.log(infoMovie)
    if (uid !== "") {
        await db
        .collection("purchase")
        .add({
            idUser: uid,
            purchase : infoMovie,
        })
        .then(async (docRef) => {
          const movieRef = await doc(db, "purchase", docRef.id);
          setMovieId(docRef.id);
          console.log(docRef.id);
          await updateDoc(movieRef, {
            id: docRef.id,
          });
        })
        .catch((error) => {
          console.error("Error writing document: ", error);
        });
      window.location.replace(`/historique-achat`);
    }
}


return(
        <Typography>
            Confirmation de votre achat en cours...
            Veuillez patientez 
        </Typography>
    )
}


export default ConfirmationSale;