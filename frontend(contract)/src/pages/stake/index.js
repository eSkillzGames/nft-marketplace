
import React from 'react';
import { Button, makeStyles, TextField} from '@material-ui/core';
import styles from './style';
import { ethers } from 'ethers';
import { useRouter } from 'next/router';
import { useEffect, useState } from "react";

const axios = require('axios');

const BetcontractABI = require('../../Bet.json');
const SportcontractABI = require('../../Sport.json');
const BetcontractAddress = "0xCB5b5Fe891310386DBE6A976f424363eAc7Fd990";
const SportcontractAddress = "0x2caFAb766a586a09659a09E92e9f4005DF827512";
const Web3 = require("web3");

const useStyles = makeStyles(styles);

function StakingPage() {
  const classes = useStyles();

  const [stakeValue, setStakeValue] = React.useState("");
  const [withDrawValue, setWithDrawValue] = React.useState("");
  const [stakedValue, setStakedValue] = React.useState("");
  const [claimableValue, setClaimableValue] = React.useState("");
  const [address, setAdress] = React.useState("");
  const [netName, setNetName] = React.useState("");
  const [balance, setBalance] = useState("");


  const router = useRouter();
  const claim = async (e) => {      
    try{
      const { ethereum } = window;
      if (ethereum) {
        
        const chainIDBuffer = await ethereum.networkVersion;
        
          if(chainIDBuffer == 80001 && address.length>0){
            
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const BetContract = new ethers.Contract(BetcontractAddress, BetcontractABI, signer); 
            let nftTxn = await BetContract.claimFromContractV2(); 
            await nftTxn.wait();
            init();
          }
          else{
            window.alert("Wrong Network or Disconnected Wallet.")
          }
        
      } 
    }
    catch{
      return;
    }      
       
   };  
  const withDrawAmounts = async (e) => {      
    try{
      const { ethereum } = window;
      if (ethereum) {
        
        const chainIDBuffer = await ethereum.networkVersion;
        
          if(chainIDBuffer == 80001 && address.length>0){
            
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const BetContract = new ethers.Contract(BetcontractAddress, BetcontractABI, signer); 
            let nftTxn = await BetContract.withDrawSportFromContract(withDrawValue*10**9); 
            await nftTxn.wait();
            init();
          }
          else{
            window.alert("Wrong Network or Disconnected Wallet.")
          }
        
      } 
    }
    catch{
      return;
    }     
       
  };
  const sendAmounts = async (e) => {      

    try{
      const { ethereum } = window;
      if (ethereum) {
        
        const chainIDBuffer = await ethereum.networkVersion;
        
          if(chainIDBuffer == 80001 && address.length>0){
            
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const SportContract = new ethers.Contract(SportcontractAddress, SportcontractABI, signer); 
            let nftTxn = await SportContract.SendSportToContract(stakeValue*10**9); 
            await nftTxn.wait();
            init();
          }
          else{
            window.alert("Wrong Network or Disconnected Wallet.")
          }
        
      } 
    }
    catch{
      return;
    }
  }; 
  
  useEffect(() => {
    try{
      if(window.ethereum) {
        window.ethereum.on('chainChanged', () => {
          //router.reload();
          router.push('/stake');
        })
        window.ethereum.on('accountsChanged', () => {
          //router.reload();
          router.push('/stake');
        })
      }
      getCurrentWalletConnected(); 
      init();
    }
    catch{
      return;
    }
    
    
  }, [])

  async function init() {
    try{
      const { ethereum } = window;
      if (ethereum) {
        const addressArray = await window.ethereum.request({
          method: "eth_accounts",
        });
        const chainIDBuffer = await ethereum.networkVersion;
        
        if(addressArray.length > 0){
          if(chainIDBuffer == 80001){
            
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const BetContract = new ethers.Contract(BetcontractAddress, BetcontractABI, signer); 
            let dataClaimAmounts = await BetContract.getClaimAmountsOfPlayerV2(addressArray[0]);   
            let dataStakedAmounts = await BetContract.getStakingAmountsOfPlayer(addressArray[0]);
            setStakedValue(parseInt(dataStakedAmounts._hex/10 **9));
            setClaimableValue(parseInt(dataClaimAmounts._hex/ 10 ** 9));

          }
        }
        
      } 
    }
    catch{
      return;
    }
  }
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
            if(chainIDBuffer == 80001){
              setNetName("");  
              web3Window.eth.getBalance(addressArray[0], (err, balanceOf) => {
                let balETH = ethers.utils.formatUnits(balanceOf, 'ether');        
                setBalance(String(balETH).substring(0, 6) + " MATIC");
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
    const chainId = 80001;
    try{
      if (window.ethereum) {
        var web3Window = new Web3(window.ethereum);     
        if (window.ethereum.networkVersion != chainId) {
          
          try {            
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: "0x"+chainId.toString(16)}],
            });
            if(address== ""){
              try {          
                await window.ethereum.request({
                  method: "wallet_requestPermissions",
                  params: [{
                      eth_accounts: {}
                  }]
                });
                const addressArray = await window.ethereum.request({method: "eth_accounts",});
                var web3Window = new Web3(window.ethereum);
                //setChainID(chainIDBuffer);
                if(addressArray.length > 0){
                  setAdress(addressArray[0]);
                    setNetName("");    
                    web3Window.eth.getBalance(addressArray[0], (err, balanceOf) => {
                      let balETH = ethers.utils.formatUnits(balanceOf, 'ether');        
                      setBalance(String(balETH).substring(0, 6) + " MATIC");
                    }); 
                }        
              } catch (err) {
                return {
                  address: ""        
                };
              }
            }
            else{
              setAdress("");
              setNetName(""); 
            }   
          } catch (err) {
              // This error code indicates that the chain has not been added to MetaMask.
            if (err.code === 4902) {
              await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [
                  {
                    chainName: 'Polygon Mumbai',
                    chainId: ethers.utils.toHex(chainId),
                    nativeCurrency: { name: 'Matic', decimals: 18, symbol: 'Matic' },
                    rpcUrls: ['https://rpc-mumbai.maticvigil.com/'],
                  },
                ],
              });
            }
          }
        }
        else{
          if(address== ""){
            try {          
              await window.ethereum.request({
                method: "wallet_requestPermissions",
                params: [{
                    eth_accounts: {}
                }]
              });
              const addressArray = await window.ethereum.request({method: "eth_accounts",});
              var web3Window = new Web3(window.ethereum);
              //setChainID(chainIDBuffer);
              if(addressArray.length > 0){
                setAdress(addressArray[0]);
                  setNetName("");    
                  web3Window.eth.getBalance(addressArray[0], (err, balanceOf) => {
                    let balETH = ethers.utils.formatUnits(balanceOf, 'ether');        
                    setBalance(String(balETH).substring(0, 6) + " MATIC");
                  }); 
              }        
            } catch (err) {
              return {
                address: ""        
              };
            }
          }
          else{
            setAdress("");
            setNetName(""); 
          }   
        }     
        
      }  
    }
    catch{
      return;
    }      
    
  };

  return (
    <>
      {/* <div className={classes.header}>
        <div>
          <Button className={classes.circle_btn} onClick={() => router.push('/')}>
            {'<'}
          </Button>          
        </div>
        
        <div className="seperator" style={{flex:"1 0 0%"}}></div>
        <div className="last-row" style={{marginLeft:"20px",display:"flex",flexDirection:"row"}}>
          <div style = {{flexDirection : 'column', display : 'flex',marginTop:"24px"}}>
              <span style={{color : 'white'}}>
                ADDRESS:&nbsp;
              {address.length> 0 ? (String(address).substring(0, 8) + "..." + String(address).substring(36)) : ("")}
              </span>
              <span style={{color : '#06f506'}}>
                MATIC BALANCE:&nbsp;
                {address.length> 0 ? balance : ""}            
              </span>            
          </div>
          <Button style={styles.presale_btn} variant="contained" onClick = {() =>{connect_Wallet();}}>
            {netName == "" ? (address.length == 0 ? "ConnectWallet" : "DisConnect") : netName}
          </Button>
        </div>
      </div>
        <span style = {{position : "absolute",  left : "200px", top : "130px", color : "brown", fontSize : "20px"}}>Total Staked Amounts : {stakedValue} SPORT </span>
        
        <span style = {{position : "absolute",  right : "200px", top : "130px", color : "brown", fontSize : "20px"}}>Total Claimable Amounts : {claimableValue} SPORT </span>
      <div className={classes.hero}>   
        <div className={classes.infos}>    
          
          <div className="titles" style={{alignSelf:"center"}}> 
            <div>
              <span style={{paddingBottom:"30px",color:"white",textTransform: "uppercase",}}>Send Sport Token to Bet Contract.</span>
              <span style = {{alignSelf:"center", color:"green"}}>Send Amounts</span>
              <TextField
                style = {{width : "200px",  alignSelf:"center"}}
                placeholder="0"
                variant="filled"      
                value = {stakeValue}  
                onChange={(event) => {setStakeValue(Number(event.target.value) > -1 ? Number(event.target.value) : 0); }}    
              />
            </div>                     
          </div>  
          <div style={{alignSelf:"center"}}>
            <Button id="submit" variant="contained" onClick = {() =>{sendAmounts();}}>
              Staking
            </Button>
          </div>   
        </div>
        <div className={classes.infos}>    
          
          <div className="titles" style={{alignSelf:"center"}}> 
            <div>
              <span style={{paddingBottom:"30px",color:"white",textTransform: "uppercase",}}>WithDraw Sport Token from Bet Contract.</span>
              <span style = {{alignSelf:"center", color:"green"}}>WithDraw Amounts</span>
              <TextField
                style = {{width : "200px",  alignSelf:"center"}}
                placeholder="0"
                variant="filled"      
                value = {withDrawValue}  
                onChange={(event) => {setWithDrawValue(Number(event.target.value) > -1 ? Number(event.target.value) : 0); }}    
              />
            </div>                     
          </div>  
          <div style={{alignSelf:"center"}}>
            <Button id="submit" variant="contained" onClick = {() =>{withDrawAmounts();}}>
              WIthDraw
            </Button>
          </div>   
        </div>
        <div className={classes.infos}>    
          
          <div className="titles" style={{alignSelf:"center"}}> 
            <div>
              <span style={{paddingBottom:"30px",color:"white",textTransform: "uppercase",}}>Claim Sport Token From Bet Contract.</span>
              
            </div>                     
          </div>  
          <div style={{alignSelf:"center"}}>
            <Button id="submit" variant="contained" onClick = {() =>{claim();}}>
              Claim
            </Button>
          </div>   
        </div>
        
                     
      </div>      */}
    </>    
  );
}

export default StakingPage;