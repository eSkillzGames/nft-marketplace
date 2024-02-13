import React, { useContext, useState, useEffect } from "react";
import style from "../../pages/token/style.module.scss";
import distributeeABI from "../../Distribute.json";
import { ethers } from "ethers";
import { useDispatch, useSelector } from "react-redux";
import { fuseActions } from "../../store/actions";
import tokenPriceABI from "../../GetTokenPrice.json";
const distributeAddress = "0x025F0aeEE1D58Af5f51f8EAA27779Bf484eF5012";
const sportTokenAddress = "0x2caFAb766a586a09659a09E92e9f4005DF827512";
const tokenPriceAddress = "0x6b186a04C801A3D717621b0B19D018375161bFF8";
const providerR = new ethers.providers.JsonRpcProvider("https://rpc-mumbai.maticvigil.com");
// const providerW = new ethers.providers.JsonRpcProvider("https://polygon-mumbai.infura.io/v3/" + process.env.REACT_APP_INFURAID);
const tokenPriceContract = new ethers.Contract(tokenPriceAddress, tokenPriceABI, providerR); 
const distributeContract = new ethers.Contract(distributeAddress, distributeeABI, providerR);
const TotalEarned = ({ }) => {
  const [amount, setAmount] = useState(0);
  const { balance } = useSelector(({ homeReducer }) => homeReducer.home);
  const { uid, address } = useSelector(({ authReducer }) => authReducer.auth);
  const [sportPrice, setSportPrice] = useState(0);
  const dispatch = useDispatch();
  useEffect(() => {
    if(balance.SportBal !=null){

      init();
    }
  }, [balance]);
  async function init() {
    try {
      let sportPricebuf = await tokenPriceContract.getPrice(sportTokenAddress);
      setSportPrice(toFixed((sportPricebuf[0] * sportPricebuf[2]) / sportPricebuf[1] / 10 ** 6));
            
      var ret_bal =  await distributeContract.distributedAmounts(address);
      setAmount(ret_bal / 10 ** 9);           
      
    } catch (err) {
      return;
    }
  }
  function toFixed(x) {
    if (Math.abs(x) < 1.0) {
      var e = parseInt(x.toString().split("e-")[1]);
      if (e) {
        x *= Math.pow(10, e - 1);
        x = "0." + new Array(e).join("0") + x.toString().substring(2);
      }
    } else {
      var e = parseInt(x.toString().split("+")[1]);
      if (e > 20) {
        e -= 20;
        x /= Math.pow(10, e);
        x += new Array(e + 1).join("0");
      }
    }
    return x;
  }
  const copy = async () => {
    await navigator.clipboard.writeText(address);
    dispatch(
      fuseActions.showMessage({
        message: "Walllet Address Copied.",
        variant: "error",
        timer:3000
      })
    );
  };
  return (
    <div className={`${style.total_earned} text-start`}>
      <p>Total Earned</p>
      <h3 className={`${style.color_white} mt-5`}>
        {amount}
        <span className={`h6 ${style.color_blue}`}>
          {" "}
          {" (  $ " + String(Number(amount) * Number(sportPrice)) + " )"}
        </span>
      </h3>
      <div className="d-flex mt-5 mb-1">
        <p className={style.color_middle_green}>{address}</p>
        <div className="ms-2" style={{ cursor: "pointer" }}>
          <img
            src="/images/Copy.png"
            alt="copy"
            onClick={() => {
              copy();
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default TotalEarned;
