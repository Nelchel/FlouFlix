import { makeStyles } from "@mui/styles";
import React, { useState, useEffect,useRef } from "react";

//Set up de la map
import mapboxgl from '!mapbox-gl';// eslint-disable-line import/no-webpack-loader-syntax
mapboxgl.accessToken = 'pk.eyJ1Ijoic291cmVubHBiIiwiYSI6ImNsMWxyczNnNTA4bDgzZXBxa3RxM2thN2MifQ.hthDrhmQc49TXGkRkpCKbw';

const makeClass = makeStyles((theme) => ({
    map : {
        height: 400,
    }
}));
 
  function Map(props){
    const classes = makeClass();
    //Variable de map
    const mapContainer = useRef(null);
    let map = useRef(null);
    const [lng] = useState(props.coordinaryUserCurrent[0].longitute);
    const [lat] = useState(props.coordinaryUserCurrent[0].latitutde);
    const [zoom] = useState(12);
    var allMarkers=[];

    //Initialisation de la map
    useEffect(() => {
        if (map.current) return; // initialize map only once
        map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [lng, lat],
        zoom: zoom
        });
    });
    
    //Point de la localisation du user
    useEffect(()=>{
        new mapboxgl.Marker({ "color": "#b40219" })
        .setLngLat([lng,lat])
        .addTo(map.current);
    },[lat, lng])

    useEffect(()=>{
        props.userMoovie.map(element =>{
            if(element.boutique === false){
                var otherMarker = new mapboxgl.Marker({ "color": "#008000" })
                .setLngLat([element.longitute,element.latitutde])
                .setPopup(new mapboxgl.Popup().setHTML("<div style='color:#333'>Boutique name</Br>"+element.address1+"</Br>"+element.address2+"</Br>"+element.phone+"</Br> boutique : "+element.boutique+"<Div>"))
                .addTo(map.current);
                return allMarkers.push({markers : otherMarker,boutique : element.boutique})
            }
            else {
                var boutiqueMarker = new mapboxgl.Marker()
                .setLngLat([element.longitute,element.latitutde])
                .setPopup(new mapboxgl.Popup().setHTML("<div style='color:#333'>Boutique name</Br>"+element.address1+"</Br>"+element.address2+"</Br>"+element.phone+"</Br> boutique : "+element.boutique+"<Div>"))
                .addTo(map.current);
                return allMarkers.push({markers : boutiqueMarker,boutique : element.boutique})
            }
        })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    return(
        <>
            <div ref={mapContainer} className={classes.map}/>
        </>
    )

}
export default Map;