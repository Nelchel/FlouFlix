import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { makeStyles } from "@mui/styles";
import TextField from "@mui/material/TextField";
import React, { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { Container } from "@mui/material";
import { Link } from "react-router-dom";

const makeClass = makeStyles((theme) => ({
  loginButton: {
    padding: "10px 20px !important",
    marginTop: "20px !important",
    margin: "auto",
    maxWidth: "122px",
  }
}));

function Connexion() {
  const classes = makeClass();
  const [mailAddress, setMailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [userLog, setUserLog] = useState("");

  const handleChangeMail = (event) => {
    setMailAddress(event.target.value);
  };

  const handleChangePassword = (event) => {
    setPassword(event.target.value);
  };

  const auth = getAuth();

  const handleSubmit = () => {
    signInWithEmailAndPassword(auth, mailAddress, password)
      .then((userCredential) => {
        const user = userCredential.user;
        setUserLog(user.uid);
        console.log(auth);
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
                  id="outlined-required"
                  label="Adresse mail"
                  defaultValue="mon-adresse@gmail.com"
                  onChange={handleChangeMail}
                />
              </Box>
              <Box paddingBottom="20px">
                <TextField
                  fullWidth
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
              </Box>
              <Button variant="contained" color="secondary" onClick={handleSubmit} className={classes.loginButton}>
                <Typography variant="body1">Connexion</Typography>
              </Button>
              <Typography>Première visite sur FlouFlix? <Link to="/Inscription">Inscrivez-vous.</Link></Typography>
            </Box>
          </form>
        </Box>
      </Container>
    </section>
  );
}

export default Connexion;
