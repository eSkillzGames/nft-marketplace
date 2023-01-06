import React, { createContext, useContext } from "react";
import { Modal, Button } from "react-bootstrap";
// import "../../pages/token/style.module.scss";
import style from "./style.module.scss";
// import { useRouter } from 'next/router';
import { useEffect, useState } from "react";
import { ethers, providers } from "ethers";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3 from "web3";
import { TextField, InputAdornment } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import tokenPriceABI from "../../GetTokenPrice.json";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as homeActions from "../../pages/home/store/actions"
import * as fuseActions from "../../store/actions";
const { default: axios } = require("axios");
const UniswapABI = require("../../Uniswap.json");
const UniswapAddress = "0x8954AfA98594b838bda56FE4C12a09D7739D179b";
const tokenPriceAddress = "0x6b186a04C801A3D717621b0B19D018375161bFF8";
const sportTokenAddress = "0x2caFAb766a586a09659a09E92e9f4005DF827512";
const esgTokenAddress = "0x6637926e5c038c7ae3d3fd2c2d77c44e8be1ed28";
const providerR = new ethers.providers.JsonRpcProvider("https://rpc-mumbai.maticvigil.com");
// const providerW = new ethers.providers.JsonRpcProvider("https://polygon-mumbai.infura.io/v3/" + process.env.REACT_APP_INFURAID);
const PresaleContract = new ethers.Contract(UniswapAddress, UniswapABI, providerR); 
const tokenPriceContract = new ethers.Contract(tokenPriceAddress, tokenPriceABI, providerR); 
// const Web3 = impor("web3");
const useStyles = makeStyles({
  
  input: {
    color: "white"
  }
});

const Presale = (props) => {
  const {
    show,
    onHide,
    id,      
    hideModel,    
  } = props;

  const [ethAmount, setEthAmount] = React.useState("");
  const [sportAmount, setSportAmount] = React.useState("0");
  const navigate = useNavigate();
  const { uid, address } = useSelector(({ authReducer }) => authReducer.auth);
  const { balance } = useSelector(({ homeReducer }) => homeReducer.home);
  const dispatch = useDispatch();
  const buy = async () => {
    try {
          if (parseFloat(ethAmount) > 0) {             
              
              try {
                hideModel();
                var type = "esg";
                if (id == 1) {
                  type = "sport";
                }
                const response = await axios.post(
                  "https://eskillzserver.net/sendtransaction/v1/BuyToken",
                  { Account: address, Type: type, ethValue: ethAmount, UserID: uid}
                );
                console.log("response->", response.data);
           
                dispatch(homeActions.setBalance(address));                

                setSportAmount("0");
                setEthAmount("");
              } catch (err) {

              }
            
          } else {
            dispatch(
              fuseActions.showMessage({
                message: "MATIC Amount must not be Zero.",
                variant: "error",
                timer:3000
              })
            );
          }
        
      
    } catch {
      return;
    }
  };

  const calcEarnVal = async (val) => {
    try {   
            if (id == 1) {
              if (val != 0) {
                const price = await tokenPriceContract.getETHPriceUsingAmount(sportTokenAddress,
                  (val * 10 ** 18).toString());    
                  setSportAmount(String(price / 10 ** 9));          
                
              } else {
                setSportAmount(0);
              }
            } else {
              if (val != 0) {
                const price = await tokenPriceContract.getETHPriceUsingAmount(esgTokenAddress,
                  (val * 10 ** 18).toString());    
                  setSportAmount(String(price / 10 ** 9));  
              } else {
                setSportAmount(0);
              }
            }
          
        
      
    } catch (err) {
      return {
        address: "",
      };
    }
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className={style.mymodal}
    >
      <Modal.Body className={`${style.modal_body} d-flex p-0`}>
        <div className={`${style.presale} d-flex text-start w-100`}>
          <div className={`${style.sub_container} ${style.bg_green}`}>
            <h6 className={`${style.color_light_green} ms-3`}>
              Amount of MATIC being spent
            </h6>
            <input
              type="text"
              className={`${style.form_control} ${style.bg_dark_green}`}
              placeholder="0"
              variant="filled"
              value={ethAmount}
              aria-label=""
              aria-describedby="basic-addon1"
              onChange={(event) => {
                event.preventDefault();
                setEthAmount(
                  Number(event.target.value) >= 0 &&
                    Number(event.target.value) <= Number(balance.MaticBal)
                    ? event.target.value.toString().length == 2 &&
                      event.target.value.toString()[0] == "0" &&
                      Number(event.target.value.toString()[1]) >= 0
                      ? event.target.value.toString()[1]
                      : Number(event.target.value) >= 0
                      ? event.target.value
                      : ""
                    : 0
                );

                calcEarnVal(
                  Number(event.target.value) >= 0 &&
                    Number(event.target.value) <= Number(balance.MaticBal)
                    ? event.target.value.toString().length == 2 &&
                      event.target.value.toString()[0] == "0" &&
                      Number(event.target.value.toString()[1]) >= 0
                      ? event.target.value.toString()[1]
                      : Number(event.target.value) >= 0
                      ? event.target.value
                      : ""
                    : 0
                );
              }}
            />
            <h6 className={`${style.color_light_green} ms-3 mt-5`}>
              Tokens to be purchaged
            </h6>
            <h2 className={`${style.color_blue}`}>
              <span className="opacity-25">+</span> {sportAmount}
            </h2>
            <Button
              variant="outline-primary"
              className={`${style.color_blue} ${style.btn_outline_primary} rounded-pill w-100 mt-4`}
              onClick={() => {
                buy();
              }}
            >
              BUY
            </Button>
          </div>
          {/* <div className="m-5 text-start">
                        <p className={style.color_light_green}>Wallet Address</p>
                        <p className={style.color_middle_green}>{address.length> 0 ? (String(address).substring(0, 8) + "..." + String(address).substring(36)) : ("")}</p>
                        <p className={`${style.color_light_green} mt-4`}>Amount of ETH</p>
                        <p className={style.color_middle_green}>1×{sportPricePerETH}</p>
                    </div> */}
        </div>
      </Modal.Body>
    </Modal>
  );
};
export default Presale;
