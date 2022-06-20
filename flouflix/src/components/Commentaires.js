import { Avatar, Typography, useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import { makeStyles } from "@mui/styles";
import firebase from "firebase/compat/app";
import React, { useEffect, useRef, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useParams } from "react-router-dom";
import Button from "@mui/material/Button";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { SnackbarProvider, useSnackbar } from "notistack";
import Grid from "@mui/material/Grid";
import getDate from "../helpers/GetDate";
import "../css/Avis.css";

const makeClass = makeStyles((theme) => ({
  signOut: {
    float: "right",
  },
  container: {
    boxShadow: "rgba(17, 12, 46, 0.15) 0px 48px 100px 0px;",
  },
  button: {
    boxShadow: "unset !important",
    textTransform: "initial !important",
  },
  fw500: {
    fontWeight: "500 !important",
  },
  linkMore: {
    "&:hover": {
      textDecoration: "underline",
      cursor: "pointer",
    },
  },
}));

function Commentaires(props) {
  const classes = makeClass();
  const theme = useTheme();
  const auth = getAuth();
  const [uid, setUid] = useState("");
  const db = firebase.firestore();
  let { id } = useParams();

  const stars = useRef();

  const getAvis = [];
  const getMovies = [];
  const getUsers = [];
  const [avis, setAvis] = useState([]);
  const [movie, setMovie] = useState([]);
  const [users, setUsers] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const { closeSnackBar } = useSnackbar();
  const [status, setStatus] = useState("success");

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

    db.collection("commentaires")
      .where("idMovie", "==", id)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          // console.log(doc.id, " => ", doc.data());
          getAvis.push(doc.data());
        });
        setAvis(getAvis);
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });

    db.collection("users")
      .where("uid", "==", uid)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          getUsers.push(doc.data());
        });
        setMovie(getMovies);
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });

    db.collection("users")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          getUsers.push(doc.data());
        });
        setUsers(getUsers);
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
  }, [uid]);

  const handleReport = async (idUser) => {
    if (uid !== "") {
      await db
        .collection("notifications")
        .add({
          content: "Vous avez été signaler par un modérateur concernant l'avis",
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
    const moovieName = `l'avis a bel et bien été signalé`;
    addMoovie(moovieName);
  };

  const handleSuppr = async (id, idUser) => {
    await deleteDoc(doc(db, "commentaires", id));

    if (uid !== "") {
      await db
        .collection("notifications")
        .add({
          content:
            "L'un de vos commentaires sur le film " +
            props.movie[0].name +
            " a été supprimé",
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
    const moovieName = `l'avis a été supprimé`;
    addMoovie(moovieName);
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
  
  const ReadMore = ({ children }) => {
    const text = children;
    const classes = makeClass();
    const [isReadMore, setIsReadMore] = useState(true);
    const toggleReadMore = () => {
      setIsReadMore(!isReadMore);
    };
    return (
      <p className="text">
        {isReadMore ? text.slice(0, 450) : text}
        <span onClick={toggleReadMore} className="read-or-hide">
          <span className={classes.linkMore}>
            {isReadMore ? "...Voir plus" : "...Voir moins"}
          </span>
        </span>
      </p>
    );
  };

  return (
    <Box paddingTop="20px">
      <Grid container spacing={2}>
        {avis.map((commentaire, index) => {
          const starTotal = 5;

          if (stars.current) {
            const starPercentage = (commentaire.note / starTotal) * 100;
            const starPercentageRounded = `${
              Math.round(starPercentage / 10) * 10
            }%`;
            document.querySelector(
              `.${`commentaire` + index} .stars-inner`
            ).style.width = starPercentageRounded;
          }
          return (
            <Grid item md={6}>
              <Box
                backgroundColor={theme.palette.primary.light}
                className={classes.container}
                borderRadius="8px"
                padding="40px"
              >
                <Box display="flex" alignItems="top" justifyContent="center">
                  <Box paddingRight="15px">
                    {users.map((user) => {
                      return (
                        <>
                          {user.uid === commentaire.idUser && (
                            <>
                              <Avatar src={user.photoURL} alt={user.pseudo} />
                            </>
                          )}
                        </>
                      );
                    })}
                  </Box>
                  <Box minWidth="370px" paddingBottom="20px">
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Box>
                        {users.map((user) => {
                          return (
                            <>
                              {user.uid === commentaire.idUser && (
                                <Typography
                                  variant="body1"
                                  className={classes.fw500}
                                >
                                  {user.pseudo}
                                </Typography>
                              )}
                            </>
                          );
                        })}
                        <Typography variant="body1">
                          {getDate(commentaire.dateAvis)}
                        </Typography>
                      </Box>
                      <Box>
                        <div class={`${`commentaire` + index}`}>
                          <div class="stars-outer">
                            <div ref={stars} class="stars-inner"></div>
                          </div>
                        </div>
                      </Box>
                    </Box>
                    <hr />
                    <Typography variant="body1" className={classes.fw500}>
                      {commentaire.title}
                    </Typography>
                    <Typography variant="body2">
                      <ReadMore>{commentaire.description}</ReadMore>
                    </Typography>
                  </Box>
                </Box>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  {movie[0] !== undefined && (
                    <>
                      {movie[0].moderator === true && (
                        <>
                          <Button
                            className={classes.button}
                            color="secondary"
                            variant="contained"
                            onClick={() => handleReport(avis[index].idUser)}
                          >
                            <Typography variant="body2">
                              Signaler l'utilisateur
                            </Typography>
                          </Button>
                          <Button
                            className={classes.button}
                            color="secondary"
                            variant="contained"
                            onClick={() =>
                              handleSuppr(avis[index].id, avis[index].idUser)
                            }
                          >
                            <Typography variant="body2">
                              Supprimer le commentaire
                            </Typography>
                          </Button>
                        </>
                      )}
                    </>
                  )}
                </Box>
              </Box>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}

export default Commentaires;
