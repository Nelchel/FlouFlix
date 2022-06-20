import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { makeStyles } from "@mui/styles";
import firebase from "firebase/compat/app";
import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useParams } from "react-router-dom";
import Button from "@mui/material/Button";

const makeClass = makeStyles((theme) => ({
  signOut: {
    float: "right",
  },
}));

function Commentaires() {
  const classes = makeClass();
  const auth = getAuth();
  const [uid, setUid] = useState("");
  const db = firebase.firestore();
  let { id } = useParams();

  const getAvis = [];
  const [avis, setAvis] = useState([]);

  useEffect(() => {
    onAuthStateChanged(
      auth,
      (user) => {
        if (user) {
          const uid = user.uid;
          setUid(uid);
        } else {
        }
      },
      [auth]
    );

    db.collection("commentaires")
      .where("idMovie", "==", id)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          // console.log(doc.id, " => ", doc.data());
          getAvis.push(doc.data());
        });
        setAvis(getAvis);
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
  }, [uid]);

  return (
    <Box>
      {avis.map((commentaire) => {
        return (
          <Box>
            <Typography>{commentaire.title}</Typography>
            <Typography>{commentaire.description}</Typography>
            <Typography>{commentaire.note}</Typography>
            <Button color="secondary" variant="contained">
              <Typography>Signaler l'utilisateur</Typography>
            </Button>
            <Button color="secondary" variant="contained">
              <Typography>Supprimer le commentaire</Typography>
            </Button>
          </Box>
        );
      })}
    </Box>
  );
}

export default Commentaires;
