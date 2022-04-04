import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { makeStyles } from "@mui/styles";
import React, { useState, useEffect } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { BrowserRouter as Router, Link, Outlet } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import {updateDoc } from "firebase/firestore";
import {
  getAuth,
  updateEmail,
  onAuthStateChanged,
  verifyPasswordResetCode,
  updatePassword,
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

  console.log(getUser.mailAddress)
console.log(password)
  const handleChange = (event) => {
    setMailAddress(event.target.value);
  }

  const handleChangePassword = (event) => {
    setPassword(event.target.value);
  }

  const handleSubmit = async (event) => {
   updateEmail(auth.currentUser, mailAddress).then(() => {
      console.log("MAIL geted");
    }).catch((error) => {
       console.log(error);
    });  
    const docRef = doc(db, "users", uid);
    await updateDoc(docRef, {
      mailAddress: mailAddress,
      });
  
    updatePassword(auth.currentUser,password).then(()=> {
      console.log("PASS get")
    }).catch((error)=>{ 
      console.log(error);
    });

    }
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
                  <Typography>Mot de passe</Typography>
                </Box>
            </Grid>
          </Grid>

        {//ICI Modifier info connexion
        }
        <Box>      
            <TextField

            value={mailAddress}
            onChange={handleChange}
            />
            <TextField
            type="password"
            value={password}
            onChange={handleChangePassword}
            />
            <Button
            variant="contained"
            color="secondary"
            onClick={handleSubmit}
            >Envoyer       
          </Button>
        </Box>
        </>
      )}
      <Outlet />
    </Box>
  );
}

export default MyAccount;
