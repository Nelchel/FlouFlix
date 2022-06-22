import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { makeStyles, useTheme } from "@mui/styles";
import Button from "@mui/material/Button";
import { withStyles } from "@mui/styles";
import Container from "@mui/material/Container";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DatePicker from "@mui/lab/DatePicker";
import CircularProgress from "@mui/material/CircularProgress";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { styled } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import Chip from "@mui/material/Chip";
import { useParams } from "react-router-dom";

import React, { useState, useEffect } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";

import { fr } from "date-fns/locale";
import frLocale from "date-fns/locale/fr";

import "../css/AddMovie.css";
import CustomTextField from "../helpers/CustomTextField";
import toTimestamp from "../helpers/ToTimestamp";
import getDateWithYear from "../helpers/GetDate";
import getDate from "../helpers/GetDate";

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

const CustomSelect = styled(InputBase)(({ theme }) => ({
  "label + &": {
    marginTop: theme.spacing(3),
    color: theme.palette.text.white,
  },
  "& .MuiInputBase-input": {
    borderRadius: 4,
    // height: "34px !important",
    color: theme.palette.text.white,
    position: "relative",
    border: "1px solid white",
    fontSize: 16,
    padding: "16px 26px 15px 12px",
    transition: theme.transitions.create(["border-color", "box-shadow"]),
    "&:focus": {
      borderRadius: 4,
    },
  },
  "& .MuiSelect-icon": {
    color: "white !important",
  },
}));

const StyleChip = withStyles({
  root: {
    color: "white !important",
  },
})(Chip);

function Movie() {
  const db = firebase.firestore();
  let { id } = useParams();
  const classes = makeClass();
  const storage = getStorage();
  const [uid, setUid] = useState("");
  const getMovies = [];
  const [movies, setMovies] = useState([]);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [valueStreaming, setValueStreaming] = React.useState("");
  const [name, setName] = useState("");
  const [releaseDate, setReleaseDate] = useState();
  const [price, setPrice] = useState(0);
  const [desc, setDesc] = useState();
  const [image, setImage] = useState("");
  const [uidUser, setUidUser] = useState("");
  const [movieId, setMovieId] = useState("");
  const [url, setUrl] = useState("");
  const [isUpload, setIsUpload] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState();
  const [director, setDirector] = useState();
  const [script, setScript] = useState([]);
  const [currValue, setCurrValue] = useState("");
  const [casting, setCasting] = useState([]);
  const [currValueCasting, setCurrValueCasting] = useState("");
  const [duration, setDuration] = useState("");
  const [genre, setGenre] = useState({
    Aventure: false,
    Guerre: false,
    Histore: false,
    Action: false,
    Comédie: false,
    Drame: false,
    Jeunesse: false,
    "Comédie musicale": false,
    Policier: false,
    Espionnage: false,
    "Science-Fiction": false,
    Fantastique: false,
    Horreur: false,
    Western: false,
    Documentaire: false,
  });
  const [imdb, setImdb] = useState(0);
  const [pegi, setPegi] = useState(0);
  const [isLoadingGallery, setIsLoadingGallery] = useState(false);
  const [imageGallery, setImageGallery] = useState("");
  const [urlGallery, setUrlGallery] = useState([]);
  const [isUploadGallery, setIsUploadGallery] = useState(false);
  const [isLoadingTrailer, setIsLoadingTrailer] = useState(false);
  const [trailer, setTrailer] = useState("");
  const [trailerUrl, setTrailerUrl] = useState("");
  const [isUploadTrailer, setIsUploadTrailer] = useState(false);
  const [isLoadingStreaming, setIsLoadingStreaming] = useState(false);
  const [movie, setMovie] = useState("");
  const [movieUrl, setMovieUrl] = useState("");
  const [isUploadMovie, setIsUploadMovie] = useState(false);
  const [onlyYear, setOnlyYear] = useState();
  const [arrayGenre, setArrayGenre] = useState([]);

  const auth = getAuth();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        setUid(uid);
      } else {
      }
    });
    console.log(uid);
    db.collection("movies")
      .where("id", "==", id)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          // console.log(doc.id, " => ", doc.data());
          getMovies.push(doc.data());
        });
        setValueStreaming(false);
        setMovies(getMovies);
        setName(getMovies[0].name);
        setReleaseDate(getDate(getMovies[0].releaseDate));
        setPrice(getMovies[0].price);
        setDesc(getMovies[0].description);
        setImage(getMovies[0].img);
        setLanguage(getMovies[0].language);
        setDirector(getMovies[0].director);
        setCurrValue(getMovies[0].script);
        setCurrValueCasting(getMovies[0].casting);
        setDuration(getMovies[0].duration);
        setGenre(getMovies[0].genre);
        setImdb(getMovies[0].imdb);
        setPegi(getMovies[0].pegi);
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
  }, [uid]);

  const localeMap = {
    fr: frLocale,
  };

  const handleSubmit = async () => {
    const imagesRef = ref(storage, `/catalogue/${image.name}`);
    uploadBytes(imagesRef, image).then((snapshot) => {
      // console.log('written');
    });

    getDownloadURL(imagesRef).then(function (downloadURL) {
      // console.log("File available at", downloadURL);
      setUrl(downloadURL);
    });
    const movieRef = doc(db, "movies", id);

    console.log(id);

    await updateDoc(movieRef, {
      name: name,
      description: desc,
      releaseDate: releaseDate,
      price: price,
      img: image,
    });

    await window.location.replace("/catalogue");
  };

  const handleChangeStreaming = (e) => {
    setValueStreaming(e.target.value);
  };

  const handleChangeLanguage = (event) => {
    setLanguage(event.target.value);
  };

  const handleDelete = (item, index) => {
    let arr = [...script];
    arr.splice(index, 1);
    console.log(item);
    setScript(arr);
  };

  const handleChange = (e) => {
    setCurrValue(e.target.value);
  };

  const handleKeyUp = (e) => {
    console.log(e.keyCode);
    if (e.keyCode === 13) {
      setScript((oldState) => [...oldState, e.target.value]);
      setCurrValue("");
    }
  };

  const handleDeleteCasting = (item, index) => {
    let arr = [...script];
    arr.splice(index, 1);
    console.log(item);
    setCasting(arr);
  };

  const handleChangeCasting = (e) => {
    setCurrValueCasting(e.target.value);
  };

  const handleKeyUpCasting = (e) => {
    console.log(e.keyCode);
    if (e.keyCode === 13) {
      setCasting((oldState) => [...oldState, e.target.value]);
      setCurrValueCasting("");
    }
  };

  return (
    <section>
      <Container maxWidth="1250px">
        <Box>
          {movies.length !== undefined && movies.length > 0 && (
            <Box>
              <Typography variant="h2">
                Modifier les informations du film
              </Typography>
              <Box paddingTop="20px">
                <FormControl fullWidth>
                  <Box paddingBottom="20px" position="relative">
                    <CustomTextField
                      fullWidth
                      required
                      value={name}
                      id="movieName"
                      label="Nom du film"
                      onChange={(e) => setName(e.target.value)}
                      InputLabelProps={{
                        style: { color: "#fff" },
                      }}
                    />
                  </Box>
                  <Box paddingBottom="20px" position="relative">
                    <LocalizationProvider
                      dateAdapter={AdapterDateFns}
                      adapterLocale={localeMap[fr]}
                    >
                      <DatePicker
                        label="Date de sortie"
                        placeholder="mm/dd/yyyy"
                        value={releaseDate}
                        onChange={(e) => {
                          setReleaseDate(
                            getDateWithYear(toTimestamp(e), setOnlyYear)
                          );
                        }}
                        renderInput={(params) => (
                          <CustomTextField
                            required
                            fullWidth
                            {...params}
                            InputLabelProps={{ style: { color: "#fff" } }}
                          />
                        )}
                      />
                    </LocalizationProvider>
                  </Box>
                  <Box paddingBottom="20px" position="relative">
                    <CustomTextField
                      fullWidth
                      required
                      multiline
                      value={desc}
                      id="movieDescription"
                      label="Description du film"
                      onChange={(e) => setDesc(e.target.value)}
                      InputLabelProps={{
                        style: { color: "#fff" },
                      }}
                    />
                  </Box>
                  <Box paddingBottom="20px" position="relative">
                    <CustomTextField
                      fullWidth
                      required
                      type="number"
                      value={price}
                      id="moviePrice"
                      label="Prix du film"
                      onChange={(e) => setPrice(e.target.value)}
                      InputLabelProps={{
                        style: { color: "#fff" },
                      }}
                    />
                  </Box>
                  <Box paddingTop="20px">
                    <Typography
                      variant="body1"
                      style={{ paddingBottom: "5px" }}
                    >
                      Langue du film
                    </Typography>
                    <Select
                      fullWidth
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={language}
                      label="Age"
                      onChange={handleChangeLanguage}
                      input={<CustomSelect />}
                    >
                      <MenuItem value="Français">Français</MenuItem>
                      <MenuItem value="English">English</MenuItem>
                      <MenuItem value="Deutsch">Deutsch</MenuItem>
                    </Select>
                  </Box>
                  <Box
                    paddingTop="20px"
                    paddingBottom="20px"
                    position="relative"
                  >
                    <CustomTextField
                      fullWidth
                      required
                      value={director}
                      id="director"
                      label="Réalisateur"
                      onChange={(e) => setDirector(e.target.value)}
                      InputLabelProps={{
                        style: { color: "#fff" },
                      }}
                    />
                  </Box>
                  <Box className={classes.formScript}>
                    <div className="container">
                      {script.map((item, index) => (
                        <Chip
                          color="secondary"
                          size="small"
                          onDelete={() => handleDelete(item, index)}
                          label={item}
                        />
                      ))}
                    </div>
                    <Box paddingTop="20px" paddingBottom="20px">
                      <CustomTextField
                        fullWidth
                        required
                        label="Scénario"
                        value={currValue}
                        onChange={handleChange}
                        onKeyDown={handleKeyUp}
                        InputLabelProps={{
                          style: { color: "#fff" },
                        }}
                      />
                    </Box>
                  </Box>
                  <Box className={classes.formScript}>
                    <div className="container">
                      {casting.map((item, index) => (
                        <Chip
                          color="secondary"
                          size="small"
                          onDelete={() => handleDeleteCasting(item, index)}
                          label={item}
                        />
                      ))}
                    </div>
                    <Box paddingTop="20px" paddingBottom="20px">
                      <CustomTextField
                        fullWidth
                        required
                        label="Casting principal"
                        value={currValueCasting}
                        onChange={handleChangeCasting}
                        onKeyDown={handleKeyUpCasting}
                        InputLabelProps={{
                          style: { color: "#fff" },
                        }}
                      />
                    </Box>
                  </Box>
                  <Box paddingBottom="20px" position="relative">
                    <CustomTextField
                      fullWidth
                      required
                      value={duration}
                      id="duration"
                      label="Durée du film"
                      onChange={(e) => setDuration(e.target.value)}
                      InputLabelProps={{
                        style: { color: "#fff" },
                      }}
                    />
                  </Box>
                  <Box
                    paddingBottom="20px"
                    paddingTop="20px"
                    position="relative"
                  >
                    <CustomTextField
                      fullWidth
                      required
                      type="number"
                      value={imdb}
                      id="imdb"
                      label="Note imDb"
                      onChange={(e) => setImdb(e.target.value)}
                      InputLabelProps={{
                        style: { color: "#fff" },
                      }}
                    />
                  </Box>
                  <Box paddingBottom="20px" position="relative">
                    <CustomTextField
                      fullWidth
                      required
                      type="number"
                      value={pegi}
                      id="pegi"
                      label="Pegi"
                      onChange={(e) => setPegi(e.target.value)}
                      InputLabelProps={{
                        style: { color: "#fff" },
                      }}
                    />
                  </Box>
                  <Box paddingTop="30px" paddingBottom="50px">
                    <Button
                      className={classes.buttonDisabled}
                      variant="contained"
                      color="secondary"
                    >
                      <Typography>Modifier le film</Typography>
                    </Button>
                  </Box>
                </FormControl>
              </Box>
            </Box>
          )}
        </Box>
      </Container>
    </section>
  );
}

export default Movie;
