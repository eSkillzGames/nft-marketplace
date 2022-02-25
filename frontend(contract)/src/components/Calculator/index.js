import React, { useState } from "react";
// import Slider from "r-range-slider";
import CustomSlider from '../CustomSlider';
import { RiRefreshLine } from "react-icons/ri";
import style from "../../pages/token/style.module.scss";
const Calculator = ({price}) => {
    const [value, setValue] = useState(1);
    const [amount, setAmount] = useState(416);
    const [earning, setEarning] = useState(Number(price)*amount);
    const [sliderVal,setSliderVal] = useState(1);
    const getSliderVal = (val) => {
        setSliderVal(val);
    } 
    return (
        <div className={style.calculator}>
            <div className={`d-flex justify-content-between ${style.color_middle_green}`}>
                <p className={`${style.subtitle} d-flex align-items-center`}><img src="/images/Plus.png" alt="Plus" className="me-2" />CALCULATOR</p>
                <p className={style.subtitle}>LAST YIELD AMOUNT {amount== "" ? 0 : amount} SPORT</p>
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
                        <div className={`${style.refresh} position-absolute`} onClick={() => setAmount(416)}>
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