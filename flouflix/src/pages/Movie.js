import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
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
import { doc, deleteDoc,updateDoc,getDoc,arrayUnion} from "firebase/firestore";
import { BrowserRouter as Router, Link, Outlet } from "react-router-dom";
import { SnackbarProvider, useSnackbar } from "notistack";

const makeClass = makeStyles((theme) => ({
  signupButton: {
    marginRight: "10px",
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

function Movie() {
  const db = firebase.firestore();
  let { id } = useParams();
  const [uid, setUid] = useState("");
  const [idFilm,setIdFilm] = useState("");
  const [userData, setUserData] = useState([]);
  const getMovies = [];
  const [movies, setMovies] = useState([]);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { enqueueSnackbar } = useSnackbar();
  const { closeSnackBar } = useSnackbar();


  const auth = getAuth();
  const theme = useTheme();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        setUid(uid);
      } else {
      }
    },[auth]);

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
        setUserData(user[0])
      };
      getUser();
    }, [uid,db]);
  
  const handleDelete = async () => {
    await deleteDoc(doc(db, "movies", movies[0].id));

    window.location.replace("/catalogue");
  };

  const handleClick = async() => {
    let quantity = 1
    const idMoovie = movies[0].id
    const moovieName = `${movies[0].name} ajouté au panier`
    const idMoovieFind = userData.myCart.find(m=> m.idMoovie === idMoovie)
    if(idMoovieFind !== undefined)
    {
      quantity = parseFloat(idMoovieFind.Quantity)
    }
    if(idMoovieFind == undefined && idFilm==="")
    {
      await updateDoc(await doc(db, "users", uid),{
        myCart:arrayUnion({idMoovie :idMoovie,Quantity : quantity})
      });
      addMoovie(moovieName)
      setIdFilm(idMoovie)
    }
    else
    {
      // await updateDoc(doc(db,  "users", uid), {
      //     "myCart": changeArray[0].myCart
      //   }) 
        console.log("n'ajoute pas le film")
        const moovieName = `${movies[0].name} est déjà dans votre panier`
      addMoovie(moovieName)
    }
  }


const addMoovie = (moovieName) =>{
  const key = enqueueSnackbar(moovieName,{
    autoHideDuration: 1000,
    variant : 'success',
    anchorOrigin :{
      vertical: 'bottom',
      horizontal: 'center',
    },
  });
}
  return (
    <section>
      <Box>
        {movies.length !== undefined && movies.length > 0 && (
          <>
            <Box>
              <Typography variant="h2">{movies[0].name}</Typography>
              <img src={movies[0].url} width="300" height="300" />
              <Typography variant="body1">{movies[0].description}</Typography>
            </Box>
            <Button onClick={() => handleClick()}>
              <Typography color={theme.palette.text.white}>
                Ajouter au panier
              </Typography>
              </Button>
            {uid === movies[0].seller && (
              <>
                <Link to={"/modifier-film/" + movies[0].id}>
                  <Button>
                    <Typography color={theme.palette.text.white}>
                    Modifier le film
                    </Typography>
                  </Button>
                </Link>
                <Button onClick={handleOpen}>
                  <Typography color={theme.palette.text.white}>
                    Supprimer le film
                  </Typography>
                </Button>
              </>
            )}
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style}>
                <Typography color={theme.palette.text.black} id="modal-modal-title" variant="h6" component="h2">
                  Supprimer le film {movies[0].name}
                </Typography>
                <Typography color={theme.palette.text.black} id="modal-modal-description" sx={{ mt: 2 }}>
                  Êtes-vous sûr ?
                </Typography>
                <Button onClick={handleDelete} color="error">
                  Supprimer
                </Button>
              </Box>
            </Modal>
          </>
        )}
      </Box>
    </section>
  );
}

export default Movie;
