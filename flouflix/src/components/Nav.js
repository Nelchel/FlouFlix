import { Container, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ShoppingCartSharpIcon from "@mui/icons-material/ShoppingCartSharp";
import { BrowserRouter as Router, Link, Outlet } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import SignOut from "./SignOut";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useState } from "react";

const makeClass = makeStyles((theme) => ({
  section: {
    background: "black",
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
      setExist(false);
    }
  });

  return (
    <section className={classes.section}>
      <Container maxWidth="1250px">
        <Box bgcolor="black" maxHeight="70px">
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box marginLeft="50px">
              <Link to="/">
                <img
                  src="images/logo-flouflix.png"
                  alt="logo flouflix"
                  height="70px"
                />
              </Link>
            </Box>
            <Link to="/catalogue">
              <Button variant="contained" color="error">
                <Typography>Catalogue</Typography>
              </Button>
            </Link>
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
              <>
                <Link to="/mon-panier">
                  <ShoppingCartSharpIcon fontSize="large" style={{color : 'white'}}/>
                </Link>
                <Link to="/mes-films">
                  <Button variant="contained" color="error">
                    <Typography>Mes films</Typography>
                  </Button>
                </Link>
                <SignOut />
              </>
            )}
          </Box>
          <Outlet />
        </Box>
      </Container>
    </section>
  );
}

export default Nav;
