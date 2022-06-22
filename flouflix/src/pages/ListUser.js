import React, { useState, useEffect } from "react";
import { Typography } from "@mui/material";
import { makeStyles, useTheme } from "@mui/styles";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import firebase from "firebase/compat/app";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import { SnackbarProvider, useSnackbar } from "notistack";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  doc,
  updateDoc,
  deleteDoc,
  setDoc,
  where,
  collection,
  getDocs,
  query,
  arrayRemove,
} from "firebase/firestore";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

const makeClass = makeStyles((theme) => ({
  button: {
    boxShadow: "unset !important",
    textTransform: "unset !important",
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

const ListUser = (props) => {
  //modal de confirmation
  const classes = makeClass();
  const [openReport, setOpenReport] = React.useState(false);
  const [openDelete, setopenDelete] = React.useState(false);
  const handleOpenReport = async (user) => {
    await setUserModal(user);
    setOpenReport(true);
  };
  const handleCloseReport = () => setOpenReport(false);

  const handleOpenDelete = async (user) => {
    await setUserModal(user);
    setopenDelete(true);
  };
  const handleCloseDelete = () => setopenDelete(false);

  const db = firebase.firestore();
  const auth = getAuth();
  const theme = useTheme();
  const [uid, setUid] = useState("");
  const [userModal, setUserModal] = useState([]);
  const [infoPurchase, setInfoPurchase] = useState([]);
  const [value, setValue] = useState([]);
  const [users, setUsers] = useState([]);
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [userCurrent, setUserCurrent] = useState(undefined);
  const { enqueueSnackbar } = useSnackbar();
  const { closeSnackBar } = useSnackbar();
  const [status, setStatus] = useState("success");

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
    let users = [];
    db.collection("users")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          users.push(doc.data());
        });
        if (users[0] !== undefined) {
          setUsers(users);
        }
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
  }, [uid]);

  const handleChangeDescription = (event) => {
    setDescription(event.target.value);
  };

  const handleReport = async (idUser, description) => {
    setOpenReport(false);
    if (uid !== "") {
      await db
        .collection("notifications")
        .add({
          content: description,
          idUser: idUser,
          isRead: false,
        })
        .then(async (docRef) => {
          const movieRef = await doc(db, "notifications", docRef.id);
          await updateDoc(movieRef, {
            id: docRef.id,
          });
        })
        .catch((error) => {
          console.error("Error writing document: ", error);
        });
    }
    const moovieName = `l'utilisateur a été signalé`;
    addMoovie(moovieName);
  };

  const handleSuppr = async (uid) => {
    await deleteDoc(doc(db, "users", uid));
    setopenDelete(false);
    const moovieName = `l'utilisateur a été supprimé`;
    addMoovie(moovieName);
    window.location.replace("/List-user/");
  };

  const addMoovie = (moovieName) => {
    const key = enqueueSnackbar(moovieName, {
      autoHideDuration: 1000,
      variant: status,
      anchorOrigin: {
        vertical: "bottom",
        horizontal: "center",
      },
    });
  };
  return (
    <Box>
      {users !== undefined && (
        <>
          <TableContainer component={Box}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Typography
                      variant="body2"
                      color={theme.palette.text.white}
                    >
                      Pseudo
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      color={theme.palette.text.white}
                      variant="body2"
                    >
                      Modérateur / Utilisateur
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography
                      variant="body2"
                      color={theme.palette.text.white}
                    >
                      Adresse email
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography
                      color={theme.palette.text.white}
                      variant="body2"
                    >
                      Boutique / Particulier
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography
                      color={theme.palette.text.white}
                      variant="body2"
                    >
                      Numéro de téléphone
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography
                      color={theme.palette.text.white}
                      variant="body2"
                    >
                      Adresse
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography
                      variant="boyd2"
                      color={theme.palette.text.white}
                    >
                      Actions
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user, index) => (
                  <TableRow
                    key={user.pseudo}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      <Typography
                        variant="body2"
                        color={theme.palette.text.white}
                      >
                        {user.pseudo}
                      </Typography>
                    </TableCell>
                    <TableCell component="th" scope="row">
                      <Typography
                        variant="body2"
                        color={theme.palette.text.white}
                      >
                        {user.moderator ? "Modérateur" : "Utilisateur"}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography
                        color={theme.palette.text.white}
                        variant="body2"
                      >
                        {user.mailAddress}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography
                        color={theme.palette.text.white}
                        variant="body2"
                      >
                        {user.isBoutique === true ? "Boutique" : "Particulier"}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography
                        variant="body2"
                        color={theme.palette.text.white}
                      >
                        {user.phone}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography
                        variant="body2"
                        color={theme.palette.text.white}
                      >
                        {user.addressLine1} {user.addressLine2}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Box display="flex" flexDirection="column">
                        <Button
                          color="secondary"
                          variant="contained"
                          className={classes.button}
                          style={{ marginBottom: "10px" }}
                          onClick={() => handleOpenReport(user)}
                        >
                          <Typography variant="body2">
                            Signaler l'utilisateur
                          </Typography>
                        </Button>
                        <Button
                          color="secondary"
                          variant="contained"
                          className={classes.button}
                          onClick={() => handleOpenDelete(user)}
                        >
                          <Typography variant="body2">
                            Supprimer l'utilisateur
                          </Typography>
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Modal
            open={openReport}
            onClose={handleCloseReport}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Typography
                color={theme.palette.text.black}
                id="modal-modal-title"
                variant="h6"
                component="h2"
              >
                Message pour {userModal.pseudo}
              </Typography>
              <TextField
                value={description}
                id="outlined-required"
                label="Déscription du message"
                onChange={handleChangeDescription}
              >
                Êtes-vous sûr ?
              </TextField>
              <Button onClick={handleCloseReport} color="error">
                Annluer
              </Button>
              <Button
                onClick={() => handleReport(userModal.uid, description)}
                color="error"
              >
                Confirmer
              </Button>
            </Box>
          </Modal>

          <Modal
            open={openDelete}
            onClose={handleCloseDelete}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Typography
                color={theme.palette.text.black}
                id="modal-modal-title"
                variant="h6"
                component="h2"
              >
                Supprimer l'utilisateur {userModal.pseudo}
              </Typography>
              <Typography
                color={theme.palette.text.black}
                id="modal-modal-description"
                sx={{ mt: 2 }}
              >
                Êtes-vous sûr ?
              </Typography>
              <Button onClick={handleCloseDelete} color="error">
                Annluer
              </Button>
              <Button onClick={() => handleSuppr(userModal.uid)} color="error">
                Supprimer
              </Button>
            </Box>
          </Modal>
        </>
      )}
    </Box>
  );
};

export default ListUser;
