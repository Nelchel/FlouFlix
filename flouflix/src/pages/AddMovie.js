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

const makeClass = makeStyles((theme) => ({
  formScript: {
    color: theme.palette.text.white,
    alignItems: "center",
    gap: "8px",
    flexWrap: "wrap",
    flexDirection: "row",
    padding: 4,
    borderRadius: "4px",
    "&> div.container": {
      gap: "6px",
      display: "flex",
      flexDirection: "row",
      flexWrap: "wrap",
    },
    "& > div.container > span": {
      backgroundColor: "gray",
      padding: "1px 3px",
      borderRadius: "4px",
    },
  },
  buttonDisabled: {
    backgroundColor: `${theme.palette.secondary.dark} !important`,
    color: `${theme.palette.text.white} !important`,
    textTransform: "initial !important",
  },
  buttonAdd: {
    textTransform: "initial !important",
  },
}));

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

function AddMovie() {
  // const storage = firebase.storage()
  const db = firebase.firestore();
  const storage = getStorage();

  const classes = makeClass();

  const auth = getAuth();

  onAuthStateChanged(auth, (user) => {
    if (user) {
      setUidUser(user.uid);
    }
  });

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

  const localeMap = {
    fr: frLocale,
  };

  const handleKeyUp = (e) => {
    console.log(e.keyCode);
    if (e.keyCode === 13) {
      setScript((oldState) => [...oldState, e.target.value]);
      setCurrValue("");
    }
  };

  useEffect(() => {
    console.log(script);
  }, [script]);

  const handleChange = (e) => {
    setCurrValue(e.target.value);
  };

  const handleKeyUpCasting = (e) => {
    console.log(e.keyCode);
    if (e.keyCode === 13) {
      setCasting((oldState) => [...oldState, e.target.value]);
      setCurrValueCasting("");
    }
  };

  const handleChangeCasting = (e) => {
    setCurrValueCasting(e.target.value);
  };

  const handleDeleteCasting = (item, index) => {
    let arr = [...script];
    arr.splice(index, 1);
    console.log(item);
    setCasting(arr);
  };

  const handleDelete = (item, index) => {
    let arr = [...script];
    arr.splice(index, 1);
    console.log(item);
    setScript(arr);
  };

  const handleSubmit = async () => {
    console.log(url);
    await db
      .collection("movies")
      .add({
        name: name,
        releaseDate: onlyYear,
        price: price,
        description: desc,
        img: image.name,
        seller: uidUser,
        id: movieId,
        url: url,
        director: director,
        script: script,
        language: language,
        exactReleaseDate: releaseDate,
        imgGallery: urlGallery,
        casting: casting,
        genre: arrayGenre,
        imdb: imdb,
        pegi: pegi,
        trailerUrl: trailerUrl,
        movieUrl: movieUrl,
        duration: duration,
      })
      .then(async (docRef) => {
        // console.log("Document successfully written!");
        // console.log(docRef);
        // console.log("Document written with ID: ", docRef.id);
        const movieRef = await doc(db, "movies", docRef.id);
        setMovieId(docRef.id);
        console.log(docRef.id);
        await updateDoc(movieRef, {
          id: docRef.id,
        });
      })
      .catch((error) => {
        console.error("Error writing document: ", error);
      });

    // const movieRef = doc(db, "movies", movieId);

    window.location.replace("/catalogue");
  };

  const handleChangeStreaming = (e) => {
    setValueStreaming(e.target.value);
  };

  const handleChangeLanguage = (event) => {
    setLanguage(event.target.value);
  };

  return (
    <section>
      <Container maxWidth="1250px">
        <Box>
          <Typography variant="h2">Ajouter un film</Typography>
          <FormControl fullWidth>
            <RadioGroup
              row
              value={valueStreaming}
              onChange={handleChangeStreaming}
            >
              <FormControlLabel
                value="isStreaming"
                control={<Radio color="secondary" />}
                label="Version streaming"
              />
              <FormControlLabel
                value="isNotStreaming"
                control={<Radio color="secondary" />}
                label="Version matérielle"
              />
            </RadioGroup>
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
            <div class="custom-file-upload">
              <form>
                <label htmlFor="file">
                  <Typography className="forLabel">
                    Choisir une affiche
                  </Typography>
                </label>
                <input
                  id="file"
                  name="file"
                  type="file"
                  onChange={async (e) => {
                    setIsLoading(true);
                    setImage(e.target.files[0]);
                    const nom = e.target.files[0].name;
                    const img = e.target.files[0];
                    const imagesRef = ref(storage, `/catalogue/${nom}`);
                    uploadBytes(imagesRef, img).then((snapshot) => {
                      getDownloadURL(imagesRef).then(function (downloadURL) {
                        // console.log("File available at", downloadURL);
                        setUrl(downloadURL);
                        setIsUpload(true);
                        console.log(downloadURL);
                        setIsLoading(false);
                      });
                    });
                    // await uploadBytes(imagesRef, img).then((snapshot) => {
                    //   console.log('written');
                    // });
                  }}
                />
              </form>
              {isLoading && (
                <Box paddingLeft="20px">
                  <CircularProgress color="secondary" />
                </Box>
              )}
              {isUpload && !isLoading && (
                <Box paddingLeft="20px">{image.name}</Box>
              )}
            </div>
            <Box paddingTop="20px">
              <Typography variant="body1" style={{ paddingBottom: "5px" }}>
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
            <Box paddingTop="20px" paddingBottom="20px" position="relative">
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
            <Box paddingTop="20px">
              <Typography variant="body1" style={{ paddingBottom: "5px" }}>
                Genre du film
              </Typography>
              <Box
                display="flex"
                height="75px"
                justifyContent="space-between"
                alignContent="space-between"
                flexWrap="wrap"
              >
                {Object.entries(genre).map(([type, value], index) => {
                  return (
                    <StyleChip
                      onClick={(e) => {
                        const g = type;
                        value = !value;
                        genre[g] = value;
                        setGenre((prevState) => {
                          let genre = Object.assign({}, prevState);
                          genre[g] = value;
                          return genre;
                        });
                        Object.entries(genre).map((type, value) => {
                          if (value === true) {
                            setArrayGenre(type);
                          }
                        });
                      }}
                      color={value ? "secondary" : "default"}
                      variant={value ? "default" : "outlined"}
                      label={type}
                    />
                  );
                })}
              </Box>
            </Box>
            <Box paddingBottom="20px" paddingTop="20px" position="relative">
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
            <div class="custom-file-upload">
              <form>
                <label htmlFor="fileGallery">
                  <Typography className="forLabel">
                    Charger des photos supplémentaires
                  </Typography>
                </label>
                <input
                  id="fileGallery"
                  multiple
                  name="file"
                  type="file"
                  onChange={async (e) => {
                    setIsLoadingGallery(true);
                    setImageGallery(e.target.files[0]);
                    const nom = e.target.files[0].name;
                    const img = e.target.files[0];
                    const imagesRef = ref(storage, `/catalogue/${nom}`);
                    uploadBytes(imagesRef, img).then((snapshot) => {
                      getDownloadURL(imagesRef).then(function (downloadURL) {
                        // console.log("File available at", downloadURL);
                        let array = [];
                        array.push(downloadURL);
                        setUrlGallery(array);
                        console.log(urlGallery);
                        setIsUploadGallery(true);
                        console.log(downloadURL);
                        setIsLoadingGallery(false);
                      });
                    });
                    // await uploadBytes(imagesRef, img).then((snapshot) => {
                    //   console.log('written');
                    // });
                  }}
                />
              </form>
              {isLoadingGallery && (
                <Box paddingLeft="20px">
                  <CircularProgress color="secondary" />
                </Box>
              )}
              {isUploadGallery && !isLoadingGallery && (
                <Box paddingLeft="20px">{imageGallery.name}</Box>
              )}
            </div>
            <Box paddingTop="40px">
              <div class="custom-file-upload">
                <form>
                  <label htmlFor="trailer">
                    <Typography className="forLabel">
                      Charger une bande annonce
                    </Typography>
                  </label>
                  <input
                    id="trailer"
                    multiple
                    name="file"
                    type="file"
                    onChange={async (e) => {
                      setIsLoadingTrailer(true);
                      setTrailer(e.target.files[0]);
                      const nom = e.target.files[0].name;
                      const img = e.target.files[0];
                      const imagesRef = ref(storage, `/trailer/${nom}`);
                      uploadBytes(imagesRef, img).then((snapshot) => {
                        getDownloadURL(imagesRef).then(function (downloadURL) {
                          // console.log("File available at", downloadURL);
                          setTrailerUrl(downloadURL);
                          setIsUploadTrailer(true);
                          console.log(downloadURL);
                          setIsLoadingTrailer(false);
                        });
                      });
                      // await uploadBytes(imagesRef, img).then((snapshot) => {
                      //   console.log('written');
                      // });
                    }}
                  />
                </form>
                {isLoadingTrailer && (
                  <Box paddingLeft="20px">
                    <CircularProgress color="secondary" />
                  </Box>
                )}
                {isUploadTrailer && !isLoadingTrailer && (
                  <Box paddingLeft="20px">{trailer.name}</Box>
                )}
              </div>
            </Box>
            {valueStreaming === "isStreaming" && (
              <Box paddingTop="40px">
                <div class="custom-file-upload">
                  <form>
                    <label htmlFor="streaming">
                      <Typography className="forLabel">
                        Charger un film
                      </Typography>
                    </label>
                    <input
                      id="streaming"
                      name="file"
                      type="file"
                      onChange={async (e) => {
                        setIsLoadingStreaming(true);
                        setMovie(e.target.files[0]);
                        const nom = e.target.files[0].name;
                        const img = e.target.files[0];
                        const imagesRef = ref(storage, `/movie/${nom}`);
                        uploadBytes(imagesRef, img).then((snapshot) => {
                          getDownloadURL(imagesRef).then(function (
                            downloadURL
                          ) {
                            // console.log("File available at", downloadURL);
                            setMovieUrl(downloadURL);
                            setIsUploadMovie(true);
                            console.log(downloadURL);
                            setIsLoadingStreaming(false);
                          });
                        });
                        // await uploadBytes(imagesRef, img).then((snapshot) => {
                        //   console.log('written');
                        // });
                      }}
                    />
                  </form>
                  {isLoadingStreaming && (
                    <Box paddingLeft="20px">
                      <CircularProgress color="secondary" />
                    </Box>
                  )}
                  {isUploadMovie && !isLoadingStreaming && (
                    <Box paddingLeft="20px">{movie.name}</Box>
                  )}
                </div>
              </Box>
            )}
            {isUpload && isUploadTrailer && isUploadGallery ? (
              <Box paddingTop="30px" paddingBottom="50px">
                <Button
                  className={classes.buttonAdd}
                  onClick={handleSubmit}
                  variant="contained"
                  color="secondary"
                >
                  <Typography>Ajouter le film</Typography>
                </Button>
              </Box>
            ) : (
              <Box paddingTop="30px" paddingBottom="50px">
                <Button
                  className={classes.buttonDisabled}
                  variant="contained"
                  disabled
                  color="secondary"
                >
                  <Typography>Ajouter le film</Typography>
                </Button>
              </Box>
            )}
          </FormControl>
        </Box>
      </Container>
    </section>
  );
}

export default AddMovie;
