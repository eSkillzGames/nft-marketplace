import React, { useContext, useState } from 'react';
import { Button } from "react-bootstrap";
import Presale from "../../Modal/Presale";
import { ethers } from 'ethers';
import style from "../../pages/token/style.module.scss";
import tokenPriceABI from '../../GetTokenPrice.json';
const sportTokenAddress = "0x297A580ccF736D5535401B9C8159F6F3e663949F";
//const esgTokenAddress = "0x8C534C9aa8d6cDB75d139caF5aD9716Db25eB628";
const esgTokenAddress = "0x630C101AD79971AAC25Aed0A3bE9bcf9bD49fA08";
const tokenPriceAddress = "0x9D46b2D90b8a1a4b69A35e935703f8860b210823";
const Web3 = require("web3");
const TokenBuy = ({ data ,id,address}) => {
    const [presaleModalShow, setPresaleModalShow] = useState(false);
    const [sportPricePerETH, setSportPricePerETH] = useState("");
    const [balance, setBalance] = useState("");
    async function init() {
        
        try {
            if (window.ethereum) {
               
                const addressArray = await window.ethereum.request({
                method: "eth_accounts",
                });
                var web3Window = new Web3(window.ethereum);
                const chainIDBuffer = await web3Window.eth.net.getId();
                
                if(addressArray.length > 0 && address!=""){
                    
                    if(chainIDBuffer == 3){
                      
                        const provider = new ethers.providers.Web3Provider(ethereum);
                        
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
        } catch (err) {
            return {
            address: ""        
            };
        }
      }
    return (
        <>
            <div className={`${style.token_buy} d-flex text-start`}>
                <div className={`${style.sub_container} ${style.bg_dark_green}`}>
                    <p className={style.color_light_green}>{data.title}</p>
                    <h3 className={`${style.color_white} mt-4`}>{data.balance}</h3>
                    <div className={`h6 ${style.color_blue} mt-3`}>$ {Number(data.balance)*Number(data.totalPrice.substring(0,8))}</div>
                    <Button
                        variant="outline-primary"
                        className={`${style.color_blue} ${style.btn_outline_primary} rounded-pill w-100 mt-4`}
                        onClick={() => {setPresaleModalShow(true);init();}}
                    >
                        {data.btnTitle}
                    </Button>
                </div>
                <div className="m-4 text-start">
                    <p className={style.color_light_green}>{data.priceTitle}</p>
                    <div className={`h2 ${style.color_blue}`}>${data.totalPrice.substring(0,8)}</div>
                </div>

            </div>
            <Presale walletAddress = {address} sportPricePerETH = {sportPricePerETH} show={presaleModalShow} onHide={() => setPresaleModalShow(false)} id = {id}/>
        </>
    )
}

export default TokenBuy;