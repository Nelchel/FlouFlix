import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { initializeApp } from "firebase/app";
import './index.css';
import reportWebVitals from './reportWebVitals';

const firebaseConfig = {
  apiKey: "AIzaSyCwyFkoS1xUdgOtDgeDDq_hRV74lNXG7_s",
  authDomain: "flouflix-46d80.firebaseapp.com",
  projectId: "flouflix-46d80",
  storageBucket: "flouflix-46d80.appspot.com",
  messagingSenderId: "762536708495",
  appId: "1:762536708495:web:ad0999b58e7a0ef5b6e3fa"
};


ReactDOM.render(
  <React.StrictMode>
    <App firebaseConfig={firebaseConfig}/>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
