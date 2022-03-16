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
import { BrowserRouter as Router, Link, Outlet } from "react-router-dom";
import { TextField } from "@mui/material";
import { doc, updateDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL} from "firebase/storage";

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
  const storage = getStorage();
  const [uid, setUid] = useState("");
  const getMovies = [];
  const [movies, setMovies] = useState([]);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [name, setName] = useState("");
  const [releaseDate, setReleaseDate] = useState();
  const [price, setPrice] = useState();
  const [desc, setDesc] = useState();
  const [image, setImage] = useState();
  const [url, setUrl] = useState();

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
        // console.log(getMovies[0]);
        // console.log("success");
        setName(getMovies[0].name);
        setReleaseDate(getMovies[0].releaseDate);
        setPrice(getMovies[0].price);
        setDesc(getMovies[0].description);
        setImage(getMovies[0].img);
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
  }, [uid]);

  const handleChangeName = (event) => {
    setName(event.target.value);
  };

  const handleChangeDate = (event) => {
    setReleaseDate(event.target.value);
  };

  const handleChangePrice = (event) => {
    setPrice(event.target.value);
  };

  const handleChangeDesc = (event) => {
    setDesc(event.target.value);
  };

  const handleSubmit = async () => {
    const imagesRef = ref(storage, `/catalogue/${image.name}`);
    uploadBytes(imagesRef, image).then((snapshot) => {
        // console.log('written');
    });

    getDownloadURL(imagesRef).then(function (downloadURL) {
        // console.log("File available at", downloadURL);
        setUrl(downloadURL);
      });
    const movieRef = doc(db, "movies", id);

    console.log(id)

    await updateDoc(movieRef, {
        name: name,
        description: desc,
        releaseDate: releaseDate,
        price: price,
        img: image,
    });

    await window.location.replace("/catalogue");
  };

  return (
    <section>
      <Box>
        {movies.length !== undefined && movies.length > 0 && (
          <Box>
            <Typography variant="h2">
              Modifier les informations du film
            </Typography>
            <form>
              <TextField
                value={name}
                id="outlined-required"
                label="Nom du film"
                onChange={handleChangeName}
              />
              <TextField
                value={releaseDate}
                id="outlined-required"
                // label="Date de sortie"
                type="number"
                onChange={handleChangeDate}
              />
              <TextField
                value={price}
                id="outlined-required"
                // label="Prix du film"
                type="number"
                onChange={handleChangePrice}
              />
              <TextField
                value={desc}
                id="outlined-required"
                // label="Description"
                onChange={handleChangeDesc}
              />
              <input
                type="file"
                onChange={(e) => {
                  setImage(e.target.files[0]);
                }}
              />
              <Button onClick={handleSubmit} variant="contained">
                <Typography>Modifier le film</Typography>
              </Button>
            </form>
          </Box>
        )}
      </Box>
    </section>
  );
}

export default Movie;
