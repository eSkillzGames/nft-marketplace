import { ethers, providers } from "ethers";
export const SET_BALANCE = "SET_BALANCE";
const axios = require('axios');

var minABI = [
  // balanceOf
  {
    constant: true,
    inputs: [{ name: "_owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    type: "function",
  },
  // decimals
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint8" }],
    type: "function",
  },
];
const sportTokenAddress = "0x2caFAb766a586a09659a09E92e9f4005DF827512";
const esgTokenAddress = "0x6637926e5c038c7ae3d3fd2c2d77c44e8be1ed28";
export const setBalance = (address) => async (dispatch) => {
  // const providerR = new ethers.providers.JsonRpcProvider("https://rpc-mumbai.maticvigil.com");
  // const sportContract = new ethers.Contract(sportTokenAddress, minABI, providerR);
  // const esgContract = new ethers.Contract(esgTokenAddress, minABI, providerR);
  // const maticBalBuf = await providerR.getBalance(address);
  // const maticBalDec = parseInt(maticBalBuf._hex, 16);
  // const sportBalBuf = await sportContract.balanceOf(address);
  // const sportBalDec = parseInt(sportBalBuf._hex, 16);
  // const esgBalBuf = await esgContract.balanceOf(address);
  // const esgBalDec = parseInt(esgBalBuf._hex, 16);

  const res = await axios({
    method: "post",
    url: process.env.REACT_APP_API_URL + "/sendTransaction/v1/getMaticBalance",
    data: { address },
    headers: {
      "Content-Type": `application/json`,
    },
  });

  const maticBalDec = res.data.balance;

  const resSkill = await axios({
    method: "post",
    url: process.env.REACT_APP_API_URL + "/sendTransaction/v1/getSkill",
    data: { Account: address },
    headers: {
      "Content-Type": `application/json`,
    },
  });

  const sportBalDec = resSkill.data.data;
  const esgBalDec = 0;

  dispatch({
    type: SET_BALANCE,
    payload: { MaticBal: maticBalDec, SportBal: sportBalDec, EsgBal: esgBalDec }
  })
}