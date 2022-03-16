import { Container, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ShoppingCartSharpIcon from "@mui/icons-material/ShoppingCartSharp";
import { makeStyles, useTheme } from "@mui/styles";

import { Link, Outlet } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";

import SignOut from "./SignOut";

const makeClass = makeStyles((theme) => ({
  section: {
    background: theme.palette.primary.main,
  },
  linkMenu: {
    marginLeft: "15px",
    textDecoration: "none",
  },
  linkMenuRight: {
    marginRight: "15px",
    textDecoration: "none",
  }
}));

function Nav() {
  const classes = makeClass();
  const [exist, setExist] = useState();
  const theme = useTheme();

  const auth = getAuth();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setExist(true);
      } else {
        setExist(false);
      }
    });
  }, ([auth]))

  return (
    <section className={classes.section}>
      <Container maxWidth="1250px">
        <Box bgcolor={theme.palette.primary.main} maxHeight="70px">
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center">
              <Link to="/">
                <img
                  src="images/logo-flouflix-new.png"
                  alt="logo flouflix"
                  height="70px"
                />
              </Link>
              <Link to="/" className={classes.linkMenu}>
                <Typography color={theme.palette.text.white} variant="body1">
                  Accueil
                </Typography>
              </Link>
              <Link to="/catalogue" className={classes.linkMenu}>
                <Typography color={theme.palette.text.white} variant="body1">
                  Catalogue
                </Typography>
              </Link>
              {exist && (
                <Link to="/mes-films" className={classes.linkMenu}>
                  <Typography color={theme.palette.text.white} variant="body1">
                    Mes films
                  </Typography>
                </Link>
              )}
            </Box>
            {!exist ? (
              <Box marginRight="10px" display="flex">
                <Link to="/inscription" className={classes.linkMenu}>
                  <Button variant="outlined" color="secondary">
                    <Typography variant="body1">Inscription</Typography>
                  </Button>
                </Link>
                <Link to="/connexion" className={classes.linkMenu}>
                  <Button variant="contained" color="secondary">
                    <Typography variant="body1">Se connecter</Typography>
                  </Button>
                </Link>
              </Box>
            ) : (
              <Box>
                <Link to="/mon-panier" className={classes.linkMenuRight}>
                  <ShoppingCartSharpIcon
                    fontSize="large"
                    style={{ color: "white" }}
                  />
                </Link>
                <SignOut />
              </Box>
            )}
          </Box>
          <Outlet />
        </Box>
      </Container>
    </section>
  );
}

export default Nav;
