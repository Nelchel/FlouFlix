import { Typography, useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import { makeStyles } from "@mui/styles";
import { Link } from "react-router-dom";

import React from "react";
import { getAuth, signOut } from "firebase/auth";

const makeClass = makeStyles((theme) => ({
  link: {
    textDecoration: "unset",
    width: "auto",
    "&:hover": {
      textDecoration: "underline",
      color: "white",
    },
  },
}));

function Footer() {
  const classes = makeClass();
  const theme = useTheme();

  return (
    <Box
      maxWidth="100vw"
      padding="30px 0"
      left="0"
      bottom="-90px"
      position="relative"
      minWidth="100vw"
      borderTop="1px solid #464646"
    >
      <Box width="fit-content" margin="auto">
        <Link to="/legal" className={classes.link}>
          <Typography color={theme.palette.text.white} variant="body2">
            Mentions légales
          </Typography>
        </Link>
      </Box>
    </Box>
  );
}

export default Footer;
