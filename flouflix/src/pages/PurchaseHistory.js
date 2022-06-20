import React, { useState, useEffect } from "react";
import { Typography } from "@mui/material";
import { makeStyles,useTheme } from "@mui/styles";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
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

const PurchaseHistory = (props) => {

    const db = firebase.firestore();
    const auth = getAuth();
    const [uid, setUid] = useState("");
    const [moovieInMyCart, setMoovieInMyCart] = useState([]);
    const [movieId, setMovieId] = useState("");
    const [valdiate,setValidate] = useState(false);
    const [infoPurchase,setInfoPurchase] = useState([]);
    const [value,setValue] = useState([]);
    const [command,setCommand] = useState([]);
    const [userCurrent, setUserCurrent] = useState(undefined);

//Récupération des informations de transaction de la BDD
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
    let transactions = [];
    db.collection("purchase")
      .where("idUser", "==", uid)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            transactions.push(doc.data());
        });
        if(transactions[0]!== undefined){
            setCommand(transactions)
            setValue(transactions[0].purchase)
        }
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });

  }, [uid]);


    return(
        <Box>
            {command !== undefined && 
                <Box>
                    {command.map((item,index)=>{
                        return(
                            <Box sx={{border:1}}>
                                <Typography variant="h6" color='secondary'>
                                    Commande n°{index+1}
                                </Typography>
                            {command[index].purchase.map((item,index) => {
                                return (
                                    <>
                                        <Typography>
                                            Article n°{index+1}
                                        </Typography>
                                        <Box justifyContent='space-around' display="flex">
                                            <Typography>
                                                Nom du film : {item.name}
                                            </Typography>
                                            <Typography>
                                                Quantité acheté : {item.quantity}
                                            </Typography>
                                            <Typography>
                                                Prix du film a l'unité : {parseFloat(item.price).toFixed(2)} €
                                            </Typography>
                                            <Typography>
                                                Prix total : {parseFloat(item.price*item.quantity).toFixed(2)} €
                                            </Typography>
                                        </Box>
                                    </>
                                )
                            })}
                        </Box>
                        )
                    }) }
                </Box>
            }
        </Box>
    )
}


export default PurchaseHistory;