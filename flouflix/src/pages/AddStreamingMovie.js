import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { makeStyles } from "@mui/styles";
import { withStyles } from "@mui/styles";
import TextField from "@mui/material/TextField";

import React from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Button } from "@mui/material";
import { doc, updateDoc } from "firebase/firestore";

const makeClass = makeStyles((theme) => ({}));

const CustomTextField = withStyles((theme) => ({
  root: {
    zIndex: 3,
    color: "white",
    borderColor: "white",
    "label + &": {
      color: "white",
    },
    "& .MuiOutlinedInput-root": {
      color: "white",
      "&::placeholder": {
        color: "white",
      },
      "& fieldset": {
        borderColor: "white",
        color: "white",
      },
      "&:hover fieldset": {
        borderColor: "white",
        color: "white",
      },
      "&.Mui-focused fieldset": {
        borderColor: "white",
        color: "white",
      },
    },
  },
}))(TextField);

function AddStreamingMovie() {
  const classes = makeClass();
  const db = firebase.firestore();
  const storage = getStorage();

  const auth = getAuth();

  onAuthStateChanged(auth, (user) => {
    if (user) {
      setUidUser(user.uid);
    }
  });

  const [uidUser, setUidUser] = React.useState();
  const [title, setTitle] = React.useState();
  const [description, setDescription] = React.useState();
  const [price, setPrice] = React.useState(0);
  const [releaseDate, setReleaseDate] = React.useState();
  const [image, setImage] = React.useState();
  const [url, setUrl] = React.useState();
  const [isUpload, setIsUpload] = React.useState(false);
  const [movie, setMovie] = React.useState();
  const [urlMovie, setUrlMovie] = React.useState();
  const [isMovieUpload, setIsMovieUpload] = React.useState();
  const [movieId, setMovieId] = React.useState("");

  const handleSubmit = async () => {
    console.log(url);
    await db
      .collection("movies")
      .add({
        name: title,
        releaseDate: releaseDate,
        price: price,
        description: description,
        img: image.name,
        seller: uidUser,
        id: movieId,
        url: url,
        movieUrl: urlMovie,
      })
      .then(async (docRef) => {
        // console.log("Document successfully written!");
        // console.log(docRef);
        // console.log("Document written with ID: ", docRef.id);
        const movieRef = await doc(db, "movies", docRef.id);
        setMovieId(docRef.id);
        console.log(docRef.id);
        await updateDoc(movieRef, {
          id: docRef.id,
        });
      })
      .catch((error) => {
        console.error("Error writing document: ", error);
      });

    // const movieRef = doc(db, "movies", movieId);

    window.location.replace("/catalogue");
  };

  return (
    <Box>
      <Typography>Ajouter un film en streaming</Typography>
      <form>
        <input
          type="file"
          onChange={async (e) => {
            setImage(e.target.files[0]);
            const nom = e.target.files[0].name;
            const img = e.target.files[0];
            const imagesRef = ref(storage, `/catalogue/${nom}`);
            uploadBytes(imagesRef, img).then((snapshot) => {
              console.log("Uploaded a blob or file!");

              getDownloadURL(imagesRef).then(function (downloadURL) {
                // console.log("File available at", downloadURL);
                setUrl(downloadURL);
                setIsUpload(true);
                console.log(downloadURL);
              });
            });
            // await uploadBytes(imagesRef, img).then((snapshot) => {
            //   console.log('written');
            // });
          }}
        />
        <CustomTextField
          fullWidth
          required
          value={title}
          id="title"
          label="Titre du film"
          onChange={(e) => {
            setTitle(e.target.value);
          }}
          InputLabelProps={{
            style: { color: "#fff" },
          }}
        />
        <CustomTextField
          fullWidth
          required
          value={description}
          id="description"
          label="Description du film"
          onChange={(e) => {
            setDescription(e.target.value);
          }}
          InputLabelProps={{
            style: { color: "#fff" },
          }}
        />
        <CustomTextField
          fullWidth
          required
          value={price}
          id="price"
          label="Prix du film"
          onChange={(e) => {
            setPrice(e.target.value);
          }}
          InputLabelProps={{
            style: { color: "#fff" },
          }}
        />
        <CustomTextField
          fullWidth
          required
          value={releaseDate}
          id="releaseDate"
          label="Date de sortie"
          onChange={(e) => {
            setReleaseDate(e.target.value);
          }}
          InputLabelProps={{
            style: { color: "#fff" },
          }}
        />
        <input
          type="file"
          onChange={async (e) => {
            setMovie(e.target.files[0]);
            const nom = e.target.files[0].name;
            const img = e.target.files[0];
            const imagesRef = ref(storage, `/movie/${nom}`);
            uploadBytes(imagesRef, img).then((snapshot) => {
              console.log("Uploaded a blob or file!");
              getDownloadURL(imagesRef).then(function (downloadURL) {
                // console.log("File available at", downloadURL);
                setUrlMovie(downloadURL);
                setIsMovieUpload(true);
                console.log(downloadURL);
              });
            });
            // await uploadBytes(imagesRef, img).then((snapshot) => {
            //   console.log('written');
            // });
          }}
        />
        {isUpload ? (
          <Button onClick={handleSubmit} variant="contained">
            <Typography>Ajouter le film</Typography>
          </Button>
        ) : (
          <Button onClick={handleSubmit} variant="contained" disabled>
            <Typography>Ajouter le film</Typography>
          </Button>
        )}
      </form>
    </Box>
  );
}

export default AddStreamingMovie;
