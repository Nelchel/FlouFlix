import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
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
        //Récupération de toutes les boutiques 
        // const getBoutiques = [];
        // db.collection("users")
        // .where("isBoutique", "==", true)
        // .get()
        // .then((querySnapshot) => {
        // querySnapshot.forEach((doc) => {
        //     getBoutiques.push(doc.data());
        // });
        // const coords = []
        // for (let i = 0; i < getBoutiques.length; i++) {
        //     coords.push({
        //         uid : getBoutiques[i].uid,
        //         address1 : getBoutiques[i].addressLine1,
        //         address2 : getBoutiques[i].addressLine2,
        //         phone : getBoutiques[i].phone,
        //         longitute : getBoutiques[i].lon,
        //         latitutde : getBoutiques[i].lat,
        //     })
        // }
        // setBoutiques(coords);
        // })
        // .catch((error) => {
        // console.log("Error getting documents: ", error);
        // });

        //Récupération des users selon un film
        const getUserMoovie= []
        db.collection("users")
        .where("uid", "==", props.moovie.seller)
        .get()
        .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            getUserMoovie.push(doc.data());
        });
        const user = []
        for (let i = 0; i < getUserMoovie.length; i++) {
            user.push({
                person : !getUserMoovie[i].isBoutique,
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

    return(
    <>
        <Button onClick={handleOpen}>Afficher les boutiques</Button>
        <Modal
        open={open}
        onClose={handleClose}
        >
            <Map  
            coordinaryUserCurrent ={coordinaryUserCurrent} 
            // boutiques={boutiques} 
            userMoovie={userMoovie}/>
        </Modal>
    </>
    )
}
export default MapModal;