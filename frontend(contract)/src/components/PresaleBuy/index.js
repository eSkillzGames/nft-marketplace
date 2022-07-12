import React, { useContext, useState ,useEffect} from 'react';
import { Button } from "react-bootstrap";
import Presale from "../../Modal/PresaleReal";
import { ethers } from 'ethers';
import style from "../../pages/token/style.module.scss";
import tokenPriceABI from '../../GetTokenPrice.json';
const sportTokenAddress = "0x8B65efE0E27D090F6E46E0dFE93E73d3574E5d99";
//const esgTokenAddress = "0x8C534C9aa8d6cDB75d139caF5aD9716Db25eB628";
const esgTokenAddress = "0x6637926e5c038c7ae3d3fd2c2d77c44e8be1ed28";
const tokenPriceAddress = "0x6b186a04C801A3D717621b0B19D018375161bFF8";
const Web3 = require("web3");
import WalletConnectProvider from "@walletconnect/web3-provider";
var minABI = [
    // balanceOf
    {
      "constant":true,
      "inputs":[{"name":"_owner","type":"address"}],
      "name":"balanceOf",
      "outputs":[{"name":"balance","type":"uint256"}],
      "type":"function"
    }
  ];
const TokenBuy = ({ data ,id,address}) => {
    const [presaleModalShow, setPresaleModalShow] = useState(false);
    const [sportPricePerETH, setSportPricePerETH] = useState("");
    const [balance, setBalance] = useState("");
    const [customTokenBalance, setCustomTokenBalance] = useState("");
    const hideModel = () => {
        setPresaleModalShow(false);
    }
    async function getChangeVal (val) {        
        try {
            if (window.ethereum) {                
                const addressArray = await window.ethereum.request({
                    method: "eth_accounts",
                });
                var web3 = new Web3(window.ethereum);
                const chainIDBuffer = await web3.eth.net.getId();
                if(addressArray.length > 0 && address!=""){
                    if(chainIDBuffer == 80001){                        
                        var sportContract = new web3.eth.Contract(minABI, sportTokenAddress);
                        var esgContract = new web3.eth.Contract(minABI, esgTokenAddress);   
                        if(val == 1){
                            sportContract.methods.balanceOf(addressArray[0]).call(function (err, res) {
                                if(res.length>7){
                                    setCustomTokenBalance(String(parseInt(String(res).substring(0,res.length-7))/100));                                    
                                }
                                else{
                                    setCustomTokenBalance("0");
                                }              
                            });
                        }
                        else{
                            esgContract.methods.balanceOf(addressArray[0]).call(function (err, res) {
                                if(res.length>7){
                                    setCustomTokenBalance(String(parseInt(String(res).substring(0,res.length-7))/100));                                     
                                }
                                else{
                                    setCustomTokenBalance("0");
                                }              
                            }); 
                        }                     
                           
                    }          
                } 
                
                
            }  
            else{
                const prov = new WalletConnectProvider({
                    rpc: {
                      80001: "https://matic-mumbai.chainstacklabs.com",
                    },
                    chainId: 80001,
                  });
                  const addressMobile = await prov.enable();
                  var web3 = new Web3(prov); 
                const chainIDBuffer = await web3.eth.net.getId();
                if(addressMobile.length > 0 && address!=""){
                    if(chainIDBuffer == 80001){                        
                        var sportContract = new web3.eth.Contract(minABI, sportTokenAddress);
                        var esgContract = new web3.eth.Contract(minABI, esgTokenAddress);   
                        if(val == 1){
                            sportContract.methods.balanceOf(addressMobile[0]).call(function (err, res) {
                                if(res.length>7){
                                    setCustomTokenBalance(String(parseInt(String(res).substring(0,res.length-7))/100));                                    
                                }
                                else{
                                    setCustomTokenBalance("0");
                                }              
                            });
                        }
                        else{
                            esgContract.methods.balanceOf(addressMobile[0]).call(function (err, res) {
                                if(res.length>7){
                                    setCustomTokenBalance(String(parseInt(String(res).substring(0,res.length-7))/100));                                     
                                }
                                else{
                                    setCustomTokenBalance("0");
                                }              
                            }); 
                        }                     
                           
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
        init();
    }, []);
    async function init() {
        getChangeVal(id);
        try {
            if (window.ethereum) {
               
                const addressArray = await window.ethereum.request({
                method: "eth_accounts",
                });
                var web3Window = new Web3(window.ethereum);
                const chainIDBuffer = await web3Window.eth.net.getId();
                
                if(addressArray.length > 0 && address!=""){
                    
                    if(chainIDBuffer == 80001){
                        web3Window.eth.getBalance(addressArray[0], (err, balanceOf) => {
                            let balETH = ethers.utils.formatUnits(balanceOf, 'ether');        
                            setBalance(balETH);
                          });
                        const provider = new ethers.providers.Web3Provider(window.ethereum);
                        
                        const signer = provider.getSigner();
                       
                        var tokenPriceContract = new web3Window.eth.Contract(tokenPriceABI,tokenPriceAddress);
                        
                        if(id == 1){
                            
                            tokenPriceContract.methods.getETHPrice(sportTokenAddress).call(function (err, res) {
                            
                                setSportPricePerETH(String(res/(10**9)));
                                
                            });
                            
                        }
                        else{
                            tokenPriceContract.methods.getETHPrice(esgTokenAddress).call(function (err, res) {
                            
                                setSportPricePerETH(String(res/(10**9)));
                                
                            });; 
                            
                        }
                    
                    }          
                }         
            
            } 
            else{
                
                    const prov = new WalletConnectProvider({
                        rpc: {
                        80001: "https://matic-mumbai.chainstacklabs.com",
                        },
                        chainId: 80001,
                    });
                      const addressMobile = await prov.enable();
                      var web3Window = new Web3(prov);
                      const chainIDBuffer = await web3Window.eth.net.getId(); 
                    
                    if(addressMobile.length > 0 && address!=""){
                        
                        if(chainIDBuffer == 80001){
                            web3Window.eth.getBalance(addressMobile[0], (err, balanceOf) => {
                                let balETH = ethers.utils.formatUnits(balanceOf, 'ether');        
                                setBalance(balETH);
                              });
                            
                            var tokenPriceContract = new web3Window.eth.Contract(tokenPriceABI, tokenPriceAddress);
                            if(id == 1){
                                
                                tokenPriceContract.methods.getETHPrice(sportTokenAddress).call(function (err, res) {
                                
                                    setSportPricePerETH(String(res/(10**9)));
                                    
                                });                               
                                
                            }
                            else{
                                tokenPriceContract.methods.getETHPrice(esgTokenAddress).call(function (err, res) {
                                
                                    setSportPricePerETH(String(res/(10**9)));
                                    
                                });; 
                                
                            }
                        
                        }          
                    }
            }
        } catch (err) {
            return {
            address: ""        
            };
        }
      }
      async function addToken(){
        try{
          if (window.ethereum) {
            var web3Window = new Web3(window.ethereum);
            const chainIDBuffer = await web3Window.eth.net.getId(); 
            if(chainIDBuffer == 80001){
                var SportTokenAddress;
                var SportTokenSymbol;
                if(id == 1){
                    SportTokenAddress = '0x8B65efE0E27D090F6E46E0dFE93E73d3574E5d99';
                    SportTokenSymbol = 'SPORT';
                }
                else{
                    SportTokenAddress = '0x6637926e5c038c7ae3d3fd2c2d77c44e8be1ed28';
                    SportTokenSymbol = 'ESG';
                }
              
              const SportTokenDecimals = 9;
              const tokenImage = '';          
              const wasAdded = await window.ethereum.request({
                method: 'wallet_watchAsset',
                params: {
                  type: 'ERC20', // Initially only supports ERC20, but eventually more!
                  options: {
                    address: SportTokenAddress, // The address that the token is at.
                    symbol: SportTokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
                    decimals: SportTokenDecimals, // The number of decimals in the token
                    image: tokenImage, // A string url of the token logo
                  },
                },
              });  
                     
            }
            else{  
              window.alert("Wrong Network");
            }
          } 
          else{
            const prov = new WalletConnectProvider({
                rpc: {
                  80001: "https://matic-mumbai.chainstacklabs.com",
                },
                chainId: 80001,
              });
            const addressMobile = await prov.enable();
           var web3Window = new Web3(prov);
            const chainIDBuffer = await web3Window.eth.net.getId(); 
            if(chainIDBuffer == 80001){
                var SportTokenAddress;
                var SportTokenSymbol;
                if(id == 1){
                    SportTokenAddress = '0x8B65efE0E27D090F6E46E0dFE93E73d3574E5d99';
                    SportTokenSymbol = 'SPORT';
                }
                else{
                    SportTokenAddress = '0x6637926e5c038c7ae3d3fd2c2d77c44e8be1ed28';
                    SportTokenSymbol = 'ESG';
                }
              const SportTokenDecimals = 9;
              const tokenImage = '';          
              const wasAdded = await prov.request({
                method: 'wallet_watchAsset',
                params: {
                  type: 'ERC20', // Initially only supports ERC20, but eventually more!
                  options: {
                    address: SportTokenAddress, // The address that the token is at.
                    symbol: SportTokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
                    decimals: SportTokenDecimals, // The number of decimals in the token
                    image: tokenImage, // A string url of the token logo
                  },
                },
              });     
            }
            else{  
              window.alert("Wrong Network");
            }        
    
          } 
        }
        catch{
          return;
        }
      }
    return (
        <>
            <div className={`${style.token_buy} d-flex text-start`}>
                <div className={`${style.sub_container} ${style.bg_dark_green}`}>
                    <p className={style.color_light_green}>{data.title}</p>
                    <h3 className={`${style.color_white} mt-4`}>{Number(customTokenBalance)}</h3>
                    <div className={`h6 ${style.color_blue} mt-3`}>$ {(Number(customTokenBalance)*Number(data.totalPrice)).toString().substring(0,10)}</div>
                    <Button
                        variant="outline-primary"
                        className={`${style.color_blue} ${style.btn_outline_primary} rounded-pill w-100 mt-4`}
                        onClick={() => {setPresaleModalShow(true);/*init();*/}}
                    >
                        {data.btnTitle}
                    </Button>
                    <Button
                        variant="outline-primary"
                        className={`${style.color_blue} ${style.btn_outline_primary} rounded-pill w-100 mt-4`}
                        onClick={() => {addToken();/*init();*/}}
                    >
                        {id == 1 ? "ADD SPORT ADDRESS" : "ADD ESG ADDRESS"}
                    </Button>
                </div>
                <div className="m-4 text-start">
                    <p className={style.color_light_green}>{data.priceTitle}</p>
                    <div className={`h2 ${style.color_blue}`}>${data.totalPrice.substring(0,12)}</div>
                </div>

            </div>
            <Presale hideModel = {hideModel} getChangeVal={getChangeVal} balance = {balance} walletAddress = {address} sportPricePerETH = {sportPricePerETH} show={presaleModalShow} onHide={() => setPresaleModalShow(false)} id = {id}/>
        </>
    )
}

export default TokenBuy;