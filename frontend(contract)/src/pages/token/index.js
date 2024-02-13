import React, { createContext, useEffect, useState } from "react";
import Header from "../../components/Header";
import TotalEarned from "../../components/TotalEarned";
import Calculator from "../../components/Calculator";
import TokenBuy from "../../components/TokenBuy";
import style from "./style.module.scss";

import { Grid } from "@mui/material";

const initialData = [
  {
    title: "Your ESG",
    balance: "0.00",
    totalPrice: "0.00",
    btnTitle: "BUY ESG",
    priceTitle: "ESG PRICE",
    price: 0,
    ethPrice: "0.00",
  },
  {
    title: "Your SKILL",
    balance: "0.00",
    totalPrice: "0.00",
    btnTitle: "BUY SKILL",
    priceTitle: "SKILL PRICE",
    price: 0,
    ethPrice: "0.00",
  },
];
const Token = () => {

  return (
    <div className={style.token}>
      <Header/>
      <Grid container spacing={4} sx={{mt:12}}>
        <Grid item md={6} xs={12}>  <TotalEarned /></Grid>
        <Grid item md={6} xs={12}><Calculator /> </Grid>
      </Grid>
      
        <div
          className={`row row-cols-md-2 row-cols-sm-1 ${style.second_container}`}
        >
            {initialData.map((e, i) => (
              <div className={`col ${style.token_buy_container}`} key={i}>
                <TokenBuy data={e} id={i}/>
              </div>
            ))}
            
          </div>

      </div>
    // </div>
  );
};

export default Token;
