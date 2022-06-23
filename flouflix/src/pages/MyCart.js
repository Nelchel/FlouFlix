import { Avatar, Divider, Typography } from "@mui/material";
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
import CustomTextField from "../helpers/CustomTextField";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

const makeClass = makeStyles((theme) => ({
  linkMenu: {
    marginLeft: "15px",
    textDecoration: "none",
    color: theme.palette.text.white,
  },
  titleEmptyCart: {
    marginTop: "-200px !important",
    textAlign: "center",
    paddingBottom: "10px",
  },
  linkEmptyCart: {
    margin: "auto",
    textDecoration: "unset !important",
  },
  buttonEmptyCart: {
    textTransform: "unset !important",
  },
  fw500: {
    fontWeight: "500 !important",
  },
  buttonCart: {
    height: "56px !important",
    minWidth: "55px !important",
    borderRadius: "4px 0 0 4px !important",
  },
  buttonCart2: {
    height: "56px !important",
    minWidth: "55px !important",
    borderRadius: "0 4px 4px 0 !important",
  },
  removeButton: {
    textTransform: "unset !important",
    marginLeft: "40px !important",
    marginTop: "20px !important",
  },
  button: {
    textTransform: "unset !important",
  },
  modale: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 500,
    backgroundColor: theme.palette.primary.light,
    padding: "40px",
    borderRadius: "8px",
  },
}));

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
  const [openModaleSuppression, setOpenModaleSuppression] = useState(false);

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
  }, [uid]);

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
  }, [userCurrent]);

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

  const handlePlus = (quantite, index) => {
    const quantityLocal = [...quantity];
    if (quantite >1  && quantite <= 100) {
      quantityLocal[index].Quantity = quantite + 1;
      setQuantity(quantityLocal);
      // debounce(index,quantityLocal[index].Quantity);
      handleSubmit(index, quantityLocal[index].Quantity);
    } else console.log("Valeur incorrecte");
  };

  const handleMoins = (quantite, index) => {
    const quantityLocal = [...quantity];
    if (quantite > 1 && quantite <= 100) {
      quantityLocal[index].Quantity = quantite - 1;
      setQuantity(quantityLocal);
      // debounce(index, quantityLocal[index].Quantity);
      handleSubmit(index, quantityLocal[index].Quantity);
    }
  };

  const handleOpenModaleSuppression = () => {
    setOpenModaleSuppression(true);
  };

  const handleCloseModaleSuppression = () => {
    setOpenModaleSuppression(false);
  };

  return (
    <section>
      <Box>
        <Typography variant="h2">Mon panier</Typography>
        <Box>
          {moovieInMyCart.length === 0 && (
            <Box width="fit-content" margin="auto">
              <img
                src="https://firebasestorage.googleapis.com/v0/b/flouflix-46d80.appspot.com/o/empty-cart.png?alt=media&token=0eabbf69-8387-49c3-8378-a8b9090b4a36"
                alt=""
              />
              <Box width="fit-content" margin="auto">
                <Typography variant="h5" className={classes.titleEmptyCart}>
                  Votre panier est vide
                </Typography>
                <Typography variant="body1" style={{ textAlign: "center" }}>
                  Vous pouvez ajouter des films dans le panier depuis le
                  catalogue
                </Typography>
                <Box width="fit-content" margin="auto" paddingTop="20px">
                  <Link to="/catalogue" className={classes.linkEmptyCart}>
                    <Button
                      color="secondary"
                      variant="contained"
                      className={classes.buttonEmptyCart}
                    >
                      <Typography>Catalogue</Typography>
                    </Button>
                  </Link>
                </Box>
              </Box>
            </Box>
          )}
          {moovieInMyCart.map((cart, index) => {
            return (
              <>
                <Box display="flex" paddingTop="50px">
                  <Avatar src={cart.url} sx={{ width: 150, height: 150 }} />
                  <Box
                    paddingLeft="20px"
                    display="flex"
                    flexDirection="column"
                    justifyContent="space-around"
                  >
                    <Typography
                      variant="body1"
                      className={classes.fw500}
                      color={theme.palette.text.white}
                    >
                      {cart.name}
                    </Typography>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      width="100vh"
                    >
                      <Box
                        display="flex"
                        maxWidth="290px"
                        alignItems="flex-end"
                      >
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() =>
                            handleMoins(quantity[index].Quantity, index)
                          }
                          className={classes.buttonCart}
                        >
                          <Typography
                            variant="h4"
                            className={classes.fw500}
                            color={theme.palette.text.white}
                          >
                            -
                          </Typography>
                        </Button>
                        <Box maxWidth="75px">
                          <CustomTextField
                            required
                            fullWidth
                            readOnly
                            type="number"
                            value={quantity[index].Quantity}
                            id="cartNumber"
                            InputLabelProps={{
                              style: { color: "#fff" },
                            }}
                          />
                        </Box>
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() =>
                            handlePlus(quantity[index].Quantity, index)
                          }
                          className={classes.buttonCart2}
                        >
                          <Typography
                            variant="h4"
                            className={classes.fw500}
                            color={theme.palette.text.white}
                          >
                            +
                          </Typography>
                        </Button>
                        <Button
                          onClick={handleOpenModaleSuppression}
                          className={classes.removeButton}
                        >
                          <Typography
                            variant="body2"
                            color={theme.palette.text.white}
                          >
                            Retirer
                          </Typography>
                        </Button>
                      </Box>
                      <Box display="flex" flexDirection="column-reverse">
                        <Typography
                          color={theme.palette.text.white}
                          style={{ paddingTop: "20px" }}
                        >
                          {cart.price} €
                        </Typography>
                        <MapModal moovie={moovieInMyCart[index]} />
                      </Box>
                      <ModalSuppr
                        indexModal={index}
                        moovie={moovieInMyCart[index]}
                        quantity={quantity}
                        handleClickModal={handleClick}
                        open={openModaleSuppression}
                        handleClose={handleCloseModaleSuppression}
                      />
                    </Box>
                  </Box>
                </Box>
                <hr style={{ borderColor: theme.palette.primary.light }} />
              </>
            );
          })}
        </Box>
        {moovieInMyCart.length !== 0 && (
          <Box
            paddingTop="20px"
            width="100wv"
            display="flex"
            justifyContent="flex-end"
          >
            <Button
              onClick={handleOpen}
              variant="contained"
              color="secondary"
              className={classes.button}
            >
              <Typography>Confirmer et payer</Typography>
            </Button>
          </Box>
        )}
        <Modal open={open} onClose={handleClose}>
          <Box className={classes.modale}>
            <Typography variant="h5">Confirmation du panier</Typography>
            <TableContainer component={Box}>
              <Table sx={{ minWidth: 500 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <Typography color={theme.palette.text.white}>
                        Nom du film
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography color={theme.palette.text.white}>
                        Quantité
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography color={theme.palette.text.white}>
                        Prix
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
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
                      <TableRow
                        key={cart.name}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="cart">
                          <Typography
                            color={theme.palette.text.white}
                            variant="body2"
                          >
                            {cart.name}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography
                            color={theme.palette.text.white}
                            variant="body2"
                          >
                            {quantity[index].Quantity}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography
                            color={theme.palette.text.white}
                            variant="body2"
                          >
                            {TotalPrice[index].price.toFixed(2)} €
                          </Typography>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
            <Box width="100%" display="flex" justifyContent="flex-end">
              <Typography variant="h6">
                Total : {finalPrice.toFixed(2)} €
              </Typography>
            </Box>
            <Box justifyContent="center" display="flex" paddingTop="20px">
              <Button
                onClick={handlePayement}
                variant="contained"
                color="secondary"
                className={classes.button}
              >
                <Typography>Valider et payer</Typography>
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
