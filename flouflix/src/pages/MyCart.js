import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { makeStyles,useTheme } from "@mui/styles";
import TextField from "@mui/material/TextField";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import ModalSuppr from "../components/ModalSuppr";
import MapModal from "../components/ModalMap";
import React, { useState, useEffect } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { useDebouncedCallback } from 'use-debounce';
import {
  getAuth,
  onAuthStateChanged,
} from "firebase/auth";
import {
  doc,
  updateDoc,
  where,
  collection,
  getDocs,
  query,
  arrayRemove,
} from "firebase/firestore";


const makeClass = makeStyles((theme) => ({

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

function MyCart() {
  const classes = makeClass();
  const theme = useTheme();
  const db = firebase.firestore();
  const auth = getAuth();
  const [uid, setUid] = useState("");
  const [moovieInMyCart, setMoovieInMyCart] = useState([]);
  const [quantity, setQuantity] = useState([]);
  const [userCurrent, setUserCurrent] = useState(undefined);


  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        setUid(uid);
      } else {
      }
    });
  }, [auth]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    const getUser = async () => {
      let user = [];
      const q = query(collection(db, "users"), where("uid", "==", uid));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        user.push(doc.data());
      });
      const quantityArray = user[0].myCart
      setQuantity(quantityArray)
      setUserCurrent(user[0]);
    };
    getUser();
  }, [uid,db]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    let movies = [];
    if (userCurrent !== undefined) {
      const cart = userCurrent.myCart;
      await Promise.all(
        cart.map(async (carte, index) => {
          const q = query(collection(db, "movies"), where("id", "==", carte.idMoovie));
          const querySnapshot = await getDocs(q);
          querySnapshot.forEach((doc) => {
            movies.push(doc.data());
          });
        })
      );
      setMoovieInMyCart(movies);
    }
  }, [userCurrent,db]);

//Suppresion de film 
const handleClick = async(index) => {
  await updateDoc(doc(db, "users", uid),{
    "myCart":arrayRemove({idMoovie :quantity[index].idMoovie,Quantity : quantity[index].Quantity})
  });
  window.location.replace("/mon-panier");
}


  //Modifier la quantité
  const handleSubmit = async(index,quantity) => {
    let changeArray = [];
    const q = query(collection(db, "users"), where("uid", "==", uid));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      changeArray.push(doc.data());
    });
    changeArray[0].myCart[index].Quantity = quantity
    await updateDoc(doc(db,  "users", uid), {
      "myCart": changeArray[0].myCart
    }) 

}
const debounce = useDebouncedCallback((index,quantity) =>handleSubmit(index,quantity),3000)
const handleChange = async (e,index) => {
  const quantityLocal = [...quantity]
    if(e.target.value>=0 && e.target.value <= 100)
    {
        quantityLocal[index].Quantity = e.target.value
        setQuantity(quantityLocal)
        debounce(index,e.target.value)
    }
    else(console.log('Valeur incorrecte'))
}

  return (
    <section>
      <Box>
        <Typography variant="h1">Page du panier</Typography>
        <Box>
          {moovieInMyCart.map((cart, index) => {
            return (
              <Box maxWidth="345px" key={index}>
                <Card style={{ minWidth: "345px" }}>
                  <CardMedia
                    component="img"
                    height="140"
                    image={cart.url}
                    alt="green iguana"
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {cart.name}
                    </Typography>
                    <ModalSuppr 
                      indexModal={index} 
                      moovie={moovieInMyCart[index]} 
                      quantity={quantity}
                      handleClickModal={handleClick}
                    />
                    <MapModal
                      // indexModal={index} 
                      // moovie={moovieInMyCart[index]} 
                      // quantity={quantity}
                      // handleClickModal={handleClick}
                      moovie={moovieInMyCart[index]}
                      />
                  <TextField
                    value={quantity[index].Quantity}
                    id="outlined-required"
                    label="Qté"
                    type="number"
                    onChange={(e)=> handleChange(e,index)}
                  />
                  </CardContent>
                </Card>
              </Box>
            );
          })}
        </Box>
      </Box>
    </section>
  );
}
export default MyCart;