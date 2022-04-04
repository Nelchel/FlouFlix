import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { makeStyles } from "@mui/styles";
import React, { useState, useEffect } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { BrowserRouter as Router, Link, Outlet } from "react-router-dom";
import Grid from "@mui/material/Grid";
import {
  getAuth,
  onAuthStateChanged,
  verifyPasswordResetCode,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const makeClass = makeStyles((theme) => ({
  signupButton: {
    marginRight: "10px",
  },
}));

function MyAccount() {
  const db = firebase.firestore();

  const [getUser, setUser] = useState([]);
  const [uid, setUid] = useState();
  const auth = getAuth();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        setUid(uid);
      } else {
      }
    });
  }, [uid]);

  console.log(uid)

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

  console.log(getUser.mailAdress)

  return (
    <Box>
      {getUser !== [] && (
        <>
          <Typography>Mon compte</Typography>

          <Grid container>
            <Grid item>
              <Typography>Mes informations personnelles</Typography>

              <Box>
                <Typography>Adresse mail</Typography>
                <Typography>{getUser.mailAddress}</Typography>
              </Box>
            </Grid>

            <Grid item>
                <Box>
                </Box>
            </Grid>
          </Grid>

        {//ICI Modifier info connexion
        }
        <Box>      
            {//DEDANS
            }
        </Box>
        </>
      )}
      <Outlet />
    </Box>
  );
}

export default MyAccount;
