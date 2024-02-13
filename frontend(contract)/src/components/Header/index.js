import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, Button, Dialog, Grid } from "@mui/material";
import { layoutActions, authActions, fuseActions } from "./../../store/actions";
import WalletModal from "../../Modal/WalletModal";
import { auth, db, firebase, storage, storageRef } from "../../utils/firebase";
import { useEffect, useState } from "react";
import d_avatar from "../../assets/image/davatar.png";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { ethers, providers } from "ethers";
import VersusButton from "../VersusButton";
import { Close } from "@mui/icons-material";

import VersusWalletOption from "../VersusWalletOption"

import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { InjectedConnector } from "@web3-react/injected-connector";
import { useWeb3React } from '@web3-react/core'


const Web3 = require("web3");

const HiddenMenu = (props) => {
  const navigate = useNavigate();

  return (
    <>
      <Box
        style={{position:"absolute", left: "-100vw", top: "0", background:"#000", width: "100vw", height:"100vh", display:"flex", 
          flexDirection:"column", zIndex:"101", transition: "left 0.75s", left: props.open ? "0" : "-300vw"
      }}
      >
        <Box
          component="div"
          display={"flex"}
          alignItems={"center"}
          style={{width: "100%", padding:"2rem"}}
          justifyContent={"space-between"}>
            <Box
              display={"flex"}
              alignItems={"center"}
              justifyContent={"center"}
            >
              <img src="/imgs/VersusX_Horizontal_Logo.png" height="30px" />
            </Box>
            <Close
                style={{fill:"#fff", width:"20px", height:"20px"}}           
                onClick={props.handleClose}
            />
        </Box>
        <Box
          style={{padding:"4.5rem", display:"flex", flexDirection:"column", alignItems:"left", flexGrow:"1"}}
        >
          <Typography
            variant="h4"
            color="white"
            sx={{ cursor: "default", lineHeight:"2", cursor: "pointer" }}
            mr={6}
            onClick={() => {props.handleClose(); navigate("/home");}}
          >
            HOME
          </Typography>
          <Typography
            variant="h4"
            color="white"
            sx={{ cursor: "default", lineHeight:"2", cursor: "pointer" }}
            mr={6}
            onClick={() => {props.handleClose(); navigate("/download");}}
          >
            DOWNLOAD
          </Typography>
          <Typography
            variant="h4"
            color="white"
            sx={{ cursor: "default", lineHeight:"2", cursor: "pointer" }}
            mr={6}
            onClick={()=>{props.handleClose(); navigate("/leaderboard");}}
          >
            LEADERBOARD
          </Typography>
          <Typography
            variant="h4"
            color="white"
            sx={{ cursor: "default", lineHeight:"2", cursor: "pointer" }}
            mr={6}
            onClick={()=>{props.handleClose(); navigate("/wallet");}}
          >
            WALLET
          </Typography>
          <Typography
            variant="h4"
            color="white"
            sx={{ cursor: "default", lineHeight:"2", cursor: "pointer" }}
            onClick={() => {props.handleClose(); navigate("/profile");}}
          >
            ACCOUNT
          </Typography>
        </Box>
      </Box>
    </>
  )
}

const Header = () => {
  const navigate = useNavigate();
  const [auth, setAuth] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const { uid, address } = useSelector(({ authReducer }) => authReducer.auth);
  const { avatar } = useSelector(({ layoutReducer }) => layoutReducer.layout);
  const [size, setSize] = useState([0, 0]);
  const [showHeader, setShowHeader] = useState(false);
  const [loading, setLoading] = useState(false);
  const [walletOptionOpen, setWalletOptionOpen] = useState(false);

  const startLoading = () => {
    setLoading(true);
    setWalletOptionOpen(false);
  }

  const endLoading = () => {
    setLoading(false);
  }

  const walletOptionClose = () => {
    setWalletOptionOpen(false);
  }

  const location = useLocation();

  const dispatch = useDispatch();
  useEffect(() => {
    storageRef
      .child(`users/${uid}.jpeg`)
      .getDownloadURL()
      .then((url) => {
        var xhr = new XMLHttpRequest();
        xhr.responseType = "blob";
        xhr.onload = (event) => {
          var blob = xhr.response;
        };
        xhr.open("GET", url);
        xhr.send();

        // Or inserted into an <img> element
        //setAvatar(url);
        dispatch(layoutActions.setAvatar(url));
      })
      .catch((error) => {
        dispatch(layoutActions.setAvatar(""));
        //setAvatar("");
      });
  }, [uid]);

  const handleChange = (event) => {
    setAuth(event.target.checked);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    handleClose();
    navigate("/profile");
  };
  
  const hideHeader = () => {
    setShowHeader(false);
  }

  useEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  },[]);

  return (
    <Box>
      <Box
        display={"flex"}
        alignItems={"center"}
        justifyContent={size[0] > 576 ?"center":"space-between"}
        pt={size[0] > 768 ?3:0}
      >
          {size[0] > 768 ?
          <Box
            component="div"
            sx={{ border: "3px solid #00BDFF", borderRadius: "10px" }}
            p={1}
          >
            <Box
              component="div"
              display={"flex"}
              alignItems={"center"}
              justifyContent={"space-between"}
            >
              <Box display={"flex"} alignItems={"center"} sx={{marginRight: "2rem"}}>
                <img src="/imgs/header_logo.png" height="40px" />
                <Typography
                  variant="overline"
                  color="white"
                  style={{cursor:"pointer", margin: "0 0.5rem"}}
                  onClick={()=>{navigate("/home");}}
                >
                  HOME
                </Typography>
                <Typography
                  variant="overline"
                  color="white"
                  style={{cursor:"pointer", margin: "0 0.5rem"}}
                  onClick={()=>{navigate("/download");}}
                >
                  DOWNLOAD
                </Typography>
                <Typography
                  variant="overline"
                  color="white"
                  style={{cursor:"pointer", margin: "0 0.5rem"}}
                  onClick={()=>{navigate("/leaderboard");}}
                >
                  LEADERBOARD
                </Typography>
                <Typography
                  variant="overline"
                  color="white"
                  style={{cursor:"pointer", margin: "0 0.5rem"}}
                  onClick={()=>{navigate("/wallet");}}
                >
                  WALLET
                </Typography>
                <Typography
                  variant="overline"
                  color="white"
                  style={{cursor:"pointer", margin: "0 0.5rem"}}
                  onClick={handleProfile}
                >
                  ACCOUNT
                </Typography>
              </Box>
              <Box flexGrow={1}></Box>
              <Box>
                <VersusButton
                  outline={true}
                  label="LOG OUT"
                  style={{cursor:"pointer", marginRight: "1rem"}}
                  onClick={() => dispatch(authActions.logout())}
                />
              </Box>
              <Box>
                <VersusButton
                  label="CONNECT WALLET"
                  style={{cursor:"pointer"}}
                  onClick={() => setWalletOptionOpen(true)}
                />
              </Box>
            </Box>
          </Box> :
          <Box
            component="div"
            display={"flex"}
            alignItems={"center"}
            style={{width: "100%", padding:"2rem", borderBottom: "4px solid #00bdff"}}
            justifyContent={"space-between"}
            >
              <img src="/imgs/VersusX_Horizontal_Logo.png" height="30px" />
              <Box
                display="flex"
                alignItems={"center"}
                justifyContent={"center"}
              >
                <VersusButton
                  outline={true}
                  label="LOG OUT"
                  style={{cursor:"pointer", marginRight: "1rem"}}
                  onClick={() => dispatch(authActions.logout())}
                />
                <VersusButton
                  label="CONNECT WALLET"
                  style={{cursor:"pointer", marginRight: "1rem"}}
                  onClick={() => setWalletOptionOpen(true)}
                />
                <div style={{cursor:"pointer"}} onClick={(e) => setShowHeader(true)}>
                  <img src="imgs/Menu_short.png" style={{maxWidth:"100%"}}></img>
                </div>
              </Box>
          </Box>
          }
      </Box>
      <VersusWalletOption open={walletOptionOpen} handleClose={walletOptionClose} startLoading={startLoading} endLoading = {endLoading}/>
      { showHeader ? <HiddenMenu open={true} handleClose={hideHeader}/>: <HiddenMenu open={false} handleClose={hideHeader}/>}
    </Box>
  );
};

export default Header;


