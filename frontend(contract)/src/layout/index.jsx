import * as React from "react";
import {Box} from "@mui/material";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Layout({ children }) {
  const location = useLocation();
  const [isHeaderShow, setHeaderShow] = React.useState(false);

  React.useEffect(()=>{
    if(location.pathname == "/" || location.pathname == "/register" || location.pathname == "/forgot"){
      setHeaderShow(false);
    }else{
      setHeaderShow(true);
    }
  }, [location]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", background: isHeaderShow ? "url('/imgs/bg-main.png')" : "url('/imgs/bg-login.png')", backgroundSize: "cover", minHeight: "100vh" }}>
      {isHeaderShow && (<Header/>)}
        {children}
      <Footer/>
    </Box>
  );
}
