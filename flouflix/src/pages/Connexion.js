import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { makeStyles } from "@mui/styles";
import TextField from "@mui/material/TextField";
import { Container } from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";

import React, { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { Link } from "react-router-dom";

const makeClass = makeStyles((theme) => ({
  loginButton: {
    padding: "10px 20px !important",
    marginTop: "20px !important",
    margin: "auto",
    maxWidth: "122px",
  },
  linkColor: {
    color: theme.palette.text.black,
    marginLeft: "5px",
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline",
    },
  },
  required: {
    position: "absolute",
    top: "75px",
    left: "35%",
    backgroundColor: "#fff",
    padding: "5px 15px",
    borderRadius: "5px",
    color: "#333",
    transform: "translateX(-50%)",
    boxShadow: "2px 2px 10px 0 rgba(0, 0, 0, 0.5)",
    minWidth: "fit-content",
    zIndex: 99,
    display: "flex",
    alignItems: "center",
    "&::after": {
      content: "''",
      position: "absolute",
      backgroundColor: "inherit",
      top: "-6px",
      left: "50%",
      bgcolor: theme.palette.background.dark,
      width: "13px",
      height: "13px",
      transform: "translateX(-50%) rotate(45deg)",
    },
    [theme.breakpoints.down("sm")]: {
      left: "45%",
    },
    [theme.breakpoints.down("xs")]: {
      top: "96px",
    },
  },
  requiredError: {
    position: "absolute",
    top: "75px",
    left: "50%",
    backgroundColor: "#fff",
    padding: "5px 15px",
    borderRadius: "5px",
    color: "#333",
    transform: "translateX(-50%)",
    boxShadow: "2px 2px 10px 0 rgba(0, 0, 0, 0.5)",
    minWidth: "fit-content",
    zIndex: 99,
    display: "flex",
    alignItems: "center",
    "&::after": {
      content: "''",
      position: "absolute",
      backgroundColor: "inherit",
      top: "-6px",
      left: "50%",
      bgcolor: theme.palette.background.dark,
      width: "13px",
      height: "13px",
      transform: "translateX(-50%) rotate(45deg)",
    },
    [theme.breakpoints.down("sm")]: {
      left: "45%",
    },
    [theme.breakpoints.down("xs")]: {
      top: "96px",
    },
  },
}));

function Connexion() {
  const classes = makeClass();
  const auth = getAuth();

  localStorage.setItem("url", window.location.pathname);

  const [mailAddress, setMailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [userLog, setUserLog] = useState("");
  const [isValid, setValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    signInWithEmailAndPassword(auth, mailAddress, password)
      .then((userCredential) => {
        const user = userCredential.user;
        setUserLog(user.uid);
        window.location.replace(`/`);
      })
      .catch((error) => {
        const errorCode = error.code;
        console.log(errorCode);
        if (error.code === "auth/user-not-found") {
          setErrorMessage("Il n'existe aucun compte associé à cet email.");
        }
      });
  };

  function ValidateEmail(mail) {
    const mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (mail.match(mailformat)) {
      return true;
    }
    return false;
  }

  return (
    <section>
      <Container maxWidth="1250px">
        <Box
          display="flex"
          flexDirection="column"
          align="center"
          maxWidth="375px"
          margin="auto"
        >
          <Box padding="50px 0 20px 0">
            <Typography variant="h2" component="h1" align="center">
              Connexion
            </Typography>
          </Box>
          <form>
            <Box align="center" textAlign="center">
              <Box paddingBottom="20px" position="relative">
                <TextField
                  fullWidth
                  required
                  value={mailAddress}
                  id="emailLogin"
                  label="Adresse mail"
                  onChange={(e) => {
                    const valid = ValidateEmail(e.target.value);
                    setValid(valid);
                    setMailAddress(e.target.value);
                  }}
                />
                {errorMessage !== "" && mailAddress.length > 3 && (
                  <div className={classes.requiredError}>
                    <WarningIcon style={{ marginRight: 5, color: "orange" }} />
                    <Typography>{errorMessage}</Typography>
                  </div>
                )}
                {!isValid && mailAddress.length > 3 && (
                  <div className={classes.required}>
                    <WarningIcon style={{ marginRight: 5, color: "orange" }} />
                    <Typography>L'email saisi n'est pas valide.</Typography>
                  </div>
                )}
              </Box>
              <Box paddingBottom="0px" position="relative">
                <TextField
                  fullWidth
                  required
                  type="password"
                  value={password}
                  id="passwordLogin"
                  label="Mot de passe"
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />
              </Box>
              {isValid && password.length > 5 ? (
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleSubmit}
                  className={classes.loginButton}
                >
                  <Typography variant="body1">Connexion</Typography>
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleSubmit}
                  className={classes.loginButton}
                  disabled
                >
                  <Typography variant="body1">Connexion</Typography>
                </Button>
              )}
              <Box paddingTop="10px">
                <Typography variant="body1">
                  Première visite sur FlouFlix?
                  <Link to="/inscription" className={classes.linkColor}>
                    Inscrivez-vous
                  </Link>
                  .
                </Typography>
              </Box>
            </Box>
          </form>
        </Box>
      </Container>
    </section>
  );
}

export default Connexion;
