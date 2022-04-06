import React, { useState, useEffect } from "react";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import Select from "react-select";
import Typography from "@mui/material/Typography";

function ResearchBar(props) {
  const [selected, setSelected] = useState("All");

  const { field } = props;

  //Set or Reset Filter Call
  useEffect(() => {
    props.resetFilter(selected, field);
  }, [selected]);

  //Action on change Filter
  const handleChange = (selectedOption) => {
    setSelected(selectedOption);
    props.refresh(selectedOption);
  };

  //Get multiple date
  const getAllYears = () => {
    const thisYear = new Date().getFullYear();
    let res = ["All"];
    for (let index = 2000; index <= thisYear; index++) {
      res.push(index.toString());
    }
    return res;
  };

  //Get the call field
  const getField = () => {
    switch (field) {
      case "releaseDate":
        return getAllYears().map((name) => ({ value: name, label: name }));
        break;

      default:
        break;
    }
  };

  const Option = (props) => {
    const {
      children,
      className,
      cx,
      getStyles,
      isDisabled,
      isFocused,
      isSelected,
      innerRef,
      innerProps,
    } = props;
    return (
      <div
        ref={innerRef}
        css={getStyles('option', props)}
        style={{ background: "#212121", padding: "5px 10px" }}
        className={cx(
          {
            option: true,
            'option--is-disabled': isDisabled,
            'option--is-focused': isFocused,
            'option--is-selected': isSelected,
          },
          className
        )}
        {...innerProps}
      >
          <Typography variant="body1">
             {children}
          </Typography>
      </div>
    );
  };


  return (
    <div className="select">
      <Select
        placeholder="Selectionner une année"
        styles={{
          control: (base) => ({
            ...base,
            backgroundColor: "transparent",
            padding: 5,
            minHeight: "56px",
            marginLeft: "20px",
            minWidth: "150px",
          }),
          option: (base) => ({
            ...base,
            background: "red",
            height: '100%',
          }),
        }}
        value={selected}
        onChange={handleChange}
        options={getField()}
        components={{ Option }}
      />
    </div>
  );
}

export default ResearchBar;
