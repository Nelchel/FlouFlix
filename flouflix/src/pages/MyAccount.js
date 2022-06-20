import { Divider, Modal, TextField, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { makeStyles, useTheme } from "@mui/styles";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DatePicker from "@mui/lab/DatePicker";
import { Container } from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";
import React, { useState, useEffect } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { Outlet } from "react-router-dom";
import { getAuth, updateEmail, onAuthStateChanged, updatePassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import "@geoapify/geocoder-autocomplete/styles/minimal.css";
import { updateDoc } from "firebase/firestore";

import InputAddress from "../components/InputAdress";

const makeClass = makeStyles((theme) => ({
  strong: {
    fontWeight: 600,
    marginLeft: "2px",
  },
  button: {
    padding: "10px 20px",
  },
}));

function MyAccount() {
  const db = firebase.firestore();

  const classes = makeClass();
  const theme = useTheme();

  const [getUser, setUser] = useState([]);
  const [uid, setUid] = useState();
  const [addressLine1, setAddressLine1] = useState();
  const [addressLine2, setAddressLine2] = useState();
  const [lat, setLat] = useState();
  const [lon, setLon] = useState();
  const auth = getAuth();
  const [mailAddress, setMailAddress] = useState();
  const [password, setPassword] = useState();
  const [passwordConfirm, setPasswordConfirm] = useState();
  const [confirm, setConfirm] = useState();
  const [pseudo, setPseudo] = useState();
  const [dateBirth, setDateBirth] = useState();
  const [phone, setPhone] = useState();
  const [connexion, setConnexion] = useState(false);
  const [personnal, setPersonnal] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        setUid(uid);
      } else {
      }
    });
  }, [auth]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setUser(docSnap.data());
      setMailAddress(docSnap.data().mailAddress);
      setPhone(docSnap.data().phone);
      setDateBirth(docSnap.data().dateBirth);
      setPseudo(docSnap.data().pseudo);
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }
  }, [uid, db]);

  const handleUpdate = () => {
    var userRef = db.collection("users").doc(auth.currentUser.uid);
    return userRef
      .update({
        phone: phone,
        dateBirth: dateBirth, 
        pseudo: pseudo,
        addressLine1: addressLine1,
        addressLine2: addressLine2,
        lat: lat,
        lon: lon,
      })
      .then(() => {
        console.log("Document successfully updated!");
        setPersonnal(false)
      })
      .catch((error) => {
        // The document probably doesn't exist.
        console.error("Error updating document: ", error);
      });
  };

  const handleSubmit = async (event) => {
    updateEmail(auth.currentUser, mailAddress)
    updatePassword(auth.currentUser, password)    
      .then(() => {
        console.log("MAIL geted");
      })
      .catch((error) => { 
        console.log(error);
      });
    const docRef = doc(db, "users", uid);
    await updateDoc(docRef, {
      mailAddress: mailAddress,
      password : password,
    });
    setConnexion(false)
  };

  return (
    <section>
      <Container maxWidth="1250px">
        <Box>
          <Typography variant="h2">Mon compte</Typography>
          <Typography variant="h4" component="h3">
            Mes informations personnelles
          </Typography>
          {getUser !== [] && (
            <Box padding="20px 0">
              <Box padding="5px 0" display="flex" alignItems="baseline">
                <Typography>Pseudo: </Typography>
                <span className={classes.strong}>{getUser.pseudo}</span>
              </Box>
              <Box padding="5px 0" display="flex" alignItems="baseline">
                <Typography>Adresse mail: </Typography>
                <span className={classes.strong}>{getUser.mailAddress}</span>
              </Box>
              <Box padding="5px 0" display="flex" alignItems="baseline">
                <Typography>Adresse postale:</Typography>
                <span className={classes.strong}>
                  {getUser.addressLine1} {getUser.addressLine2}
                </span>
              </Box>
              <Box padding="5px 0">
                <Typography>Numéro de téléphone: {getUser.phone}</Typography>
              </Box>
              {/* <Box>
              <Typography>Date de naissance: {getUser.dateBirth}</Typography>
          </Box> */}
            </Box>
          )}
          <Divider style={{ backgroundColor: "#464646" }} />
          <Box padding="20px 0">
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-around"
              paddingBottom="20px"
            >
              <Button
                variant="contained"
                color="secondary"
                onClick={(e) => {
                  setConnexion(true);
                }}
                className={classes.button}
              >
                <Typography variant="body1" style={{ textTransform: "none" }}>
                  Modifier mes informations de connexion
                </Typography>
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={(e) => {
                  setPersonnal(true);
                }}
                className={classes.button}
              >
                <Typography variant="body1" style={{ textTransform: "none" }}>
                  Modifier mes informations personnelles
                </Typography>
              </Button>
            </Box>
          </Box>
          <Modal
            open={connexion}
            onClose={(e) => {
              setConnexion(false);
            }}
          >
            <Box
              position="absolute"
              top="37%"
              left="33%"
              backgroundColor="#FFF"
              padding="30px"
              borderRadius="8px"
            >
              <Box paddingBottom="30px">
                <Typography variant="h5" color={theme.palette.text.black}>
                  Modifier mes informations de connexion
                </Typography>
              </Box>
              <form>
                <Box display="flex" flexDirection="column">
                  <Box paddingBottom="20px">
                    <TextField
                      required
                      fullWidth
                      value={mailAddress}
                      onChange={(e) => {
                        setMailAddress(e.target.value);
                      }}
                      label="Adresse mail"
                    />
                  </Box>
                  <Box paddingBottom="20px">
                    <TextField
                      required
                      label="Nouveau mot de passe"
                      placeholer="Nouveau mot de passe"
                      type="password"
                      value={password}
                      fullWidth
                      onChange={(e) => {
                        setPassword(e.target.value);
                      }}
                    />
                  </Box>
                  {console.log(password + " mdp")}
                  {console.log(passwordConfirm + " mdpconfirm")}

                  <Box paddingBottom="20px">
                    <TextField
                     required
                     fullWidth
                     type="password"
                     value={passwordConfirm}
                     id="passwordValidation"
                     label="Confirmer votre mot de passe"
                     onChange={(e) => {
                      setPasswordConfirm(e.target.value);
                      if (password === e.target.value) {
                        setConfirm(true);
                      } else setConfirm(false);
                    }}
                      // onChange={(e) => {
                      //   setPassword(e.target.value);
                      // }}
                    />
                    <Box display="inline-flex" vertical-align="text-top"> 
            {password!==passwordConfirm && <> <WarningIcon style={{ marginRight: 5, color: "red" }}/>  
            <Typography color="red" >Les mots de passe ne correspondent pas.</Typography> </>} 
            </Box>
              </Box>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleSubmit}
                    disabled={password!==passwordConfirm}
                                        
                  >
                    Envoyer
                  </Button>
                </Box>
              </form>
            </Box>
          </Modal>
          <Modal
            open={personnal}
            onClose={(e) => {
              setPersonnal(false);
            }}
          >
            <Box
              position="absolute"
              top="27%"
              left="33%"
              backgroundColor="#FFF"
              padding="30px"
              borderRadius="8px"
            >
              <Box paddingBottom="30px">
                <Typography variant="h5" color={theme.palette.text.black}>
                  Modifier mes informations personnelles
                </Typography>
              </Box>
              <form>
                <Box display="flex" flexDirection="column">
                  <Box paddingBottom="20px">
                    <TextField
                      fullWidth
                      value={pseudo}
                      onChange={(e) => {
                        setPseudo(e.target.value);
                      }}
                      placeholder="Renseigner un pseudo"
                      label="Pseudo"
                    />
                  </Box>
                  <Box paddingBottom="20px">
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        label="mm/dd/yyyy"
                        value={dateBirth}
                        onChange={(e) => {
                          setDateBirth(e);
                        }}
                        renderInput={(params) => (
                          <TextField fullWidth {...params} />
                        )}
                      />
                    </LocalizationProvider>
                  </Box>
                  <Box paddingBottom="20px">
                    <TextField
                      type="phone"
                      fullWidth
                      label="Numéro de téléphone"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                      }}
                    />
                  </Box>
                  <InputAddress
                    addressLine1={addressLine1}
                    setAddressLine1={setAddressLine1}
                    addressLine2={addressLine2}
                    setAddressLine2={setAddressLine2}
                    lat={lat}
                    setLat={setLat}
                    lon={lon}
                    setLon={setLon}
                  />
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleUpdate}
                  >
                    Envoyer
                  </Button>
                </Box>
              </form>
            </Box>
          </Modal>
          <Outlet />
        </Box>
      </Container>
    </section>
  );
}

export default MyAccount;
