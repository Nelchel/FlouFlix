import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { makeStyles } from "@mui/styles";
import TextField from "@mui/material/TextField";
import React, { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const makeClass = makeStyles((theme) => ({
  signupButton: {
    marginRight: "10px",
  },
}));

function Inscription() {
  const classes = makeClass();
  const [mailAddress, setMailAddress] = useState("");
  const [password, setPassword] = useState("");

  const handleChangeMail = (event) => {
    setMailAddress(event.target.value)
  }

  const handleChangePassword = (event) => {
    setPassword(event.target.value)
  }

  const auth = getAuth();

  const handleSubmit = () => {
    createUserWithEmailAndPassword(auth, mailAddress, password)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      console.log(user)
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      // console.log(errorMessage)
    });
  }

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
        <Typography>
          S'inscrire
        </Typography>
      </Button>
    </Box>
  );
}

export default Inscription;
