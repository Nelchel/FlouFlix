import { TextField, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { makeStyles } from "@mui/styles";
import React, { useState } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import Button from "@mui/material/Button";

const makeClass = makeStyles((theme) => ({
  signupButton: {
    marginRight: "10px",
  },
}));

function AddMovie() {
  const db = firebase.firestore();

  const [name, setName] = useState("");
  const [releaseDate, setReleaseDate] = useState();
  const [price, setPrice] = useState();
  const [desc, setDesc] = useState();
  const [img, setImg] = useState();

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

  const handleChangeImg = (event) => {
    setImg(event.target.value);
  };

  const handleSubmit = async () => {
    await db
      .collection("movies")
      .doc()
      .set({
        name: name,
        releaseDate: releaseDate,
        price: price,
        description: desc,
        img: img,
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
        <TextField
          value={img}
          id="outlined-required"
          label="Affiche du film"
          onChange={handleChangeImg}
        />
        <Button onClick={handleSubmit} variant="contained">
          <Typography>Ajouter le film</Typography>
        </Button>
      </form>
    </Box>
  );
}

export default AddMovie;
