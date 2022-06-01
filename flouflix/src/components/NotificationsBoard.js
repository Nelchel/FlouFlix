import { Modal, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { makeStyles } from "@mui/styles";
import Button from "@mui/material/Button";

import React from "react";
import { getAuth, signOut } from "firebase/auth";

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

  return (
    <Modal open={open}>
      <Box sx={style}>
        <Button onClick={handleClose}>Fermer</Button>
      </Box>
    </Modal>
  );
}

export default NotificationsBoard;
