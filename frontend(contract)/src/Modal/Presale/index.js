import React, { createContext, useContext } from "react";
import { Modal, Button } from "react-bootstrap";
// import "../../pages/token/style.module.scss";
import style from "./style.module.scss";
import { ethers } from 'ethers';
import { useRouter } from 'next/router';
import { useEffect, useState } from "react";

const PresaleSportContractABI = require('../../PresaleSport.json');
const PresaleSportContractAddress = "0xB2C01519D42fEb1D77D4436ac84D316C9027b2A9";
const PresaleContractABI = require('../../Presale.json');
const UniswapABI = require('../../Uniswap.json');
import tokenPriceABI from '../../GetTokenPrice.json';
const UniswapAddress = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
const PresaleContractAddress = "0x97BBF34109875FEe6dB01b055d64dFe7d32EA4C4";
const tokenPriceAddress = "0x9D46b2D90b8a1a4b69A35e935703f8860b210823";
const Web3 = require("web3");


const Presale = ({ show, onHide ,id, walletAddress,sportPricePerETH}) => {
    const [address, setAdress] = useState("");
    const [ethAmount, setEthAmount] = React.useState("");
    const [sportAmount, setSportAmount] = React.useState("0");    
    const router = useRouter();
    
    const buy = async () => {  
        try{
            const { ethereum } = window;
            if(ethereum){
                if(walletAddress!=""){            
                    if (parseFloat(ethAmount) > 0) {
                        const chainIDBuffer = await ethereum.networkVersion;
                        if(chainIDBuffer == 3){
                            const provider = new ethers.providers.Web3Provider(ethereum);
                            const signer = provider.getSigner();
                            var PresaleContract = new ethers.Contract(UniswapAddress, UniswapABI, signer); 
                            let dateInAWeek = new Date();
                            const deadline = Math.floor(dateInAWeek.getTime() / 1000);
                            
                            try {
                                if (id == 1){
                                    let nftTxn = await PresaleContract.swapExactETHForTokensSupportingFeeOnTransferTokens(0, ["0xc778417e063141139fce010982780140aa0cd5ab","0x297A580ccF736D5535401B9C8159F6F3e663949F"], walletAddress,deadline+1000,
                                    {
                                        value: ethers.utils.parseUnits(ethAmount.toString(), 'ether')._hex,
                                    }        
                                    ); 
                                    await nftTxn.wait();
                                    window.alert("You recieved "+sportAmount + "SPORT");
                                }
                                else{
                                    let nftTxn = await PresaleContract.swapExactETHForTokensSupportingFeeOnTransferTokens(0, ["0xc778417e063141139fce010982780140aa0cd5ab","0x630C101AD79971AAC25Aed0A3bE9bcf9bD49fA08"], walletAddress,deadline+1000,
                                    {
                                        value: ethers.utils.parseUnits(ethAmount.toString(), 'ether')._hex,
                                    }        
                                    ); 
                                    await nftTxn.wait();     
                                    window.alert("You recieved "+sportAmount + "ESG");                               
                                }                                  
                                
                                setSportAmount("0");
                                setEthAmount("");   
                                //router.reload();                                             
                            } catch (err) {          
                                window.alert("Buy of the Token failed");
                            }            
                        }   
                    }
                    else{
                        window.alert("ETH Amount must not be Zero.");
                    }
                }
                else{
                    window.alert("Connect to the MetaMask");
                }      
            }
            else{
                
                window.alert("Install MetaMask.");
            }  
        }
        catch{
            return;
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
                        <h6 className={`${style.color_light_green} ms-3`}>Amount of ETH being spent</h6>
                        <input type="text" 
                            className={`${style.form_control} ${style.bg_dark_green}`} 
                            placeholder="0" variant="filled" value = {ethAmount} aria-label="" aria-describedby="basic-addon1" 
                            onChange={(event) => {
                                setEthAmount(event.target.value.toString().length ==2 && event.target.value.toString()[0]=="0" && Number(event.target.value.toString()[1]) >=0 ? (event.target.value.toString()[1]):(Number(event.target.value) >= 0 ? (event.target.value) : ("")))
                                setSportAmount(Number(event.target.value) >= 0 ? (sportPricePerETH*event.target.value) : ("0"));
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
                    <div className="m-5 text-start">
                        <p className={style.color_light_green}>Wallet Address</p>
                        <p className={style.color_middle_green}>{address.length> 0 ? (String(address).substring(0, 8) + "..." + String(address).substring(36)) : ("")}</p>
                        <p className={`${style.color_light_green} mt-4`}>Amount of ETH</p>
                        <p className={style.color_middle_green}>1×{sportPricePerETH}</p>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );
};
export default Presale;
