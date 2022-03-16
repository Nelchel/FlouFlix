import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Icon from "@mui/material/Icon"
import { makeStyles } from "@mui/styles";
import TextField from "@mui/material/TextField";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import React, { useState, useEffect} from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { getAuth, signOut,onAuthStateChanged } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL} from "firebase/storage";
import { doc, updateDoc,where, collection, getDocs, query} from "firebase/firestore";

function MyCart() {
  const db = firebase.firestore();
  const auth = getAuth();

  const [uid, setUid] = useState("");
  const [myCart, setMyCart] = useState([]);
  const[moovieInMyCart, setMoovieInMyCart] = useState([]);
  const userCurrent = useState();
  const moviesCurrent = useState();
  const [newUser, setNewUser] = useState();
  const getMyCart = [];
  const getMoovieInMyCart = [];
  let user = [];
  let movies = [];


  onAuthStateChanged(auth, (user) => {
    if (user) {
      const uid = user.uid;
      setUid(uid);
    } else {
    }
  });
  const test = async () => {
    if (uid !== "") {
      const q = query(collection(db, "users"), where("uid", "==", uid));
      const querySnapshot = await getDocs(q);
  
      querySnapshot.forEach((doc) => {
        user.push(doc.data());
      });
      userCurrent[0] = user;
    }
    console.log(userCurrent[0][0].myCart);
  
    const test = userCurrent[0][0].myCart;
  
    if (userCurrent[0][0] !== undefined) {
      userCurrent[0][0].myCart.forEach(async (cart, index) => {
        const s = query(collection(db, "movies"), where("id", "==", cart));
        const querySnapshot = await getDocs(s);
  
        querySnapshot.forEach((doc) => {
          movies.push(doc.data());
          console.log(doc.data())
        });
        console.log(movies[0].releaseDate)
        moviesCurrent.push(movies[0]);
        setMoovieInMyCart(movies);
      })  
    }
  }

  test();
  

  useEffect(async () => {


    // const getUser = async () => {
    //   const getUsers = await getDoc(docRef);
    //   console.log(getUsers)
    // }

    // getUser();
    // db.collection("users")
    // .where("uid", "==", uid)
    // .get()
    // .then((querySnapshot) => {
    //   querySnapshot.forEach((doc) => {
    //   getMyCart.push(doc.data());
    //   if(getMyCart.length !== undefined && getMyCart.length > 0)
    //   {   
    //     console.log('je rentre dans la boucle ');
    //      getMyCart[0].myCart.forEach(element => {
    //       db.collection("movies")
    //       .where("id","==",element)
    //       .get()
    //       .then((querySnapshot) => {
    //         querySnapshot.forEach((doc) => {
    //         getMoovieInMyCart.push(doc.data());
    //       });
    //       setMoovieInMyCart(getMoovieInMyCart);
    //       })
    //       .catch((error) => {
    //         console.log("Error getting documents: ", error);
    //       });
    //     });
    //   }
    //   });
    // })
    // .catch((error) => {
    //   console.log("Error getting documents: ", error);
    // });

  },[uid])
    return(
      <section>
        <Box>
          {userCurrent[0] !== undefined && (
            <>
            {userCurrent[0][0].map((film, index) => {
              console.log("ic")
              return <Box/>
            })}




              <Typography variant="h1">Page du panier</Typography>
              <Box>
              {moovieInMyCart.map((cart, index) => {
                console.log('contenance de cart',cart)
                console.log(index)
                return (
                  <>
                  <Box maxWidth="345px">
                  <Card style={{ minWidth: "345px" }}>
                    <CardMedia  
                      component="img"
                      height="140"
                      image={cart.url}
                      alt="green iguana"
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        {cart.name}
                      </Typography>
                    </CardContent>
                  </Card>
                </Box>
                  </>
                );
              })}
              </Box>
            </>
          )}
        </Box>
      </section>
    );
}
export default MyCart;
