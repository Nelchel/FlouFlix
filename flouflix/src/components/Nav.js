import { Container, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { makeStyles, useTheme } from "@mui/styles";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Logout from "@mui/icons-material/Logout";
import SlideshowIcon from "@mui/icons-material/Slideshow";
import Inventory from "@mui/icons-material/Inventory";
import Person from "@mui/icons-material/Person";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import NotificationsIcon from "@mui/icons-material/Notifications";

import { Link, Outlet } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import firebase from "firebase/compat/app";
import SignOut from "./SignOut";
import NotificationsBoard from "./NotificationsBoard";

const makeClass = makeStyles((theme) => ({
  section: {
    background: theme.palette.primary.main,
    borderBottom: "1px solid #464646",
  },
  linkMenu: {
    marginLeft: "15px",
    textDecoration: "none",
    color: theme.palette.text.white,
  },
  linkMenuRight: {
    marginRight: "15px",
    textDecoration: "none",
  },
}));

function Nav() {
  const classes = makeClass();
  const [exist, setExist] = useState();
  const theme = useTheme();
  const db = firebase.firestore();

  const auth = getAuth();

  const [user, setUser] = useState();
  const [uid, setUid] = useState();
  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setExist(true);
        const uid = user.uid;
        setUid(uid);
      } else {
        setExist(false);
      }
    });
  }, [auth]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setUser(docSnap.data());
    } else {
      console.log("No such document!");
    }
  }, [uid, db]);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <section className={classes.section}>
      <Container maxWidth="1250px">
        <Box bgcolor={theme.palette.primary.main} maxHeight="70px">
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box display="flex" alignItems="center">
              <Link to="/">
                <img
                  src="https://firebasestorage.googleapis.com/v0/b/flouflix-46d80.appspot.com/o/logo-flouflix-new.png?alt=media&token=c5b15aa2-4dae-42ba-911a-d83e50009fd3"
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
              <Box display="flex" alignItems="center">
                <Link to="/mon-panier" className={classes.linkMenuRight}>
                  <IconButton>
                    <ShoppingBasketIcon
                      fontSize="medium"
                      style={{ color: "white" }}
                    />
                  </IconButton>
                </Link>
                <IconButton onClick={handleOpenModal}>
                  <NotificationsIcon
                    fontSize="medium"
                    style={{ color: "white" }}
                  />
                </IconButton>
                {user !== undefined && (
                  <>
                    <Tooltip title="Mon compte">
                      <IconButton
                        onClick={handleClick}
                        size="small"
                        sx={{ ml: 2 }}
                        aria-controls={open ? "account-menu" : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? "true" : undefined}
                      >
                        <Avatar alt="user photo" src={user.photoURL} />
                      </IconButton>
                    </Tooltip>
                    <Menu
                      anchorEl={anchorEl}
                      id="account-menu"
                      open={open}
                      onClose={handleClose}
                      onClick={handleClose}
                      PaperProps={{
                        elevation: 0,
                        sx: {
                          overflow: "visible",
                          bgcolor: "#000000",
                          color: "white",
                          filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                          mt: 1.5,
                          "& .MuiAvatar-root": {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                          },
                          "&:before": {
                            content: '""',
                            display: "block",
                            position: "absolute",
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: "#000000",
                            transform: "translateY(-50%) rotate(45deg)",
                            zIndex: 0,
                          },
                        },
                      }}
                      transformOrigin={{ horizontal: "right", vertical: "top" }}
                      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                    >
                      <MenuItem>
                        <Avatar alt="user photo" src={user.photoURL} />
                        <Link to="/mon-compte" className={classes.linkMenu}>
                          <Typography color={theme.palette.text.white}>
                            Mon compte
                          </Typography>
                        </Link>
                      </MenuItem>
                      <MenuItem>
                        <ListItemIcon>
                          <SlideshowIcon
                            sx={{ color: "white" }}
                            fontSize="small"
                          />
                        </ListItemIcon>
                        <Link to="/mes-films" className={classes.linkMenu}>
                          <Typography
                            color={theme.palette.text.white}
                            variant="body1"
                          >
                            Mes films
                          </Typography>
                        </Link>
                      </MenuItem>
                      <MenuItem>
                        <ListItemIcon>
                          <Inventory sx={{ color: "white" }} fontSize="small" />
                        </ListItemIcon>
                        <Link
                          to="/historique-achat"
                          className={classes.linkMenu}
                        >
                          <Typography color={theme.palette.text.white}>
                            Historique
                          </Typography>
                        </Link>
                      </MenuItem>

                      {user.moderator === true &&(
                        <MenuItem>
                          <ListItemIcon>
                            <Person
                              sx={{ color: "white" }}
                              fontSize="small"
                            />
                          </ListItemIcon>
                          <Link to="/List-user" className={classes.linkMenu}>
                            <Typography color={theme.palette.text.white}>
                              Utilisateurs
                            </Typography>
                          </Link>
                        </MenuItem>
                      )}

                      <Divider />
                      <MenuItem>
                        <ListItemIcon>
                          <Logout sx={{ color: "white" }} fontSize="small" />
                        </ListItemIcon>
                        <SignOut />
                      </MenuItem>
                    </Menu>
                  </>
                )}
              </Box>
            )}
          </Box>
          <Outlet />
        </Box>
        <NotificationsBoard open={openModal} handleClose={handleCloseModal} />
      </Container>
    </section>
  );
}

export default Nav;
