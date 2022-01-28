
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
import { SpaOutlined } from '@material-ui/icons';
const NFTcontractABI = require('../../NFT.json');
// const NFTcontractAddress = "0xd95D493b5B048bE25bA70a89AD2360AC5f653a68";
const NFTcontractAddress = "0x2dC7DE43f04Cf66fA0fa25cDAD796Ff3fcF9e56A";
const sportTokenAddress = "0x19330E3C89c9AFB1581c7a16a863f1c5Bd489F46";
const Web3 = require("web3");

let web3 = new Web3(
    new Web3.providers.WebsocketProvider("wss://ropsten.infura.io/ws/v3/acc8266b5baf41c5ad44a05fe4a49925")
);

var minABI = [
  // balanceOf
  {
    "constant":true,
    "inputs":[{"name":"_owner","type":"address"}],
    "name":"balanceOf",
    "outputs":[{"name":"balance","type":"uint256"}],
    "type":"function"
  },
  // decimals
  {
    "constant":true,
    "inputs":[],
    "name":"decimals",
    "outputs":[{"name":"","type":"uint8"}],
    "type":"function"
  }
];

const useStyles = makeStyles(styles);

function HomePage() {
  const classes = useStyles();
  
  const [selected, setSelected] = React.useState(0);
  const [sortValue, setSortValue] = React.useState(0);
  const [byAndSellSelected, setByAndSellSelected] = React.useState(0);

  const images = [    
    "hall.png",
    "cues.png",
    "lifes.png",
    "connectWallet.png",
  ];

  const titles = [
    "AVATARS",
    "EQUIPMENT",
    "TOKENS",
    "Connect Wallet",
  ];
  const [balance, setBalance] = useState("");
  const [sportBalance, setSportBalance] = useState("");
  const [address, setAdress] = useState("");
  const [chainID, setChainID] = useState("");
  const [netName, setNetName] = useState("");

  const [loaded, setLoaded] = useState(0)

  var TokenContract = new web3.eth.Contract(NFTcontractABI,NFTcontractAddress);
  var sportContract = new web3.eth.Contract(minABI, sportTokenAddress);
  if(loaded == 0){
    setLoaded(1);
    TokenContract.events.Transfer((err, events)=>{
      eventListened();      
    });
  }
  async function eventListened() {
    if (window.ethereum) {
      try {
        const addressArray = await window.ethereum.request({
          method: "eth_accounts",
        });
        var web3Window = new Web3(window.ethereum);
        const chainIDBuffer = await web3Window.eth.net.getId();
        if(addressArray.length > 0){
          if(chainIDBuffer == 3){
            web3Window.eth.getBalance(addressArray[0], (err, balanceOf) => {
              let balETH = ethers.utils.formatUnits(balanceOf, 'ether');        
              setBalance(String(balETH).substring(0, 6) + " ETH");
            });
            sportContract.methods.balanceOf(addressArray[0]).call(function (err, res) {
              if(res.length>7){
                setSportBalance(String(parseInt(String(res).substring(0,res.length-7))/100) + " SPORT");
              }
              else{
                setSportBalance("0.00 SPORT");
              }              
            });
              
          }          
        } 
        
      } catch (err) {
        return {
          address: ""        
        };
      }
    } 
    
  }

  useEffect(() => {
    if(window.ethereum) {
      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      })
      window.ethereum.on('accountsChanged', () => {
        window.location.reload();
      })
    }
    getCurrentWalletConnected(); 
    
  }, [])

  async function getCurrentWalletConnected() {
    if (window.ethereum) {
      try {
        const addressArray = await window.ethereum.request({
          method: "eth_accounts",
        });
        var web3Window = new Web3(window.ethereum);
        const chainIDBuffer = await web3Window.eth.net.getId();
        
        //setChainID(chainIDBuffer);
        if(addressArray.length > 0){
          setAdress(addressArray[0]);
          if(chainIDBuffer == 3){
            setNetName("");
            web3Window.eth.getBalance(addressArray[0], (err, balanceOf) => {
              let balETH = ethers.utils.formatUnits(balanceOf, 'ether');        
              setBalance(String(balETH).substring(0, 6) + " ETH");
            });
            
            sportContract.methods.balanceOf(addressArray[0]).call(function (err, res) {
              if(res.length>7){
                setSportBalance(String(parseInt(String(res).substring(0,res.length-7))/100) + " SPORT");
              }
              else{
                setSportBalance("0.00 SPORT");
              }         
            });
          }
          else{  
            setNetName("Wrong NET");  
          }
        } 
        
      } catch (err) {
        return {
          address: ""        
        };
      }
    } 
  };

  async function connect_Wallet() {
    var web3Window = new Web3(window.ethereum);   
       
    if(address== ""){

      const walletResponse = await connectWallet();
      if(walletResponse.chainID == 3){
        setAdress(walletResponse.address);
        //setChainID(walletResponse.chainID);
        setNetName("");
        web3Window.eth.getBalance(walletResponse.address, (err, balanceOf) => {
          let balETH = ethers.utils.formatUnits(balanceOf, 'ether');        
          setBalance(String(balETH).substring(0, 6) + " ETH");
        }); 
      }
      else{
        setAdress(walletResponse.address);
        //setChainID(walletResponse.chainID);
        setNetName("Wrong NET");
      }          
    }
    else{
      
      //web3Window.currentProvider.disconnect();
      // if(chainID == 3) {
      //   web3Window.eth.getBalance(address, (err, balanceOf) => {
      //     let balETH = ethers.utils.formatUnits(balanceOf, 'ether');               
      //     setBalance(String(balETH).substring(0, 6) + " ETH");
      //   });
      // }
      // else{
      //   setBalance("Wrong NET");
      // }
      
    }
  };

  return (
    <>
      <div className={classes.buttons} style={{justifyContent:"center", marginTop:"24px"}}>
          <Button className={`${classes.btn} ${byAndSellSelected === 0 ? classes.selected_btn : ''}`} onClick={() => {setByAndSellSelected(0);}}>              
            {"BUY"}
          </Button>
          <div style={{width:"32px",flexShrink:"0%"}}></div>
          <Button className={`${classes.btn} ${byAndSellSelected === 1 ? classes.selected_btn : ''}`} onClick={() => {setByAndSellSelected(1);}}>              
            {"SELL"}
          </Button>
          <div style = {{flexDirection : 'column', display : 'flex'}}>
            <span style={{color : 'white'}}>
              &nbsp;
              &nbsp;
              ADDRESS :
              &nbsp;
            {address.length> 0 ? (String(address).substring(0, 8) + "..." + String(address).substring(36)) : ("")}
            </span>
            <span style={{color : '#06f506'}}>
              &nbsp;
              &nbsp;
              ETHER BALANCE :
              &nbsp;
              {address.length> 0 ? balance : ""}            
            </span>
            <span style={{color : '#00edff'}}>
              &nbsp;
              &nbsp;
              SPORT BALANCE :
              &nbsp;
              {address.length> 0 ? sportBalance : ""}            
            </span>
          </div>
      </div>
      <div className={classes.hero}>        
          <Button className={classes.circle_btn} onClick={() => {setSortValue(1 - sortValue);}}>
            { sortValue < 1 ? '↑' : '↓'}
          </Button>          
          <div className={classes.buttons}>
            {images.map((img, index) => (
              <Button key={index} className={`${classes.btn} ${selected === index ? classes.selected_btn : ''}`} onClick={() => {
                  if(index === 3){
                    connect_Wallet();
                  }
                  else{
                    setSelected(index);
                  }
                }
              }>
                <img src={"/images/" + img} alt="" />
                { index === 3 ? (netName == "" ? (balance.length == 0 ? titles[index] : "Connected") : netName ) : titles[index]}
              </Button>
            ))}
            </div>
            { selected === 0 && <Hall /> }
            { selected === 1 && byAndSellSelected === 1 && sortValue ==1 && <Cues check = {1} sortVal = {1}/> }
            { selected === 1 && byAndSellSelected === 1 && sortValue ==0 && <Cues check = {1} sortVal = {0}/> }
            { selected === 1 && byAndSellSelected === 0 && sortValue ==1 && <Cues check = {0} sortVal = {1}/> }
            { selected === 1 && byAndSellSelected === 0 && sortValue ==0 && <Cues check = {0} sortVal = {0}/> }            
            { selected === 2 && <LifesAndTokens /> }
          </div> 
        
    </>
  );
}

export default HomePage;