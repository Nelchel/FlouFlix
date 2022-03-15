import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Icon from "@mui/material/Icon"
import { makeStyles } from "@mui/styles";
import TextField from "@mui/material/TextField";
import React, { useState } from "react";
import { getAuth, signOut } from "firebase/auth";


function MyCart() {

    return(
        <Box>
          <Typography variant="h2">Page du panier</Typography>
        </Box>
    );
}
export default MyCart;
