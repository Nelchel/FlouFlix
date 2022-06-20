import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { makeStyles } from "@mui/styles";
import firebase from "firebase/compat/app";
import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useParams } from "react-router-dom";
import Button from "@mui/material/Button";
import {
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
const makeClass = makeStyles((theme) => ({
  signOut: {
    float: "right",
  },
}));

function Commentaires(props) {
  const classes = makeClass();
  const auth = getAuth();
  const [uid, setUid] = useState("");
  const db = firebase.firestore();
  let { id } = useParams();

  const getAvis = [];
  const getMovies = [];
  const [avis, setAvis] = useState([]);
  const [movie, setMovie] = useState([]);

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
      
      db.collection("users")
      .where("uid", "==", uid)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          getMovies.push(doc.data());
        });
        console.log(getMovies)
        setMovie(getMovies);
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
  }, [uid]);



  const handleReport = async (idUser) => {
    if (uid !== "") {
      await db
      .collection("notifications")
      .add({
          content : "Vous avez été signaler par un modérateur concernant l'avis",
          idUser: idUser,
          isRead : false,
      })
      .then(async (docRef) => {
        const movieRef = await doc(db, "notifications", docRef.id);
        await updateDoc(movieRef, {
          id: docRef.id,
        });
      })
      .catch((error) => {
        console.error("Error writing document: ", error);
      });
    }
  };

  const handleSuppr = async (id,idUser) => {
    await deleteDoc(doc(db,"commentaires",id))

    if (uid !== "") {
      await db
      .collection("notifications")
      .add({
          content : "L'un de vos commentaires sur le film "+props.movie[0].name+" a été supprimé",
          idUser: idUser,
          isRead : false,
      })
      .then(async (docRef) => {
        const movieRef = await doc(db, "notifications", docRef.id);
        await updateDoc(movieRef, {
          id: docRef.id,
        });
      })
      .catch((error) => {
        console.error("Error writing document: ", error);
      });
    }
  };

  return (
    <Box>
      {avis.map((commentaire,index) => {
        return (
          <Box>
            <Typography>{commentaire.title}</Typography>
            <Typography>{commentaire.description}</Typography>
            <Typography>{commentaire.note}</Typography>
            {movie[0] !== undefined && (
              <>
                {movie[0].moderator === true &&(
                  <>
                    <Button color="secondary" variant="contained" onClick={() => handleReport(avis[index].idUser)}>
                      <Typography>Signaler l'utilisateur</Typography>
                    </Button>
                    <Button color="secondary" variant="contained" onClick={() => handleSuppr(avis[index].id,avis[index].idUser)}>
                      <Typography>Supprimer le commentaire</Typography>
                    </Button>
                  </>
                )}
              </>
            )}
          </Box>
        );
      })}
    </Box>
  );
}

export default Commentaires;
