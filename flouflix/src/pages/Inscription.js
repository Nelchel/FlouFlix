import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { makeStyles } from "@mui/styles";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Container } from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";

import React, { useEffect, useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { Outlet } from "react-router-dom";
import firebase from "firebase/compat/app";
import { Link, useLocation } from "react-router-dom";

const makeClass = makeStyles((theme) => ({
  submitButton: {
    padding: "10px 20px !important",
    marginTop: "20px !important",
    margin: "auto",
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

function Inscription() {
  const classes = makeClass();
  const db = firebase.firestore();
  const auth = getAuth();

  localStorage.setItem("url", window.location.pathname);

  const [mailAddress, setMailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [userLog, setUserLog] = useState("");
  const [isBoutique, setIsBoutique] = useState(false);
  const [isValid, setValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async () => {
    await createUserWithEmailAndPassword(auth, mailAddress, password)
      .then((userCredential) => {
        const user = userCredential.user;
        setUserLog(user.uid);
      })
      .catch((error) => {
        if (error.code === "auth/email-already-in-use") {
          setErrorMessage("Il existe déjà un compte associé à cet email.");
        }
      });
  };

  useEffect(() => {
    const logIn = async () => {
      if (userLog !== "") {
        await setDoc(doc(db, "users", userLog), {
          uid: userLog,
          mailAddress: mailAddress,
          password: password,
          isBoutique: isBoutique,
        });
        window.location.replace(`/`);
      }
    };
    logIn();
  }, [userLog]);

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
          width="375px"
          margin="auto"
        >
          <Box padding="50px 0 20px 0">
            <Typography align="center" variant="h2" component="h1">
              Inscription
            </Typography>
          </Box>
          <form>
            <Box align="center" textAlign="center">
              <Box paddingBottom="20px" position="relative">
                <TextField
                  fullWidth
                  required
                  value={mailAddress}
                  id="mailAdressSingUp"
                  label="Adresse mail"
                  onChange={(e) => {
                    const valid = ValidateEmail(e.target.value);
                    setValid(valid);
                    setMailAddress(e.target.value);
                  }}
                />
                {errorMessage !== "" && (
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
              <Box paddingBottom="20px" position="relative">
                <TextField
                  required
                  fullWidth
                  type="password"
                  value={password}
                  id="passwordSignUp"
                  label="Password"
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />
                {password.length > 1 && password.length < 6 && (
                  <div className={classes.required}>
                    <WarningIcon style={{ marginRight: 5, color: "orange" }} />
                    <Typography>
                      Le mot de passe saisi doit comporter plus de 6 caractères.
                    </Typography>
                  </div>
                )}
              </Box>
              <FormControl fullWidth>
                <InputLabel id="labelCategorie">Catégorie</InputLabel>
                <Select
                  id="selectCategorie"
                  value={isBoutique}
                  label="Catégorie"
                  onChange={(e) => {
                    setIsBoutique(e.target.value);
                  }}
                >
                  <MenuItem value={true}>Boutique agréée</MenuItem>
                  <MenuItem value={false}>Particulier</MenuItem>
                </Select>
              </FormControl>
              {isValid && password.length >= 6 ? (
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleSubmit}
                  className={classes.submitButton}
                >
                  <Typography variant="body1">S'inscrire</Typography>
                </Button>
              ) : (
                <Button
                  disabled
                  variant="contained"
                  color="secondary"
                  className={classes.submitButton}
                >
                  <Typography variant="body1">S'inscrire</Typography>
                </Button>
              )}
              <Box paddingTop="10px">
                <Typography variant="body1">
                  Vous avez déjà un compte ?
                  <Link to="/connexion" className={classes.linkColor}>
                    Connectez-vous
                  </Link>
                  .
                </Typography>
              </Box>
            </Box>
          </form>
          <Outlet />
        </Box>
      </Container>
    </section>
  );
}

export default Inscription;
