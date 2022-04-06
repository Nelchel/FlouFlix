import { React, useState, useEffect } from 'react'
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import CardsLists from "./CardsLists";

function ListMovies(props) {

    const [getFilterMovies, setFilterMovies] = useState([]);

    const { getMovies, inputText, inputFilter, displayList } = props.allInput

    //Refresh the data when "props.allInput" change
    useEffect(() => {
        refreshFilter()
    }, [props.allInput]);

    const refreshFilter = () => {
        setFilterMovies(getMovies.filter((el) => {
            //if no input the return the original
            if (inputText === '' && Object.keys(inputFilter).length === 0) {
                return el;
            }
            //return the item which contains the user input
            else {
                if (inputText === '') return isFindSelect(el,['releaseDate'])
                else if (Object.keys(inputFilter).length === 0) return isFindText(el,['name','description'])
                else return isFindText(el,['name','description']) && isFindSelect(el,['releaseDate']) 
            }
        }))
    }

    //Find film with inputText
    const isFindText = (elem, tab) => {
        let res = false
        for (let index = 0; index < tab.length; index++) {
            if (elem[tab[index]].toLowerCase().includes(inputText)) return true
        }
        return res
    };

    //Find film with all select
    const isFindSelect = (elem, tab) => {
        let res = false
        for (let index = 0; index < tab.length; index++) {
            if (elem[tab[index]] == inputFilter[tab[index]].value) res = true
        }
        return res
    };

    return (
        displayList && <CardsLists 
            userData={props.userData} 
            movies={getFilterMovies} 
            isResearch={true}
            setUpFavoris={(movie) => props.setUpFavoris(movie)}
            setDownFavoris={(movie) => props.setDownFavoris(movie)}
        ></CardsLists>
    )
}

export default ListMovies