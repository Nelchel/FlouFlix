import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { makeStyles } from "@mui/styles";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Container } from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DatePicker from "@mui/lab/DatePicker";
import { withStyles } from "@mui/styles";

import React, { useEffect, useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { Outlet } from "react-router-dom";
import firebase from "firebase/compat/app";
import { Link } from "react-router-dom";
import { GeocoderAutocomplete } from "@geoapify/geocoder-autocomplete";
import "@geoapify/geocoder-autocomplete/styles/minimal.css";

const makeClass = makeStyles((theme) => ({
  submitButton: {
    padding: "10px 20px !important",
    marginTop: "20px !important",
    margin: "auto",
  },
  linkColor: {
    color: theme.palette.text.white,
    marginLeft: "5px",
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline",
    },
  },
  required: {
    position: "absolute",
    top: "75px",
    left: "35%",
    backgroundColor: "#fff",
    padding: "5px 15px",
    borderRadius: "5px",
    color: "#333",
    transform: "translateX(-50%)",
    boxShadow: "2px 2px 10px 0 rgba(0, 0, 0, 0.5)",
    minWidth: "fit-content",
    zIndex: 99,
    display: "flex",
    alignItems: "center",
    "&::after": {
      content: "''",
      position: "absolute",
      backgroundColor: "inherit",
      top: "-6px",
      left: "50%",
      bgcolor: theme.palette.background.dark,
      width: "13px",
      height: "13px",
      transform: "translateX(-50%) rotate(45deg)",
    },
    [theme.breakpoints.down("sm")]: {
      left: "45%",
    },
    [theme.breakpoints.down("xs")]: {
      top: "96px",
    },
  },
  requiredError: {
    position: "absolute",
    top: "75px",
    left: "50%",
    backgroundColor: "#fff",
    padding: "5px 15px",
    borderRadius: "5px",
    color: "#333",
    transform: "translateX(-50%)",
    boxShadow: "2px 2px 10px 0 rgba(0, 0, 0, 0.5)",
    minWidth: "fit-content",
    zIndex: 99,
    display: "flex",
    alignItems: "center",
    "&::after": {
      content: "''",
      position: "absolute",
      backgroundColor: "inherit",
      top: "-6px",
      left: "50%",
      bgcolor: theme.palette.background.dark,
      width: "13px",
      height: "13px",
      transform: "translateX(-50%) rotate(45deg)",
    },
    [theme.breakpoints.down("sm")]: {
      left: "45%",
    },
    [theme.breakpoints.down("xs")]: {
      top: "96px",
    },
  },
  inputAdress: {
    paddingBottom: "20px",
    "& .geoapify-autocomplete-input": {
      height: "56px",
      borderRadius: "4px",
      background: "transparent",
      borderColor: "white",
      color: "white",
    },
    "& .geoapify-close-button": {
      top: "-10px",
      color: "white",
    },
    "& .geoapify-autocomplete-items": {
      marginTop: "-20px",
      borderRadius: "0 0 4px 4px",
      background: "#212121",
      borderColor: "white",
    },
    "& .geoapify-autocomplete-items .secondary-part": {
      color: "white",
    },
  },
}));

const CustomTextField = withStyles((theme) => ({
  root: {
    zIndex: 3,
    color: "white",
    borderColor: "white",
    "label + &": {
      color: "white",
    },
    "& .MuiOutlinedInput-root": {
      color: "white",
      "&::placeholder": {
        color: "white",
      },
      "& fieldset": {
        borderColor: "white",
        color: "white",
      },
      "&:hover fieldset": {
        borderColor: "white",
        color: "white",
      },
      "&.Mui-focused fieldset": {
        borderColor: "white",
        color: "white",
      },
    },
  },
}))(TextField);

function Inscription() {
  const classes = makeClass();
  const db = firebase.firestore();
  const auth = getAuth();

  localStorage.setItem("url", window.location.pathname);

  const [mailAddress, setMailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [userLog, setUserLog] = useState("");
  const [isBoutique, setIsBoutique] = useState(false);
  const [isValid, setValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [passwordValidation, setPasswordValidation] = useState("");
  const [confirm, setConfirm] = useState();
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [lat, setLat] = useState("");
  const [lon, setLon] = useState("");
  const [pseudo, setPseudo] = useState("");
  const [phone, setPhone] = useState("");
  const [dateBirth, setDateBirth] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    await createUserWithEmailAndPassword(auth, mailAddress, password)
      .then((userCredential) => {
        const user = userCredential.user;
        setUserLog(user.uid);
      })
      .catch((error) => {
        if (error.code === "auth/email-already-in-use") {
          setErrorMessage("Il existe déjà un compte associé à cet email.");
        }
      });
  };

  useEffect(() => {
    const logIn = async () => {
      if (userLog !== "") {
        await setDoc(doc(db, "users", userLog), {
          uid: userLog,
          mailAddress: mailAddress,
          myCart: [],
          password: password,
          isBoutique: isBoutique,
          addressLine1: addressLine1,
          addressLine2: addressLine2,
          photoURL:
            "https://firebasestorage.googleapis.com/v0/b/flouflix-46d80.appspot.com/o/anonyme.png?alt=media&token=ebc235c8-d5df-4dd2-b834-d9d6f985fc1a",
          phone: phone,
          dateBirth: dateBirth,
          pseudo: pseudo,
          lat: lat,
          lon: lon,
        });
        window.location.replace(`/`);
      }
    };
    logIn();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userLog]);

  useEffect(() => {
    const autocomplete = new GeocoderAutocomplete(
      document.getElementById("autocomplete"),
      "f99dc96855554b5e94169e8f6015c05c",
      {
        /* Geocoder options */
      }
    );
    autocomplete.on("select", async (location) => {
      setAddressLine1(location.properties.address_line1);
      setAddressLine2(location.properties.address_line2);
      setLat(location.properties.lat);
      setLon(location.properties.lon);
    });

    autocomplete.on("suggestions", (suggestions) => {
      // process suggestions here
    });
  }, []);

  function ValidateEmail(mail) {
    const mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (mail.match(mailformat)) {
      return true;
    }
    return false;
  }

  return (
    <section>
      <Container maxWidth="1250px">
        <Box
          display="flex"
          flexDirection="column"
          align="center"
          width="375px"
          margin="auto"
        >
          <Box padding="50px 0 20px 0">
            <Typography align="center" variant="h2" component="h1">
              Inscription
            </Typography>
          </Box>
          <form>
            <Box align="center" textAlign="center">
              <Box paddingBottom="20px" position="relative">
                <CustomTextField
                  required
                  fullWidth
                  value={pseudo}
                  id="pseudo"
                  label="Entrer un pseudo"
                  onChange={(e) => {
                    setPseudo(e.target.value);
                  }}
                  InputLabelProps={{
                    style: { color: "#fff" },
                  }}
                />
              </Box>
              <Box paddingBottom="20px" position="relative">
                <CustomTextField
                  fullWidth
                  required
                  value={mailAddress}
                  id="mailAdressSingUp"
                  label="Adresse mail"
                  onChange={(e) => {
                    const valid = ValidateEmail(e.target.value);
                    setValid(valid);
                    setMailAddress(e.target.value);
                  }}
                  InputLabelProps={{
                    style: { color: "#fff" },
                  }}
                />
                {errorMessage !== "" && (
                  <div className={classes.requiredError}>
                    <WarningIcon style={{ marginRight: 5, color: "orange" }} />
                    <Typography>{errorMessage}</Typography>
                  </div>
                )}
                {!isValid && mailAddress.length > 3 && (
                  <div className={classes.required}>
                    <WarningIcon style={{ marginRight: 5, color: "orange" }} />
                    <Typography>L'email saisi n'est pas valide.</Typography>
                  </div>
                )}
              </Box>
              <Box paddingBottom="20px" position="relative">
                <CustomTextField
                  required
                  fullWidth
                  type="password"
                  value={password}
                  id="passwordSignUp"
                  label="Mot de passe"
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  InputLabelProps={{
                    style: { color: "#fff" },
                  }}
                />
                {password.length > 1 && password.length < 6 && (
                  <div className={classes.required}>
                    <WarningIcon style={{ marginRight: 5, color: "orange" }} />
                    <Typography>
                      Le mot de passe saisi doit comporter plus de 6 caractères.
                    </Typography>
                  </div>
                )}
              </Box>
              <Box paddingBottom="20px" position="relative">
                <CustomTextField
                  required
                  fullWidth
                  type="password"
                  value={passwordValidation}
                  id="passwordValidation"
                  label="Confirmer votre mot de passe"
                  onChange={(e) => {
                    setPasswordValidation(e.target.value);
                    if (password === e.target.value) {
                      setConfirm(true);
                    } else setConfirm(false);
                  }}
                  InputLabelProps={{
                    style: { color: "#fff" },
                  }}
                />
                {confirm && password.length < 3 && (
                  <div className={classes.required}>
                    <WarningIcon style={{ marginRight: 5, color: "orange" }} />
                    <Typography>
                      Les mots de passe ne correspondent pas.
                    </Typography>
                  </div>
                )}
              </Box>
              <Box paddingBottom="20px" position="relative">
                <CustomTextField
                  required
                  fullWidth
                  type="phone"
                  value={phone}
                  id="phone"
                  placeholder="+330612345678"
                  label="Numéro de téléphone"
                  onChange={(e) => {
                    setPhone(e.target.value);
                  }}
                  InputLabelProps={{
                    style: { color: "#fff" },
                  }}
                />
              </Box>
              <Box paddingBottom="20px" position="relative">
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Date de naissance"
                    placeholder="mm/dd/yyyy"
                    value={dateBirth}
                    onChange={(e) => {
                      setDateBirth(e);
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
              <div
                className={classes.inputAdress}
                id="autocomplete"
                style={{ position: "relative" }}
              ></div>
              <FormControl fullWidth>
                <Select
                  id="selectCategorie"
                  sx={{
                    border: "1px solid white",
                    color: "#fff",
                    "& .MuiSvgIcon-root": {
                      color: "white",
                    },
                  }}
                  value={isBoutique}
                  onChange={(e) => {
                    setIsBoutique(e.target.value);
                  }}
                >
                  <MenuItem value={true}>Boutique agréée</MenuItem>
                  <MenuItem value={false}>Particulier</MenuItem>
                </Select>
              </FormControl>
              {isValid &&
              confirm &&
              password.length >= 5 &&
              pseudo.length >= 3 ? (
                <Button
                  id="submit"
                  variant="contained"
                  color="secondary"
                  onClick={handleSubmit}
                  className={classes.submitButton}
                >
                  <Typography variant="body1">S'inscrire</Typography>
                </Button>
              ) : (
                <Button
                  id="submit"
                  disabled
                  variant="contained"
                  color="secondary"
                  className={classes.submitButton}
                  style={{ backgroundColor: "#ff5740", color: "white"}}
                >
                  <Typography variant="body1">S'inscrire</Typography>
                </Button>
              )}
              <Box paddingTop="10px">
                <Typography variant="body1">
                  Vous avez déjà un compte ?
                  <Link to="/connexion" className={classes.linkColor}>
                    Connectez-vous
                  </Link>
                  .
                </Typography>
              </Box>
            </Box>
          </form>
          <Outlet />
        </Box>
      </Container>
    </section>
  );
}

export default Inscription;
