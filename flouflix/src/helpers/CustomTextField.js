import { TextField } from "@mui/material";
import { withStyles } from "@mui/styles";

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

export default CustomTextField;
