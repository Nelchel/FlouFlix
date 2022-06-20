import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { Container } from "@mui/material";
import { makeStyles, useTheme } from "@mui/styles";
import React, { useState, useEffect } from "react";
import firebase from "firebase/compat/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useSearchParams } from "react-router-dom";
import { useParams } from "react-router-dom";
import { Button } from "@mui/material";
import { chainPropTypes } from "@mui/utils";
import Modal from "@mui/material/Modal";
import {
  doc,
  deleteDoc,
  updateDoc,
  getDoc,
  arrayUnion,
} from "firebase/firestore";
import { BrowserRouter as Router, Link, Outlet } from "react-router-dom";
import { SnackbarProvider, useSnackbar } from "notistack";
import Video from "../components/Video";
import { ClassNames } from "@emotion/react";
import ReactPlayer from "react-player";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { flexbox } from "@mui/system";
import "../css/Movie.css";
import CustomTextField from "../helpers/CustomTextField";
import Commentaires from "../components/Commentaires";

const makeClass = makeStyles((theme) => ({
  videoPlayer: {
    minWidth: "753px",
    minHeight: "420px",
    paddingRight: "3px",
  },
  pegiCircle: {
    display: "flex",
    alignItems: "center",
    border: "1px solid white",
    justifyContent: "center",
    borderRadius: "50%",
    width: "37px",
    height: "35px",
  },
  pegiCircleFat: {
    display: "flex",
    alignItems: "center",
    border: "1px solid white",
    justifyContent: "center",
    borderRadius: "30px",
    width: "117px",
    height: "35px",
  },
  addToCart: {
    boxShadow: "unset !important",
    textTransform: "initial !important",
    marginRight: "20px !important",
  },
  deleteFilmButton: {
    boxShadow: "unset !important",
    textTransform: "initial !important",
  },
  modifyFilmButton: {
    boxShadow: "unset !important",
    textTransform: "initial !important",
    backgroundColor: `${theme.palette.primary.dark} !important`,
    marginRight: "20px !important",
  },
  link: {
    textDecoration: "unset !important",
  },
  fw500: {
    fontWeight: 600,
    marginRight: "10px",
  },
  buyStreaming: {
    textTransform: "initial !important",
    boxShadow: "unset !important",
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

const style2 = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "#484848",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function Movie() {
  const db = firebase.firestore();
  let { id } = useParams();
  const [uid, setUid] = useState("");
  const [idFilm, setIdFilm] = useState("");
  const [userData, setUserData] = useState([]);
  const getMovies = [];
  const [movies, setMovies] = useState([]);
  const [status, setStatus] = useState("success");
  const [open, setOpen] = React.useState(false);
  const [openAvis, setOpenAvis] = useState(false);

  const [titleAvis, setTitleAvis] = useState();
  const [descriptionAvis, setDescriptionAvis] = useState();
  const [noteAvis, setNoteAvis] = useState();
  const [avisId, setAvisId] = useState();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleOpenAvis = () => setOpenAvis(true);
  const handleCloseAvis = () => setOpenAvis(false);

  const { enqueueSnackbar } = useSnackbar();
  const { closeSnackBar } = useSnackbar();

  const auth = getAuth();
  const theme = useTheme();
  const classes = makeClass();

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

    db.collection("movies")
      .where("id", "==", id)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          // console.log(doc.id, " => ", doc.data());
          getMovies.push(doc.data());
        });
        setMovies(getMovies);
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
  }, [uid]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    const getUser = async () => {
      let user = [];
      const q = query(collection(db, "users"), where("uid", "==", uid));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        user.push(doc.data());
      });
      setUserData(user[0]);
    };
    getUser();
  }, [uid, db]);

  const handleDelete = async () => {
    await deleteDoc(doc(db, "movies", movies[0].id));
    window.location.replace("/catalogue");
  };

  const handleClick = async () => {
    let quantity = 1;
    const idMoovie = movies[0].id;
    const moovieName = `${movies[0].name} ajouté au panier`;
    const idMoovieFind = userData.myCart.find((m) => m.idMoovie === idMoovie);
    if (idMoovieFind !== undefined) {
      quantity = parseFloat(idMoovieFind.Quantity);
    }
    if (idMoovieFind === undefined && idFilm === "") {
      await updateDoc(await doc(db, "users", uid), {
        myCart: arrayUnion({ idMoovie: idMoovie, Quantity: quantity }),
      });
      addMoovie(moovieName);
      setIdFilm(idMoovie);
    } else {
      console.log("n'ajoute pas le film");
      const moovieName = `${movies[0].name} est déjà dans votre panier`;
      addMoovie(moovieName);
      setStatus("warning");
    }
  };

  const handleSubmitAvis = async () => {
    await db
      .collection("commentaires")
      .add({
        idUser: uid,
        idMovie: id,
        title: titleAvis,
        description: descriptionAvis,
        datePurchase: "",
        note: noteAvis,
        likes: 0,
        dislikes: 0,
      })
      .then(async (docRef) => {
        // console.log(docRef);
        // console.log("Document written with ID: ", docRef.id);
        const avisRef = db.collection("commentaires").doc(docRef.id);
        return avisRef
          .update({
            id: docRef.id,
          })
          .then(() => {
            setOpenAvis(false);
            console.log("Document successfully updated!");
          })
          .catch((error) => {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
          });
      })
      .catch((error) => {
        console.error("Error writing document: ", error);
      });
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
    <section>
      <Box>
        {movies.length !== undefined && movies.length > 0 && (
          <>
            <Container maxWidth="1250px">
              <Box
                paddingTop="50px"
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography variant="h2">{movies[0].name}</Typography>
                {uid === movies[0].seller && (
                  <Box>
                    <Link
                      to={"/modifier-film/" + movies[0].id}
                      className={classes.link}
                    >
                      <Button
                        color="primary"
                        variant="contained"
                        className={classes.modifyFilmButton}
                      >
                        <Typography color={theme.palette.text.white}>
                          Modifier le film
                        </Typography>
                      </Button>
                    </Link>
                    <Button
                      className={classes.deleteFilmButton}
                      color="secondary"
                      variant="contained"
                      onClick={handleOpen}
                    >
                      <Typography color={theme.palette.text.white}>
                        Supprimer le film
                      </Typography>
                    </Button>
                  </Box>
                )}
              </Box>
              <Box display="flex" alignItems="center" paddingTop="15px">
                {movies[0].genre.map((genreMovie) => (
                  <Box
                    marginRight="10px"
                    borderRadius="16px"
                    border="1px solid white"
                    padding="5px 10px"
                  >
                    <Typography variant="body1">{genreMovie}</Typography>
                  </Box>
                ))}
              </Box>
              <Box display="flex" paddingTop="20px">
                <Box paddingRight="3px">
                  <img src={movies[0].url} width="280" height="420" alt="" />
                </Box>
                <Box className={classes.videoPlayer}>
                  <ReactPlayer
                    controls
                    url={movies[0].trailerUrl}
                    width="750px"
                    height="420px"
                  />
                </Box>
                <Box maxWidth="450px" paddingLeft="30px">
                  <Typography variant="h5">À propos du film</Typography>
                  <Typography
                    variant="body1"
                    style={{ paddingTop: "30px", textAlign: "justify" }}
                  >
                    {movies[0].description}
                  </Typography>
                </Box>
              </Box>
              <Box
                backgroundColor={theme.palette.primary.light}
                padding="10px"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                borderRadius="2px"
              >
                <Box display="flex" alignItems="center" paddingLeft="20px">
                  <Typography variant="body1" style={{ paddingRight: "30px" }}>
                    Imdb {movies[0].imdb}/10
                  </Typography>
                  <Box display="flex" paddingRight="30px">
                    <AccessTimeIcon />
                    <Typography variant="body1">
                      {movies[0].duration}
                    </Typography>
                  </Box>
                  {movies[0].pegi === 0 ? (
                    <Box className={classes.pegiCircleFat}>
                      <Typography>Tous publics</Typography>
                    </Box>
                  ) : (
                    <Box className={classes.pegiCircle}>
                      <Typography>{movies[0].pegi}+</Typography>
                    </Box>
                  )}
                </Box>
                <Box display="flex" alignItems="center">
                  {/* DO NOT REMOVE */}
                  <Box paddingRight="10px">
                    <Link
                      to={`/watch/${movies[0].id}`}
                      className={classes.link}
                    >
                      <Button
                        color="secondary"
                        variant="contained"
                        className={classes.buyStreaming}
                      >
                        <Typography variant="body1">
                          Acheter le film en streaming
                        </Typography>
                      </Button>
                    </Link>
                  </Box>
                  <Button
                    color="secondary"
                    variant="contained"
                    onClick={() => handleClick()}
                    className={classes.addToCart}
                  >
                    <Typography variant="body1" style={{ marginRight: "10px" }}>
                      {movies[0].price} €
                    </Typography>
                    -
                    <Typography
                      variant="body1"
                      color={theme.palette.text.white}
                      style={{ marginLeft: "10px" }}
                    >
                      Ajouter au panier
                    </Typography>
                  </Button>
                </Box>
              </Box>
              <Box
                paddingTop="5px"
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Box>
                  <Typography variant="body1" style={{ paddingBottom: "10px" }}>
                    <span className={classes.fw500}>Réalisation :</span>
                    {movies[0].director}
                  </Typography>
                  <Typography variant="body1" style={{ paddingBottom: "10px" }}>
                    <span className={classes.fw500}>Scénario :</span>
                    {movies[0].script.map((scriptGuy) => (
                      <span className="scriptGuy">{scriptGuy}</span>
                    ))}
                  </Typography>
                  <Typography variant="body1" style={{ paddingBottom: "10px" }}>
                    <span className={classes.fw500}>Casting principal :</span>
                    {movies[0].casting.map((actorGuy) => (
                      <span className="scriptGuy">{actorGuy}</span>
                    ))}
                  </Typography>
                  <Typography variant="body1" style={{ paddingBottom: "10px" }}>
                    <span className={classes.fw500}>Langue disponible :</span>
                    {movies[0].language}
                  </Typography>
                  <Typography variant="body1" style={{ paddingBottom: "10px" }}>
                    <span className={classes.fw500}>Date de sortie :</span>
                    {movies[0].exactReleaseDate}
                  </Typography>
                </Box>
                <Box>
                  <img src={movies[0].imgGallery[0]} width="800" />
                </Box>
              </Box>
              <Box paddingTop="20px" paddingBottom="50px">
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Typography variant="h4">Avis</Typography>
                  <Button
                    color="secondary"
                    variant="contained"
                    onClick={handleOpenAvis}
                    className={classes.deleteFilmButton}
                  >
                    <Typography variant="body1">Ajouter un avis</Typography>
                  </Button>
                </Box>
                <Commentaires movies={movies} />
              </Box>

              <Modal
                open={openAvis}
                onClose={handleCloseAvis}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box sx={style2}>
                  <Typography color={theme.palette.text.white}>
                    Ajouter un avis
                  </Typography>
                  <Box paddingTop="20px">
                    <CustomTextField
                      fullWidth
                      required
                      value={titleAvis}
                      id="titleAvis"
                      label="Titre du commentaire"
                      onChange={(e) => setTitleAvis(e.target.value)}
                      InputLabelProps={{
                        style: { color: "#fff" },
                      }}
                    />
                  </Box>
                  <Box paddingTop="20px">
                    <CustomTextField
                      fullWidth
                      required
                      multiline
                      value={descriptionAvis}
                      id="descriptionAvis"
                      label="Commentaire"
                      onChange={(e) => setDescriptionAvis(e.target.value)}
                      InputLabelProps={{
                        style: { color: "#fff" },
                      }}
                    />
                  </Box>
                  <Box paddingTop="20px" paddingBottom="20px">
                    <CustomTextField
                      fullWidth
                      required
                      type="number"
                      value={noteAvis}
                      id="noteAvis"
                      label="Note du film"
                      onChange={(e) => setNoteAvis(e.target.value)}
                      InputLabelProps={{
                        style: { color: "#fff" },
                      }}
                    />
                  </Box>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleSubmitAvis}
                  >
                    <Typography>Valider mon commentaire</Typography>
                  </Button>
                </Box>
              </Modal>

              <Modal
                open={open}
                onClose={handleClose}
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
                    Supprimer le film {movies[0].name}
                  </Typography>
                  <Typography
                    color={theme.palette.text.black}
                    id="modal-modal-description"
                    sx={{ mt: 2 }}
                  >
                    Êtes-vous sûr ?
                  </Typography>
                  <Button onClick={handleDelete} color="error">
                    Supprimer
                  </Button>
                </Box>
              </Modal>
            </Container>
          </>
        )}
      </Box>
    </section>
  );
}

export default Movie;
