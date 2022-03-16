import { TextField, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { makeStyles } from "@mui/styles";
import React, { useState } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import Button from "@mui/material/Button";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";

const makeClass = makeStyles((theme) => ({
  signupButton: {
    marginRight: "10px",
  },
}));

function AddMovie() {
  // const storage = firebase.storage()
  const db = firebase.firestore();
  const storage = getStorage();

  const auth = getAuth();

  onAuthStateChanged(auth, (user) => {
    if (user) {
      setUidUser(user.uid);
    }
  });

  const [name, setName] = useState("");
  const [releaseDate, setReleaseDate] = useState();
  const [price, setPrice] = useState();
  const [desc, setDesc] = useState();
  const [image, setImage] = useState("");
  const [uidUser, setUidUser] = useState("");
  const [movieId, setMovieId] = useState("");
  const [url, setUrl] = useState("");

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
    // uploadBytes(imagesRef, image).then((snapshot) => {
    //     // console.log('written');
    // });

    // getDownloadURL(imagesRef).then(function (downloadURL) {
    //     // console.log("File available at", downloadURL);
    //     setUrl(downloadURL);
    //   });

    console.log(url);
    await db
      .collection("movies")
      .add({
        name: name,
        releaseDate: releaseDate,
        price: price,
        description: desc,
        img: image.name,
        seller: uidUser,
        id: movieId,
        url: url,
      })
      .then(async (docRef) => {
        // console.log("Document successfully written!");
        // console.log(docRef);
        // console.log("Document written with ID: ", docRef.id);
        const movieRef = await doc(db, "movies", docRef.id);
        setMovieId(docRef.id);
        console.log(docRef.id)
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
      <Typography variant="h2">Ajouter un film</Typography>
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
          label="Date de sortie"
          type="number"
          onChange={handleChangeDate}
        />
        <TextField
          value={price}
          id="outlined-required"
          label="Prix du film"
          type="number"
          onChange={handleChangePrice}
        />
        <TextField
          value={desc}
          id="outlined-required"
          label="Description"
          onChange={handleChangeDesc}
        />
        <input
          type="file"
          onChange={async (e) => {
            setImage(e.target.files[0]);
            const nom = e.target.files[0].name;
            const img = e.target.files[0];
            const imagesRef = ref(storage, `/catalogue/${nom}`);
            uploadBytes(imagesRef, img).then((snapshot) => {
              console.log('Uploaded a blob or file!');
            });
            // await uploadBytes(imagesRef, img).then((snapshot) => {
            //   console.log('written');
            // });

            getDownloadURL(imagesRef).then(function (downloadURL) {
              // console.log("File available at", downloadURL);
              setUrl(downloadURL);
              console.log(downloadURL);
            });
          }}
        />
        <Button onClick={handleSubmit} variant="contained">
          <Typography>Ajouter le film</Typography>
        </Button>
      </form>
    </Box>
  );
}

export default AddMovie;
