import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { makeStyles, useTheme } from "@mui/styles";
import Modal from "@mui/material/Modal";

import React from "react";

const makeClass = makeStyles((theme) => ({
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
  button: {
    textTransform: "unset !important",
    boxShadow: "unset !important",
  },
}));

function ModalSuppr(props) {
  const classes = makeClass();
  const theme = useTheme();
  return (
    <>
      <Modal
        open={props.open}
        onClose={props.handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className={classes.modale}>
          <Typography
            id="modal-modal-title"
            variant="h5"
            color={theme.palette.text.white}
          >
            Supprimer le film {props.moovie.name}
          </Typography>
          <Box paddingTop="20px">
            <Typography
              id="modal-modal-description"
              color={theme.palette.text.white}
            >
              Êtes-vous sûr de vouloir supprimer ce film ?
            </Typography>
          </Box>
          <Box paddingTop="30px" display="flex" justifyContent="space-between">
            <Button
              onClick={() => props.handleClose()}
              variant="contained"
              color="primary"
              className={classes.button}
            >
              <Typography variant="body1">Annuler</Typography>
            </Button>
            <Button
              variant="contained"
              onClick={() => props.handleClickModal(props.indexModal)}
              color="secondary"
              className={classes.button}
            >
              <Typography variant="body1">Confirmer la suppression</Typography>
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
}
export default ModalSuppr;
