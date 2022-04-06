import Box from "@mui/material/Box";
import { makeStyles } from "@mui/styles";

import { useEffect } from "react";
import { GeocoderAutocomplete } from "@geoapify/geocoder-autocomplete";
import "@geoapify/geocoder-autocomplete/styles/minimal.css";

const makeClass = makeStyles((theme) => ({
  inputAdress: {
    paddingBottom: "20px",
    "& .geoapify-autocomplete-input": {
      height: "56px",
      borderRadius: "4px",
    },
    "& .geoapify-close-button": {
      top: "-10px",
    },
    "& .geoapify-autocomplete-items": {
      marginTop: "-20px",
      borderRadius: "0 0 4px 4px",
      color: theme.palette.text.black,
    },
  },
}));

function InputAddress({
  addressLine1,
  setAddressLine1,
  addressLine2,
  setAddressLine2,
  lat,
  setLat,
  lon,
  setLon,
}) {
  const classes = makeClass();

  useEffect(() => {
    const autocomplete = new GeocoderAutocomplete(
      document.getElementById("autocomplete"),
      "f99dc96855554b5e94169e8f6015c05c",
      {
        /* Geocoder options */
      }
    );
    autocomplete.on("select", async (location) => {
      setAddressLine1(location.properties.address_line1);
      setAddressLine2(location.properties.address_line2);
      setLat(location.properties.lat);
      setLon(location.properties.lon);
    });

    autocomplete.on("suggestions", (suggestions) => {
      // process suggestions here
    });
  }, []);

  return (
    <Box>
      <div
        className={classes.inputAdress}
        id="autocomplete"
        style={{ position: "relative" }}
      ></div>
    </Box>
  );
}

export default InputAddress;
