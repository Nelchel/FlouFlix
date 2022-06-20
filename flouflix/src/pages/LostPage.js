import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { makeStyles } from "@mui/styles";
import "../css/LostPage.css";
import React from "react";
import { getAuth, signOut } from "firebase/auth";
import { Link } from "react-router-dom";

const makeClass = makeStyles((theme) => ({
  signOut: {
    float: "right",
  },
}));

function LostPage() {
  const classes = makeClass();
  const auth = getAuth();

  const handleSubmit = async () => {
    signOut(auth)
      .then(() => {
        // console.log("success")
      })
      .catch((error) => {
        // console.log(error)
      });
  };

  return (
    <Box>
      <body class="bg-purple">
        <div class="stars">
          <div class="central-body">
            <img
              class="image-404"
              src="http://salehriaz.com/404Page/img/404.svg"
              width="300px"
            />
            <Link to="/" class="btn-go-home">
              GO BACK HOME
            </Link>
          </div>
          <div class="objects">
            <img
              class="object_rocket"
              src="http://salehriaz.com/404Page/img/rocket.svg"
              width="40px"
            />
            <div class="earth-moon">
              <img
                class="object_earth"
                src="http://salehriaz.com/404Page/img/earth.svg"
                width="100px"
              />
              {/* <img
                class="object_moon"
                src="http://salehriaz.com/404Page/img/moon.svg"
                width="80px"
              /> */}
              <div class="myplanet"></div>
            </div>
            <div class="box_astronaut">
              <img
                class="object_astronaut"
                src="http://salehriaz.com/404Page/img/astronaut.svg"
                width="140px"
              />
            </div>
          </div>
          <div class="glowing_stars">
            <div class="star"></div>
            <div class="star"></div>
            <div class="star"></div>
            <div class="star"></div>
            <div class="star"></div>
          </div>
        </div>
      </body>
    </Box>
  );
}

export default LostPage;
