import React, { createContext, useEffect , useState} from "react";
import Header from '../../components/Header';
import TotalEarned from '../../components/TotalEarned';
import Calculator from '../../components/Calculator';
import TokenBuy from '../../components/TokenBuy';
import style from "./style.module.scss";
import { useRouter } from 'next/router';
import tokenPriceABI from '../../GetTokenPrice.json';
const Web3 = require("web3");
const sportTokenAddress = "0x8603f5D95e463dAfcec01a03aAE8F93b199c7f65";
//const esgTokenAddress = "0x8C534C9aa8d6cDB75d139caF5aD9716Db25eB628";
const esgTokenAddress = "0x630C101AD79971AAC25Aed0A3bE9bcf9bD49fA08";
const tokenPriceAddress = "0xf48eD7f89f81973C48E0275002c23b82eDE795F3";
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

const initialData = [{
    title: "Your ESG",
    balance: "0.00",
    totalPrice: "0.00",
    btnTitle: "BUY ESG",
    priceTitle: "ESG PRICE",
    price: "0.00"
}, {
    title: "Your SPORT",
    balance: "0.00",
    totalPrice: "0.00",
    btnTitle: "BUY SPORT",
    priceTitle: "SPORT PRICE",
    price: "0.00"
}]
const Token = () => {
    const [sportBalance, setSportBalance] = useState("");
    const [esgBalance, setEsgBalance] = useState("");
    const [esgPrice, setEsgPrice] = useState("");
    const [sportPrice, setSportPrice] = useState("");
    const [address, setAdress] = useState(null);
    useEffect(() => {        
        init();        
      }, []);

      async function init() {
        try {
            if (window.ethereum) {
                
                const addressArray = await window.ethereum.request({
                    method: "eth_accounts",
                });
                var web3 = new Web3(window.ethereum);
                const chainIDBuffer = await web3.eth.net.getId();
                if(addressArray.length > 0){
                    if(chainIDBuffer == 3){
                    
                        var sportContract = new web3.eth.Contract(minABI, sportTokenAddress);
                        var esgContract = new web3.eth.Contract(minABI, esgTokenAddress);
                        var tokenPriceContract = new web3.eth.Contract(tokenPriceABI,tokenPriceAddress);
                        tokenPriceContract.methods.getPrice(sportTokenAddress).call(function (err, res) {
                            initialData[1].totalPrice = String(res[0] * res[2] / (res[1]*10**6));
                            setSportPrice(String(res[0] * res[2] / (res[1]*10**6)));
                        });
                        tokenPriceContract.methods.getPrice(esgTokenAddress).call(function (err, res) {
                            initialData[0].totalPrice = String(res[0] * res[2] / (res[1]*10**6));
                            setEsgPrice(String(res[0] * res[2] / (res[1]*10**6)));
                        });
                        sportContract.methods.balanceOf(addressArray[0]).call(function (err, res) {
                        if(res.length>7){
                            initialData[1].balance = String(parseInt(String(res).substring(0,res.length-7))/100);
                            setSportBalance(String(parseInt(String(res).substring(0,res.length-7))/100));
                        }
                        else{
                            setSportBalance("0.00");
                        }              
                        });
                        esgContract.methods.balanceOf(addressArray[0]).call(function (err, res) {
                        if(res.length>7){
                            initialData[0].balance = String(parseInt(String(res).substring(0,res.length-7))/100);
                            setEsgBalance(String(parseInt(String(res).substring(0,res.length-7))/100));
                        }
                        else{
                            setEsgBalance("0.00");
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
    const getAddress = (val) => {
        setAdress(val)
    }    
    return (
        <div className={style.token}>
            <Header getAddress={getAddress}/>
            <div className={`w-100 ${style.content}`}>
                <div className={`row row-cols-md-2 row-cols-sm-1 ${style.first_container}`}>
                    <div className="col" ><TotalEarned address = {address} price = {sportPrice}/></div>
                    <div className="col" ><Calculator price = {sportPrice}/></div>
                </div>
                <div className={`row row-cols-md-2 row-cols-sm-1 ${style.second_container}`}>
                    {
                        (Number(esgBalance) >= 0 || Number(sportBalance) >= 0 )&& initialData.map((e, i) =>
                            
                            <div className={`col ${style.token_buy_container}`} key={i}><TokenBuy address = {address} data={e} id = {i} /></div>
                            
                        )
                    }
                </div>
                <div className={style.calc_container}>
                    <Calculator />
                </div>
            </div>
        </div>
    )
}

export default Token;