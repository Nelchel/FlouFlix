import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import StoreIcon from "@mui/icons-material/Store";
import PersonIcon from "@mui/icons-material/Person";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";
import FilterAltIcon from "@mui/icons-material/FilterAlt"; 
import { makeStyles,useTheme } from "@mui/styles";
import Modal from "@mui/material/Modal";
import Map from './Map'
import React, { useState, useEffect,useRef } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import {
  getAuth,
  onAuthStateChanged,
} from "firebase/auth";
import {
  doc,
  updateDoc,
  where,
  collection,
  getDocs,
  query,
  arrayRemove,
} from "firebase/firestore";


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

function MapModal(props){
    //Gestion de la modale
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    //Récupération userCurrent
    const db = firebase.firestore();
    const auth = getAuth();
    const [uid, setUid] = useState("");
    const [coordinaryUserCurrent, setCoordinaryUserCurrent] = useState([]);
    // const[boutiques,setBoutiques] = useState([]);
    const[userMoovie,setUserMoovie] = useState([]);

    //liste déroulante
    const [openList, setOpenList] = useState(false);

    
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(async () => {
        //Recupération du user actuelle
        onAuthStateChanged(auth, (user) => {
            if (user) {
                const uid = user.uid;
                setUid(uid);
            } else {
            }
        });

        //Récupération des users selon un film
        const getUserMoovie= []
        db.collection("users")
        .where("uid", "==", props.moovie.seller)
        .get()
        .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            getUserMoovie.push(doc.data());
        });
        console.log(getUserMoovie)
        const user = []
        for (let i = 0; i < getUserMoovie.length; i++) {
            user.push({
                boutique : getUserMoovie[i].isBoutique,
                uid : getUserMoovie[i].uid,
                address1 : getUserMoovie[i].addressLine1,
                address2 : getUserMoovie[i].addressLine2,
                phone : getUserMoovie[i].phone,
                longitute : getUserMoovie[i].lon,
                latitutde : getUserMoovie[i].lat,
            })
        }
        setUserMoovie(user);
        })
        .catch((error) => {
        console.log("Error getting documents: ", error);
        });
    }, [auth,uid]);
    


    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(async () => {
        const getUser = async () => {
        let user = [];
        const q = query(collection(db, "users"), where("uid", "==", uid));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            user.push(doc.data());
        });
        const lng = user[0].lon 
        const lat = user[0].lat
        const coordinaryArray = []
        coordinaryArray.push({
            longitute : lng,
            latitutde : lat 
        })
        setCoordinaryUserCurrent(coordinaryArray)
        };
        getUser();
    }, [uid,db]);


//Affichage de la liste déroulante 
const handleClick = () => {
    setOpenList(!openList);
  };


//Gestion des filtres 
    const handleFilterPersonClick = () =>{
        const localFilter = false
        const type = 'Person'
        // removeMarkers(localFilter,type)
    }
    
    const handleFilterStoreClick = () =>{
        const localFilter = true
        const type = "Boutique"
        // removeMarkers(localFilter,type)
    }
    
    const handleNoFilterClick = () =>{
        const localFilter = null
        const type = "All"
        // removeMarkers(localFilter,type)
    }


    return(
    <>
        <Button onClick={handleOpen}>Afficher les boutiques</Button>
        <Modal
        open={open}
        onClose={handleClose}
        >
            <Box sx={style}>
            <List
            sx={{ width: "100%", maxWidth: 360 }}
            aria-labelledby="nested-list-subheader"
            >
                <ListItemButton onClick={handleClick}>
                    <ListItemIcon>
                        <FilterAltIcon />
                    </ListItemIcon>
                    <ListItemText style={{color:"#333"}} primary="Filtre" />
                    {open ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={openList} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>

                        <ListItemButton onClick={handleNoFilterClick} sx={{ pl: 4 }}>
                            <ListItemIcon>
                            <FilterAltOffIcon />
                            </ListItemIcon>
                            <ListItemText style={{color:"#333"}} primary="All"/>
                        </ListItemButton>

                        <ListItemButton onClick={handleFilterStoreClick} sx={{ pl: 4 }}>
                            <ListItemIcon>
                            <StoreIcon />
                            </ListItemIcon>
                            <ListItemText style={{color:"#333"}} primary="Boutique" />
                        </ListItemButton>

                        <ListItemButton onClick={handleFilterPersonClick} sx={{ pl: 4 }}>
                            <ListItemIcon>
                            <PersonIcon />
                            </ListItemIcon>
                            <ListItemText style={{color:"#333"}} primary="Particulier" />
                        </ListItemButton>
                        
                    </List>
                </Collapse>
            </List>
                <Map  
                coordinaryUserCurrent ={coordinaryUserCurrent} 
                // boutiques={boutiques} 
                userMoovie={userMoovie}/>
            </Box>
        </Modal>
    </>
    )
}
export default MapModal;