import React, { createContext, useEffect , useState} from "react";
import Header from '../../components/Header';
import TotalEarned from '../../components/TotalEarned';
import Calculator from '../../components/Calculator';
import PresaleBuy from '../../components/PresaleBuy';
import style from "../token/style.module.scss";
import { useRouter } from 'next/router';
import tokenPriceABI from '../../GetTokenPrice.json';
import WalletConnectProvider from "@walletconnect/web3-provider";
const Web3 = require("web3");
const sportTokenAddress = "0x8B65efE0E27D090F6E46E0dFE93E73d3574E5d99";
//const esgTokenAddress = "0x8C534C9aa8d6cDB75d139caF5aD9716Db25eB628";
const esgTokenAddress = "0x6637926e5c038c7ae3d3fd2c2d77c44e8be1ed28";
const tokenPriceAddress = "0x6b186a04C801A3D717621b0B19D018375161bFF8";
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
    price: "0.00",
    ethPrice : "0.00"
}, {
    title: "Your SPORT",
    balance: "0.00",
    totalPrice: "0.00",
    btnTitle: "BUY SPORT",
    priceTitle: "SPORT PRICE",
    price: "0.00",
    ethPrice : "0.00"
}]
const Presale = () => {
    const [sportBalance, setSportBalance] = useState("");
    const [esgBalance, setEsgBalance] = useState("");
    const [esgPrice, setEsgPrice] = useState("");
    const [sportPrice, setSportPrice] = useState("");
    const [ethSportPrice, setEthSportPrice] = useState("");
    const [ethEsgPrice, setEthEsgPrice] = useState("");
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
                    if(chainIDBuffer == 80001){
                        
                        var sportContract = new web3.eth.Contract(minABI, sportTokenAddress);
                        var esgContract = new web3.eth.Contract(minABI, esgTokenAddress);
                        var tokenPriceContract = new web3.eth.Contract(tokenPriceABI,tokenPriceAddress);
                        tokenPriceContract.methods.getPrice(sportTokenAddress).call(function (err, res) {
                            initialData[1].totalPrice = toFixed(res[0] * res[2] / res[1]/10**6);
                            
                            //console.log(initialData[1].ethPrice);
                            setSportPrice(toFixed(res[0] * res[2] / res[1]/10**6));
                        });
                        tokenPriceContract.methods.getETHPrice(sportTokenAddress).call(function (err, res) {
                            
                            initialData[1].ethPrice = String(res/(10**9));
                            setEthSportPrice(String(res/(10**9)));
                            //console.log(initialData[1].ethPrice);
                            
                        });
                        tokenPriceContract.methods.getPrice(esgTokenAddress).call(function (err, res) {
                            initialData[0].totalPrice = toFixed(res[0] * res[2] / res[1]/10**6);
                            //initialData[0].ethPrice = String(10**18/res[0]);
                            //console.log(initialData[1].ethPrice);
                            setEsgPrice(toFixed(res[0] * res[2] / res[1]/10**6));
                        });
                        tokenPriceContract.methods.getETHPrice(esgTokenAddress).call(function (err, res) {
                            
                            initialData[0].ethPrice = String(res/(10**9));
                            setEthEsgPrice(String(res/(10**9)));
                            //console.log(initialData[1].ethPrice);
                            
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
                if(addressMobile.length > 0){
                    if(chainIDBuffer == 80001){
                        
                        var sportContract = new web3.eth.Contract(minABI, sportTokenAddress);
                        var esgContract = new web3.eth.Contract(minABI, esgTokenAddress);
                        var tokenPriceContract = new web3.eth.Contract(tokenPriceABI,tokenPriceAddress);
                        tokenPriceContract.methods.getPrice(sportTokenAddress).call(function (err, res) {
                            initialData[1].totalPrice = toFixed(res[0] * res[2] / res[1]/10**6);
                            
                            //console.log(initialData[1].ethPrice);
                            setSportPrice(toFixed(res[0] * res[2] / res[1]/10**6));
                        });
                        tokenPriceContract.methods.getETHPrice(sportTokenAddress).call(function (err, res) {
                            
                            initialData[1].ethPrice = String(res/(10**9));
                            setEthSportPrice(String(res/(10**9)));
                            //console.log(initialData[1].ethPrice);
                            
                        });
                        tokenPriceContract.methods.getPrice(esgTokenAddress).call(function (err, res) {
                            initialData[0].totalPrice = toFixed(res[0] * res[2] / res[1]/10**6);
                            //initialData[0].ethPrice = String(10**18/res[0]);
                            //console.log(initialData[1].ethPrice);
                            setEsgPrice(toFixed(res[0] * res[2] / res[1]/10**6));
                        });
                        tokenPriceContract.methods.getETHPrice(esgTokenAddress).call(function (err, res) {
                            
                            initialData[0].ethPrice = String(res/(10**9));
                            setEthEsgPrice(String(res/(10**9)));
                            //console.log(initialData[1].ethPrice);
                            
                        });
                        sportContract.methods.balanceOf(addressMobile[0]).call(function (err, res) {
                        if(res.length>7){
                            initialData[1].balance = String(parseInt(String(res).substring(0,res.length-7))/100);
                            setSportBalance(String(parseInt(String(res).substring(0,res.length-7))/100));
                        }
                        else{
                            setSportBalance("0.00");
                        }              
                        });
                        esgContract.methods.balanceOf(addressMobile[0]).call(function (err, res) {
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
    function toFixed(x) {
        if (Math.abs(x) < 1.0) {
          var e = parseInt(x.toString().split('e-')[1]);
          if (e) {
              x *= Math.pow(10,e-1);
              x = '0.' + (new Array(e)).join('0') + x.toString().substring(2);
          }
        } else {
          var e = parseInt(x.toString().split('+')[1]);
          if (e > 20) {
              e -= 20;
              x /= Math.pow(10,e);
              x += (new Array(e+1)).join('0');
          }
        }
        return x;
      }
    const getAddress = (val) => {
        setAdress(val)
    }    
    return (
        <div className={style.token}>
            <Header getAddress={getAddress}/>
            <div className={`w-100 ${style.content}`}>
                
                <div className={`row row-cols-md-2 row-cols-sm-1 ${style.second_container}`}>
                    {
                        (Number(esgBalance) >= 0 || Number(sportBalance) >= 0 )&& initialData.map((e, i) =>
                            
                            <div className={`col ${style.token_buy_container}`} key={i}><PresaleBuy address = {address} data={e} id = {i} /></div>
                            
                        )
                    }
                </div>
                {/* <div className={style.calc_container}>
                    <Calculator />
                </div> */}
            </div>
        </div>
    )
}

export default Presale;