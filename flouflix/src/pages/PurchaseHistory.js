import React, { useState, useEffect } from "react";
import { Container, Typography } from "@mui/material";
import { makeStyles, useTheme } from "@mui/styles";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  doc,
  updateDoc,
  setDoc,
  where,
  collection,
  getDocs,
  query,
  arrayRemove,
} from "firebase/firestore";
import getDate from "../helpers/GetDate";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

const makeClass = makeStyles((theme) => ({
  fw500: {
    fontWeight: "500 !important",
  },
}));

const PurchaseHistory = (props) => {
  const db = firebase.firestore();
  const theme = useTheme();
  const classes = makeClass();
  const auth = getAuth();
  const [uid, setUid] = useState("");
  const [moovieInMyCart, setMoovieInMyCart] = useState([]);
  const [movieId, setMovieId] = useState("");
  const [valdiate, setValidate] = useState(false);
  const [infoPurchase, setInfoPurchase] = useState([]);
  const [value, setValue] = useState([]);
  const [command, setCommand] = useState([]);
  const [userCurrent, setUserCurrent] = useState(undefined);

  //Récupération des informations de transaction de la BDD
  useEffect(() => {
    onAuthStateChanged(
      auth,
      (user) => {
        if (user) {
          const uid = user.uid;
          setUid(uid);
        } else {
        }
      },
      [auth]
    );
    let transactions = [];
    db.collection("purchase")
      .where("idUser", "==", uid)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          transactions.push(doc.data());
        });
        if (transactions[0] !== undefined) {
          setCommand(transactions);
          setValue(transactions[0].purchase);
        }
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
  }, [uid]);

  return (
    <section>
      <Container maxWidth="1250px">
        <Box paddingTop="25px">
          <Typography variant="h2" color={theme.palette.text.white}>
            Historique de commande
          </Typography>
        </Box>
        {command !== undefined && (
          <Box paddingTop="20px">
            {command.map((item, index) => {
              return (
                <Box>
                  <Typography
                    variant="h5"
                    color={theme.palette.text.white}
                    className={classes.fw500}
                  >
                    Numéro de commande: {item.id.toUpperCase()}
                  </Typography>
                  <Box padding="15px 0">
                    <Typography variant="body2">
                      Date d'achat: {getDate(item.date)}
                    </Typography>
                  </Box>
                  <hr style={{ borderColor: "#595858" }} />
                  <TableContainer component={Box}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell>
                            <Typography
                              color={theme.palette.text.white}
                              variant="body2"
                            >
                              Nom du film
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography
                              color={theme.palette.text.white}
                              variant="body2"
                            >
                              Quantité
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography
                              color={theme.palette.text.white}
                              variant="body2"
                            >
                              Prix unitaire
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography
                              color={theme.palette.text.white}
                              variant="body2"
                            >
                              Prix total
                            </Typography>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {command[index].purchase.map((item, index) => (
                          <TableRow
                            key={item.name}
                            sx={{
                              "&:last-child td, &:last-child th": {
                                border: 0,
                              },
                            }}
                          >
                            <TableCell component="th" scope="row">
                              <Typography
                                color={theme.palette.text.white}
                                variant="body2"
                              >
                                {item.name}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Typography
                                color={theme.palette.text.white}
                                variant="body2"
                              >
                                {item.quantity}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Typography
                                color={theme.palette.text.white}
                                variant="body2"
                              >
                                {parseFloat(item.price).toFixed(2)} €
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Typography
                                color={theme.palette.text.white}
                                variant="body2"
                              >
                                {parseFloat(item.price * item.quantity).toFixed(
                                  2
                                )}
                                €
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              );
            })}
          </Box>
        )}
      </Container>
    </section>
  );
};

export default PurchaseHistory;
