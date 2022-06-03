import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { makeStyles } from "@mui/styles";

import { useParams } from "react-router-dom";
import React, { useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import firebase from "firebase/compat/app";
import { collection, query, where, getDocs } from "firebase/firestore";
import ReactPlayer from "react-player";

const makeClass = makeStyles((theme) => ({
  videoPlayer: {
    width: "100%",
    height: "calc(100vh - 80px)",
  },
}));

function WatchMovie() {
  const classes = makeClass();
  const auth = getAuth();
  const db = firebase.firestore();
  let i = 0;

  const [uid, setUid] = React.useState("");
  const [idFilm, setIdFilm] = React.useState("");
  const [userData, setUserData] = React.useState([]);
  const getMovies = [];
  const getStreaming = [];
  const [idStreaming, setIdStreaming] = React.useState();
  const [movies, setMovies] = React.useState([]);
  const [played, setPlayed] = React.useState();
  const [wasPlayed, setWasPlayed] = React.useState();
  const [counter, setCounter] = React.useState(0);
  const playerRef = React.useRef();
  const [isPlaying, setIsPlaying] = React.useState(true);
  const [isReady, setIsReady] = React.useState(false);
  const [streaming, setStreaming] = React.useState([]);

  let { id } = useParams();
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

    db.collection("streaming")
      .where("idMovie", "==", id)
      .where("idUser", "==", uid)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          // console.log(doc.id, " => ", doc.data());
          getStreaming.push(doc.data());
        });
        if (getStreaming.length !== 0) {
          setIdStreaming(getStreaming[0].idStreaming);
          setWasPlayed(getStreaming[0].played);
          localStorage.setItem("items", getStreaming[0].played);
          setStreaming(getStreaming);
        }
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
  }, [uid]);

  const updateFilm = (playedProgress) => {
    console.log("update");
    var userRef = db.collection("streaming").doc(idStreaming);
    return userRef
      .update({
        played: playedProgress,
      })
      .then(() => {
        console.log("Document successfully updated!");
        i = 0;
      })
      .catch((error) => {
        // The document probably doesn't exist.
        console.error("Error updating document: ", error);
      });
  };

  const onReady = React.useCallback(() => {
    if (!isReady) {
      setIsReady(true);
      const played = localStorage.getItem("items");
      console.log(played);
      playerRef.current.seekTo(played, "seconds");
    }
  }, [isReady]);

  return (
    <Box className={classes.videoPlayer}>
      {movies.length !== undefined &&
        movies.length > 0 &&
        streaming.length !== 0 && (
          <ReactPlayer
            ref={playerRef}
            progressInterval={30000}
            onProgress={(progress) => {
              setPlayed(progress.playedSeconds);
              updateFilm(progress.playedSeconds);
            }}
            controls
            onReady={onReady}
            url={movies[0].movieUrl}
            width="100%"
            height="100%"
          />
        )}
    </Box>
  );
}

export default WatchMovie;
