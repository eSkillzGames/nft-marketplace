import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
// import { ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import theme from "./theme";
import "bootstrap/dist/css/bootstrap.css";
import "r-range-slider/index.css";
import { Provider } from "react-redux";
import store from "./store/store";
import FuseMessage from "./components/FuseMessage/FuseMessage";
import { ThemeProvider } from "@mui/material";

import { Buffer } from "buffer";

////////////////
import { Web3ReactProvider } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { ethers } from "ethers";

window.Buffer = window.Buffer || Buffer;

const getLibrary = (provider) => {
  const library = new Web3Provider(provider);
  library.pollingInterval = 8000; // frequency provider is polling
  return library;
};

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Web3ReactProvider getLibrary={getLibrary}>
        <App/>
      </Web3ReactProvider>
        <FuseMessage />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
