import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import style from "../../pages/token/style.module.scss";
import { useNavigate } from "react-router-dom";
import { ethers} from "ethers";
import { useDispatch, useSelector } from "react-redux";
import * as homeActions from "../../pages/home/store/actions"
const Header = () => {
  const navigate = useNavigate();
  const { uid, address } = useSelector(({ authReducer }) => authReducer.auth);
  const { balance } = useSelector(({ homeReducer }) => homeReducer.home);
  const [maticBalance, setMaticBalance] = useState("");
  const [screenSize, getDimension] = useState({
    dynamicWidth: 1100,
    dynamicHeight: 0,
  });
  const dispatch = useDispatch();
  const setDimension = () => {
    getDimension({
      dynamicWidth: window.innerWidth - 500,
      dynamicHeight: window.innerHeight,
    });
  };
  useEffect(() => {    
    if(address){

      dispatch(homeActions.setBalance(address));
    }

  }, [address])
  useEffect(() => {
    if(balance.MaticBal !=null){
      init()
    }
  },[balance])
  useEffect(() => {
    try {
      window.addEventListener("resize", setDimension); 
    } catch {
      return;
    }
  }, [screenSize]);

  async function init(){
    let balETH = ethers.utils.formatUnits(balance.MaticBal.toString(), "ether");
      var string = balETH.toString().split(".");   
      if (string.length > 1) {
        if (string[1].length > 3) {
          setMaticBalance(
            string[0] + "." + string[1].substring(0, 4) + " MATIC"
            );
        } else {
          setMaticBalance(string[0] + "." + string[1] + " MATIC");
        }
      } else {
        setMaticBalance(string[0] + " MATIC");
      }
  }
  return (
    <>
      <div className={style.logo} style={{
            position: "absolute",
            top: "100px"}}>
        <img src="/images/Logo1.png" alt="Logo" />
      </div>
      <div className={style.backDiv}>
        <Button
          style={{
            position: "absolute",
            top: "100px",
            left: "50px",
            minWidth: "auto",
            width: "40px",
            height: "40px",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            color: "white",
            borderRadius: "50%",
            fontFamily: "monospace",
            fontSize: "20px",
            backgroundColor: "transparent",
          }}
          onClick={() => navigate("/home")}
        >
          {"<"}
        </Button>
      </div>
      <div
        className={
          style.buttonDiv +
          " d-flex justify-content-lg-between justify-content-md-between align-items-center"
        } 
      >
        <div
          style={{
            position: "absolute",
            left: screenSize.dynamicWidth / 2,
            top: "185px",
          }}
        >
          <p
            className={`${style.bg_dark_green} ${style.color_blue}`}
            style={{ fontSize: "25px" }}
          >
            Please make sure you are visiting{" "}
            <a href="https://www.eskillz.info" className={style.color_blue}>
              www.eskillz.info
            </a>
          </p>
        </div>
        <div
          style={{
            flexDirection: "column",
            display: "flex",
            position: "absolute",
            right: "70px",
            top: "100px",
          }}
        >          
          <span style={{ color: "#06f506" }}>
            &nbsp; &nbsp; MATIC BALANCE : &nbsp;
            {maticBalance}
          </span>
        </div>
       
      </div>
    </>
  );
};

export default Header;
