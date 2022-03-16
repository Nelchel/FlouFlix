import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { makeStyles } from "@mui/styles";
import React, { useState, useEffect } from "react";
import firebase from "firebase/compat/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useSearchParams } from "react-router-dom";
import { useParams } from "react-router-dom";
import { Button } from "@mui/material";
import { chainPropTypes } from "@mui/utils";
import Modal from "@mui/material/Modal";
import { doc, deleteDoc,updateDoc} from "firebase/firestore";
import { BrowserRouter as Router, Link, Outlet } from "react-router-dom";

const makeClass = makeStyles((theme) => ({
  signupButton: {
    marginRight: "10px",
  },
}));

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function Movie() {
  const db = firebase.firestore();
  let { id } = useParams();
  const [uid, setUid] = useState("");
  const getMovies = [];
  const [movies, setMovies] = useState([]);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const auth = getAuth();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        setUid(uid);
      } else {
      }
    });
    console.log(uid);
    db.collection("movies")
      .where("id", "==", id)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          // console.log(doc.id, " => ", doc.data());
          getMovies.push(doc.data());
        });
        setMovies(getMovies);
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
  }, [uid]);

  const handleDelete = async () => {
    await deleteDoc(doc(db, "movies", movies[0].id));

    window.location.replace("/catalogue");
  };

  const handleClick = async() => {
    await updateDoc(doc(db,"users", uid),{
      idMoovie : movies[0].id,
      Quantity : 1
    });
  }

  return (
    <section>
      <Box>
        {movies.length !== undefined && movies.length > 0 && (
          <>
            <Box>
              <Typography variant="h2">{movies[0].name}</Typography>
              <img src={movies[0].url} width="300" height="300" />
              <Typography variant="body1">{movies[0].description}</Typography>
            </Box>
            <Button onClick={handleClick()}>Ajouter au panier</Button>
            {uid === movies[0].seller && (
              <>
                <Link to={"/modifier-film/" + movies[0].id}>
                  <Button>Modifier le film</Button>
                </Link>
                <Button onClick={handleOpen}>Supprimer le film</Button>
              </>
            )}
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                  Supprimer le film {movies[0].name}
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                  Êtes-vous sûr ?
                </Typography>
                <Button onClick={handleDelete} color="error">
                  Supprimer
                </Button>
              </Box>
            </Modal>
          </>
        )}
      </Box>
    </section>
  );
}

export default Movie;
