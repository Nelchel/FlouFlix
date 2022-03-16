import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { makeStyles } from "@mui/styles";
import TextField from "@mui/material/TextField";
import React, { useState } from "react";
import { getAuth, signOut } from "firebase/auth";


const makeClass = makeStyles((theme) => ({
  signOut: {
    float: "right",
  },
}));

function Connexion() {
  const classes = makeClass();
  
  const auth = getAuth();


     const handleSubmit = () => {
        signOut(auth).then(() => {
          }).catch((error) => {
            // An error happened.
          });
     
        window.location.replace(`/`);
    }



  return ( 
    <Box className={classes.signOut}>
      <Button onClick={handleSubmit} variant="outlined" color="secondary">
          <Typography variant="body1">Se déconnecter</Typography>
      </Button>
    </Box>
  );
}

export default Connexion;