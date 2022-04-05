import React, { useState, useEffect } from "react";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import Select from 'react-select';

function ResearchBar(props) {

    const [selected, setSelected] = useState("All");
    
    const { field } = props

    //Set or Reset Filter Call
    useEffect(() => {
        props.resetFilter(selected,field)
      }, [selected]);

    //Action on change Filter
    const handleChange = (selectedOption) => {
        setSelected(selectedOption);
        props.refresh(selectedOption)
    }

    //Get multiple date
    const getAllYears = () => {
        const thisYear = new Date().getFullYear()
        let res = ['All']
        for (let index = 2000; index <= thisYear; index++) {
            res.push(index.toString())
        }
        return res
    }

    //Get the call field
    const getField = () => {
        switch (field) {
            case 'releaseDate':
                return getAllYears().map(name => (
                    {value: name, label: name}
                ))
                break;
        
            default:
                break;
        }
    }

    return (
        <div className="select">
          <Select
            value={selected}
            onChange={handleChange}
            options={getField()}
          />
        </div>
    )
}

export default ResearchBar;