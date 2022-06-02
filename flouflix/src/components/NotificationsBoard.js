import { Modal, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { makeStyles, useTheme } from "@mui/styles";
import Button from "@mui/material/Button";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import firebase from "firebase/compat/app";

const makeClass = makeStyles((theme) => ({
  signOut: {
    float: "right",
  },
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

function NotificationsBoard({ open, handleClose }) {
  const classes = makeClass();
  const auth = getAuth();
  const db = firebase.firestore();
  const theme = useTheme();

  const [uid, setUid] = useState("");
  const getNotifications = [];
  const [notifications, setNotifications] = useState([]);

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

    db.collection("notifications")
      .where("idUser", "==", uid)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          // console.log(doc.id, " => ", doc.data());
          getNotifications.push(doc.data());
        });
        setNotifications(getNotifications);
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
  }, [uid]);

  const handleClick = (id, index) => {
    var userRef = db.collection("notifications").doc(id);
    return userRef
      .update({
        isRead: true,
      })
      .then(() => {
        console.log("Document successfully updated!");
        getNotifications.splice(index, 1);
        setNotifications(getNotifications);
      })
      .catch((error) => {
        // The document probably doesn't exist.
        console.error("Error updating document: ", error);
      });
  };

  return (
    <Modal open={open}>
      <Box sx={style}>
        <Button onClick={handleClose}>Fermer</Button>
        <Typography color={theme.palette.text.black}>Notifications</Typography>
        {notifications.map((notif, index) => {
          return (
            <Box>
              {!notif.isRead && (
                <Box>
                  {index}
                  <Typography color={theme.palette.text.black}>
                    {notif.content}
                  </Typography>
                  <Button
                    onClick={(e) => {
                      handleClick(notif.id, index);
                    }}
                  >
                    <Typography>Marquer comme lue</Typography>
                  </Button>
                </Box>
              )}
            </Box>
          );
        })}
      </Box>
    </Modal>
  );
}

export default NotificationsBoard;
