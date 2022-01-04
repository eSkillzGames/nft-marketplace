
import React from 'react';
import { Button, makeStyles } from '@material-ui/core';
import Cues from '../../components/Cues';
import Chalks from '../../components/Chalks';
import Hall from '../../components/Hall';
import LifesAndTokens from '../../components/LifesAndTokens';
import styles from './style';
import { useEffect, useState } from "react";
import { connectWallet} from "../../components/Cues/index.js";
import { ethers } from 'ethers'
const Web3 = require("web3");
let web3 = new Web3(
    new Web3.providers.WebsocketProvider("wss://ropsten.infura.io/ws/v3/acc8266b5baf41c5ad44a05fe4a49925")
);
import api from '../../utils/api';
const useStyles = makeStyles(styles);

function HomePage() {
  const classes = useStyles();
  
  const [selected, setSelected] = React.useState(0);

  const images = [
    "cues.png",
    "chalks.png",
    "hall.png",
    "lifes.png",
    "connectWallet.png",
  ];

  const titles = [
    "Cues",
    "Chalks",
    "Hall Design",
    "Lifes & Tokens",
    "Connect Wallet",
  ];
  const [balance, setBalance] = useState("");
  const [address, setAdress] = useState("");

  useEffect(() => {
    getCurrentWalletConnected(); 
  }, [])

  async function getCurrentWalletConnected() {
    
    if (window.ethereum) {
      try {
        const addressArray = await window.ethereum.request({
          method: "eth_accounts",
        });
        if (addressArray.length > 0) {
          web3.eth.getBalance(addressArray[0], (err, balanceOf) => {
            let balETH = ethers.utils.formatUnits(balanceOf, 'ether');               
            setBalance(String(balETH).substring(0, 6) + " ETH");
          });
        } 
      } catch (err) {
        return {
          address: ""        
        };
      }
    } 
  };

  async function connect_Wallet() {
    
    if(address.length==0){
      const walletResponse = await connectWallet();
      setAdress(walletResponse.address);
      web3.eth.getBalance(walletResponse.address, (err, balanceOf) => {
        let balETH = ethers.utils.formatUnits(balanceOf, 'ether');        
        setBalance(String(balETH).substring(0, 6) + " ETH");
      });  
      
    }
    else{
      web3.eth.getBalance(address, (err, balanceOf) => {
        let balETH = ethers.utils.formatUnits(balanceOf, 'ether');               
        setBalance(String(balETH).substring(0, 6) + " ETH");
      });
      // let data = { address: '0x89C30f2Af966Ed9e733E5dCFc76AE984EaAF5373'};
      //     const res = await api.get('/cues/getBalance');
      //     //web3.eth.getBalance(addressArray[0], (err, balanceOf) => {
      //       //let balETH = ethers.utils.formatUnits(balanceOf, 'ether');   
      //       let balETH = ethers.utils.formatUnits(res, 'ether');     
      //       setBalance(String(balETH).substring(0, 6) + " ETH");     
    }
  };

  return (
    <>
      <div className={classes.hero}>
        <Button className={classes.circle_btn}>
          {'<'}
        </Button>
        <div className={classes.buttons}>
          {images.map((img, index) => (
            <Button key={index} className={`${classes.btn} ${selected === index ? classes.selected_btn : ''}`} onClick={() => {
                if(index === 4){
                  connect_Wallet();
                }
                else{
                  setSelected(index);
                }
              }
            }>
              <img src={"/images/" + img} alt="" />
              { index === 4 ? (balance.length == 0 ? titles[index] : balance) : titles[index]}
            </Button>
          ))}
        </div>
        { selected === 0 && <Cues /> }
        { selected === 1 && <Chalks /> }
        { selected === 2 && <Hall /> }
        { selected === 3 && <LifesAndTokens /> }
      </div>
    </>
  );
}

export default HomePage;