import React, { createContext, useEffect , useState} from "react";
import Header from '../../components/Header';
import TotalEarned from '../../components/TotalEarned';
import Calculator from '../../components/Calculator';
import TokenBuy from '../../components/TokenBuy';
import style from "./style.module.scss";
import { useRouter } from 'next/router';
const Web3 = require("web3");
const sportTokenAddress = "0xd371c8BcE5e4BeCC2c66E7003CD46f6558105C35";
const esgTokenAddress = "0x8C534C9aa8d6cDB75d139caF5aD9716Db25eB628";
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
    const [address, setAdress] = useState(null);
    useEffect(() => {        
        init();        
      }, []);

      async function init() {
        if (window.ethereum) {
            try {
              const addressArray = await window.ethereum.request({
                method: "eth_accounts",
              });
              var web3 = new Web3(window.ethereum);
              const chainIDBuffer = await web3.eth.net.getId();
              if(addressArray.length > 0){
                if(chainIDBuffer == 3){
                 
                    var sportContract = new web3.eth.Contract(minABI, sportTokenAddress);
                    var esgContract = new web3.eth.Contract(minABI, esgTokenAddress);
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
              
            } catch (err) {
              return {
                address: ""        
              };
            }
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
                    <div className="col" ><TotalEarned address = {address} price = {initialData[1].totalPrice}/></div>
                    <div className="col" ><Calculator price = {initialData[1].totalPrice}/></div>
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