import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { makeStyles,useTheme } from "@mui/styles";
import Modal from "@mui/material/Modal";
import React, { useState, useEffect,useRef } from "react";
import { useDebouncedCallback } from 'use-debounce';

//Set up de la map
import mapboxgl from '!mapbox-gl';// eslint-disable-line import/no-webpack-loader-syntax
mapboxgl.accessToken = 'pk.eyJ1Ijoic291cmVubHBiIiwiYSI6ImNsMWxyczNnNTA4bDgzZXBxa3RxM2thN2MifQ.hthDrhmQc49TXGkRkpCKbw';

function MapRender (props) {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng, setLng] = useState(props.coordinaryUserCurrent[0].longitute);
    const [lat, setLat] = useState(props.coordinaryUserCurrent[0].latitutde);
    const [zoom, setZoom] = useState(12);


    //Initialisation de la map
    useEffect(() => {
        if (map.current) return; // initialize map only once
        props.mapRender(new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [lng, lat],
            zoom: zoom
            })
        )
    });
}
export default MapRender;