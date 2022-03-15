import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Icon from "@mui/material/Icon"
import { makeStyles } from "@mui/styles";
import TextField from "@mui/material/TextField";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import React, { useState } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { getAuth, signOut,onAuthStateChanged } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL} from "firebase/storage";
import { doc, updateDoc } from "firebase/firestore";

function MyCart() {

  const db = firebase.firestore();
  const storage = getStorage();
  const auth = getAuth();
  let cart = [];

  const [uid, setUid] = useState("");
  const [getCart, setCart] = useState([]);


  onAuthStateChanged(auth, (user) => {
    if (user) {
      const uid = user.uid;
      setUid(uid);
    } else {
    }
  });

  db.collection("users")
  .where("uid", "==", uid)
  .get()
  .then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      cart.push(doc.data());
    });
    console.log(cart[0]);
    // setCart(cart.MyCart);
  });


    return(
      <Box>
        <Typography variant="h1">Page du panier</Typography>
        <Box>
        {getCart.map((cart, index) => {
          return (
            <Box maxWidth="345px">
            <Card style={{ minWidth: "345px" }}>
              {/* <CardMedia
                component="img"
                height="140"
                image={cart.url}
                alt="green iguana"
              /> */}
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {cart.favoris}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {cart.mailAddress}
                </Typography>
              </CardContent>
            </Card>
          </Box>
          );
        })}
        </Box>
      </Box>
    );
}
export default MyCart;
