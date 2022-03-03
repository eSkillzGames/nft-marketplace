import React, { createContext, useEffect , useState} from "react";
// import Slider from "r-range-slider";
import CustomSlider from '../CustomSlider';
import { RiRefreshLine } from "react-icons/ri";
import style from "../../pages/token/style.module.scss";
const Web3 = require("web3");
const distributeAddress = "0x93ed733aE86FB5DecCBB3E2660bfCEcf1788FC73";
import distributeeABI from '../../Distribute.json';
const Calculator = ({price}) => {
    const [value, setValue] = useState(1);
    const [amount, setAmount] = useState(416);
    const [lastAmount, setLastAmount] = useState(0);
    const [earning, setEarning] = useState(Number(price)*amount);
    const [sliderVal,setSliderVal] = useState(1);
    const getSliderVal = (val) => {
        setSliderVal(val);
    }
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
                    
                        var distributeContract = new web3.eth.Contract(distributeeABI,distributeAddress);
                        distributeContract.methods.getYesterdayYield(addressArray[0]).call(function (err, res) {
                            setLastAmount(res/10**9);
                            setAmount(res/10**9);
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
    return (
        <div className={style.calculator}>
            <div className={`d-flex justify-content-between ${style.color_middle_green}`}>
                <p className={`${style.subtitle} d-flex align-items-center`}><img src="/images/Plus.png" alt="Plus" className="me-2" />CALCULATOR</p>
                <p className={style.subtitle}>LAST YIELD AMOUNT {lastAmount== "" ? 0 : lastAmount} SPORT</p>
            </div>
            <CustomSlider getSliderVal={getSliderVal}/>
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
            <div className={`d-flex justify-content-between mt-4 ${style.color_light_green}`}>
                <h6>1 DAY</h6>
                <h6>366 DAYS</h6>
            </div>
            <div className="row row-cols-2 mt-4">
                <div className="col">
                    <div className={`ms-5 text-start ${style.color_middle_green} ${style.subtitle}`}>SPORT amount</div>
                    <div className="d-flex position-relative align-items-center">
                        <input type="text" className={`${style.form_control} ${style.bg_dark_green} w-100`} value={amount} onChange={(e) =>
                             setAmount(event.target.value.toString().length ==2 && event.target.value.toString()[0]=="0" && Number(event.target.value.toString()[1]) >=0 ? (event.target.value.toString()[1]):(Number(event.target.value) >= 0 ? (event.target.value) : ("")))
                             
                        } />
                        <div className={`${style.refresh} position-absolute`} onClick={() => setAmount(lastAmount)}>
                            <RiRefreshLine color={" #0096B5"} size={20} />
                        </div>
                    </div>
                </div>
                <div className="col">
                    <div className={`ms-5 text-start ${style.color_middle_green} ${style.subtitle}`}>$ Earnings</div>
                    <input type="text" className={`${style.form_control} ${style.bg_dark_green} w-100`} value={"$ "+String(Number(price)*Number(sliderVal)*Number(amount)).substring(0,8)} readOnly/>
                </div>
            </div>
        </div>
    )
}

export default Calculator;