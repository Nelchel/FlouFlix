import { TextField, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { makeStyles } from "@mui/styles";
import React, { useState, useEffect } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { BrowserRouter as Router, Link, Outlet } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import {
  getAuth,
  updateEmail,
  onAuthStateChanged,
  verifyPasswordResetCode,
  updatePassword,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { GeocoderAutocomplete } from "@geoapify/geocoder-autocomplete";
import "@geoapify/geocoder-autocomplete/styles/minimal.css";
import {
  GeoapifyGeocoderAutocomplete,
  GeoapifyContext,
} from "@geoapify/react-geocoder-autocomplete";
import { updateDoc } from "firebase/firestore";

const makeClass = makeStyles((theme) => ({
  signupButton: {
    marginRight: "10px",
  },
}));

function MyAccount() {
  const db = firebase.firestore();

  const classes = makeClass();

  const [getUser, setUser] = useState([]);
  const [uid, setUid] = useState();
  const [addressLine1, setAddressLine1] = useState();
  const [addressLine2, setAddressLine2] = useState();
  const [lat, setLat] = useState();
  const [lon, setLon] = useState();
  const auth = getAuth();
  const [mailAddress, setMailAddress] = useState();
  const [password, setPassword] = useState();

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
      // console.log("Document data:", docSnap.data());
      setUser(docSnap.data());
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }
  }, [uid, db]);

  useEffect(() => {
    const autocomplete = new GeocoderAutocomplete(
      document.getElementById("autocomplete"),
      "f99dc96855554b5e94169e8f6015c05c",
      {
        /* Geocoder options */
      }
    );
    autocomplete.on("select", async (location) => {
      setAddressLine1(location.properties.address_line1);
      setAddressLine2(location.properties.address_line2);
      setLat(location.properties.lat);
      setLon(location.properties.lon);
    });

    autocomplete.on("suggestions", (suggestions) => {
      // process suggestions here
    });
  }, []);

  const handleClick = () => {
    var userRef = db.collection("users").doc(auth.currentUser.uid);
    return userRef
      .update({
        addressLine1: addressLine1,
        addressLine2: addressLine2,
        lat: lat,
        lon: lon,
      })
      .then(() => {
        console.log("Document successfully updated!");
      })
      .catch((error) => {
        // The document probably doesn't exist.
        console.error("Error updating document: ", error);
      });
  };

  const handleChange = (event) => {
    setMailAddress(event.target.value);
  };

  const handleChangePassword = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    updateEmail(auth.currentUser, mailAddress)
      .then(() => {
        console.log("MAIL geted");
      })
      .catch((error) => {
        console.log(error);
      });
    const docRef = doc(db, "users", uid);
    await updateDoc(docRef, {
      mailAddress: mailAddress,
    });

    updatePassword(auth.currentUser, password)
      .then(() => {
        console.log("PASS get");
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <Box>
      <Typography>Mon compte</Typography>
      <Grid container>
        <Box>
          <Typography>Adresse mail</Typography>
          <Typography>{getUser.mailAddress}</Typography>
        </Box>
        <Grid item>
          <Box>
            <div
              className={classes.inputAdress}
              id="autocomplete"
              style={{ position: "relative" }}
            ></div>
            <Button onClick={handleClick}>Enregistrer mon adresse</Button>
          </Box>
        </Grid>
      </Grid>
      <Box>
        <TextField value={mailAddress} onChange={handleChange} />
        <TextField
          type="password"
          value={password}
          onChange={handleChangePassword}
        />
        <Button variant="contained" color="secondary" onClick={handleSubmit}>
          Envoyer
        </Button>
      </Box>
      <Outlet />
    </Box>
  );
}

export default MyAccount;
