import React, { createContext, useEffect, useState } from "react";
// import Slider from "r-range-slider";
import CustomSlider from "../CustomSlider";
import { RiRefreshLine } from "react-icons/ri";
import style from "../../pages/token/style.module.scss";
import distributeeABI from "../../Distribute.json";
import { ethers, providers } from "ethers";
import { useDispatch, useSelector } from "react-redux";
import tokenPriceABI from "../../GetTokenPrice.json";
const distributeAddress = "0x025F0aeEE1D58Af5f51f8EAA27779Bf484eF5012";
const sportTokenAddress = "0x2caFAb766a586a09659a09E92e9f4005DF827512";
const tokenPriceAddress = "0x6b186a04C801A3D717621b0B19D018375161bFF8";
const providerR = new ethers.providers.JsonRpcProvider("https://rpc-mumbai.maticvigil.com");
// const providerW = new ethers.providers.JsonRpcProvider("https://polygon-mumbai.infura.io/v3/" + process.env.REACT_APP_INFURAID);
const tokenPriceContract = new ethers.Contract(tokenPriceAddress, tokenPriceABI, providerR); 
const distributeContract = new ethers.Contract(distributeAddress, distributeeABI, providerR);
const Calculator = () => {
  const [amount, setAmount] = useState(0);
  const [lastAmount, setLastAmount] = useState(0);
  const [sliderVal, setSliderVal] = useState(1);
  const { balance } = useSelector(({ homeReducer }) => homeReducer.home);
  const { uid, address } = useSelector(({ authReducer }) => authReducer.auth);
  const [sportPrice, setSportPrice] = useState(0);
  const getSliderVal = (val) => {
    setSliderVal(val);
  };
  useEffect(() => {
    if(balance.SportBal !=null){

      init();
    }
  }, [balance]);
  async function init() {
    try {

      let sportPricebuf = await tokenPriceContract.getPrice(sportTokenAddress);
      setSportPrice(toFixed((sportPricebuf[0] * sportPricebuf[2]) / sportPricebuf[1] / 10 ** 6));
      var ret_bal =  await distributeContract.getYesterdayYield(address);
       
      setLastAmount(ret_bal / 10 ** 9);
      setAmount(ret_bal / 10 ** 9);
      
    } catch (err) {
      return {
        address: "",
      };
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
  return (
    <div className={style.calculator}>
      <div
        className={`d-flex justify-content-between ${style.color_middle_green}`}
      >
        <p className={`${style.subtitle} d-flex align-items-center`}>
          <img src="/images/Plus.png" alt="Plus" className="me-2" />
          CALCULATOR
        </p>
        <p className={style.subtitle}>
          LAST YIELD AMOUNT {lastAmount == "" ? 0 : lastAmount} SPORT
        </p>
      </div>
      <CustomSlider getSliderVal={getSliderVal} />
      {/* <Slider
                start={1}
                end={365}
                points={[value]}
                onChange={(points) => setValue(points[0])}
                showValue={true}
                attrs={{ className: 'my-slider' }}
                fillStyle={(index) => {
                    if (index === 0) {
                        return {
                            background: '#2DBFDF',
                            height: '4px'
                        }
                    } else if (index === 1) {
                        return {
                            background: '#4F6268'
                        }
                    }
                }}
            /> */}
      <div
        className={`d-flex justify-content-between mt-4 ${style.color_light_green}`}
      >
        <h6>1 DAY</h6>
        <h6>366 DAYS</h6>
      </div>
      <div className="row row-cols-2 mt-4">
        <div className="col">
          <div
            className={`ms-5 text-start ${style.color_middle_green} ${style.subtitle}`}
          >
            SKILL amount
          </div>
          <div className="d-flex position-relative align-items-center">
            <input
              type="text"
              className={`${style.form_control} ${style.bg_dark_green} w-100`}
              value={amount}
              onChange={(e) =>
                setAmount(
                  e.target.value.toString().length == 2 &&
                    e.target.value.toString()[0] == "0" &&
                    Number(e.target.value.toString()[1]) >= 0
                    ? e.target.value.toString()[1]
                    : Number(e.target.value) >= 0
                    ? e.target.value
                    : ""
                )
              }
            />
            <div
              className={`${style.refresh} position-absolute`}
              onClick={() => setAmount(lastAmount)}
            >
              <RiRefreshLine color={" #0096B5"} size={20} />
            </div>
          </div>
        </div>
        <div className="col">
          <div
            className={`ms-5 text-start ${style.color_middle_green} ${style.subtitle}`}
          >
            $ Earnings
          </div>
          <input
            type="text"
            className={`${style.form_control} ${style.bg_dark_green} w-100`}
            value={
              Number(sportPrice) * Number(sliderVal) * Number(amount) < 0.000001 ?
              "$ << 0.000001" :
              "$ " +
              String(
                Number(sportPrice) * Number(sliderVal) * Number(amount)
              ).substring(0, 8)
            }
            readOnly
          />
        </div>
      </div>
    </div>
  );
};

export default Calculator;
