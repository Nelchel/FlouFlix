import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { makeStyles } from "@mui/styles";
import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import firebase from "firebase/compat/app";

const makeClass = makeStyles((theme) => ({
  signOut: {
    float: "right",
  },
}));

function AddMovieControl() {
  const classes = makeClass();
  const auth = getAuth();
  const db = firebase.firestore();

  const [user, setUser] = useState();
  const [uid, setUid] = useState();
  const [exist, setExist] = useState();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setExist(true);
        const uid = user.uid;
        setUid(uid);
      } else {
        setExist(false);
      }
    });
  }, [auth]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setUser(docSnap.data());
    } else {
      console.log("No such document!");
    }
  }, [uid, db]);

  console.log(user?.isBoutique);

  return (
    <Box>
      {user?.isBoutique && (
        <Link to="/add/streaming-movie">
          <Button color="secondary">
            Ajouter un film (version dématérialisée)
          </Button>
        </Link>
      )}
      <Link to="/add/dvd-movie">
        <Button color="secondary">Ajouter un film (version matérielle)</Button>
      </Link>
    </Box>
  );
}

export default AddMovieControl;
