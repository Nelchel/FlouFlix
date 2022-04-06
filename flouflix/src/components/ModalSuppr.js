import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { makeStyles,useTheme } from "@mui/styles";
import Modal from "@mui/material/Modal";
import React, { useState, useEffect } from "react";
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



function ModalSuppr(props) {
  //Gestion de la fenêtre de suppression  
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return(
<>
    <Button onClick={handleOpen}>Supprimer</Button>

    <Modal
    open={open}
    onClose={handleClose}
    aria-labelledby="modal-modal-title"
    aria-describedby="modal-modal-description"
    >
    <Box sx={style}>
      <Typography id="modal-modal-title" variant="h6" component="h2" color="primary">
        Supprimer le film {props.moovie.name}
      </Typography>
      <Typography id="modal-modal-description" sx={{ mt: 2 }} color="primary">
        Êtes-vous sûr ?
      </Typography>
      <Button onClick={() => handleClose()} color="primary">
        Annuler
      </Button>
      <Button onClick={() =>props.handleClickModal(props.indexModal)} color="secondary">
        Supprimer
      </Button>
    </Box>
  </Modal>
</> 
  )
}
export default ModalSuppr;