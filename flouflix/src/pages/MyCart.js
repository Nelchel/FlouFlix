import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { makeStyles, useTheme } from "@mui/styles";
import TextField from "@mui/material/TextField";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import ModalSuppr from "../components/ModalSuppr";
import MapModal from "../components/ModalMap";
import { Link } from "react-router-dom";
//gestion du payement en ligne
import Payment from "../components/Payment";
import Modal from "@mui/material/Modal";
import React, { useState, useEffect } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { useDebouncedCallback } from "use-debounce";
import { getAuth, onAuthStateChanged } from "firebase/auth";
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
  linkMenu: {
    marginLeft: "15px",
    textDecoration: "none",
    color: theme.palette.text.white,
  },
}));

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function MyCart(stripeConfig) {
  //modal du paiement
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    calculPrice();
    setOpen(true);
  };
  const handleClose = () => setOpen(false);
  //Style
  const classes = makeClass();
  const theme = useTheme();

  const db = firebase.firestore();
  const auth = getAuth();
  const [uid, setUid] = useState("");
  const [moovieInMyCart, setMoovieInMyCart] = useState([]);
  const TotalPrice = [];
  const finalPurchase = [];
  const [finalPrice, setFinalPrice] = useState(0);
  const [valdiate, setValidate] = useState(false);
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
      const quantityArray = user[0].myCart;
      setQuantity(quantityArray);
      setUserCurrent(user[0]);
    };
    getUser();
  }, [uid, db]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    let movies = [];
    if (userCurrent !== undefined) {
      const cart = userCurrent.myCart;
      await Promise.all(
        cart.map(async (carte, index) => {
          const q = query(
            collection(db, "movies"),
            where("id", "==", carte.idMoovie)
          );
          const querySnapshot = await getDocs(q);
          querySnapshot.forEach((doc) => {
            movies.push(doc.data());
          });
        })
      );
      setMoovieInMyCart(movies);
    }
  }, [userCurrent, db]);

  //Suppresion de film
  const handleClick = async (index) => {
    await updateDoc(doc(db, "users", uid), {
      myCart: arrayRemove({
        idMoovie: quantity[index].idMoovie,
        Quantity: quantity[index].Quantity,
      }),
    });
    window.location.replace("mon-panier");
  };

  //Modifier la quantité
  const handleSubmit = async (index, quantity) => {
    let changeArray = [];
    const q = query(collection(db, "users"), where("uid", "==", uid));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      changeArray.push(doc.data());
    });
    changeArray[0].myCart[index].Quantity = quantity;
    await updateDoc(doc(db, "users", uid), {
      myCart: changeArray[0].myCart,
    });
  };
  const debounce = useDebouncedCallback(
    (index, quantity) => handleSubmit(index, quantity),
    3000
  );
  const handleChange = async (e, index) => {
    const quantityLocal = [...quantity];
    if (e.target.value >= 0 && e.target.value <= 100) {
      quantityLocal[index].Quantity = e.target.value;
      setQuantity(quantityLocal);
      debounce(index, e.target.value);
    } else console.log("Valeur incorrecte");
  };

  const calculPrice = () => {
    let sum = 0;
    for (let i = 0; i < TotalPrice.length; i++) {
      sum += TotalPrice[i].price;
    }
    setFinalPrice(sum);
  };

  const handlePayement = () => {
    setValidate(true);
    return null;
  };

  console.log(moovieInMyCart);
  return (
    <section>
      <Box>
        <Typography variant="h2">Mon panier</Typography>
        <Box>
          {moovieInMyCart.length === 0 && (
            <Box width="fit-content" margin="auto">
              <img src="https://firebasestorage.googleapis.com/v0/b/flouflix-46d80.appspot.com/o/empty-cart.png?alt=media&token=0eabbf69-8387-49c3-8378-a8b9090b4a36" />
              <Box width="fit-content" margin="auto">
                <Typography variant="h5">Votre panier est vide</Typography>
                <Typography variant="body1">
                  Vous pouvez ajouter des films dans le panier depuis le
                  catalogue
                </Typography>
                <Link to="/catalogue">
                  <Button color="secondary" variant="contained">
                    <Typography>Catalogue</Typography>
                  </Button>
                </Link>
              </Box>
            </Box>
            // <Typography variant="h5">
            //   Votre panier est vide :
            //   <Link to="/catalogue" className={classes.linkMenu}>
            //     ajouter un film
            //   </Link>
            // </Typography>
          )}
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
                    <MapModal moovie={moovieInMyCart[index]} />
                    <TextField
                      value={quantity[index].Quantity}
                      id="outlined-required"
                      label="Qté"
                      type="number"
                      onChange={(e) => handleChange(e, index)}
                    />
                  </CardContent>
                </Card>
              </Box>
            );
          })}
        </Box>
        {moovieInMyCart.length !== 0 && (
          <Button onClick={handleOpen} variant="contained" color="secondary">
            Confirmer son panier
          </Button>
        )}
        <Modal open={open} onClose={handleClose}>
          <Box sx={style}>
            <Typography>Confirmation du panier</Typography>
            <Box justifyContent="space-around" display="flex">
              <Typography gutterBottom variant="h6" component="div">
                Nom du film
              </Typography>
              <Typography gutterBottom variant="h6" component="div">
                Qté
              </Typography>
              <Typography gutterBottom variant="h6" component="div">
                prix
              </Typography>
            </Box>
            {moovieInMyCart.map((cart, index) => {
              TotalPrice.push({
                price:
                  parseFloat(moovieInMyCart[index].price) *
                  quantity[index].Quantity,
              });
              finalPurchase.push({
                price: moovieInMyCart[index].id_price,
                quantity: quantity[index].Quantity,
              });
              return (
                <Box justifyContent="space-around" display="flex">
                  <Typography gutterBottom component="div">
                    {cart.name}
                  </Typography>
                  <Typography gutterBottom variant="h6" component="div">
                    {quantity[index].Quantity}
                  </Typography>
                  <Typography gutterBottom variant="h6" component="div">
                    {TotalPrice[index].price.toFixed(2)} €
                  </Typography>
                </Box>
              );
            })}
            <Box justifyContent="space-between" display="flex">
              <Typography gutterBottom variant="h6" component="div">
                Total :
              </Typography>
              <Typography gutterBottom variant="h6" component="div">
                {finalPrice.toFixed(2)} €
              </Typography>
            </Box>
            <Box justifyContent="center" display="flex">
              <Button
                onClick={handlePayement}
                variant="contained"
                color="secondary"
              >
                Valider et payer
              </Button>
              {valdiate === true && (
                <Box>
                  <Payment
                    email={auth.currentUser.email}
                    sale={finalPurchase}
                  />
                </Box>
              )}
            </Box>
          </Box>
        </Modal>
      </Box>
    </section>
  );
}
export default MyCart;
