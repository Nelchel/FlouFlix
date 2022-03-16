import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Icon from "@mui/material/Icon";
import { makeStyles } from "@mui/styles";
import TextField from "@mui/material/TextField";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import React, { useState, useEffect } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import {
  getAuth,
  signOut,
  onAuthStateChanged,
  updateCurrentUser,
} from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  doc,
  updateDoc,
  where,
  collection,
  getDocs,
  query,
  arrayRemove,
} from "firebase/firestore";

function MyCart() {
  const db = firebase.firestore();
  const auth = getAuth();

  const [uid, setUid] = useState("");
  const [myCart, setMyCart] = useState([]);
  const [moovieInMyCart, setMoovieInMyCart] = useState([]);
  const [userCurrent, setUserCurrent] = useState(undefined);
  const moviesCurrent = useState();
  const [newUser, setNewUser] = useState();
  const getMyCart = [];
  const getMoovieInMyCart = [];

  // const test = async () => {
  //   if (uid !== "") {
  //     const q = query(collection(db, "users"), where("uid", "==", uid));
  //     const querySnapshot = await getDocs(q);

  //     querySnapshot.forEach((doc) => {
  //       user.push(doc.data());
  //     });
  //     userCurrent[0] = user;
  //   }
  //   console.log(userCurrent[0][0].myCart);

  //   const test = userCurrent[0][0].myCart;

  //   if (userCurrent[0][0] !== undefined) {
  //     userCurrent[0][0].myCart.forEach(async (cart, index) => {
  //       const s = query(collection(db, "movies"), where("id", "==", cart));
  //       const querySnapshot = await getDocs(s);

  //       querySnapshot.forEach((doc) => {
  //         movies.push(doc.data());
  //         console.log(doc.data())
  //       });
  //       console.log(movies[0].releaseDate)
  //       moviesCurrent.push(movies[0]);
  //       setMoovieInMyCart(movies);
  //     })
  //   }
  // }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        setUid(uid);
      } else {
      }
    });
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    const getUser = async () => {
      let user = [];
      const q = query(collection(db, "users"), where("uid", "==", uid));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        user.push(doc.data());
      });
      setUserCurrent(user[0]);
    };
    getUser();
  }, [uid]);

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
  }, [userCurrent]);


  const handleClick = async(index) => {
      await updateDoc(doc(db, "users", uid),{
        myCart:arrayRemove({idMoovie :moovieInMyCart[index].id,Quantity : 1})
      });
      window.location.replace("/mon-panier");
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
                    <Button onClick={() =>handleClick(index)}>Supprimer</Button>
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
