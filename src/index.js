import React from "react";
import ReactDOM from "react-dom/client";
import "./stylesheets/all.scss";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import axios from "axios";
import { HashRouter, BrowserRouter } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import ScrollToTop from "./components/ScrollToTop";

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
  <BrowserRouter>
  {/* <HashRouter> */}
    <ScrollToTop />
    <App />
 {/* </HashRouter>, */}
  </BrowserRouter>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
