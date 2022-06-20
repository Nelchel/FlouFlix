import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { makeStyles } from "@mui/styles";

import React from "react";
import { getAuth, signOut } from "firebase/auth";

const makeClass = makeStyles((theme) => ({
  signOut: {
    float: "right",
  },
}));

function SignOut() {
  const classes = makeClass();
  const auth = getAuth();

  const handleSubmit = async () => {
    signOut(auth)
      .then(() => {})
      .catch((error) => {
        // console.log(error)
      });
  };

  return (
    <Box className={classes.signOut} onClick={handleSubmit}>
      <Typography variant="body1">Se déconnecter</Typography>
    </Box>
  );
}

export default SignOut;
