import React, { useContext, useState } from 'react';
import { Button } from "react-bootstrap";
import Presale from "../../Modal/Presale";
import style from "../../pages/token/style.module.scss";

const TokenBuy = ({ data ,id,address}) => {
    const [presaleModalShow, setPresaleModalShow] = useState(false);
    const [balance, setBalance] = useState("");
    return (
        <>
            <div className={`${style.token_buy} d-flex text-start`}>
                <div className={`${style.sub_container} ${style.bg_dark_green}`}>
                    <p className={style.color_light_green}>{data.title}</p>
                    <h3 className={`${style.color_white} mt-4`}>{data.balance}</h3>
                    <div className={`h6 ${style.color_blue} mt-3`}>$ {data.totalPrice}</div>
                    <Button
                        variant="outline-primary"
                        className={`${style.color_blue} ${style.btn_outline_primary} rounded-pill w-100 mt-4`}
                        onClick={() => setPresaleModalShow(true)}
                    >
                        {data.btnTitle}
                    </Button>
                </div>
                <div className="m-4 text-start">
                    <p className={style.color_light_green}>{data.priceTitle}</p>
                    <div className={`h2 ${style.color_blue}`}>$ {data.price}</div>
                </div>

            </div>
            <Presale walletAddress = {address} show={presaleModalShow} onHide={() => setPresaleModalShow(false)} id = {id}/>
        </>
    )
}

export default TokenBuy;