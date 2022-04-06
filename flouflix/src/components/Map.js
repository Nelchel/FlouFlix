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
    const [filter, setFilter] = useState(true);
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
        props.userMoovie.map(element =>{
            if(filter ==="Boutique"){
                if(element.boutique == true)
                {
                    var oneMarker = new mapboxgl.Marker()
                    .setLngLat([element.longitute,element.latitutde])
                    .setPopup(new mapboxgl.Popup().setHTML("Boutique name</Br>"+element.address1+"</Br>"+element.address2+"</Br>"+element.phone))
                    .addTo(map.current);
                    currentMarker.push({markers : oneMarker,boutique : element.boutique})
                    setCurrentMarkers(currentMarker)
                    
                }
            }
            else if(filter === "Person")
            {
                if(element.person == true)
                {
                    var oneMarker = new mapboxgl.Marker()
                    .setLngLat([element.longitute,element.latitutde])
                    .setPopup(new mapboxgl.Popup().setHTML("Boutique name</Br>"+element.address1+"</Br>"+element.address2+"</Br>"+element.phone))
                    .addTo(map.current);
                    currentMarker.push({markers : oneMarker,boutique : element.boutique})
                    setCurrentMarkers(currentMarker) 
                }
            }
            else 
            {
                var oneMarker = new mapboxgl.Marker()
                .setLngLat([element.longitute,element.latitutde])
                .setPopup(new mapboxgl.Popup().setHTML("Boutique name</Br>"+element.address1+"</Br>"+element.address2+"</Br>"+element.phone))
                .addTo(map.current);
                currentMarker.push({markers : oneMarker,boutique : element.boutique})
                setCurrentMarkers(currentMarker)
            }
        })
    },[filter])
        
        
        const removeMarkers = (localFilter,all) => {
        if (currentMarkers!==null) {
            console.log(localFilter,all)
            for (var i = currentMarkers.length - 1; i >= 0; i--) {
                if(localFilter== !currentMarkers[i].boutique)    
                {
                    console.log(filter,'je rentre dans la boucle ')
                    currentMarkers[i].markers.remove();
                }
            }
            if(localFilter == true)
            {
                setFilter("Boutique")
            }
            else
            {
                setFilter("Person")
            }

            if(all==true)
            {
                setFilter("All")
            }
        }
    }

const handleClick = () => {
  setOpen(!open);
};


const handleFilterPersonClick = () =>{
    const localFilter = false
    const all = false
    removeMarkers(localFilter,all)
}

const handleFilterStoreClick = () =>{
    const localFilter = true
    const all = false
    removeMarkers(localFilter,all)
}

const handleNoFilterClick = () =>{
    const localFilter = null
    const all = true
    removeMarkers(localFilter,all)
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
                    <ListItemText primary="Filtre" />
                    {open ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>

                        <ListItemButton onClick={handleNoFilterClick} sx={{ pl: 4 }}>
                            <ListItemIcon>
                            <FilterAltOffIcon />
                            </ListItemIcon>
                            <ListItemText primary="All" />
                        </ListItemButton>

                        <ListItemButton onClick={handleFilterStoreClick} sx={{ pl: 4 }}>
                            <ListItemIcon>
                            <StoreIcon />
                            </ListItemIcon>
                            <ListItemText primary="Boutique" />
                        </ListItemButton>

                        <ListItemButton onClick={handleFilterPersonClick} sx={{ pl: 4 }}>
                            <ListItemIcon>
                            <PersonIcon />
                            </ListItemIcon>
                            <ListItemText primary="Particulier" />
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