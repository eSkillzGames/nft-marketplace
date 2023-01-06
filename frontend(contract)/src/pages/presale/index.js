import React, { createContext, useEffect, useState } from "react";
import Header from "../../components/Header";

import PresaleBuy from "../../components/PresaleBuy";
import style from "../token/style.module.scss";

const initialData = [
  {
    title: "Your ESG",
    balance: "0.00",
    totalPrice: "0.00",
    btnTitle: "BUY ESG",
    priceTitle: "ESG PRICE",
    price: "0.00",
    ethPrice: "0.00",
  },
  {
    title: "Your SPORT",
    balance: "0.00",
    totalPrice: "0.00",
    btnTitle: "BUY SPORT",
    priceTitle: "SPORT PRICE",
    price: "0.00",
    ethPrice: "0.00",
  },
];

const Presale = () => {

  
  return (
    <div className={style.token}>
      <Header />
      <div className={`w-100 ${style.content}`}>
          <div
            className={`row row-cols-md-2 row-cols-sm-1 ${style.second_container}`}
          >
          {initialData.map((e, i) => (
              <div className={`col ${style.token_buy_container}`} key={i}>
                <PresaleBuy data={e} id={i}/>
              </div>
            ))}
          </div>
      </div>
    </div>
  );
};

export default Presale;
