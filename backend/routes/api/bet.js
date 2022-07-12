const express = require('express');
const axios = require('axios');
const config = require('config');
const router = express.Router();
const { initializeApp } = require("firebase/app");
const { getFirestore, collection, getDocs, doc, getDoc, addDoc,setDoc,updateDoc, deleteDoc} = require ('firebase/firestore');

const { check, validationResult } = require('express-validator');
const normalize = require('normalize-url');
const { ethers } = require('ethers');
const { useState } = require('react');
const auth = require('../../middleware/auth');
const checkObjectId = require('../../middleware/checkObjectId');
const privateKeyToAddress = require('ethereum-private-key-to-address')

const firebaseConfig = {

  apiKey: "AIzaSyCbHhwS7kjq3s-zidpdk0THPugYTyzSqhI",

  authDomain: "eskillz-pool.firebaseapp.com",

  databaseURL: "https://eskillz-pool-default-rtdb.firebaseio.com",

  projectId: "eskillz-pool",

  storageBucket: "eskillz-pool.appspot.com",

  messagingSenderId: "285834418480",

  appId: "1:285834418480:web:86863685fac50c99e950f5",

  measurementId: "G-7C45NW1VCC"

};

// const Profile = require('../../models/Profile');
// const User = require('../../models/User');
// const Post = require('../../models/Post');

require('dotenv').config();

const infuraKey = process.env.REACT_INFURA_KEY;
const SportTokenAddress = process.env.SPORT_TOKEN_ADDRESS;
const betAddress = process.env.BET_ADDRESS;
const betABI = require('../../abi/Bet.json');
const sportABI = require('../../abi/Sport.json');
// const Web3 = require("web3");
// if (typeof web3 !== 'undefined') {
//   var web3 = new Web3(web3.currentProvider);
// } else {
//   var web3 = new Web3(new Web3.providers.HttpProvider(infuraKey));
// }

// var sportContract = new web3.eth.Contract(sportABI,SportTokenAddress);                        
// var betContract = new web3.eth.Contract(betABI,betAddress);
var PRIVATE_KEY = "9cc02444163355273705cccc39684d9df3e933034ef1e681d3f04afbd16ffc5e";
var PUBLIC_KEY = privateKeyToAddress(PRIVATE_KEY);
const provider = new ethers.providers.JsonRpcProvider(infuraKey);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const etherInterface = new ethers.utils.Interface(betABI);
const betContract = new ethers.Contract(betAddress, betABI, provider);
var checkNonce = 0;
//firebase start
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
//firebase end
router.post('/CreateSPGame', async function(req, res) {
  let CreatePlayer = req.body.CreatePlayer;
  let BetAmounts = parseInt(req.body.BetAmounts);
  if(CreatePlayer == null || BetAmounts == null){
    res.send("Create Player and BetAmounts must not be null.");
  }
  else{  
    if(CreatePlayer.toString().toLowerCase().length == 42 && CreatePlayer.toString().toLowerCase().substring(0,2) == "0x") {
      let minBetAmounts =await betContract.minBetAmounts();
      if(BetAmounts >= Number(minBetAmounts._hex)){
        try {
          
          let stakeAmount =await betContract.getStakingAmountsOfPlayer(CreatePlayer);
          if(Number(stakeAmount._hex) < BetAmounts){  
            res.send("Stake amounts of Create Player is smaller than BetAmounts.");
          }
          else{

            try{   
              const count = await provider.getTransactionCount(PUBLIC_KEY, "latest"); //get latest nonce
              var nonce = count+checkNonce;
              checkNonce++;
              //console.log(nonce);
              const gasPrice = await provider.getGasPrice();  
              const network = await provider.getNetwork();
              const { chainId } = network;
              //Transaction object
              const transaction = {
                from: PUBLIC_KEY,
                to: betAddress,
                nonce,
                chainId,
                gasPrice,
                data: etherInterface.encodeFunctionData("CreateSPGame", 
                      [ CreatePlayer, BetAmounts.toString() ]) 
              };
              //Estimate gas limit
              const estimatedGas = await provider.estimateGas(transaction);
              transaction["gasLimit"] = estimatedGas;
              //Sign & Send transaction
              const signedTx = await wallet.signTransaction(transaction);
              const transactionReceipt = await provider.sendTransaction(signedTx);
              await transactionReceipt.wait();
              const hash = transactionReceipt.hash;
              // Get transaction receipt
              const receipt = await provider.getTransactionReceipt(hash);
              const { logs } = receipt;
              var logsData =  logs[0].data.toString();
              var gameIDs = Number(logsData.substr(0, 66));
              // const tokenInBigNumber = ethers.BigNumber.from(logs[0].topics[3]);
              // const tokenId = tokenInBigNumber.toNumber();
              //console.log("gameIDs ID:", gameIDs);
              checkNonce--;  
              //console.log(checkNonce);
              res.send(String(gameIDs));
            }
            catch{
              checkNonce--;  
              res.send("Network is Busy. Transaction failed.");
            }          
          }
        } catch {
          res.send("Network is Busy. So get staking amount is failed.");
        }
      }
      else{
        res.send("BetAmounts must bigger than minBetAmounts.");
      }   
    } 
    else{
      res.send("Create Player is not address Type.");

    }
  } 
});

router.post('/CreateMPGame', async function(req, res) {
  let CreatePlayer = req.body.CreatePlayer;
  let JoinPlayer = req.body.JoinPlayer;
  let BetAmounts = parseInt(req.body.BetAmounts);
  if(CreatePlayer == null || JoinPlayer == null || BetAmounts == null){
    res.send("Create Player and BetAmounts must not be null.");
  }
  else{   
    if(CreatePlayer.toString().toLowerCase().length == 42 && CreatePlayer.toString().toLowerCase().substring(0,2) == "0x") {
      if(JoinPlayer.toString().toLowerCase().length == 42 && JoinPlayer.toString().toLowerCase().substring(0,2) == "0x") {
        if(JoinPlayer.toString().toLowerCase() == CreatePlayer.toString().toLowerCase()){
          res.send("JoinPlayer is equal to Create Player.");
        }
        else{
          let minBetAmounts =await betContract.minBetAmounts();
          if(BetAmounts >= Number(minBetAmounts._hex)){
            try {
            
              let stakeAmount1 =await betContract.getStakingAmountsOfPlayer(CreatePlayer);
              let stakeAmount2 =await betContract.getStakingAmountsOfPlayer(JoinPlayer);
              if(Number(stakeAmount1._hex) < BetAmounts){  
                res.send("Stake amounts of Create Player is smaller than BetAmounts.");
              }
              else{
                if(Number(stakeAmount2._hex) < BetAmounts){  
                  res.send("Stake amounts of Join Player is smaller than BetAmounts.");
                }
                else{
                  try{   
                    const count = await provider.getTransactionCount(PUBLIC_KEY, "latest"); //get latest nonce
                    var nonce = count+checkNonce;
                    checkNonce++;
                    //console.log(nonce);
                    const gasPrice = await provider.getGasPrice();  
                    const network = await provider.getNetwork();
                    const { chainId } = network;
                    //Transaction object
                    const transaction = {
                      from: PUBLIC_KEY,
                      to: betAddress,
                      nonce,
                      chainId,
                      gasPrice,
                      data: etherInterface.encodeFunctionData("CreateMPGame", 
                            [ CreatePlayer, JoinPlayer, BetAmounts.toString() ]) 
                    };
                    //Estimate gas limit
                    const estimatedGas = await provider.estimateGas(transaction);
                    transaction["gasLimit"] = estimatedGas;
                    //Sign & Send transaction
                    const signedTx = await wallet.signTransaction(transaction);
                    const transactionReceipt = await provider.sendTransaction(signedTx);
                    await transactionReceipt.wait();
                    const hash = transactionReceipt.hash;
                    // Get transaction receipt
                    const receipt = await provider.getTransactionReceipt(hash);
                    const { logs } = receipt;
                    var logsData =  logs[0].data.toString();
                    var gameIDs = Number(logsData.substr(0, 66));
                    // const tokenInBigNumber = ethers.BigNumber.from(logs[0].topics[3]);
                    // const tokenId = tokenInBigNumber.toNumber();
                    //console.log("gameIDs ID:", gameIDs);
                    checkNonce--;  
                    //console.log(checkNonce);
                    res.send(String(gameIDs));
                  }
                  catch{
                    checkNonce--;  
                    res.send("Network is Busy.Transaction failed.");
                  }          
                }
              }
            }
            catch {
              res.send("Network is Busy. So get staking amount is failed.");
            }
          }
          else{
            res.send("BetAmounts must bigger than minBetAmounts.");
          }   
        }
      } 
      else{
        res.send("Join Player is not address Type.");
      }
    } 
    else{
      res.send("Create Player is not address Type.");
    }
  } 
});

router.post('/SetSPGameResult', async function(req, res) {
  
  let GameID = parseInt(req.body.GameID);
  
  if(GameID == null ){
    res.send("GameID must not be null.");
  }
  else{  
    let WinPlayer;
    let Result
    const docSnap = await getDoc(doc(db, "eskillzGameResult", GameID.toString()));
    if (docSnap.exists()) {
      WinPlayer = docSnap.data().winAddress;
      Result = docSnap.data().result;
      if(GameID > 0){
        if(WinPlayer.toString().length == 42){
          if(Number(Result) >=0){

            try{ 
              
              const count = await provider.getTransactionCount(PUBLIC_KEY, "latest"); //get latest nonce
              var nonce = count+checkNonce;
              checkNonce++;
              //console.log(nonce);
              const gasPrice = await provider.getGasPrice();  
              const network = await provider.getNetwork();
              const { chainId } = network;
              //Transaction object
              const transaction = {
                from: PUBLIC_KEY,
                to: betAddress,
                nonce,
                chainId,
                gasPrice,
                data: etherInterface.encodeFunctionData("SetSPGameResult", 
                      [ WinPlayer.toString(), GameID.toString(), Result.toString()]) 
              };
              //Estimate gas limit
              const estimatedGas = await provider.estimateGas(transaction);
              transaction["gasLimit"] = estimatedGas;
              //Sign & Send transaction
              const signedTx = await wallet.signTransaction(transaction);
              const transactionReceipt = await provider.sendTransaction(signedTx);
              await transactionReceipt.wait();
              const hash = transactionReceipt.hash;
              checkNonce--;  
              //console.log(checkNonce);
              await deleteDoc(doc(db, "eskillzGameResult", GameID.toString()));
              res.send(String(hash));
            }
            catch{
              checkNonce--;  
              res.send("Transaction failed.");
            }     
          }
          else{
            res.send("Result is incorrect on firebase.");
          }
        }
        else{
          res.send("winAdress is not address Type.");
        }             
      }
      else{
        res.send("GameID must bigger than zero.");
      }
    } else {
      res.send("Can not find GameID and GameResult on firebase.");
    }
         
  } 
});

router.post('/SetMPGameResult', async function(req, res) {
  
  let GameID = parseInt(req.body.GameID);
  
  if(GameID == null ){
    res.send("GameID must not be null.");
  }
  else{  
      let WinPlayer;
      const docSnap = await getDoc(doc(db, "eskillzGameResult", GameID.toString()));
      if (docSnap.exists()) {
        WinPlayer = docSnap.data().winAddress;
        if(GameID > 0 ){
          if(WinPlayer.toString().length == 42){
            try{   
              const count = await provider.getTransactionCount(PUBLIC_KEY, "latest"); //get latest nonce
              var nonce = count+checkNonce;
              checkNonce++;
              //console.log(nonce);
              const gasPrice = await provider.getGasPrice();  
              const network = await provider.getNetwork();
              const { chainId } = network;
              //Transaction object
              const transaction = {
                from: PUBLIC_KEY,
                to: betAddress,
                nonce,
                chainId,
                gasPrice,
                data: etherInterface.encodeFunctionData("SetMPGameResult", 
                      [ WinPlayer.toString(), GameID.toString()]) 
              };
              //Estimate gas limit
              const estimatedGas = await provider.estimateGas(transaction);
              transaction["gasLimit"] = estimatedGas;
              //Sign & Send transaction
              const signedTx = await wallet.signTransaction(transaction);
              const transactionReceipt = await provider.sendTransaction(signedTx);
              await transactionReceipt.wait();
              const hash = transactionReceipt.hash;
              checkNonce--;  
              //console.log(checkNonce);
              await deleteDoc(doc(db, "eskillzGameResult", GameID.toString()));
              res.send(String(hash));
            }
            catch{
              checkNonce--;  
              res.send("Transaction failed.");
            }     
          }
          else{
            res.send("winAdress is not address Type.");
          }             
        }
        else{
          res.send("GameID must bigger than zero.");
        } 
      } else {
        res.send("Can not find GameID and winAddress on firebase.");
      }
        
  } 
});

module.exports = router;
