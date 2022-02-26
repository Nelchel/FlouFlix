import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { makeStyles } from "@mui/styles";

const makeClass = makeStyles((theme) => ({
  signupButton: {
    marginRight: "10px",
  },
}));

function Nav() {
  const classes = makeClass();

  return (
    <Box bgcolor="black" maxHeight="70px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box marginLeft="50px">
          <img
            src="images/logo-flouflix.png"
            alt="logo flouflix"
            height="70px"
          />
        </Box>
        <Box marginRight="10px" display="flex">
          <Box marginRight="10px">
            <Button variant="outlined" color="error">
              <Typography>Inscription</Typography>
            </Button>
          </Box>
          <Button variant="contained" color="error">
            <Typography>Se Connecter</Typography>
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default Nav;
