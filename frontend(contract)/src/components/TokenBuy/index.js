import React, { useContext, useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import Presale from "../../Modal/Presale";

import style from "../../pages/token/style.module.scss";
import tokenPriceABI from "../../GetTokenPrice.json";
import { ethers } from "ethers";
import { useDispatch, useSelector } from "react-redux";
const sportTokenAddress = "0x2caFAb766a586a09659a09E92e9f4005DF827512";
//const esgTokenAddress = "0x8C534C9aa8d6cDB75d139caF5aD9716Db25eB628";
const esgTokenAddress = "0x6637926e5c038c7ae3d3fd2c2d77c44e8be1ed28";
const tokenPriceAddress = "0x6b186a04C801A3D717621b0B19D018375161bFF8";
const providerR = new ethers.providers.JsonRpcProvider("https://rpc-mumbai.maticvigil.com");
// const providerW = new ethers.providers.JsonRpcProvider("https://polygon-mumbai.infura.io/v3/" + process.env.REACT_APP_INFURAID);
const tokenPriceContract = new ethers.Contract(tokenPriceAddress, tokenPriceABI, providerR);

const TokenBuy = ({ data, id}) => {
  const [presaleModalShow, setPresaleModalShow] = useState(false);
  const { balance } = useSelector(({ homeReducer }) => homeReducer.home);
  const [customTokenBalance, setCustomTokenBalance] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const hideModel = () => {
    setPresaleModalShow(false);
  };

  useEffect(() => {
    if(balance.SportBal !=null){

      init();
    }
  }, [balance]);
  async function init() {
    try {
 
      if (id == 1) {
        // const Buf = await tokenPriceContract.getETHPrice(sportTokenAddress);
        // setSportPricePerETH(String(Buf / 10 ** 9));
        if (String(balance.SportBal).length > 7) {
          setCustomTokenBalance(
          String(
            parseInt(String(balance.SportBal).substring(0, String(balance.SportBal).length - 7)) / 100
            )
            );
        } else {
          setCustomTokenBalance("0.00");
        }
        let sportPrice = await tokenPriceContract.getPrice(sportTokenAddress);
        setTotalPrice(toFixed(
            (sportPrice[0] * sportPrice[2]) / sportPrice[1] / 10 ** 6
          ));
      } else {
        // const Buf = await tokenPriceContract.getETHPrice(esgTokenAddress);
        // setSportPricePerETH(String(Buf / 10 ** 9));
        if (String(balance.EsgBal).length > 7) {
          setCustomTokenBalance(
          String(
            parseInt(String(balance.EsgBal).substring(0, String(balance.EsgBal).length - 7)) / 100
            )
            );
        } else {
          setCustomTokenBalance("0.00");
        }
        let sportPrice = await tokenPriceContract.getPrice(esgTokenAddress);
        setTotalPrice(toFixed(
            (sportPrice[0] * sportPrice[2]) / sportPrice[1] / 10 ** 6
          ));
      } 
      
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
  // async function addToken() {
  //   try {
  //     if (window.ethereum) {
  //       var web3Window = new Web3(window.ethereum);
  //       const chainIDBuffer = await web3Window.eth.net.getId();
  //       if (chainIDBuffer == 80001) {
  //         var SportTokenAddress;
  //         var SportTokenSymbol;
  //         if (id == 1) {
  //           SportTokenAddress = "0x2caFAb766a586a09659a09E92e9f4005DF827512";
  //           SportTokenSymbol = "SPORT";
  //         } else {
  //           SportTokenAddress = "0x6637926e5c038c7ae3d3fd2c2d77c44e8be1ed28";
  //           SportTokenSymbol = "ESG";
  //         }

  //         const SportTokenDecimals = 9;
  //         const tokenImage = "";
  //         const wasAdded = await window.ethereum.request({
  //           method: "wallet_watchAsset",
  //           params: {
  //             type: "ERC20", // Initially only supports ERC20, but eventually more!
  //             options: {
  //               address: SportTokenAddress, // The address that the token is at.
  //               symbol: SportTokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
  //               decimals: SportTokenDecimals, // The number of decimals in the token
  //               image: tokenImage, // A string url of the token logo
  //             },
  //           },
  //         });
  //       } else {
  //         window.alert("Wrong Network");
  //       }
  //     } else {
  //       const ethersProvider = new providers.Web3Provider(providerR);
  //       const signer = await ethersProvider.getSigner();
  //         const network = await ethersProvider.getNetwork();
  //         const chainIdBuf = network.chainId;
  //       if (Number(chainIdBuf) == 80001) {
  //         var SportTokenAddress;
  //         var SportTokenSymbol;
  //         if (id == 1) {
  //           SportTokenAddress = "0x2caFAb766a586a09659a09E92e9f4005DF827512";
  //           SportTokenSymbol = "SPORT";
  //         } else {
  //           SportTokenAddress = "0x6637926e5c038c7ae3d3fd2c2d77c44e8be1ed28";
  //           SportTokenSymbol = "ESG";
  //         }
  //         const SportTokenDecimals = 9;
  //         const tokenImage = "";

        
  //         const wasAdded = await ethersProvider.provider.request({
  //           method: "wallet_watchAsset",
  //           params: {
  //             type: "ERC20", // Initially only supports ERC20, but eventually more!
  //             options: {
  //               address: SportTokenAddress, // The address that the token is at.
  //               symbol: SportTokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
  //               decimals: SportTokenDecimals, // The number of decimals in the token
  //               image: tokenImage, // A string url of the token logo
  //             },
  //           },
  //         });
  //       } else {
  //         window.alert("Wrong Network");
  //       }
  //     }
  //   } catch {
  //     return;
  //   }
  // }
  return (
    <>
      <div className={`${style.token_buy} d-flex text-start`}>
        <div className={`${style.sub_container} ${style.bg_dark_green}`}>
          <p className={style.color_light_green}>{data.title}</p>
          <h3 className={`${style.color_white} mt-4`}>
            {Number(customTokenBalance)}
          </h3>
          <div className={`h6 ${style.color_blue} mt-3`}>
            ${" "}
            {(Number(customTokenBalance) * Number(totalPrice))
              .toString()}
          </div>
          <Button
            variant="outline-primary"
            className={`${style.color_blue} ${style.btn_outline_primary} rounded-pill w-100 mt-4`}
            onClick={() => {
              setPresaleModalShow(true); /*init();*/
            }}
          >
            {data.btnTitle}
          </Button>
         
         
        </div>
        <div className="m-4 text-start">
          <p className={style.color_light_green}>{data.priceTitle}</p>
          <div className={`h2 ${style.color_blue}`}>
            ${String(totalPrice).substring(0, 12)}
          </div>
        </div>
      </div>
      <Presale
        hideModel={hideModel}
        show={presaleModalShow}
        onHide={() => setPresaleModalShow(false)}
        id={id}
      />
    </>
  );
};

export default TokenBuy;
