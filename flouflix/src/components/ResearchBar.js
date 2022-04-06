import React, { useState, useEffect } from "react";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import ListMovies from "./ListMovies";
import SelectFilter from "./SelectFilter";
import TextField from "@mui/material/TextField";
import { withStyles } from "@mui/styles";
import SearchIcon from "@mui/icons-material/Search";
import { InputAdornment } from "@mui/material";
import { makeStyles } from "@mui/styles";
import Box from "@mui/material/Box";

const makeClass = makeStyles((theme) => ({}));

const CustomTextField = withStyles((theme) => ({
  root: {
    zIndex: 3,
    color: "white",
    borderColor: "white",
    "label + &": {
      color: "white",
    },
    "& .MuiOutlinedInput-root": {
      color: "white",
      "&::placeholder": {
        color: "white",
      },
      "& fieldset": {
        borderColor: "white",
        color: "white",
      },
      "&:hover fieldset": {
        borderColor: "white",
        color: "white",
      },
      "&.Mui-focused fieldset": {
        borderColor: "white",
        color: "white",
      },
    },
  },
}))(TextField);

function ResearchBar(props) {
  const classes = makeClass();

  let { getMovies, inputText, inputFilter, displayList } = props.allInput;

  //Value for refresh
  const [lastActionRefrech, setLastActionRefrech] = useState("");

  //Refresh filter and set last change
  const refresh = (selected) => {
    props.setDisplayList(true);
    setLastActionRefrech(selected);
  };

  //Set inputText
  const inputHandler = (e) => {
    var lowerCase = e.target.value.toLowerCase();
    props.setInputText(lowerCase);
    refresh(lowerCase);
  };

  //Set or Reset Filter
  const resetFilter = (selected, field) => {
    if (selected.value === "All" || !selected?.value) {
      delete inputFilter[field];
      props.setFilter(inputFilter);
    } else {
      let tempObj = {};
      tempObj[field] = selected;
      props.setFilter(Object.assign(inputFilter, { ...tempObj }));
    }
  };
  return (
    <>
      <Box display="flex" justifyContent="flex-end" paddingBottom="30px">
        <Box minWidth="350px">
          <CustomTextField
            id="outlined-basic"
            onChange={inputHandler}
            variant="outlined"
            label="Rechercher un film"
            fullWidth
            InputLabelProps={{
              style: { color: "#fff" },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon style={{ color: "white" }} />
                </InputAdornment>
              ),
            }}
          />
        </Box>
        <SelectFilter
          field="releaseDate"
          resetFilter={(selected, field) => resetFilter(selected, field)}
          refresh={(selected) => refresh(selected)}
        ></SelectFilter>
      </Box>
      <ListMovies
        userData={props.userData}
        allInput={{
          getMovies,
          inputText,
          inputFilter,
          displayList,
          lastActionRefrech,
        }}
        setUpFavoris={(movie) => props.setUpFavoris(movie)}
        setDownFavoris={(movie) => props.setDownFavoris(movie)}
      />
    </>
  );
}

export default ResearchBar;
