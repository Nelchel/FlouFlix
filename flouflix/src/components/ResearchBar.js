import React, { useState, useEffect } from "react";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import ListMovies from "./ListMovies"
import SelectFilter from "./SelectFilter"
import TextField from "@mui/material/TextField";

function ResearchBar(props) {

  let { getMovies, inputText, inputFilter, displayList } = props.allInput

  //Value for refresh
  const [lastActionRefrech, setLastActionRefrech] = useState("");

  //Refresh filter and set last change
  const refresh = (selected) => {
    props.setDisplayList(true)
    setLastActionRefrech(selected)
  };

  //Set inputText
  const inputHandler = (e) => {
      var lowerCase = e.target.value.toLowerCase();
      props.setInputText(lowerCase);
      refresh(lowerCase)
  };

  //Set or Reset Filter
  const resetFilter = (selected, field) => {
    if(selected.value === "All" || !selected?.value) {
      delete inputFilter[field]
      props.setFilter(inputFilter)
    }
    else {
      let tempObj = {}
      tempObj[field] = selected
      props.setFilter(Object.assign(inputFilter, {...tempObj}))
    }
  }
  return (<>
      <div className="search">
      <TextField
          id="outlined-basic"
          onChange={inputHandler}
          variant="outlined"
          fullWidth
          label="Search"
      />
      </div>
      <SelectFilter 
        field="releaseDate" 
        resetFilter={(selected, field) => resetFilter(selected, field)}
        refresh={(selected) => refresh(selected)}
      ></SelectFilter>
      <ListMovies 
      userData={props.userData} 
      allInput={{ getMovies, inputText, inputFilter, displayList, lastActionRefrech }} 
      setUpFavoris={(movie) => props.setUpFavoris(movie)}
      setDownFavoris={(movie) => props.setDownFavoris(movie)}
      />
    </>
  )
}

export default ResearchBar;