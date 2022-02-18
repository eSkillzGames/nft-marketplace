import React from "react";
import style from "../../pages/token/style.module.scss";
const TotalEarned = ({address, price}) => {
    const copy = async () => {
        await navigator.clipboard.writeText(address);
        alert('Text copied');
      }
    return (
        <div className={`${style.total_earned} text-start`}>
            <p>Total Earned</p>
            <h3 className={`${style.color_white} mt-5`}>127,000.34 <span className={`h6 ${style.color_blue}`}>$ {price}</span></h3>
            <div className="d-flex mt-5 mb-1">
                <p className={style.color_middle_green}>{address}</p>
                <div className="ms-2" style={{cursor: "pointer"}}><img src="/images/Copy.png" alt="copy" onClick={() => {copy();}}/></div>
            </div>
        </div>
    );
}

export default TotalEarned;