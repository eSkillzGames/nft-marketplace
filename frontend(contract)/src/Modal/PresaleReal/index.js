import React, { createContext, useContext } from "react";
import { Modal, Button } from "react-bootstrap";

// import "../../pages/token/style.module.scss";
import style from "./style.module.scss";
// import { useRouter } from 'next/router';
import { useEffect, useState } from "react";
import { ethers, providers } from "ethers";
import { TextField, InputAdornment } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as homeActions from "../../pages/home/store/actions"
import * as fuseActions from "../../store/actions";
const { default: axios } = require("axios");
const PresaleSportContractABI = require("../../PresaleSport.json");
const PresaleSportContractAddress =
  "0x0002746e28a35d0b9113b12ccdf5ad2ca488e6a3";
const PresaleContractABI = require("../../Presale.json");
const PresaleContractAddress = "0x7a63d32124af1654863621afa0073efa26587351";
const providerR = new ethers.providers.JsonRpcProvider("https://rpc-mumbai.maticvigil.com");
// const providerW = new ethers.providers.JsonRpcProvider("https://polygon-mumbai.infura.io/v3/" + process.env.REACT_APP_INFURAID);
const PresaleContract = new ethers.Contract(PresaleContractAddress, PresaleContractABI, providerR); 
const PresaleSportContract = new ethers.Contract(PresaleSportContractAddress, PresaleSportContractABI, providerR); 

const useStyles = makeStyles({
  
  input: {
    color: "white"
  }
});

const Presale = (props) => {
  const { show, onHide, id, hideModel} =
    props;
  const [sportPricePerETH, setSportPricePerETH] = useState("");
  const [ethAmount, setEthAmount] = React.useState("");
  const [sportAmount, setSportAmount] = React.useState("0");
  
  const classes = useStyles();
  const { uid, address } = useSelector(({ authReducer }) => authReducer.auth);
  const { balance } = useSelector(({ homeReducer }) => homeReducer.home);
  const dispatch = useDispatch();
  // const router = useRouter();
  useEffect(() => {
    if(balance.MaticBal !=null){

      init();
    }
  }, [show,balance, id]);
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
                  "https://eskillzserver.net/sendtransaction/v1/BuyPresaleToken",
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
  async function init() {
      try {
       
            if (id == 0) {
              const price = await PresaleContract.price();              
              setSportPricePerETH(parseInt(price._hex));
            } else {
              
              const price = await PresaleSportContract.price();
              setSportPricePerETH(parseInt(price._hex));
            }
          
        
      } catch (err) {
        return {
          address: "",
        };
      }
    
  }
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
            <TextField 
                variant="outlined"
                
                className={`${style.form_control} ${style.bg_dark_green}`}
                value={ethAmount}
                placeholder="0"
                inputProps={{ className: classes.input }}
                
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
                  setSportAmount(
                    Number(event.target.value) >= 0 &&
                      Number(event.target.value) <= Number(balance.MaticBal)
                      ? sportPricePerETH * event.target.value
                      : "0"
                  );
                }}
            />
            {/* <input
              type="text"
              className={`${style.form_control} ${style.bg_dark_green}`}
              placeholder="0"
              variant="filled"
              value={ethAmount}
              aria-label=""
              aria-describedby="basic-addon1"
              onFocus={(e) => e.preventDefault()}
              onChange={(event) => {
                setEthAmount(
                  Number(event.target.value) >= 0 &&
                    Number(event.target.value) <= Number(balance)
                    ? event.target.value.toString().length == 2 &&
                      event.target.value.toString()[0] == "0" &&
                      Number(event.target.value.toString()[1]) >= 0
                      ? event.target.value.toString()[1]
                      : Number(event.target.value) >= 0
                      ? event.target.value
                      : ""
                    : 0
                );
                setSportAmount(
                  Number(event.target.value) >= 0 &&
                    Number(event.target.value) <= Number(balance)
                    ? sportPricePerETH * event.target.value
                    : "0"
                );
              }}
            /> */}
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
