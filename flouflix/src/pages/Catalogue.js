import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { makeStyles } from "@mui/styles";
import React, { useState } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

const makeClass = makeStyles((theme) => ({
  signupButton: {
    marginRight: "10px",
  },
}));

function Catalogue() {
  const classes = makeClass();
  const db = firebase.firestore();

  const [uid, setUid] = useState("");
  const [user, setUser] = useState();
  const tmp = localStorage.getItem("user");

  var docRef = db.collection("users").doc(tmp);
  docRef
    .get()
    .then((doc) => {
      if (doc.exists) {
        setUid(doc.data().uid)
        setUser(doc.data().mailAddress)
      } else {
        console.log("No such document!");
      }
    })
    .catch((error) => {
      console.log("Error getting document:", error);
    });


  return (
    <Box>
      <Typography variant="h1">Catalogue</Typography>
      <Typography variant="h2">Bienvenue {user}</Typography>
    </Box>
  );
}

export default Catalogue;
