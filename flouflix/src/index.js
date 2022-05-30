import React, { Fragment } from "react";
import ReactDOM from "react-dom";
import 'mapbox-gl/dist/mapbox-gl.css';
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const firebaseConfig = {
  apiKey: "AIzaSyCwyFkoS1xUdgOtDgeDDq_hRV74lNXG7_s",
  authDomain: "flouflix-46d80.firebaseapp.com",
  projectId: "flouflix-46d80",
  storageBucket: "flouflix-46d80.appspot.com",
  messagingSenderId: "762536708495",
  appId: "1:762536708495:web:ad0999b58e7a0ef5b6e3fa",
};

const stripeConfig = {
  apiKey:"pk_test_51L526RGH7Y6DbZsDauEw1anemg27mScrSuK7a3WOzhDx08m0vjZuyvytTzXMKyXCHQT53pw60DdQOF4aOeEnJ7To00HVayNsSM",
}


ReactDOM.render(
  <React.StrictMode>
        <App firebaseConfig={firebaseConfig} stripeConfig={stripeConfig}/>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
