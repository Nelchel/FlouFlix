import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import {
  BrowserRouter as Router,
  Link,
  Outlet,
} from "react-router-dom";
import { makeStyles } from "@mui/styles";
import SignOut from "./SignOut";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useState } from "react";

const makeClass = makeStyles((theme) => ({
  signupButton: {
    marginRight: "10px",
  },
  
}));

function Nav() {
  const classes = makeClass();
  const [exist, setExist] = useState();

  const auth = getAuth();

  onAuthStateChanged(auth, (user) => {
    if (user) {
      const mail = user.mailAddress;
      setExist(true);
    } else {
      setExist(false)
    }
  });
  


  return (
    <Box bgcolor="black" maxHeight="70px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box marginLeft="50px">
          <Link to="/">
            <img
              src="images/logo-flouflix.png"
              alt="logo flouflix"
              height="70px"
            />
          </Link>
        </Box>
        {exist === false ? (
          <Box marginRight="10px" display="flex">
            <Box marginRight="10px">
              <Link to="/inscription">
                <Button variant="outlined" color="error">
                  <Typography>Inscription</Typography>
                </Button>
              </Link>
            </Box>
            <Link to="/connexion">
              <Button variant="contained" color="error">
                <Typography>Se connecter</Typography>
              </Button>
            </Link>
          </Box>
        ) : (
          <SignOut />
        )}
        <Link to="/catalogue">Catalogue</Link>
      </Box>
      <Outlet />
    </Box>
  );
}

export default Nav;
