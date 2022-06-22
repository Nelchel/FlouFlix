import { Modal, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { makeStyles, useTheme } from "@mui/styles";
import Button from "@mui/material/Button";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import firebase from "firebase/compat/app";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import TabPanel from "@mui/lab/TabPanel";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import { red } from "@mui/material/colors";
import PropTypes from "prop-types";

const makeClass = makeStyles((theme) => ({
  signOut: {
    float: "right",
  },
  modale: {
    position: "absolute",
    top: "47%",
    right: "-15%",
    height: "75vh",
    transform: "translate(-50%, -50%)",
    width: 500,
    backgroundColor: theme.palette.primary.light,
    borderRadius: "14px",
    padding: 20,
  },
  tabPanel: {
    color: "white !important",
  },
  button: {
    boxShadow: "unset !important",
    textTransform: "unset !important",
    // padding: "6px 11px !important",
  },
}));

function NotificationsBoard({ open, handleClose }) {
  const classes = makeClass();
  const auth = getAuth();
  const db = firebase.firestore();
  const theme = useTheme();

  const [uid, setUid] = useState("");
  const getNotifications = [];
  const getReadNotifications = [];
  const [notifications, setNotifications] = useState([]);
  const [readNotifications, setReadNotifications] = useState([]);
  const [isUpdate, setUpdate] = useState(false);

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
  }, [uid]);

  useEffect(() => {
    db.collection("notifications")
      .where("idUser", "==", uid)
      .where("isRead", "==", false)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          // console.log(doc.id, " => ", doc.data());
          getNotifications.push(doc.data());
        });
        console.log(getNotifications);
        setNotifications(getNotifications);
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
  }, [uid, isUpdate]);

  useEffect(() => {
    db.collection("notifications")
      .where("idUser", "==", uid)
      .where("isRead", "==", true)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          // console.log(doc.id, " => ", doc.data());
          getReadNotifications.push(doc.data());
        });
        console.log(getReadNotifications);
        setReadNotifications(getReadNotifications);
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
  }, [uid, isUpdate]);

  const handleClick = (id, index) => {
    var userRef = db.collection("notifications").doc(id);
    setUpdate(!isUpdate);
    return userRef
      .update({
        isRead: true,
      })
      .then(() => {
        console.log("Document successfully updated!");
        let tmp = [];
        tmp = notifications;
        tmp.splice(index, 1);
        setNotifications(tmp);
      })
      .catch((error) => {
        // The document probably doesn't exist.
        console.error("Error updating document: ", error);
      });
  };

  const handleClickNotRead = (id, index) => {
    var userRef = db.collection("notifications").doc(id);
    setUpdate(!isUpdate);
    return userRef
      .update({
        isRead: false,
      })
      .then(() => {
        console.log("Document successfully updated!");
        let tmp = [];
        tmp = readNotifications;
        console.log(index);
        tmp.splice(index, 1);
        console.log(tmp);
        setReadNotifications(tmp);
        console.log(notifications);
      })
      .catch((error) => {
        // The document probably doesn't exist.
        console.error("Error updating document: ", error);
      });
  };

  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }

  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  };

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }

  return (
    <Modal open={open} onClose={handleClose}>
      <Box className={classes.modale}>
        <Typography color={theme.palette.text.white} variant="h5">
          Notifications
        </Typography>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab
              className={classes.tabPanel}
              label="Non lues"
              {...a11yProps(0)}
            />
            <Tab
              className={classes.tabPanel}
              label="Archivées"
              {...a11yProps(1)}
            />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          {notifications.map((notif, index) => {
            return (
              <Box>
                {notif.isRead === false && (
                  <>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Typography
                        color={theme.palette.text.white}
                        style={{ maxWidth: "301px" }}
                        variant="body2"
                      >
                        {notif.content}
                      </Typography>
                      <Button
                        color="primary"
                        variant="contained"
                        className={classes.button}
                        onClick={(e) => {
                          handleClick(notif.id, index);
                        }}
                      >
                        <Typography
                          variant="body2"
                          color={theme.palette.text.white}
                        >
                          Marquer comme lue
                        </Typography>
                      </Button>
                    </Box>
                    <hr style={{ borderColor: "#929292" }} />
                  </>
                )}
              </Box>
            );
          })}
        </TabPanel>
        <TabPanel value={value} index={1}>
          {readNotifications.map((notif, index) => {
            return (
              <Box>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Typography
                    color={theme.palette.text.white}
                    style={{ maxWidth: "301px" }}
                    variant="body2"
                  >
                    {notif.content}
                  </Typography>
                  <Button
                    className={classes.button}
                    color="primary"
                    variant="contained"
                    onClick={(e) => {
                      handleClickNotRead(notif.id, index);
                    }}
                  >
                    <Typography
                      variant="body2"
                      color={theme.palette.text.white}
                    >
                      Marquer comme non lue
                    </Typography>
                  </Button>
                </Box>
                <hr style={{ borderColor: "#929292" }} />
              </Box>
            );
          })}
        </TabPanel>
      </Box>
    </Modal>
  );
}

export default NotificationsBoard;
