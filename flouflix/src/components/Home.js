import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { makeStyles } from "@mui/styles";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Link,
  Outlet,
  useLocation,
} from "react-router-dom";
import Catalogue from "../pages/Catalogue";
import { SnackbarProvider, useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import { createBrowserHistory } from "history";
import Video from "./Video";
import CookieConsent, { Cookies } from "react-cookie-consent";


const makeClass = makeStyles((theme) => ({
  signupButton: {
    marginRight: "10px",
  },
  }));

function Home() {
  const classes = makeClass();
  const { enqueueSnackbar } = useSnackbar();

  const [exist, setExist] = useState();
  const [mail, setMail] = useState();

  const previousURL = localStorage.getItem("url");
  localStorage.removeItem("url");

  const auth = getAuth();

  onAuthStateChanged(auth, (user) => {
    if (user) {
      setMail(user.email);
      setExist(true);
      if (previousURL === "/inscription" || previousURL === "/connexion") {
        welcome(user.email);
      }
    } else {
      setExist(false);
    }
  });

  const welcome = (email) => {
    // variant could be success, error, warning, info, or default
    enqueueSnackbar(`Bienvenue ${email}`);
  };

  return (
    <Box>
      <Catalogue />
      <CookieConsent  enableDeclineButton flipButtons>Ce site utilise des cookies pour stocker et/ou accéder à des informations sur votre terminal. Cliquez sur "Accepter" pour consentir</CookieConsent>
    </Box>
  );
}

export default Home;
