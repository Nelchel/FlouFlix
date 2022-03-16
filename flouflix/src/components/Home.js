import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { makeStyles } from "@mui/styles";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useState } from "react";
import {
  BrowserRouter as Router,
  Link,
  Outlet,
} from "react-router-dom";
import Catalogue from "../pages/Catalogue";
const makeClass = makeStyles((theme) => ({
  signupButton: {
    marginRight: "10px",
  },
}));

function Home() {
  const classes = makeClass();

  const [exist, setExist] = useState();
  const [mail, setMail] = useState();

  const auth = getAuth();

  onAuthStateChanged(auth, (user) => {
    if (user) {
      setMail(user.email);
      setExist(true);
    } else {
      setExist(false);
    }
  });

  return (
    <Box>
      {exist === true && (
        <Box>
          <Typography variant="h2">Bienvenue {mail}</Typography>
        </Box>
      )}
      <Catalogue />
    </Box>
  );
}

export default Home;
