import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Map from "./Map";
import React, { useState, useEffect } from "react";
import RoomIcon from "@mui/icons-material/Room";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { where, collection, getDocs, query } from "firebase/firestore";
import { Typography, useTheme } from "@mui/material";
import { makeStyles } from "@mui/styles";

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

const makeClass = makeStyles((theme) => ({
  button: {
    textTransform: "unset !important",
  },
}));

const legend = {
  color: "black",
  display: "inline-block",
};

function MapModal(props) {
  const theme = useTheme();
  const classes = makeClass();

  //Gestion de la modale
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  //Récupération userCurrent
  const db = firebase.firestore();
  const auth = getAuth();
  const [uid, setUid] = useState("");
  const [coordinaryUserCurrent, setCoordinaryUserCurrent] = useState([]);
  // const[boutiques,setBoutiques] = useState([]);
  const [userMoovie, setUserMoovie] = useState([]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    //Recupération du user actuelle
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        setUid(uid);
      } else {
      }
    });

    //Récupération des users selon un film
    const getUserMoovie = [];
    db.collection("users")
      .where("uid", "==", props.moovie.seller)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          getUserMoovie.push(doc.data());
        });
        const user = [];
        for (let i = 0; i < getUserMoovie.length; i++) {
          user.push({
            boutique: getUserMoovie[i].isBoutique,
            uid: getUserMoovie[i].uid,
            address1: getUserMoovie[i].addressLine1,
            address2: getUserMoovie[i].addressLine2,
            phone: getUserMoovie[i].phone,
            longitute: getUserMoovie[i].lon,
            latitutde: getUserMoovie[i].lat,
          });
        }
        setUserMoovie(user);
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth, uid]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    const getUser = async () => {
      let user = [];
      const q = query(collection(db, "users"), where("uid", "==", uid));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        user.push(doc.data());
      });
      const lng = user[0].lon;
      const lat = user[0].lat;
      const coordinaryArray = [];
      coordinaryArray.push({
        longitute: lng,
        latitutde: lat,
      });
      setCoordinaryUserCurrent(coordinaryArray);
    };
    getUser();
  }, [uid, db]);

  return (
    <>
      <Button
        onClick={handleOpen}
        color="secondary"
        variant="contained"
        className={classes.button}
      >
        <Typography color={theme.palette.text.white}>
          Voir les boutiques
        </Typography>
      </Button>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <div>
            <RoomIcon style={{ fill: "#b40219", display: "inline-block" }} />{" "}
            <h3 style={legend}>Votre position</h3>
          </div>
          <div>
            <RoomIcon style={{ fill: "#3bb2d0", display: "inline-block" }} />{" "}
            <h3 style={legend}>Boutique</h3>
          </div>
          <div>
            <RoomIcon style={{ fill: "#008000", display: "inline-block" }} />{" "}
            <h3 style={legend}>Particulier</h3>
          </div>
          <Map
            coordinaryUserCurrent={coordinaryUserCurrent}
            userMoovie={userMoovie}
          />
        </Box>
      </Modal>
    </>
  );
}
export default MapModal;
