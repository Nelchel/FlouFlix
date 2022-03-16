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
import React, { useEffect, useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { Outlet } from "react-router-dom";
import firebase from "firebase/compat/app";
import { Link } from "react-router-dom";


const makeClass = makeStyles((theme) => ({
  submitButton: {
    padding: "10px 20px !important",
    marginTop: "20px !important",
    margin: "auto",
  },
}));

function Inscription() {
  const classes = makeClass();
  const db = firebase.firestore();
  const auth = getAuth();

  const [mailAddress, setMailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [userLog, setUserLog] = useState("");
  const [isBoutique, setIsBoutique] = useState("");

  const handleSubmit = async () => {
    await createUserWithEmailAndPassword(auth, mailAddress, password)
      .then((userCredential) => {
        const user = userCredential.user;
        setUserLog(user.uid);
      })
      .catch((error) => {});
  };

  useEffect(() => {
    const logIn = async () => {
      await setDoc(doc(db, "users", userLog), {
        uid: userLog,
        mailAddress: mailAddress,
        password: password,
        isBoutique: isBoutique,
      });

      window.location.replace(`/`);
    };
    logIn();
  }, [userLog]);

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
              <Box paddingBottom="20px">
                <TextField
                  fullWidth
                  required
                  value={mailAddress}
                  id="mailAdressSingUp"
                  label="Adresse mail"
                  onChange={(e) => {
                    setMailAddress(e.target.value);
                  }}
                />
              </Box>
              <Box paddingBottom="20px">
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
              <Button
                variant="contained"
                color="secondary"
                onClick={handleSubmit}
                className={classes.submitButton}
              >
                <Typography variant="body1">S'inscrire</Typography>
              </Button>
               
              <Typography paddingTop="20px" variant ="body1">Vous avez déjà un compte ? <Link to="/Connexion">Connectez-vous.</Link></Typography>
            </Box>
          </form>
          <Outlet />
        </Box>
      </Container>
    </section>
  );
}

export default Inscription;
