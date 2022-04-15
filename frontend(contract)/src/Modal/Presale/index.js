import React, { createContext, useContext } from "react";
import { Modal, Button } from "react-bootstrap";
// import "../../pages/token/style.module.scss";
import style from "./style.module.scss";
import { ethers } from 'ethers';
import { useRouter } from 'next/router';
import { useEffect, useState } from "react";
import WalletConnectProvider from "@walletconnect/web3-provider";
const UniswapABI = require('../../Uniswap.json');
import tokenPriceABI from '../../GetTokenPrice.json';
const UniswapAddress = "0x8954AfA98594b838bda56FE4C12a09D7739D179b";
const tokenPriceAddress = "0x6b186a04C801A3D717621b0B19D018375161bFF8";
const sportTokenAddress = "0x6D586a553563C84222bE782F13de3d720a30Cdc0";
const esgTokenAddress = "0xc44B158B2D55783e38F0Cf701657658D61b0C970";
const Web3 = require("web3");


const Presale = (props) => {
    const { balance, show, onHide ,id, walletAddress,sportPricePerETH, getChangeVal, hideModel} = props;
    
    const [address, setAdress] = useState("");
    const [ethAmount, setEthAmount] = React.useState("");
    const [sportAmount, setSportAmount] = React.useState("0");    
    const router = useRouter();
    
    const buy = async () => {  
        try{
           // const { ethereum } = window;
            if(window.ethereum){
                if(walletAddress!=""){            
                    if (parseFloat(ethAmount) > 0) {
                        const chainIDBuffer = await window.ethereum.networkVersion;
                        if(chainIDBuffer == 80001){
                            const provider = new ethers.providers.Web3Provider(window.ethereum);
                            const signer = provider.getSigner();
                            var PresaleContract = new ethers.Contract(UniswapAddress, UniswapABI, signer); 
                            let dateInAWeek = new Date();
                            const deadline = Math.floor(dateInAWeek.getTime() / 1000)+1000000;
                            try {
                                hideModel();
                                if (id == 1){

                                    let nftTxn = await PresaleContract.swapExactETHForTokensSupportingFeeOnTransferTokens(0, ["0x9c3c9283d3e44854697cd22d3faa240cfb032889" ,"0x6D586a553563C84222bE782F13de3d720a30Cdc0"], walletAddress,deadline,
                                    {
                                        value: ethers.utils.parseUnits((Number(ethAmount)).toString(), 'ether')._hex,
                                    }       
                                    ); 
                                    await nftTxn.wait();
                                    getChangeVal(1);
                                    // window.alert("You recieved "+sportAmount + "SPORT");
                                }
                                else{
                                    let nftTxn = await PresaleContract.swapExactETHForTokensSupportingFeeOnTransferTokens(0, ["0x9c3c9283d3e44854697cd22d3faa240cfb032889","0xc44B158B2D55783e38F0Cf701657658D61b0C970"], walletAddress,deadline,
                                    {
                                        value: ethers.utils.parseUnits((Number(ethAmount)).toString(), 'ether')._hex,
                                    }        
                                    ); 
                                    await nftTxn.wait(); 
                                    getChangeVal(2);
                                    // window.alert("You recieved "+sportAmount + "ESG");                               
                                }                                  
                                
                                setSportAmount("0");
                                setEthAmount("");   
                                //router.reload();                                             
                            } catch (err) {  
                                console.log(err)        
                                //window.alert("Buy of the Token failed");
                            }            
                        }   
                    }
                    else{
                        window.alert("MATIC Amount must not be Zero.");
                    }
                }
                else{
                    window.alert("Connect to the MetaMask");
                }      
            }
            else{
                const prov = new WalletConnectProvider({
                    infuraId: "acc8266b5baf41c5ad44a05fe4a49925",
                    qrcodeModalOptions: {
                      mobileLinks: ["metamask"],
                    },
                  });
                  const addressMobile = await prov.enable();
                if(walletAddress!=""){            
                    if (parseFloat(ethAmount) > 0) {
                        var web3Window = new Web3(prov);
                        const chainIDBuffer = await web3Window.eth.net.getId(); 
                        if(chainIDBuffer == 80001){
                            const provider = new ethers.providers.Web3Provider(prov);
                            const signer = provider.getSigner();
                            var PresaleContract = new ethers.Contract(UniswapAddress, UniswapABI, signer); 
                            let dateInAWeek = new Date();
                            const deadline = Math.floor(dateInAWeek.getTime() / 1000)+1000000;
                            
                            try {
                                hideModel();
                                if (id == 1){
                                    let nftTxn = await PresaleContract.swapExactETHForTokensSupportingFeeOnTransferTokens(0, ["0x9c3c9283d3e44854697cd22d3faa240cfb032889","0x6D586a553563C84222bE782F13de3d720a30Cdc0"], walletAddress,deadline,
                                    {
                                        value: ethers.utils.parseUnits((Number(ethAmount)).toString(), 'ether')._hex,
                                    }        
                                    ); 
                                    await nftTxn.wait();
                                    getChangeVal(1);
                                    // window.alert("You recieved "+sportAmount + "SPORT");
                                }
                                else{
                                    let nftTxn = await PresaleContract.swapExactETHForTokensSupportingFeeOnTransferTokens(0, ["0x9c3c9283d3e44854697cd22d3faa240cfb032889","0xc44B158B2D55783e38F0Cf701657658D61b0C970"], walletAddress,deadline,
                                    {
                                        value: ethers.utils.parseUnits((Number(ethAmount)).toString(), 'ether')._hex,
                                    }        
                                    ); 
                                    await nftTxn.wait(); 
                                    getChangeVal(2);
                                    // window.alert("You recieved "+sportAmount + "ESG");                               
                                }                                  
                                
                                setSportAmount("0");
                                setEthAmount("");   
                                //router.reload();                                             
                            } catch (err) {          
                                //window.alert("Buy of the Token failed");
                            }                                      
                        }   
                    }
                    else{
                        window.alert("MATIC Amount must not be Zero.");
                    }
                }
                else{
                    window.alert("Connect to the MetaMask");
                } 
                //window.alert("Install MetaMask.");
            }  
        }
        catch{
            return;
        }
          
    }

    const calcEarnVal = async (val) => {  
        
        try {
            if (window.ethereum) {
               
                const addressArray = await window.ethereum.request({
                method: "eth_accounts",
                });
                var web3Window = new Web3(window.ethereum);
                const chainIDBuffer = await web3Window.eth.net.getId();
                
                if(addressArray.length > 0 && walletAddress!=""){
                    
                    if(chainIDBuffer == 80001){                       
                        
                        var tokenPriceContract = new web3Window.eth.Contract(tokenPriceABI,tokenPriceAddress);
                        
                        if(id == 1){
                            
                            if(val !=0){
                                tokenPriceContract.methods.getETHPriceUsingAmount(sportTokenAddress, (val*10**18).toString()).call(function (err, res) {
                                    setSportAmount(String(res/(10**9)));
                                    
                                });
                            }
                            else{
                                setSportAmount(0);
                            }
                            
                            
                        }
                        else{
                            if(val !=0){
                                tokenPriceContract.methods.getETHPriceUsingAmount(esgTokenAddress, (val*10**18).toString()).call(function (err, res) {
                                    setSportAmount(String(res/(10**9)));
                                    
                                });
                            }
                            else{
                                setSportAmount(0);
                            }
                            
                        }
                    
                    }          
                }         
            
            } 
            else{
                const prov = new WalletConnectProvider({
                    infuraId: "acc8266b5baf41c5ad44a05fe4a49925",
                    qrcodeModalOptions: {
                      mobileLinks: ["metamask"],
                    },
                  });
                  const addressMobile = await prov.enable();
                  var web3Window = new Web3(prov);
                  const chainIDBuffer = await web3Window.eth.net.getId();                
                   
                    
                    if(addressMobile.length > 0 && walletAddress!=""){
                        
                        if(chainIDBuffer == 80001){                       
                            
                            var tokenPriceContract = new web3Window.eth.Contract(tokenPriceABI,tokenPriceAddress);
                            
                            if(id == 1){
                                
                                if(val !=0){
                                    tokenPriceContract.methods.getETHPriceUsingAmount(sportTokenAddress, (val*10**18).toString()).call(function (err, res) {
                                        setSportAmount(String(res/(10**9)));
                                        
                                    });
                                }
                                else{
                                    setSportAmount(0);
                                }
                                
                                
                            }
                            else{
                                if(val !=0){
                                    tokenPriceContract.methods.getETHPriceUsingAmount(esgTokenAddress, (val*10**18).toString()).call(function (err, res) {
                                        setSportAmount(String(res/(10**9)));
                                        
                                    });
                                }
                                else{
                                    setSportAmount(0);
                                }
                                
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
                        <h6 className={`${style.color_light_green} ms-3`}>Amount of MATIC being spent</h6>
                        <input type="text" 
                            className={`${style.form_control} ${style.bg_dark_green}`} 
                            placeholder="0" variant="filled" value = {ethAmount} aria-label="" aria-describedby="basic-addon1" 
                            onChange={(event) => {
                                setEthAmount(Number(event.target.value) >=0 && Number(event.target.value) <= Number(balance) ? (event.target.value.toString().length ==2 && event.target.value.toString()[0]=="0" && Number(event.target.value.toString()[1]) >=0 ? (event.target.value.toString()[1]):(Number(event.target.value) >= 0 ? (event.target.value) : (""))):0)
                                
                                calcEarnVal(Number(event.target.value) >=0 && Number(event.target.value) <= Number(balance) ? (event.target.value.toString().length ==2 && event.target.value.toString()[0]=="0" && Number(event.target.value.toString()[1]) >=0 ? (event.target.value.toString()[1]):(Number(event.target.value) >= 0 ? (event.target.value) : (""))):0);
                            }}    
                        />                        
                        <h6 className={`${style.color_light_green} ms-3 mt-5`}>Tokens to be purchaged</h6>
                        <h2 className={`${style.color_blue}`}><span className="opacity-25">+</span> {sportAmount}</h2>
                        <Button
                            variant="outline-primary"
                            className={`${style.color_blue} ${style.btn_outline_primary} rounded-pill w-100 mt-4`}
                            onClick = {() =>{buy()}}
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
