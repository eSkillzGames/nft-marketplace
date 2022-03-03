
import React from 'react';
import { Button, makeStyles } from '@material-ui/core';
import Cues from '../../components/Cues';
import Cards from '../../components/Card';
import styles from './style';
import { useEffect, useState } from "react";
import { ethers } from 'ethers'
// import { SpaOutlined } from '@material-ui/icons';
// import Link from 'next/link';
import { useRouter } from 'next/router';
const NFTcontractABI = require('../../NFT.json');
const CardNFTcontractABI = require('../../NFT_CARD.json');
const NFTcontractAddress = "0x4e3ec2260c79369319b322808c084886849E81EC";
const CardNFTcontractAddress = "0x4Add67aC56C4DC86B87C7e4B73FE9495f7d0FF65";
const sportTokenAddress = "0x8603f5D95e463dAfcec01a03aAE8F93b199c7f65";
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
  const router = useRouter();
  const images = [    
    "hall.png",
    "cues.png",
    "lifes.png",
    "connectWallet.png",
  ];

  const titles = [
    "CARDS",
    "CUES",
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
  var CardTokenContract = new web3.eth.Contract(CardNFTcontractABI,CardNFTcontractAddress);
  var sportContract = new web3.eth.Contract(minABI, sportTokenAddress);
  if(loaded == 0){
    setLoaded(1);
    TokenContract.events.Transfer((err, events)=>{
      eventListened();      
    });
    CardTokenContract.events.Transfer((err, events)=>{
      eventListened();      
    });
  }
  async function eventListened() {
    try {
      if (window.ethereum) {
        
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
          
        
      } 
    } catch (err) {
      return {
        address: ""        
      };
    }
  }

  useEffect(() => {
    try{
      if(window.ethereum) {
        window.ethereum.on('chainChanged', () => {
          router.reload();
        })
        window.ethereum.on('accountsChanged', () => {
          router.reload();
        })
      }
      getCurrentWalletConnected(); 
    }
    catch{
      return;
    }
    
    
  }, [])

  async function getCurrentWalletConnected() {
    try {
      if (window.ethereum) {
        
          const addressArray = await window.ethereum.request({
            method: "eth_accounts",
          });        
          var web3Window = new Web3(window.ethereum);
          const chainIDBuffer = await web3Window.eth.net.getId();        
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
              setNetName("Wrong NET(DisConnect)");  
            }
          }         
        
      } 
    } catch (err) {
      return {
        address: ""        
      };
    }
  };

  async function connect_Wallet() {
    try{
      if (window.ethereum) {
        var web3Window = new Web3(window.ethereum);          
        if(address== ""){
          await window.ethereum.request({
            method: "wallet_requestPermissions",
            params: [{
                eth_accounts: {}
            }]
          });
          const addressArray = await window.ethereum.request({method: "eth_accounts",});
          const chainIDBuffer = await ethereum.networkVersion;
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
              setNetName("Wrong NET(DisConnect)");
            }     
          }
        }
        else{
          setAdress("");
          setNetName("");
          setBalance("");
          setSportBalance("");  
        }
      }  
    }
    catch{
      return;
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
          {/* <Link href="/mint">
            <Button className={classes.circle_btn} style={{position: 'relative', marginLeft : '20px'}}>
                {'>'}
            </Button>
          </Link> */}
          <Button className={classes.circle_btn} style={{position: 'relative', marginLeft : '20px'}} onClick={() => router.push('/mint')}>
              {'>'}
          </Button>          
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
                  else if(index == 2){
                    router.push('/token')
                  }
                  else{
                    setSelected(index);
                  }
                }
              }>
                <img src={"/images/" + img} alt="" />
                { index === 3 ? (netName == "" ? (balance.length == 0 ? titles[index] : "DisConnect") : netName ) : titles[index]}
              </Button>
            ))}
            </div>
            { selected === 0 && byAndSellSelected === 1 && sortValue ==1 && address == ""&& <Cards check = {1} sortVal = {1} connected = {0}/>}
            { selected === 0 && byAndSellSelected === 1 && sortValue ==0 && address == ""&& <Cards check = {1} sortVal = {0} connected = {0}/>}
            { selected === 0 && byAndSellSelected === 0 && sortValue ==1 && address == ""&& <Cards check = {0} sortVal = {1} connected = {0}/>}
            { selected === 0 && byAndSellSelected === 0 && sortValue ==0 && address == ""&& <Cards check = {0} sortVal = {0} connected = {0}/>}
            { selected === 0 && byAndSellSelected === 1 && sortValue ==1 && address != ""&& <Cards check = {1} sortVal = {1} connected = {1}/>}
            { selected === 0 && byAndSellSelected === 1 && sortValue ==0 && address != ""&& <Cards check = {1} sortVal = {0} connected = {1}/>}
            { selected === 0 && byAndSellSelected === 0 && sortValue ==1 && address != ""&& <Cards check = {0} sortVal = {1} connected = {1}/>}
            { selected === 0 && byAndSellSelected === 0 && sortValue ==0 && address != ""&& <Cards check = {0} sortVal = {0} connected = {1}/>}
            { selected === 1 && byAndSellSelected === 1 && sortValue ==1 && address == ""&& <Cues check = {1} sortVal = {1} connected = {0}/> }
            { selected === 1 && byAndSellSelected === 1 && sortValue ==0 && address == ""&& <Cues check = {1} sortVal = {0} connected = {0}/> }
            { selected === 1 && byAndSellSelected === 0 && sortValue ==1 && address == ""&& <Cues check = {0} sortVal = {1} connected = {0}/> }
            { selected === 1 && byAndSellSelected === 0 && sortValue ==0 && address == ""&& <Cues check = {0} sortVal = {0} connected = {0}/> }
            { selected === 1 && byAndSellSelected === 1 && sortValue ==1 && address != ""&& <Cues check = {1} sortVal = {1} connected = {1}/> }
            { selected === 1 && byAndSellSelected === 1 && sortValue ==0 && address != ""&& <Cues check = {1} sortVal = {0} connected = {1}/> }
            { selected === 1 && byAndSellSelected === 0 && sortValue ==1 && address != ""&& <Cues check = {0} sortVal = {1} connected = {1}/> }
            { selected === 1 && byAndSellSelected === 0 && sortValue ==0 && address != ""&& <Cues check = {0} sortVal = {0} connected = {1}/> }            
            {/* { selected === 2 && <LifesAndTokens /> } */}
          </div> 
        
    </>
  );
}

export default HomePage;