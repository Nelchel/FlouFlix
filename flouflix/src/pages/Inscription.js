import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { makeStyles } from "@mui/styles";
import TextField from "@mui/material/TextField";
import React, { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { initializeApp } from "firebase/app";

const makeClass = makeStyles((theme) => ({
  signupButton: {
    marginRight: "10px",
  },
}));

function Inscription({ firebaseConfig }) {
  const classes = makeClass();

  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();

  const [mailAddress, setMailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [userLog, setUserLog] = useState("");

  const handleChangeMail = (event) => {
    setMailAddress(event.target.value);
  };

  const handleChangePassword = (event) => {
    setPassword(event.target.value);
  };

  const auth = getAuth();

  const handleSubmit = async () => {
    createUserWithEmailAndPassword(auth, mailAddress, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        setUserLog(user.uid);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // console.log(errorCode)
        // console.log(errorMessage)
      });

    db.collection("users")
      .doc(userLog)
      .set({
        uid: userLog,
        mailAddress: mailAddress,
        password: password,
      })
      .then(() => {
        console.log("Document successfully written!");
      })
      .catch((error) => {
        console.error("Error writing document: ", error);
      });
  };

  return (
    <Box>
      <TextField
        value={mailAddress}
        id="outlined-required"
        label="Adresse mail"
        defaultValue="mon-adresse@gmail.com"
        onChange={handleChangeMail}
      />
      <TextField
        type="password"
        value={password}
        id="outlined-required"
        label="Password"
        defaultValue="password"
        onChange={handleChangePassword}
      />
      <Button variant="contained" color="error" onClick={handleSubmit}>
        <Typography>S'inscrire</Typography>
      </Button>
    </Box>
  );
}

export default Inscription;
