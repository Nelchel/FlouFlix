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
    console.log(uid)
    let transactions = [];
    db.collection("purchase")
      .where("idUser", "==", uid)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            transactions.push(doc.data());
        });
        if(transactions[0]!== undefined){
            // infoPurchaseFunction(transactions)
            setValue(transactions[0].purchase)
        }
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });

  }, [uid]);


//   const infoPurchaseFunction = (transactions) => {
//       let info = []
//       for (let index = 0; index < transactions[0].purchase.length; index++) {
//           info.push({
//               prix : transactions[0].purchase[index].price,
//               quantity : transactions[0].purchase[index].quantity,
//               name : transactions[0].purchase[index].idMoovie,
//           })
//           setInfoPurchase(info)
//       }
//   }

console.log(value)
    return(
        <Box>
            {value !== undefined && 
            <Box>
                {value.map((item,index) => {
                    return (
                        <>
                            <Typography>
                                Film n°{index+1}
                            </Typography>
                            <Box justifyContent='space-around' display="flex">
                                <Typography>
                                    Id du film : {item.idMoovie}
                                </Typography>
                                <Typography>
                                    Quantité acheté : {item.quantity}
                                </Typography>
                                <Typography>
                                    Prix du film a l'unité : {item.price}
                                </Typography>
                            </Box>
                        </>
                    )
                })}
            </Box>
            }
            {/* {value!== undefined && (
                value.purchase.map((purchase, index) => {
                    console.log(purchase);
                    return(
                        <Box key={index}>
                            <Typography>
                                {purchase[index].name}
                                {purchase[index].quantity}
                                {purchase[index].prix}
                            </Typography>
                        </Box>
                    )
                })
            )} */}
        </Box>
    )
}


export default PurchaseHistory;