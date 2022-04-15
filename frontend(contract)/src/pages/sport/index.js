
import React from 'react';
import { Button, makeStyles, TextField} from '@material-ui/core';
import styles from './style';
import { ethers } from 'ethers';
import { useRouter } from 'next/router';
import { useEffect, useState } from "react";

const PresaleSportContractABI = require('../../PresaleSport.json');
const PresaleSportContractAddress = "0xB2C01519D42fEb1D77D4436ac84D316C9027b2A9";
const Web3 = require("web3");

const useStyles = makeStyles(styles);

function SportPage() {
  const classes = useStyles(); 
 
  const [ethAmount, setEthAmount] = React.useState("");
  const [sportAmount, setSportAmount] = React.useState("");
  const [sportPricePerETH, setSportPricePerETH] = React.useState("");
  const [address, setAdress] = React.useState("");
  const [netName, setNetName] = React.useState("");
  const [balance, setBalance] = useState("");

  
  const router = useRouter();
  const buy = async () => {  
    try{
      const { ethereum } = window;
      if(address!=""){
        if(window.ethereum){
          if (parseFloat(ethAmount) > 0) {
            const chainIDBuffer = await window.ethereum.networkVersion;
            if(chainIDBuffer == 80001){
              const provider = new ethers.providers.Web3Provider(window.ethereum);
              const signer = provider.getSigner();
              const PresaleSportContract = new ethers.Contract(PresaleSportContractAddress, PresaleSportContractABI, signer);
              try {
                let nftTxn = await PresaleSportContract.buy(
                  {
                    value: ethers.utils.parseUnits(ethAmount.toString(), 'ether')._hex,
                  }        
                ); 
                await nftTxn.wait();  
                let sportBuffer = sportAmount;
                setSportAmount("");
                setEthAmount("");    
                window.alert("You recieved "+sportBuffer+ " SPORT");    
              } catch (err) {          
                window.alert("Buy of the SPORT failed");
              }            
            }   
          }
          else{
            window.alert("MATIC Amount must be Float.");
          }
        }
        else{
          window.alert("Install MetaMask.");
        }      
      }
      else{
        window.alert("Connect to the MetaMask");
      }
    }
    catch{
      return;
    }
    
    
  }

  useEffect(() => {
    try{
      if(window.ethereum) {
        window.ethereum.on('chainChanged', () => {
          //router.reload();
          router.push('/sport');
        })
        window.ethereum.on('accountsChanged', () => {
          //router.reload();
          router.push('/sport');
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
    try {
      if (window.ethereum) {
        
          const addressArray = await window.ethereum.request({
            method: "eth_accounts",
          });
          var web3Window = new Web3(window.ethereum);
          const chainIDBuffer = await web3Window.eth.net.getId();
          if(addressArray.length > 0){
            if(chainIDBuffer == 80001){
              const provider = new ethers.providers.Web3Provider(window.ethereum);
              const signer = provider.getSigner();
              const PresaleSportContract = new ethers.Contract(PresaleSportContractAddress, PresaleSportContractABI, signer);      
              const price = await PresaleSportContract.price(); 
              setSportPricePerETH(parseInt(price._hex));   
            }          
          }         
        
      } 
    } catch (err) {
      return {
        address: ""        
      };
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
    try{
      if (window.ethereum) {
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
            const chainIDBuffer = await web3Window.eth.net.getId();        
            //setChainID(chainIDBuffer);
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
    catch{
      return;
    }
     
  };

  return (
    <>      
      <div className={classes.header} style={{flex:"row",display:"flex"}}>
        <div>
          <Button className={classes.circle_btn} onClick={() => router.push('/')}>
            {'<'}
          </Button>
        </div>
        
        <div className="seperator" style={{flex:"1 0 0%"}}></div>
        <div className="last-div" style={{marginLeft:"20px",display:"flex",flexDirection:"row"}}>
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
      <div className={classes.modal_content}>
        <div>
        <div className="infor1">
          <span className="amount_eth">
            Amount of MATIC being spent
          </span>
          <input
            placeholder="0"
            variant="filled"      
            value = {ethAmount}      
            onChange={(event) => {setEthAmount(event.target.value); setSportAmount(sportPricePerETH*event.target.value)}}
          />
          <span className="token_purchased">SPORT Token to be purchased</span>
          <span className="value">+&nbsp;{sportAmount}</span>
          <button className="buy_btn" onClick = {() =>{buy()}}>BUY</button>
        </div>
        
        <div className="infor2">
          <div>
            <span className="title">Wallet Address</span>
            <span className="content">{address.length> 0 ? (String(address).substring(0, 8) + "..." + String(address).substring(36)) : ("")}</span>
          </div>
          <div>
            <span className="title">Amount of MATIC</span>
            <span className="content">1x{sportPricePerETH}</span>
          </div>
        </div>
        </div>
      </div>  
    </>    
  );
}

export default SportPage;