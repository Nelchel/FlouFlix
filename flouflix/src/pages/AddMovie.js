import { TextField, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { makeStyles } from "@mui/styles";
import React, { useState } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import Button from "@mui/material/Button";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { getAuth, onAuthStateChanged } from "firebase/auth";

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
  const [image , setImage] = useState('');
  const [uidUser, setUidUser] = useState('');

  const imagesRef = ref(storage, `/catalogue/${image.name}`);
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

    uploadBytes(imagesRef, image).then((snapshot) => {
        console.log('Uploaded a blob or file!');
      });

    await db
      .collection("movies")
      .doc()
      .set({
        name: name,
        releaseDate: releaseDate,
        price: price,
        description: desc,
        img: image.name,
        seller: uidUser,
      })
      .then(() => {
        console.log("Document successfully written!");
      })
      .catch((error) => {
        console.error("Error writing document: ", error);
      });
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
        <input type="file" onChange={(e)=>{setImage(e.target.files[0])}} />
        <Button onClick={handleSubmit} variant="contained">
          <Typography>Ajouter le film</Typography>
        </Button>
      </form>
    </Box>
  );
}

export default AddMovie;
