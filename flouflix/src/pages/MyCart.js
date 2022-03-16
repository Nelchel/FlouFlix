import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Icon from "@mui/material/Icon";
import { makeStyles } from "@mui/styles";
import TextField from "@mui/material/TextField";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Modal from "@mui/material/Modal";
import React, { useState, useEffect } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
// import { useDebouncedCallback } from 'use-debounce';
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
  const db = firebase.firestore();
  const auth = getAuth();
  const [uid, setUid] = useState("");
  const [myCart, setMyCart] = useState([]);
  const [moovieInMyCart, setMoovieInMyCart] = useState([]);
  const [quantite, setQuantite] = useState(1);
  const [userCurrent, setUserCurrent] = useState(undefined);
  const moviesCurrent = useState();
  const [newUser, setNewUser] = useState();
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const getMyCart = [];
  const getMoovieInMyCart = [];

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
  
//   const debounce = useDebouncedCallback(() =>console.log('mise a jour de la base de donnée'),3000)
// //  {
// //       const handleClick = async(index) => {
// //       await updateDoc(doc(db, "users", uid),{
// //         myCart:arrayRemove({idMoovie :moovieInMyCart[index].id,Quantity : 1})
// //       });
// //       window.location.replace("/mon-panier");
// //   }
// // }
// // ,3000)
  
  const handleChange = async(e,index) => {
    if(e.target.value>=0 && e.target.value <= 100)
    {
      setQuantite(e.target.value)
      // debounce()
    }
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
                    <Button onClick={handleOpen}>Supprimer</Button>
                    <Modal
                      open={open}
                      onClose={handleClose}
                      aria-labelledby="modal-modal-title"
                      aria-describedby="modal-modal-description"
                    >
                      <Box sx={style}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                          Supprimer le film {cart.name}
                        </Typography>
                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                          Êtes-vous sûr ?
                        </Typography>
                        <Button onClick={() =>handleClick(index)} color="error">
                          Supprimer
                        </Button>
                      </Box>
                  </Modal>
                  <TextField
                    value={quantite}
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
