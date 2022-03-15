import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { makeStyles } from "@mui/styles";
import TextField from "@mui/material/TextField";
import React, { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const makeClass = makeStyles((theme) => ({
  signupButton: {
    marginRight: "10px",
  },
}));

function Connexion() {
  const classes = makeClass();
  const [mailAddress, setMailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [userLog, setUserLog] = useState("");
  

  const handleChangeMail = (event) => {
    setMailAddress(event.target.value)
  }

  const handleChangePassword = (event) => {
    setPassword(event.target.value)
  }

  const auth = getAuth();

     const handleSubmit = () => {
      signInWithEmailAndPassword(auth, mailAddress, password)
      .then((userCredential) => {
        const user = userCredential.user;
        setUserLog(user.uid);
        console.log(auth)
        window.location.replace(`/`);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage)
      });
    }


  return ( 

    <Box display="flex" flexDirection='column' align="center" width="375px" margin="auto">
     <Typography align="center">
      Connexion 
      </Typography>
     
      <TextField
        required
        value={mailAddress}
        id="outlined-required"
        label="Adresse mail"
        defaultValue="mon-adresse@gmail.com"
        onChange={handleChangeMail}
             
      />
      <TextField
        required
        type="password"
        value={password}
        id="outlined-required"
        label="Mot de passe"
        defaultValue="password"
        onChange={handleChangePassword}
        display="flex" 
        alignItems="center"
        justifyContent="center"

        />
      <Button variant="contained" color="error" onClick={handleSubmit}  >
        <Typography>  
          Connexion 
        </Typography>
      </Button>
    </Box>

  );
}

export default Connexion;