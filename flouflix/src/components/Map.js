import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { makeStyles,useTheme } from "@mui/styles";
import Modal from "@mui/material/Modal";
import React, { useState, useEffect,useRef } from "react";
import { useDebouncedCallback } from 'use-debounce';

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

//Set up de la map
import mapboxgl from '!mapbox-gl';// eslint-disable-line import/no-webpack-loader-syntax
mapboxgl.accessToken = 'pk.eyJ1Ijoic291cmVubHBiIiwiYSI6ImNsMWxyczNnNTA4bDgzZXBxa3RxM2thN2MifQ.hthDrhmQc49TXGkRkpCKbw';

const makeClass = makeStyles((theme) => ({
    map : {
        height: 400,
    }
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
  
  function Map(props){
    console.log(props.userMoovie)
    const classes = makeClass();
    //Variable de map
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng, setLng] = useState(props.coordinaryUserCurrent[0].longitute);
    const [lat, setLat] = useState(props.coordinaryUserCurrent[0].latitutde);
    const [zoom, setZoom] = useState(12);
    const [currentMarkers, setCurrentMarkers] = useState([]);
    const [open, setOpen] = useState(false);
    const [isBoutique, setIsBoutique] = useState(true);
    const [isPerson, setIsPerson] = useState(true);
    const [filter, setFilter] = useState("All");
    var currentMarker = [];

    
    useEffect(() => {
        if (map.current) return; // initialize map only once
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [lng, lat],
            zoom: zoom
        });
    },[]);
    
    useEffect(()=>{
        const Usermarker = new mapboxgl.Marker()
        .setLngLat([lng,lat])
        .addTo(map.current);
    },[])

    useEffect(()=>{
        console.log(filter)    
        if(filter ==="Boutique")
        {
            console.log('je rentre dans la boucle boutique')

            props.userMoovie.map(element =>{
                if(element.boutique === true)
                {
                    console.log('ajout du marqueur boutique')
                    var oneMarker = new mapboxgl.Marker()
                    .setLngLat([element.longitute,element.latitutde])
                    .setPopup(new mapboxgl.Popup().setHTML("<div style='color:#333'>Boutique name</Br>"+element.address1+"</Br>"+element.address2+"</Br>"+element.phone+"</Br> its person : "+element.person+"<Div>"))
                    .addTo(map.current);
                    currentMarker.push({markers : oneMarker,boutique : element.boutique})
                    setCurrentMarkers(currentMarker)
                    
                }
            })
        }
        else
        { 
            if(filter ==="Person")
            {
                console.log('je rentre dans la boucle person')
                props.userMoovie.map(element =>{
                    if(element.boutique === false)
                    {
                        console.log('ajout du marqueur particulier')
                        var oneMarker = new mapboxgl.Marker()
                        .setLngLat([element.longitute,element.latitutde])
                        .setPopup(new mapboxgl.Popup().setHTML("<div style='color:#333'>Boutique name</Br>"+element.address1+"</Br>"+element.address2+"</Br>"+element.phone+"</Br> its person : "+element.person+"<Div>"))
                        .addTo(map.current);
                        currentMarker.push({markers : oneMarker,boutique : element.boutique})
                        setCurrentMarkers(currentMarker) 
                    }
                })
            }
            else
            {
                console.log('je rentre dans la boucle all')

                props.userMoovie.map(element =>{
                    console.log('ajout de tout les marqueurs')
                    var oneMarker = new mapboxgl.Marker()
                    .setLngLat([element.longitute,element.latitutde])
                    .setPopup(new mapboxgl.Popup().setHTML("<div style='color:#333'>Boutique name</Br>"+element.address1+"</Br>"+element.address2+"</Br>"+element.phone+"</Br> its person : "+element.person+"<Div>"))
                    .addTo(map.current);
                    currentMarker.push({markers : oneMarker,boutique : element.boutique})
                    setCurrentMarkers(currentMarker)
                })
            }
        }
    },[filter])
        
        
        const removeMarkers = (localFilter,type) => {
        if (currentMarkers!==null) {
            console.log(localFilter,type)
            if(type ==="Boutique")
            {
                for (var i = currentMarkers.length - 1; i >= 0; i--) {
                    if(localFilter== !currentMarkers[i].boutique)    
                    {
                        currentMarkers[i].markers.remove();
                    }
                    
                }
                console.log('Suppression des point Particulier : ',type)

                setFilter(type)
            }
            else if(type ==="Person")
            {
                for (var i = currentMarkers.length - 1; i >= 0; i--) {
                    if(localFilter== currentMarkers[i].boutique)    
                    {
                        currentMarkers[i].markers.remove();
                    }
                    
                }
                console.log('Suppression des point Boutique : ',type)
                setFilter(type)

            }
            else
            {
                if(type !== "All" && type!=="Person")
                {
                    for (var i = currentMarkers.length - 1; i >= 0; i--) {
                            currentMarkers[i].markers.remove();
                   }
                }
                console.log('Suppression de tout les points : ',type)

               setFilter(type)

            }
        }
    }

const handleClick = () => {
  setOpen(!open);
};


const handleFilterPersonClick = () =>{
    const localFilter = false
    const type = 'Person'
    removeMarkers(localFilter,type)
}

const handleFilterStoreClick = () =>{
    const localFilter = true
    const type = "Boutique"
    removeMarkers(localFilter,type)
}

const handleNoFilterClick = () =>{
    const localFilter = null
    const type = "All"
    removeMarkers(localFilter,type)
}

    return(
        <>
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
                <Collapse in={open} timeout="auto" unmountOnExit>
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
                <div ref={mapContainer} className={classes.map}/>
            </Box>
        </>
    )

}
export default Map;