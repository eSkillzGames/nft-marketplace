
import React from 'react';
import { Button, makeStyles, TextField} from '@material-ui/core';
import styles from './style';
import { ethers } from 'ethers';
import { useRouter } from 'next/router';
import { useEffect, useState } from "react";

const PresaleContractABI = require('../../Presale.json');
const PresaleContractAddress = "0x97BBF34109875FEe6dB01b055d64dFe7d32EA4C4";

const Web3 = require("web3");

const useStyles = makeStyles(styles);

function ESGPage() {
  const classes = useStyles(); 
 
  const [ethAmount, setEthAmount] = React.useState("");
  const [esgAmount, setEsgAmount] = React.useState("");
  const [esgPricePerETH, setEsgPricePerETH] = React.useState("");
  const [address, setAdress] = React.useState("");
  const [netName, setNetName] = React.useState("");
  const [balance, setBalance] = useState("");

  
  const router = useRouter();
  const buy = async () => {  
    const { ethereum } = window;
    if(address!=""){
      if(ethereum){
        if (parseFloat(ethAmount) > 0) {
          const chainIDBuffer = await ethereum.networkVersion;
          if(chainIDBuffer == 3){
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const PresaleContract = new ethers.Contract(PresaleContractAddress, PresaleContractABI, signer);
            try {
              let nftTxn = await PresaleContract.buy(
                {
                  value: ethers.utils.parseUnits(ethAmount.toString(), 'ether')._hex,
                }        
              ); 
              await nftTxn.wait();  
              let esgBuffer = esgAmount;
              setEsgAmount("");
              setEthAmount("");    
              window.alert("You recieved "+esgBuffer+ " ESG");    
            } catch (err) {          
              window.alert("Buy of the ESG failed");
            }            
          }   
        }
        else{
          window.alert("ETH Amount must be Float.");
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

  useEffect(() => {
    if(window.ethereum) {
      window.ethereum.on('chainChanged', () => {
        //router.reload();
        router.push('/esg');
      })
      window.ethereum.on('accountsChanged', () => {
        //router.reload();
        router.push('/esg');
      })
    }
    getCurrentWalletConnected(); 
    init();
    
  }, [])
  async function init() {
    if (window.ethereum) {
      try {
        const addressArray = await window.ethereum.request({
          method: "eth_accounts",
        });
        var web3Window = new Web3(window.ethereum);
        const chainIDBuffer = await web3Window.eth.net.getId();
        if(addressArray.length > 0){
          if(chainIDBuffer == 3){
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const PresaleContract = new ethers.Contract(PresaleContractAddress, PresaleContractABI, signer);      
            const price = await PresaleContract.price(); 
            setEsgPricePerETH(parseInt(price._hex));   
          }          
        }         
      } catch (err) {
        return {
          address: ""        
        };
      }
    } 
  }
  async function getCurrentWalletConnected() {
    if (window.ethereum) {
      try {
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
  };

  async function connect_Wallet() {
    
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
            if(chainIDBuffer == 3){
              setNetName("");    
              web3Window.eth.getBalance(addressArray[0], (err, balanceOf) => {
                let balETH = ethers.utils.formatUnits(balanceOf, 'ether');        
                setBalance(String(balETH).substring(0, 6) + " ETH");
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
  };

  return (
    <>      
      <div style={{flex:"row",display:"flex"}}>
        <div>
          <Button className={classes.circle_btn} onClick={() => router.push('/')}>
            {'<'}
          </Button>
        </div>
        
        <div style={{flex:"1 0 0%"}}></div>
        <div style={{marginLeft:"20px",display:"flex",flexDirection:"row"}}>
          <div style = {{flexDirection : 'column', display : 'flex',marginTop:"24px"}}>
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
            Amount of ETH being spent
          </span>
          <input
            placeholder="0"
            variant="filled"      
            value = {ethAmount}      
            onChange={(event) => {setEthAmount(event.target.value); setEsgAmount(esgPricePerETH*event.target.value)}}
          />
          <span className="token_purchased">ESG Token to be purchased</span>
          <span className="value">+&nbsp;{esgAmount}</span>
          <button className="buy_btn" onClick = {() =>{buy()}}>BUY</button>
        </div>
        
        <div className="infor2">
          <div>
            <span className="title">Wallet Address</span>
            <span className="content">{address.length> 0 ? (String(address).substring(0, 8) + "..." + String(address).substring(36)) : ("")}</span>
          </div>
          <div>
            <span className="title">Amount of ETH</span>
            <span className="content">1x{esgPricePerETH}</span>
          </div>
        </div>
        </div>
      </div>       
    </>    
  );
}

export default ESGPage;