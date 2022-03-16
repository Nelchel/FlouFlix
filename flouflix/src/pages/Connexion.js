import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { makeStyles } from "@mui/styles";
import TextField from "@mui/material/TextField";
import { Container } from "@mui/material";

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
}));

function Connexion() {
  const classes = makeClass();
  const auth = getAuth();

  const [mailAddress, setMailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [userLog, setUserLog] = useState("");

  const handleSubmit = () => {
    signInWithEmailAndPassword(auth, mailAddress, password)
      .then((userCredential) => {
        const user = userCredential.user;
        setUserLog(user.uid);
        window.location.replace(`/`);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage);
      });
  };

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
              <Box paddingBottom="20px">
                <TextField
                  fullWidth
                  required
                  value={mailAddress}
                  id="emailLogin"
                  label="Adresse mail"
                  onChange={(e) => {
                    setMailAddress(e.target.value);
                  }}
                />
              </Box>
              <Box paddingBottom="0px">
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
              <Button
                variant="contained"
                color="secondary"
                onClick={handleSubmit}
                className={classes.loginButton}
              >
                <Typography variant="body1">Connexion</Typography>
              </Button>
              <Box paddingTop="10px">
                <Typography variant="body1">
                  Première visite sur FlouFlix?
                  <Link to="/inscription" className={classes.linkColor}>Inscrivez-vous</Link>.
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
