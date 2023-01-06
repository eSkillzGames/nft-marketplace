import React from "react";
import { Button, makeStyles } from "@material-ui/core";
import Cues from "../../components/Cues";
import Cards from "../../components/Card";
import styles from "./style";
import { useEffect, useState } from "react";
import { ethers, providers } from "ethers";

import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as homeActions from "./store/actions"

const NFTcontractABI = require("../../NFT.json");
const CardNFTcontractABI = require("../../NFT_CARD.json");
const NFTcontractAddress = "0xd7694bf6715dc2672c3c42558f09114e7a9fe6c3";
const CardNFTcontractAddress = "0x4daf37319a02ae027b3165fd625fd5cf22ea622d";
const Web3 = require("web3");

const useStyles = makeStyles(styles);

function HomePage() {
  const classes = useStyles();
  const { uid, address } = useSelector(({ authReducer }) => authReducer.auth);
  const { balance } = useSelector(({ homeReducer }) => homeReducer.home);
  const [selected, setSelected] = React.useState(0);
  const [sortValue, setSortValue] = React.useState(0);
  const [byAndSellSelected, setByAndSellSelected] = React.useState(0);
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const images = ["hall.png", "cues.png", "presale.png"];

  const titles = ["CARDS", "CUES", "PRESALE"];
  const [maticbalance, setBalance] = useState("");
  const [sportBalance, setSportBalance] = useState("");
  const [esgBalance, setEsgBalance] = useState("");

  const [loaded, setLoaded] = useState(0);

  // var TokenContract = new web3.eth.Contract(NFTcontractABI, NFTcontractAddress);
  // var CardTokenContract = new web3.eth.Contract(
  //   CardNFTcontractABI,
  //   CardNFTcontractAddress
  // );
  
  if (loaded == 0) {
    setLoaded(1);
    // TokenContract.events.Transfer((err, events) => {
    //   eventListened();
    // });
    // CardTokenContract.events.Transfer((err, events) => {
    //   eventListened();
    // });
  }

  // function sleep(ms) {
  //   return new Promise((resolve) => {
  //     setTimeout(resolve, ms);
  //   });
  // }

  // async function eventListened() {
  //   await sleep(15000);
  //   try {
  //     if (address != "") {
  //       // if (window.ethereum) {
  //       //   const addressArray = await window.ethereum.request({
  //       //     method: "eth_accounts",
  //       //   });
  //       //   var web3Window = new Web3(window.ethereum);
  //       //   const chainIDBuffer = await web3Window.eth.net.getId();
  //       //   if (addressArray.length > 0) {
  //       //     if (chainIDBuffer == 80001) {
  //       //       web3Window.eth.getBalance(addressArray[0], (err, balanceOf) => {
  //       //         let balETH = ethers.utils.formatUnits(balanceOf, "ether");
  //       //         var string = balETH.toString().split(".");
  //       //         if (string.length > 1) {
  //       //           if (string[1].length > 3) {
  //       //             setBalance(
  //       //               string[0] + "." + string[1].substring(0, 4) + " MATIC"
  //       //             );
  //       //           } else {
  //       //             setBalance(string[0] + "." + string[1] + " MATIC");
  //       //           }
  //       //         } else {
  //       //           setBalance(string[0] + " MATIC");
  //       //         }
  //       //       });
  //       //       sportContract.methods
  //       //         .balanceOf(addressArray[0])
  //       //         .call(function (err, res) {
  //       //           if (res.length > 7) {
  //       //             setSportBalance(
  //       //               String(
  //       //                 parseInt(String(res).substring(0, res.length - 7)) / 100
  //       //               ) + " SPORT"
  //       //             );
  //       //           } else {
  //       //             setSportBalance("0.00 SPORT");
  //       //           }
  //       //         });
  //       //     }
  //       //   }
  //       // } 
  //     }
  //   } catch (err) {
  //     return {
  //       address: "",
  //     };
  //   }
  // }

  useEffect(() => {    
    if(address){

      dispatch(homeActions.setBalance(address));
    }

  }, [address])
  useEffect(() => {
    if(balance.MaticBal !=null){
      init()
    }
  },[balance])

  async function init() {
    try {

            let balETH = ethers.utils.formatUnits(balance.MaticBal.toString(), "ether");
            var string = balETH.toString().split(".");     
         
            if (string.length > 1) {
              if (string[1].length > 3) {
                setBalance(
                  string[0] + "." + string[1].substring(0, 4) + " MATIC"
                  );
              } else {
                setBalance(string[0] + "." + string[1] + " MATIC");
              }
            } else {
              setBalance(string[0] + " MATIC");
            }
            if (String(balance.SportBal).length > 7) {
              setSportBalance(
              String(
                parseInt(String(balance.SportBal).substring(0, String(balance.SportBal).length - 7)) / 100
                ) + " SPORT"
                );
            } else {
              setSportBalance("0.00 SPORT");
            }
            if (String(balance.EsgBal).length > 7) {
              setEsgBalance(
              String(
                parseInt(String(balance.EsgBal).substring(0, String(balance.EsgBal).length - 7)) / 100
                ) + " ESG"
                );
            } else {
              setEsgBalance("0.00 ESG");
            }
                
      } catch (err) {
        
      }
    }
    
    return (
      <>
      <div
        className={classes.buttons}
        style={{ justifyContent: "center", marginTop: "24px" }}
      >       
        <div
          className="seperator"
          style={{ width: "32px", flexShrink: "0%" }}
        ></div>
        <Button
          className={`${classes.btn} ${
            byAndSellSelected === 0 ? classes.selected_btn : ""
          }`}
          onClick={() => {
            setByAndSellSelected(0);
          }}
        >
          {"BUY"}
        </Button>
        <div
          className="seperator"
          style={{ width: "32px", flexShrink: "0%" }}
        ></div>
        <Button
          className={`${classes.btn} ${
            byAndSellSelected === 1 ? classes.selected_btn : ""
          }`}
          onClick={() => {
            setByAndSellSelected(1);
          }}
        >
          {"SELL"}
        </Button>
        <div
          className="last-div"
          style={{ flexDirection: "column", display: "flex" }}
        >          
          <span style={{ color: "#06f506" }}>
            &nbsp; &nbsp; MATIC BALANCE : &nbsp;
            {maticbalance}
          </span>
          <span style={{ color: "#00edff" }}>
            &nbsp; &nbsp; SPORT BALANCE : &nbsp;
            {sportBalance}
          </span>
          <span style={{ color: "#ffedff" }}>
            &nbsp; &nbsp; ESG BALANCE : &nbsp;
            {esgBalance}
          </span>
        </div>        
      </div>
      <div className={classes.hero}>
        <Button
          className={classes.circle_btn}
          onClick={() => {
            setSortValue(1 - sortValue);
          }}
        >
          {sortValue < 1 ? "↑" : "↓"}
        </Button>
        <div className={classes.buttons}>
          {images.map((img, index) => (
            <Button
              key={index}
              className={`${classes.btn} ${
                selected === index ? classes.selected_btn : ""
              }`}
              onClick={() => {
                if (index === 2) {
                  navigate("/presale");
                
                } else {
                  setSelected(index);
                }
              }}
            >
              <img src={"/images/" + img} alt="" />
              {titles[index]}
            </Button>
          ))}
        </div>
        
        {selected === 0 &&
          byAndSellSelected === 1 &&
          sortValue == 1 &&
          (
            <Cards
              check={1}
              sortVal={1}
            />
          )}
        {selected === 0 &&
          byAndSellSelected === 1 &&
          sortValue == 0 &&
          (
            <Cards
              check={1}
              sortVal={0}
            />
          )}
        {selected === 0 &&
          byAndSellSelected === 0 &&
          sortValue == 1 &&
          (
            <Cards
              check={0}
              sortVal={1}
            />
          )}
        {selected === 0 &&
          byAndSellSelected === 0 &&
          sortValue == 0 &&
          (
            <Cards
              check={0}
              sortVal={0}
            />
          )}
        
        {selected === 1 &&
          byAndSellSelected === 1 &&
          sortValue == 1 &&
          (
            <Cues
              check={1}
              sortVal={1}
            />
          )}
        {selected === 1 &&
          byAndSellSelected === 1 &&
          sortValue == 0 &&
          (
            <Cues
              check={1}
              sortVal={0}
            />
          )}
        {selected === 1 &&
          byAndSellSelected === 0 &&
          sortValue == 1 &&
          (
            <Cues
              check={0}
              sortVal={1}
            />
          )}
        {selected === 1 &&
          byAndSellSelected === 0 &&
          sortValue == 0 &&
          (
            <Cues
              check={0}
              sortVal={0}
            />
          )} 
      </div>
    </>
  );
}

export default HomePage;
