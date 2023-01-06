const express = require('express');
const axios = require('axios');
const config = require('config');
const router = express.Router();
const { initializeApp } = require("firebase/app");
const { getFirestore, collection, query,limit,getDocs, doc, getDoc, addDoc,setDoc,updateDoc, deleteDoc,deleteField} = require ('firebase/firestore');

const { check, validationResult } = require('express-validator');
const normalize = require('normalize-url');
const { ethers } = require('ethers');
const { useState } = require('react');
const privateKeyToAddress = require('ethereum-private-key-to-address')

const firebaseConfig = {

  apiKey: process.env.FIREBASE_APIKEY,

  authDomain: "eskillz-pool.firebaseapp.com",

  databaseURL: "https://eskillz-pool-default-rtdb.firebaseio.com",

  projectId: "eskillz-pool",

  storageBucket: "eskillz-pool.appspot.com",

  messagingSenderId: process.env.FIREBASE_MESSAGINGSENDERID,

  appId: process.env.FIREBASE_APPID,

  measurementId: process.env.FIREBASE_MEASUREMENTID

};

require('dotenv').config();

const infuraKey = process.env.REACT_INFURA_KEY;
const SportTokenAddress = process.env.SPORT_TOKEN_ADDRESS;
const EsgTokenAddress = process.env.ESG_TOKEN_ADDRESS;
const betAddress = process.env.BET_ADDRESS;
const nftCueAddress = process.env.NFT_CONTRACT_ADDRESS;
const nftCardAddress = process.env.CARD_NFT_CONTRACT_ADDRESS;
const marketCueAddress = process.env.MARKET_CONTRACT_ADDRESS;
const marketCardAddress = process.env.CARD_MARKET_CONTRACT_ADDRESS;
const presaleSportAddress = process.env.PRESALE_SPORT_CONTRACT_ADDRESS;
const presaleEsgAddress = process.env.PRESALE_ESG_CONTRACT_ADDRESS;
const MaticAddress = process.env.MATIC_ADDRESS;
const UniswapAddress = process.env.UNISWAPADDRESS;
const pricePredictAddress = process.env.PRICE_PREDICT_ADDRESS;
const nftCueABI = require('../../abi/NFT.json');
const nftCardABI = require('../../abi/NFT_CARD.json');
const marketCueABI = require('../../abi/Marketplace.json');
const marketCardABI = require('../../abi/Marketplace_CARD.json');
const betABI = require('../../abi/Bet.json');
const sportABI = require('../../abi/Sport.json');
const esgABI = require('../../abi/Esg.json');
const presaleEsgABI = require('../../abi/PresaleEsg.json');
const presaleSportABI = require('../../abi/PresaleSport.json');
const uniswapABI = require('../../abi/Uniswap.json');
const pricePredictABI = require('../../abi/getPricePredict.json');
const Web3 = require("web3");
const { setRandomFallback } = require('bcryptjs');
if (typeof web3 !== 'undefined') {
  var web3 = new Web3(web3.currentProvider);
} else {
  var web3 = new Web3(new Web3.providers.HttpProvider(infuraKey));
}

const provider = new ethers.providers.JsonRpcProvider(infuraKey);
const providerR = new ethers.providers.JsonRpcProvider(infuraKey);
const etherInterface = new ethers.utils.Interface(betABI);
const etherInterfaceSport = new ethers.utils.Interface(sportABI);
const etherInterfaceEsg = new ethers.utils.Interface(esgABI);
const etherInterfaceNFTCue = new ethers.utils.Interface(nftCueABI);
const etherInterfaceNFTCard = new ethers.utils.Interface(nftCardABI);
const etherInterfaceMarketCue = new ethers.utils.Interface(marketCueABI);
const etherInterfaceMarketCard = new ethers.utils.Interface(marketCardABI);
const etherInterfacePresaleSport = new ethers.utils.Interface(presaleSportABI);
const etherInterfacePresaleEsg = new ethers.utils.Interface(presaleEsgABI);
const etherInterfaceUniswap = new ethers.utils.Interface(uniswapABI);
const betContract = new ethers.Contract(betAddress, betABI, providerR);
const sportContract = new ethers.Contract(SportTokenAddress, sportABI, providerR);
const esgContract = new ethers.Contract(EsgTokenAddress, esgABI, providerR);
const ContractNFTCue = new ethers.Contract(nftCueAddress, nftCueABI, providerR);
const ContractNFTCard = new ethers.Contract(nftCardAddress, nftCardABI, providerR);
const ContractMarketCue = new ethers.Contract(marketCueAddress, marketCueABI, providerR);
const ContractMarketCard = new ethers.Contract(marketCardAddress, marketCardABI, providerR);
const presaleSportContract = new ethers.Contract(presaleSportAddress, presaleSportABI, providerR);
const presaleEsgContract = new ethers.Contract(presaleEsgAddress, presaleEsgABI, providerR);
const UniswapContract = new ethers.Contract(UniswapAddress, uniswapABI, providerR);
const pricePredictContract = new ethers.Contract(pricePredictAddress, pricePredictABI, providerR);
//firebase start
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
//firebase end

const knex = require('knex')({
  client: 'mysql',
  connection: {
      host : '127.0.0.1',
      port : 3306,
      user : 'root',
      password : '',
      database : 'apiserver'
  }
});

async function getKey(uID){
     try{  
          var docSnap = await getDoc(doc(db, "users", `${uID}`, "Profile","ProfileData"));
          if (docSnap.exists()) {
            var KeyExist = docSnap.data()["eSkillzKey"];
            if(KeyExist != null){
              return KeyExist;         
            }
            else{
              return 0;
            }             
          }   
          else{
            return 0;
          }
     }
     catch{
         return 0;
     }
}


router.post('/CreateEskillzAccount', async function(req, res) {
  try {
    let UserID = req.body.UserID;
    let UserName = req.body.userName;
    let BirthDay = req.body.birthDay;
    if(UserID == null || UserName == null ||BirthDay == null){
      res.send("Parameters must not be null.");
      return;
    }
    else{
      if(UserID.length == 28) {
    
        try{ 
          //var temp = 0;
          var docSnap = await getDoc(doc(db, "users", `${UserID}`, "Profile","ProfileData"));
          if (!docSnap.exists()) {
            await setDoc(doc(db, "users", `${UserID}`, "Profile","ProfileData"), {"userid" : `${UserID}`});
            docSnap = await getDoc(doc(db, "users", `${UserID}`, "Profile","ProfileData"));
            //temp = 1;
          }
          
          var docSnap1 = await getDoc(doc(db, "users", `${UserID}`, "Profile","KYC"));
          if (!docSnap1.exists()) {
            await setDoc(doc(db, "users", `${UserID}`, "Profile","KYC"), {"AddressField1" : ""});
            //temp = 1;
          }
          
          var walletAddressExist = docSnap.data()["eSkillzWalletAddress"];
          if(walletAddressExist == null){
            const { address, privateKey } = web3.eth.accounts.create(); 
            await updateDoc(doc(db, "users", `${UserID}`, "Profile","ProfileData"), {"FramesLost" : 0});
            await updateDoc(doc(db, "users", `${UserID}`, "Profile","ProfileData"), {"FramesWon" : 0});
            await updateDoc(doc(db, "users", `${UserID}`, "Profile","ProfileData"), {"IsOnline" : 0});
            await updateDoc(doc(db, "users", `${UserID}`, "Profile","ProfileData"), {"LastPlayed" : null});
            await updateDoc(doc(db, "users", `${UserID}`, "Profile","ProfileData"), {"PlayerLevel" : 1});
            await updateDoc(doc(db, "users", `${UserID}`, "Profile","ProfileData"), {"PlayerXP" : 0});
            await updateDoc(doc(db, "users", `${UserID}`, "Profile","ProfileData"), {"SkillPoints" : 0});
            await updateDoc(doc(db, "users", `${UserID}`, "Profile","ProfileData"), {"Wins" : 0});
            await updateDoc(doc(db, "users", `${UserID}`, "Profile","ProfileData"), {"eSkillzKey" : encrypt(String(privateKey))});
            await updateDoc(doc(db, "users", `${UserID}`, "Profile","ProfileData"), {"eSkillzWalletAddress" : address});
            await updateDoc(doc(db, "users", `${UserID}`, "Profile","ProfileData"), {"gamesplayed" : 0});
            await updateDoc(doc(db, "users", `${UserID}`, "Profile","ProfileData"), {"lost" : 0});
            await updateDoc(doc(db, "users", `${UserID}`, "Profile","ProfileData"), {"userName" : UserName});
            await updateDoc(doc(db, "users", `${UserID}`, "Profile","ProfileData"), {"userid" : `${UserID}`});
            await updateDoc(doc(db, "users", `${UserID}`, "Profile","ProfileData"), {"walletAddress" : ""});
            await updateDoc(doc(db, "users", `${UserID}`, "Profile","ProfileData"), {"birthDay" : BirthDay});

            await updateDoc(doc(db, "users", `${UserID}`, "Profile","KYC"), {"AddressField1" : ""});
            await updateDoc(doc(db, "users", `${UserID}`, "Profile","KYC"), {"AddressField2" : ""});
            await updateDoc(doc(db, "users", `${UserID}`, "Profile","KYC"), {"AddressField3" : ""});
            await updateDoc(doc(db, "users", `${UserID}`, "Profile","KYC"), {"AddressField4" : ""});
            await updateDoc(doc(db, "users", `${UserID}`, "Profile","KYC"), {"Country" : ""});
            await updateDoc(doc(db, "users", `${UserID}`, "Profile","KYC"), {"CountryState" : ""});
            await updateDoc(doc(db, "users", `${UserID}`, "Profile","KYC"), {"DOB" : ""});
            await updateDoc(doc(db, "users", `${UserID}`, "Profile","KYC"), {"DocumentID" : ""});
            await updateDoc(doc(db, "users", `${UserID}`, "Profile","KYC"), {"DocumentImageStorageUrl" : ""});
            await updateDoc(doc(db, "users", `${UserID}`, "Profile","KYC"), {"Postcode" : ""});
            await updateDoc(doc(db, "users", `${UserID}`, "Profile","KYC"), {"documentType" : ""});
            res.send(address);
            return;                          
          }
          else{
            res.send("Wallet Address already exist now.");
            return;
          }            
              
        }catch{
          res.send("Network is busy now, retry please.");
        }    
      }else{
        res.send("Type of UserID is not correct.");
      }
          
    } 
  } catch (error) {
    res.send("Your Request is not correct.");
    return;
  }
  
});


router.post('/UpdateEskillzAccount', async function(req, res) {
  try {
    let UserID = req.body.UserID;
  
    if(UserID == null ){
      res.send("UserID must not be null.");
      return;
    }
    else{
      if(UserID.length == 28) {
        try{ 
          var docSnap = await getDoc(doc(db, "users", `${UserID}`, "Profile","ProfileData"));
          
          if (docSnap.exists()) {
            var walletAddressExist = docSnap.data()["eSkillzWalletAddress"];
            if(walletAddressExist != null){
              const { address, privateKey } = web3.eth.accounts.create();  
              await updateDoc(doc(db, "users", `${UserID}`, "Profile","ProfileData"), {"userid" : `${UserID}`});
              await updateDoc(doc(db, "users", `${UserID}`, "Profile","ProfileData"), {"eSkillzKey" : encrypt(String(privateKey))});
              await updateDoc(doc(db, "users", `${UserID}`, "Profile","ProfileData"), {"eSkillzWalletAddress" : address});
              res.send(address); 
              return; 
              
            }
            else{
              res.send("Wallet Address does not exist now.");
              return;
            }  
          }
          else{
            await setDoc(doc(db, "users", `${UserID}`, "Profile","ProfileData"), {"userid" : `${UserID}`});
            await updateDoc(doc(db, "users", `${UserID}`, "Profile","ProfileData"), {"userid": deleteField()});          
            res.send("Wallet Address does not exist now.");
            return;
          }       
              
        }catch{
          res.send("Network is busy now, retry please.");
        }    
      }else{
        res.send("Type of UserID is not correct.");
      }
          
    } 
  } catch (error) {
    res.send("Your Request is not correct.");
    return;
  }
  
});

router.post('/DeleteEskillzAccount', async function(req, res) {
  try {
    let UserID = req.body.UserID;  
    if(UserID == null ){
      res.send("UserID must not be null.");
      return;
    }
    else{
      if(UserID.length == 28) {
        try{ 
          var docSnap = await getDoc(doc(db, "users", `${UserID}`, "Profile","ProfileData"));
          if (docSnap.exists()) {
            var walletAddressExist = docSnap.data()["eSkillzWalletAddress"];
            if(walletAddressExist != null){
            
              await updateDoc(doc(db, "users", `${UserID}`, "Profile","ProfileData"), {"userid" : deleteField()});
              await updateDoc(doc(db, "users", `${UserID}`, "Profile","ProfileData"), {"eSkillzKey" : deleteField()});
              await updateDoc(doc(db, "users", `${UserID}`, "Profile","ProfileData"), {"eSkillzWalletAddress" : deleteField()});
              res.send("Successed"); 
              return;                         
            }
            else{
              res.send("Wallet Address does not exist now.");
              return;
            }  
          }
          else{
            await setDoc(doc(db, "users", `${UserID}`, "Profile","ProfileData"), {"userid" : `${UserID}`});
            await updateDoc(doc(db, "users", `${UserID}`, "Profile","ProfileData"), {"userid": deleteField()}); 
            res.send("Wallet Address does not exist now.");
            return;
          }          
              
        }catch{
          res.send("Network is busy now, retry please.");
        }  
      } 
      else{
        res.send("Type of UserID is not correct.");
      }
          
    } 
  } catch (error) {
    res.send("Your Request is not correct.");
    return;
  }
  
});

router.post('/getEskillzAccount', async function(req, res) {
  try {
    let UserID = req.body.UserID;
  
    if(UserID == null ){
      res.send("UserID must not be null.");
      return;
    }
    else{
      if(UserID.length == 28) {
        try{ 
          var docSnap = await getDoc(doc(db, "users", `${UserID}`, "Profile","ProfileData"));
          if (docSnap.exists()) {
            var walletAddressExist = docSnap.data()["eSkillzWalletAddress"];
            if(walletAddressExist != null){
              res.send(walletAddressExist);
              return;         
            }
            else{
              res.send("Wallet Address does not exist now.");
              return;
            }             
          }        
          else{  
            await setDoc(doc(db, "users", `${UserID}`, "Profile","ProfileData"), {"userid" : `${UserID}`});
            await updateDoc(doc(db, "users", `${UserID}`, "Profile","ProfileData"), {"userid": deleteField()});          
            res.send("Wallet Address does not exist now.");
            return; 
          }             
              
        }catch{
          res.send("Network is busy now, retry please.");
        }    
      }else{
        res.send("Type of UserID is not correct.");
      }
          
    } 
  } catch (error) {
    res.send("Your Request is not correct.");
    return;
  }
  
});

const fSendSport = async(UserID, Player, Amounts, wallet, callNumber) => {
                 
      try{         
                      
        var count = await providerR.getTransactionCount(Player, "latest"); //get latest nonce
        var nonce = count;  
        var gasPrice = 80000000000;  
        var chainId = 80001;
        var transaction;
        var estimatedGas;
        var signedTx;
        var transactionReceipt;
        
        transaction = {
          from: Player,
          to: SportTokenAddress,
          nonce,
          chainId,
          gasPrice,
          data: etherInterfaceSport.encodeFunctionData("mintSportToUser", 
                [ parseInt(Number(Amounts)).toString(), Player]) 
        };
        console.log(transaction); 
        console.log(providerR);
        estimatedGas = await providerR.estimateGas(transaction);
        transaction["gasLimit"] = estimatedGas;
        console.log(estimatedGas);
        signedTx = await wallet.signTransaction(transaction);
        transactionReceipt = await provider.sendTransaction(signedTx);
        await transactionReceipt.wait();
        console.log("call Number success->", callNumber);              
        return "success";
      }
      catch (err){
        console.log(err);
        if(callNumber >4){
          console.log("call Number retry ->", callNumber);
          return "Network is Busy. Transaction failed.";
        }
        else{
          console.log("call Number send->", callNumber);
          var retValBuf = await fSendSport(UserID, Player, Amounts, wallet, callNumber + 1);
          return retValBuf;          
        }
      }   
};

const deleteMintMore = async(insertedId) => {
  try {
    
    var rows = await knex('mintmore').del().where('Id', insertedId);
    if(rows == 1){
      return;
    }
    else{
      await deleteMintMore(insertedId);
    }
  } catch (error) {
    return;
  }
}

const removePendingBalance = async(UserID, Player, Amounts) => {
  try {
    var docSnap = await getDoc(doc(db, "users", `${UserID}`, "Private","WalletBalances"));
        
    if (docSnap.exists()) {
      var PSExist = docSnap.data()["PendingSkill"];
      if(PSExist != null){
        if(Number(PSExist) - Number(Amounts)/10**9 > 0){

          await updateDoc(doc(db, "users", `${UserID}`, "Private","WalletBalances"), {"PendingSkill" : Number(PSExist) - Number(Amounts)/10**9});
        }
        else{

          await updateDoc(doc(db, "users", `${UserID}`, "Private","WalletBalances"), {"PendingSkill" : 0});
        }     
      }
      else{
        
        await updateDoc(doc(db, "users", `${UserID}`, "Private","WalletBalances"), {"PendingSkill" : 0});
      }             
    }   
    else{
      await setDoc(doc(db, "users", `${UserID}`, "Private","WalletBalances"), {"CurrentSkill" : 0, "PendingSkill" : 0});
    }

    var rowsSel = await knex('pendingtoken').where('address', Player).select('*');
    if (rowsSel.length) {
      var rows;
      if(Number(rowsSel[0].balance) - Amounts > 0){
  
        rows = await knex('pendingtoken').where('address', Player).update({    
            balance: String(Number(rowsSel[0].balance) - Amounts),
        });
      }
      else{
        rows = await knex('pendingtoken').where('address', Player).update({    
            balance: "0",
        });
  
      }
      if(rows == 1){
        return;
      }
      else{
        await removePendingBalance(UserID,Player, Amounts);
      }      
    }
    else{
      return;
    }
  } catch (error) {
    return;
  }

  
}

router.post('/EarnSport', async function(req, res) {
  try {
    let UserID = req.body.UserID;
    let Player = req.body.Player;
    let Amounts = Number(req.body.Amounts);
    var curBalBuf;
    var pendBalBuf = 0;
    if(Player == null || Amounts == null || UserID == null){
      res.send("Parameters must not be null.");
      return;
    }
    else{
       
      if(Player.toString().toLowerCase().length == 42 && Player.toString().toLowerCase().substring(0,2) == "0x") {
        if(Number(Amounts) <1){
          res.send("Mint Amounts must be bigger than one.");
          return;
        } 
        var dateTimeComp = new Date();
        var rowsComp = await knex('mintmore').where('Player', Player).where('UserId', UserID).where('Amounts', String(Amounts)).orderBy('CreatedTime', 'desc').select('*');
        if(rowsComp.length){
          if(dateTimeComp - rowsComp[0].CreatedTime < 60000){
            res.send("MutiCalls");
            return;
          }
        }
        let curSport = await sportContract.balanceOf(Player);
        curBalBuf = Number(curSport)/10**9;
        //add pendingToken
        var docSnap = await getDoc(doc(db, "users", `${UserID}`, "Private","WalletBalances"));
        
        if (docSnap.exists()) {
          var PSExist = docSnap.data()["PendingSkill"];
          if(PSExist != null){
                 
            await updateDoc(doc(db, "users", `${UserID}`, "Private","WalletBalances"), {"PendingSkill" : Number(PSExist) + Number(Amounts)/10**9});
            pendBalBuf = Number(PSExist);
          }
          else{
            
            await updateDoc(doc(db, "users", `${UserID}`, "Private","WalletBalances"), {"PendingSkill" : Number(Amounts)/10**9});
          }             
        }   
        else{
          await setDoc(doc(db, "users", `${UserID}`, "Private","WalletBalances"), {"CurrentSkill" : 0, "PendingSkill" : Number(Amounts)/10**9});
        }
        var rows = await knex('pendingtoken').where('address', Player).select('*');
        if (rows.length) {
          await knex('pendingtoken').where('address', Player).update({    
              balance: String(Number(rows[0].balance) + Amounts),
          });      
        }
        else{    
          await knex('pendingtoken').insert({address :Player ,  
            balance: String(Amounts),
          });   
        }
        //add mintMore
        var dateTime = new Date();
        var insertedID = await knex('mintmore').insert({UserId :UserID ,  
          Player: Player,
          Amounts: String(Amounts),
          CreatedTime: dateTime,
          ReCallNum: 0
        });   
          var keyBuf = await getKey(UserID);
          if(keyBuf == 0){
            res.send("There is no Private key on firebase. So transaction is failed.");
            return;
          }
          var privateKeyVal = decrypt(keyBuf);
          const wallet = new ethers.Wallet(privateKeyVal, providerR);
          let returnVal = await fSendSport(UserID, Player, parseInt(Amounts), wallet, 0);
          if(returnVal == "success") {
            
            await deleteMintMore(insertedID[0]);
            await removePendingBalance(UserID,Player, Amounts);
            //
            var docSnapBUF = await getDoc(doc(db, "users", `${UserID}`, "Private","WalletBalances"));
            
            if (docSnapBUF.exists()) {
              var PSExistBuf = docSnapBUF.data()["PendingSkill"];
              if(PSExistBuf != null){
                console.log(Number(PSExistBuf));
                console.log(pendBalBuf);
                if(Number(PSExistBuf) != Number(pendBalBuf)){
                  console.log("PS")
                  await updateDoc(doc(db, "users", `${UserID}`, "Private","WalletBalances"), {"PendingSkill" : pendBalBuf});
                }                    
              }                         
            }   
            
            //
            let resValSport;
            let Samount;
            for(var ii = 0; ii < 10; ii ++ ){
              
              resValSport = await sportContract.balanceOf(Player);
              Samount = Number(resValSport)/10**9;
              console.log(ii);
              if(curBalBuf != Samount) break;
              
            }
            var docSnapSportBal = await getDoc(doc(db, "users", `${UserID}`, "Private","WalletBalances"));
            if (docSnapSportBal.exists()) {                    
              
              // await updateDoc(doc(db, "users", `${array[j]}`, "Private","WalletBalances"), {"PendingSkill" : 0});
              await updateDoc(doc(db, "users", `${UserID}`, "Private","WalletBalances"), {"CurrentSkill" : Samount});
              
            }   
            else{
              await setDoc(doc(db, "users", `${UserID}`, "Private","WalletBalances"), {"CurrentSkill" : Samount, "PendingSkill" : 0});
            }  
          }
          
          res.send(returnVal);
          return; 
        } 
      else{
          res.send("Player is not address Type.");
          return;
      }
    } 
  } catch (error) {
    res.send("Your Request is not correct.");
    return;
  }
  
});

const fCreateSPGame = async(UserID, CreatePlayer, BetAmounts, ExchangeAmount, rakeFee, wallet, callNumber) => {
                 
     try {
        let maticBal =await web3.eth.getBalance(CreatePlayer);
        var count = await providerR.getTransactionCount(CreatePlayer, "latest");
        var nonce = count;             
        var gasPrice = 80000000000;  
        var chainId = 80001;
        var transaction;
        var estimatedGas;
        var signedTx;
        var transactionReceipt;
        let stakeAmount =await sportContract.balanceOf(CreatePlayer);
        if(Number(maticBal) / 10**18 < 0.1){
          var addAmounts = 0.11 * 10**18 - maticBal;
          let retVal =await pricePredictContract.getReserves(MaticAddress, SportTokenAddress);
          var inputVal = Math.floor(addAmounts / retVal[0] * retVal[1]);
          if(Number(stakeAmount._hex) < BetAmounts + inputVal){ 
            return {
              result : false,
              message : "Matic balance of Create Player is smaller than 0.1 Matic. But sport balance of Create Player is not enough for swap sport to matic.",
              GameID : 0,
              BetFee : 0,
              ExchangeAmount : ExchangeAmount / 10 ** 9      
            };            
          }
          //approve router
          const PriveVal = await sportContract.allowance(
            CreatePlayer,
            UniswapAddress
          );
          if (Number(PriveVal._hex) < inputVal) {
                          
            //Transaction object
            transaction = {
              from: CreatePlayer,
              to : SportTokenAddress,
              nonce,
              chainId,
              gasPrice, 
              data: etherInterfaceSport.encodeFunctionData("approve", 
                    [UniswapAddress, "1000000000000000000000000000"]) 
            };
            console.log("approve->",transaction);
            estimatedGas = await providerR.estimateGas(transaction);
            transaction["gasLimit"] = estimatedGas;
            //Sign & Send transaction
          //   console.log(estimatedGas);
            signedTx = await wallet.signTransaction(transaction);
            transactionReceipt = await provider.sendTransaction(signedTx);
            await transactionReceipt.wait();
            nonce +=1;
            
          }
          //swap sport to matic
          
                     
          let dateInAWeek = new Date();
          const deadline =
            Math.floor(dateInAWeek.getTime() / 1000) + 1000000;
          //Transaction object
          var arrParams = [ SportTokenAddress, MaticAddress];     
          transaction = {
            from: CreatePlayer,
            to : UniswapAddress,
            nonce,
            chainId,
            gasPrice, 
            data: etherInterfaceUniswap.encodeFunctionData("swapExactTokensForETHSupportingFeeOnTransferTokens", 
                  [inputVal, 0,
                    arrParams,
                    CreatePlayer,
                    deadline]) 
          };
          console.log("swap->",transaction);
          estimatedGas = await providerR.estimateGas(transaction);
          transaction["gasLimit"] = estimatedGas;
          // //Sign & Send transaction
          // console.log(estimatedGas);
          signedTx = await wallet.signTransaction(transaction);
          transactionReceipt = await provider.sendTransaction(signedTx);
          await transactionReceipt.wait();
          nonce +=1;
          ExchangeAmount+=inputVal;
        }
        
        if(Number(stakeAmount._hex) < BetAmounts){
          return {
            result : false,
            message : "Sport balance of Create Player is smaller than BetAmounts.",
            GameID : 0,
            BetFee : 0,
            ExchangeAmount : ExchangeAmount / 10 ** 9   
          };    
          
        }
        else{              
            transaction = {
              from: CreatePlayer,
              to: SportTokenAddress,
              nonce,
              chainId,
              gasPrice,
              data: etherInterfaceSport.encodeFunctionData("approveAndCreateSPGame", 
                    [  betAddress, parseInt(BetAmounts).toString()]) 
            };
            estimatedGas = await providerR.estimateGas(transaction);
            transaction["gasLimit"] = estimatedGas;
            signedTx = await wallet.signTransaction(transaction);
            
            transactionReceipt = await provider.sendTransaction(signedTx);
            await transactionReceipt.wait();
            const hash = transactionReceipt.hash;
            // Get transaction receipt
            const receipt = await providerR.getTransactionReceipt(hash);
            const { logs } = receipt;
            var logsData =  logs[2].data.toString();
            var gameIDs = Number(logsData.substr(0, 66));
            console.log("call Number end ->", callNumber)
            return {
              result : true,
              message : "success",
              GameID : gameIDs,
              BetFee : BetAmounts * Number(rakeFee) / 10000 / 10 ** 9,
              ExchangeAmount : ExchangeAmount / 10 ** 9   
            };             
        }
      } catch {
        if(callNumber >4){
          console.log("call Number retry ->", callNumber);
          return {
            result : false,
            message : "Network is Busy. Transaction failed.",
            GameID : 0,
            BetFee : 0,
            ExchangeAmount : ExchangeAmount / 10 ** 9      
          };
        }
        else{
          console.log("call Number send->", callNumber);
          var retValBuf = await fCreateSPGame(UserID, CreatePlayer, BetAmounts, ExchangeAmount, rakeFee, wallet, callNumber + 1);
          return retValBuf;          
        }        
      }
};

router.post('/CreateSPGame', async function(req, res) {
  try {
    let UserID = req.body.UserID;
    let CreatePlayer = req.body.CreatePlayer;
    let BetAmounts = Number(req.body.BetAmounts);
    var ExchangeAmount = 0;
    var curBalBuf;
    if(CreatePlayer == null || req.body.BetAmounts == null || UserID == null){
      res.json({
        result : false,
        message : "Requirement Parameters must not be null.",
        GameID : 0,
        BetFee : 0,
        ExchangeAmount : ExchangeAmount / 10 ** 9      
      });
      return;
    }
    else{  
      if(CreatePlayer.toString().toLowerCase().length == 42 && CreatePlayer.toString().toLowerCase().substring(0,2) == "0x") {
        let minBetAmounts =await betContract.minBetAmounts();
        let rakeFee =await betContract.eskillz_fee();
        if(BetAmounts >= Number(minBetAmounts._hex)){        
            var keyBuf = await getKey(UserID);
            if(keyBuf == 0){
              res.json({
                result : false,
                message : "There is no Private key on firebase. So transaction failed.",
                GameID : 0,
                BetFee : 0,
                ExchangeAmount : ExchangeAmount / 10 ** 9      
              });
              return;
            }
            let curSport = await sportContract.balanceOf(CreatePlayer);
            curBalBuf = Number(curSport)/10**9;
            var privateKeyVal = decrypt(keyBuf);
            const wallet = new ethers.Wallet(privateKeyVal, providerR);
            let returnVal = await fCreateSPGame(UserID, CreatePlayer, parseInt(BetAmounts), ExchangeAmount, rakeFee, wallet, 0);
            //
            let resValSport;
            let Samount;
            if(returnVal.result == true){

              for(var ii = 0; ii < 10; ii ++ ){
  
                resValSport = await sportContract.balanceOf(CreatePlayer);
                Samount = Number(resValSport)/10**9;
                
                if(curBalBuf != Samount) break;
              }
            }
            else{
              resValSport = await sportContract.balanceOf(CreatePlayer);
              Samount = Number(resValSport)/10**9;

            }
            //
            var docSnapSportBal = await getDoc(doc(db, "users", `${UserID}`, "Private","WalletBalances"));
            if (docSnapSportBal.exists()) {                    
              
              // await updateDoc(doc(db, "users", `${array[j]}`, "Private","WalletBalances"), {"PendingSkill" : 0});
              await updateDoc(doc(db, "users", `${UserID}`, "Private","WalletBalances"), {"CurrentSkill" : Samount});
              
            }   
            else{
              await setDoc(doc(db, "users", `${UserID}`, "Private","WalletBalances"), {"CurrentSkill" : Samount, "PendingSkill" : 0});
            }  
            res.send(returnVal);
            return;           
        
        }
        else{
          res.json({
            result : false,
            message : "BetAmounts must bigger than minBetAmounts.",
            GameID : 0,
            BetFee : 0,
            ExchangeAmount : ExchangeAmount / 10 ** 9      
          });
          return;
        }  
        return; 
      } 
      else{
        res.json({
          result : false,
          message : "Create Player is not address Type.",
          GameID : 0,
          BetFee : 0,
          ExchangeAmount : ExchangeAmount / 10 ** 9      
        });
        return;
      }
    } 
  } catch (error) {
    res.json({
      result : false,
      message : "Your Request is not correct.",
      GameID : 0,
      BetFee : 0,
      ExchangeAmount : ExchangeAmount / 10 ** 9      
    });
    return;
  }
  
});

const fCreateMPGame = async(UserID_Creator, UserID_Joiner, CreatePlayer, JoinPlayer, BetAmounts, ExchangeAmount1, ExchangeAmount2, rakeFee, wallet1, wallet2, callNumber) => {
    try {              
      let stakeAmount1 =await sportContract.balanceOf(CreatePlayer);
    let stakeAmount2 =await sportContract.balanceOf(JoinPlayer);
    let maticBal1 =await web3.eth.getBalance(CreatePlayer);
    let maticBal2 =await web3.eth.getBalance(JoinPlayer);
    var count1 = await providerR.getTransactionCount(CreatePlayer, "latest"); //get latest nonce
    var nonce1 = count1;             
    var gasPrice = 80000000000;  
    var chainId = 80001;
    var transaction1;
    var estimatedGas1;
    var signedTx1;
    var transactionReceipt1;

    var count2 = await providerR.getTransactionCount(JoinPlayer, "latest"); //get latest nonce
    var nonce2 = count2;
    var transaction2;
    var estimatedGas2;
    var signedTx2;
    var transactionReceipt2;

    if(Number(maticBal1) / 10**18 < 0.1){
      var addAmounts = 0.11 * 10**18 - maticBal1;
      let retVal =await pricePredictContract.getReserves(MaticAddress, SportTokenAddress);
      var inputVal = Math.floor(addAmounts / retVal[0] * retVal[1]);
      if(Number(stakeAmount1._hex) < BetAmounts + inputVal){
        return {
          result : false,
          message : "Matic balance of Create Player is smaller than 0.1 Matic. But sport balance of Create Player is not enough for swap sport to matic.",
          GameID : 0,
          BetFee : 0,
          ExchangeAmount1 : ExchangeAmount1 / 10 ** 9,
          ExchangeAmount2 : ExchangeAmount2 / 10 ** 9          
        };    
              
      }    
      //approve router
      const PriveVal = await sportContract.allowance(
        CreatePlayer,
        UniswapAddress
      );
      if (Number(PriveVal._hex) < inputVal) {
                      
        //Transaction object
        transaction1 = {
          from: CreatePlayer,
          to : SportTokenAddress,
          nonce : nonce1,
          chainId,
          gasPrice, 
          data: etherInterfaceSport.encodeFunctionData("approve", 
                [UniswapAddress, "1000000000000000000000000000"]) 
        };
        estimatedGas1 = await providerR.estimateGas(transaction1);
        transaction1["gasLimit"] = estimatedGas1;
        //Sign & Send transaction
        signedTx1 = await wallet1.signTransaction(transaction1);
        transactionReceipt1 = await provider.sendTransaction(signedTx1);
        await transactionReceipt1.wait();
        nonce1 +=1;
      }
      //swap sport to matic
        
     
      let dateInAWeek = new Date();
      const deadline =
        Math.floor(dateInAWeek.getTime() / 1000) + 1000000;
      //Transaction object
      var arrParams = [ SportTokenAddress, MaticAddress];     
      transaction1 = {
        from: CreatePlayer,
        to : UniswapAddress,
        nonce : nonce1,
        chainId,
        gasPrice, 
        data: etherInterfaceUniswap.encodeFunctionData("swapExactTokensForETHSupportingFeeOnTransferTokens", 
              [inputVal, 0,
                arrParams,
                CreatePlayer,
                deadline]) 
      };
      estimatedGas1 = await providerR.estimateGas(transaction1);
      transaction1["gasLimit"] = estimatedGas1;
      //Sign & Send transaction
      signedTx1 = await wallet1.signTransaction(transaction1);
      transactionReceipt1 = await provider.sendTransaction(signedTx1);
      await transactionReceipt1.wait();
      nonce1 +=1;
      ExchangeAmount1 += inputVal;
    }
    if(Number(maticBal2) / 10**18 < 0.1){
      var addAmounts = 0.11 * 10**18 - maticBal2;
      let retVal =await pricePredictContract.getReserves(MaticAddress, SportTokenAddress);
      var inputVal = Math.floor(addAmounts / retVal[0] * retVal[1]);
      if(Number(stakeAmount2._hex) < BetAmounts + inputVal){
        return {
          result : false,
          message : "Matic balance of Join Player is smaller than 0.1 Matic. But sport balance of Join Player is not enough for swap sport to matic.",
          GameID : 0,
          BetFee : 0,
          ExchangeAmount1 : ExchangeAmount1 / 10 ** 9,
          ExchangeAmount2 : ExchangeAmount2 / 10 ** 9           
        };   
         
      }
      //approve router
      const PriveVal = await sportContract.allowance(
        JoinPlayer,
        UniswapAddress
      );
      if (Number(PriveVal._hex) < inputVal) {
                      
        //Transaction object
        transaction2 = {
          from: JoinPlayer,
          to : SportTokenAddress,
          nonce : nonce2,
          chainId,
          gasPrice, 
          data: etherInterfaceSport.encodeFunctionData("approve", 
                [UniswapAddress, "1000000000000000000000000000"]) 
        };
        estimatedGas2 = await providerR.estimateGas(transaction2);
        transaction2["gasLimit"] = estimatedGas2;
        //Sign & Send transaction
        signedTx2 = await wallet2.signTransaction(transaction2);
        transactionReceipt2 = await provider.sendTransaction(signedTx2);
        await transactionReceipt2.wait();
        nonce2 +=1;
      }
      //swap sport to matic
      

      let dateInAWeek = new Date();
      const deadline =
        Math.floor(dateInAWeek.getTime() / 1000) + 1000000;
      //Transaction object
      var arrParams = [ SportTokenAddress, MaticAddress];     
      transaction2 = {
        from: JoinPlayer,
        to : UniswapAddress,
        nonce : nonce2,
        chainId,
        gasPrice, 
        data: etherInterfaceUniswap.encodeFunctionData("swapExactTokensForETHSupportingFeeOnTransferTokens", 
              [inputVal, 0,
                arrParams,
                JoinPlayer,
                deadline]) 
      };
      estimatedGas2 = await providerR.estimateGas(transaction2);
      transaction2["gasLimit"] = estimatedGas2;
      //Sign & Send transaction
      signedTx2 = await wallet2.signTransaction(transaction2);
      transactionReceipt2 = await provider.sendTransaction(signedTx2);
      await transactionReceipt2.wait();
      nonce2 +=1;
      ExchangeAmount2 += inputVal;
    }
    if(Number(stakeAmount1._hex) < BetAmounts){
      return {
        result : false,
        message : "Sport balance of Create Player is smaller than BetAmounts.",
        GameID : 0,
        BetFee : 0,
        ExchangeAmount1 : ExchangeAmount1 / 10 ** 9,
        ExchangeAmount2 : ExchangeAmount2 / 10 ** 9           
      };   
      
    }
    else{
      if(Number(stakeAmount2._hex) < BetAmounts){
        return {
          result : false,
          message : "Sport balance of Join Player is smaller than BetAmounts.",
          GameID : 0,
          BetFee : 0,
          ExchangeAmount1 : ExchangeAmount1 / 10 ** 9,
          ExchangeAmount2 : ExchangeAmount2 / 10 ** 9          
        };  
            
      }
      else{   
          
          transaction1 = {
            from: CreatePlayer,
            to: SportTokenAddress,
            nonce: nonce1,
            chainId,
            gasPrice,
            data: etherInterfaceSport.encodeFunctionData("approveAndCreateMPGame", 
                  [  betAddress, parseInt(BetAmounts).toString()]) 
          };
          estimatedGas1 = await providerR.estimateGas(transaction1);
          transaction1["gasLimit"] = estimatedGas1;
          
          signedTx1 = await wallet1.signTransaction(transaction1);
          
          transactionReceipt1 = await provider.sendTransaction(signedTx1);
          await transactionReceipt1.wait();
          var hash = transactionReceipt1.hash;
          var receipt = await providerR.getTransactionReceipt(hash);
          var { logs } = receipt;
          var logsData =  logs[2].data.toString();
          var gameIDs = Number(logsData.substr(0, 66));                        
          //createState +=1;
          
          return {
            result : true,
            message : "success",
            GameID : gameIDs,
            BetFee : BetAmounts * Number(rakeFee) / 10000 / 10 ** 9,
            ExchangeAmount1 : ExchangeAmount1 / 10 ** 9,
            ExchangeAmount2 : ExchangeAmount2 / 10 ** 9              
          };  
      }
    }
  }
  catch {
    if(callNumber >4){
      console.log("call Number retry ->", callNumber);
      return {
        result : false,
        message : "Network is Busy.Transaction failed.",
        GameID : 0,
        BetFee : 0,
        ExchangeAmount1 : ExchangeAmount1 / 10 ** 9,
        ExchangeAmount2 : ExchangeAmount2 / 10 ** 9      
      };
    }
    else{
      console.log("call Number send->", callNumber);
      var retValBuf = await fCreateMPGame(UserID_Creator, UserID_Joiner, CreatePlayer, JoinPlayer, BetAmounts, ExchangeAmount1, ExchangeAmount2, rakeFee, wallet1, wallet2, callNumber + 1);
      return retValBuf;         
    } 
  }
};

const fJoinMPGame = async( UserID_Joiner, JoinPlayer, BetAmounts, wallet2, returnVal, callNumber) => {
  try {     

  var count2 = await providerR.getTransactionCount(JoinPlayer, "latest"); //get latest nonce
  var nonce2 = count2;
  var gasPrice = 80000000000;  
  var chainId = 80001;
  var transaction2;
  var estimatedGas2;
  var signedTx2;
  var transactionReceipt2;
       
  transaction2 = {
    from: JoinPlayer,
    to: SportTokenAddress,
    nonce :nonce2,
    chainId,
    gasPrice,
    data: etherInterfaceSport.encodeFunctionData("approveAndJoinMPGame", 
          [betAddress, parseInt(BetAmounts).toString(), returnVal.GameID]) 
  };
  estimatedGas2 = await providerR.estimateGas(transaction2);
  transaction2["gasLimit"] = estimatedGas2;
  
  signedTx2 = await wallet2.signTransaction(transaction2);
  transactionReceipt2 = await provider.sendTransaction(signedTx2);
  await transactionReceipt2.wait(); 
  return returnVal;
}
catch {
  if(callNumber >4){
    console.log("call Number retry ->", callNumber);
    returnVal.GameID = 0;
    returnVal.result = false;
    returnVal.message = "Network is Busy.Transaction failed.";   
    returnVal.BetFee = 0;   
    return returnVal;
  }
  else{
    console.log("call Number send->", callNumber);
    var retValBuf = await fJoinMPGame( UserID_Joiner, JoinPlayer, BetAmounts, wallet2, returnVal, callNumber + 1);
    return retValBuf;         
  } 
}
};

router.post('/CreateMPGame', async function(req, res) {
  try {
    let UserID_Creator = req.body.UserID_Creator;
    let UserID_Joiner = req.body.UserID_Joiner;
    let CreatePlayer = req.body.CreatePlayer;
    let JoinPlayer = req.body.JoinPlayer;
    let BetAmounts = Number(req.body.BetAmounts);
    //var createState = 0;
    var ExchangeAmount1 = 0;
    var ExchangeAmount2 = 0;
    var curBalBuf;     
    if(CreatePlayer == null || JoinPlayer == null || req.body.BetAmounts == null || UserID_Creator == null|| UserID_Joiner == null){
      res.json({
        result : false,
        message : "Requirement Parameters must not be null.",
        GameID : 0,
        BetFee : 0,
        ExchangeAmount1 : ExchangeAmount1 / 10 ** 9,
        ExchangeAmount2 : ExchangeAmount2 / 10 ** 9      
      });
      return;
    }
    else{   
      if(CreatePlayer.toString().toLowerCase().length == 42 && CreatePlayer.toString().toLowerCase().substring(0,2) == "0x") {
        if(JoinPlayer.toString().toLowerCase().length == 42 && JoinPlayer.toString().toLowerCase().substring(0,2) == "0x") {
          if(JoinPlayer.toString().toLowerCase() == CreatePlayer.toString().toLowerCase()){
            res.json({
              result : false,
              message : "JoinPlayer is equal to Create Player.",
              GameID : 0,
              BetFee : 0,
              ExchangeAmount1 : ExchangeAmount1 / 10 ** 9,
              ExchangeAmount2 : ExchangeAmount2 / 10 ** 9       
            });
            return;
          }
          else{
            let rakeFee =await betContract.eskillz_fee();
            let minBetAmounts =await betContract.minBetAmounts();
            if(BetAmounts >= Number(minBetAmounts._hex)){
                
                var keyBuf1 = await getKey(UserID_Creator);
                if(keyBuf1 == 0){
                  res.json({
                    result : false,
                    message : "There is no Private key of create player on firebase. So transaction failed.",
                    GameID : 0,
                    BetFee : 0,
                    ExchangeAmount1 : ExchangeAmount1 / 10 ** 9,
                    ExchangeAmount2 : ExchangeAmount2 / 10 ** 9     
                  });
                  return;
                }
                var privateKeyVal1 = decrypt(keyBuf1);
                var wallet1 = new ethers.Wallet(privateKeyVal1, providerR);
                var keyBuf2 = await getKey(UserID_Joiner);
                if(keyBuf2 == 0){
                  res.json({
                    result : false,
                    message : "There is no Private key of Join player on firebase. So transaction failed.",
                    GameID : 0,
                    BetFee : 0,
                    ExchangeAmount1 : ExchangeAmount1 / 10 ** 9,
                    ExchangeAmount2 : ExchangeAmount2 / 10 ** 9      
                  });
                  return;
                }
                var privateKeyVal2 = decrypt(keyBuf2);
                var wallet2 = new ethers.Wallet(privateKeyVal2, providerR);
                let returnVal = await fCreateMPGame(UserID_Creator, UserID_Joiner, CreatePlayer, JoinPlayer, parseInt(BetAmounts), ExchangeAmount1, ExchangeAmount2, rakeFee, wallet1, wallet2, 0);
                console.log(returnVal);
                let curSport = await sportContract.balanceOf(JoinPlayer);
                curBalBuf = Number(curSport)/10**9;
                if(returnVal.GameID > 0){
                  console.log(">0 -> ", returnVal);
                  let returnVal1 = await fJoinMPGame(UserID_Joiner, JoinPlayer, parseInt(BetAmounts), wallet2, returnVal, 0);
                  let resValSport;
                  let Samount;
                  if(returnVal1.result == true){
                    console.log(returnVal1);
                    for(var ii = 0; ii < 10; ii ++ ){
                      console.log(ii);
        
                      resValSport = await sportContract.balanceOf(JoinPlayer);
                      Samount = Number(resValSport)/10**9;
                      
                      if(curBalBuf != Samount) break;
                    }
                  }
                  else{
                    resValSport = await sportContract.balanceOf(JoinPlayer);
                    Samount = Number(resValSport)/10**9;

                  }
                  console.log(Samount);
                  var docSnapSportBal = await getDoc(doc(db, "users", `${UserID_Joiner}`, "Private","WalletBalances"));
                  if (docSnapSportBal.exists()) {                    
                      
                    // await updateDoc(doc(db, "users", `${array[j]}`, "Private","WalletBalances"), {"PendingSkill" : 0});
                    await updateDoc(doc(db, "users", `${UserID_Joiner}`, "Private","WalletBalances"), {"CurrentSkill" : Samount});
                    
                  }   
                  else{
                    await setDoc(doc(db, "users", `${UserID_Joiner}`, "Private","WalletBalances"), {"CurrentSkill" : Samount, "PendingSkill" : 0});
                  }  
                  console.log("end");
                  let resValSportC = await sportContract.balanceOf(CreatePlayer);
                  let SamountC = Number(resValSportC)/10**9;
                  let docSnapSportBalC = await getDoc(doc(db, "users", `${UserID_Creator}`, "Private","WalletBalances"));
                  if (docSnapSportBalC.exists()) {                    
                      
                    // await updateDoc(doc(db, "users", `${array[j]}`, "Private","WalletBalances"), {"PendingSkill" : 0});
                    await updateDoc(doc(db, "users", `${UserID_Creator}`, "Private","WalletBalances"), {"CurrentSkill" : SamountC});
                    
                  }   
                  else{
                    await setDoc(doc(db, "users", `${UserID_Creator}`, "Private","WalletBalances"), {"CurrentSkill" : SamountC, "PendingSkill" : 0});
                  }    
                  res.send(returnVal1);
                }
                else{
                  console.log(" = 0->",returnVal);
                  res.send(returnVal);
                }
                return;       
                
              }
            else{
              res.json({
                result : false,
                message : "BetAmounts must bigger than minBetAmounts.",
                GameID : 0,
                BetFee : 0,
                ExchangeAmount1 : ExchangeAmount1 / 10 ** 9,
                ExchangeAmount2 : ExchangeAmount2 / 10 ** 9     
              });
            } 
            return;  
          }
        } 
        else{
          res.json({
            result : false,
            message : "Join Player is not address Type.",
            GameID : 0,
            BetFee : 0,
            ExchangeAmount1 : ExchangeAmount1 / 10 ** 9,
            ExchangeAmount2 : ExchangeAmount2 / 10 ** 9     
          });
        }
      } 
      else{
        res.json({
          result : false,
          message : "Create Player is not address Type.",
          GameID : 0,
          BetFee : 0,
          ExchangeAmount1 : ExchangeAmount1 / 10 ** 9,
          ExchangeAmount2 : ExchangeAmount2 / 10 ** 9     
        });
      }
    } 
  } catch (error) {
    res.json({
      result : false,
      message : "Your Request is not correct.",
      GameID : 0,
      BetFee : 0,
      ExchangeAmount1 : ExchangeAmount1 / 10 ** 9,
      ExchangeAmount2 : ExchangeAmount2 / 10 ** 9  
    });
    return;
  }
  
});

const fSetSPGameResult = async(UserID, GameID, WinPlayer, Result, ExchangeAmount, wallet, callNumber) => {
    
   try{ 
              
    // let maticBal =await web3.eth.getBalance(WinPlayer);
    var count = await providerR.getTransactionCount(WinPlayer, "latest");
    var nonce = count;             
    var gasPrice = 80000000000;  
    var chainId = 80001;
    var transaction;
    var estimatedGas;
    var signedTx;
    var transactionReceipt;
    // let stakeAmount =await sportContract.balanceOf(WinPlayer);
    // if(Number(maticBal) / 10**18 < 0.1){
    //   var addAmounts = 0.11 * 10**18 - maticBal;
    //   let retVal =await pricePredictContract.getReserves(MaticAddress, SportTokenAddress);
    //   var inputVal = Math.floor(addAmounts / retVal[0] * retVal[1]);
    //   //approve router
    //   const PriveVal = await sportContract.allowance(
    //     WinPlayer,
    //     UniswapAddress
    //   );
    //   if (Number(PriveVal._hex) < inputVal) {
                      
    //     //Transaction object
    //     transaction = {
    //       from: WinPlayer,
    //       to : SportTokenAddress,
    //       nonce,
    //       chainId,
    //       gasPrice, 
    //       data: etherInterfaceSport.encodeFunctionData("approve", 
    //             [UniswapAddress, "1000000000000000000000000000"]) 
    //     };
    //     estimatedGas = await providerR.estimateGas(transaction);
    //     transaction["gasLimit"] = estimatedGas;
    //     //Sign & Send transaction
    //     signedTx = await wallet.signTransaction(transaction);
    //     transactionReceipt = await provider.sendTransaction(signedTx);
    //     await transactionReceipt.wait();
    //     nonce +=1;
    //   }
    //   //swap sport to matic

    //   if(Number(stakeAmount._hex) < inputVal){  
    //     return {
    //       result : false,
    //       message : "Sport balance of Winner is not enough.",
    //       ExchangeAmount : ExchangeAmount / 10 ** 9      
    //     };  
    //   }
      
    //   let dateInAWeek = new Date();
    //   const deadline =
    //     Math.floor(dateInAWeek.getTime() / 1000) + 1000000;
    //   //Transaction object
    //   var arrParams = [ SportTokenAddress, MaticAddress];     
    //   transaction = {
    //     from: WinPlayer,
    //     to : UniswapAddress,
    //     nonce,
    //     chainId,
    //     gasPrice, 
    //     data: etherInterfaceUniswap.encodeFunctionData("swapExactTokensForETHSupportingFeeOnTransferTokens", 
    //           [inputVal, 0,
    //             arrParams,
    //             WinPlayer,
    //             deadline]) 
    //   };
    //   estimatedGas = await providerR.estimateGas(transaction);
    //   transaction["gasLimit"] = estimatedGas;
    //   //Sign & Send transaction
    //   signedTx = await wallet.signTransaction(transaction);
    //   transactionReceipt = await provider.sendTransaction(signedTx);
    //   await transactionReceipt.wait();
    //   nonce +=1;
    //   ExchangeAmount += inputVal;
    // }
      
    //Transaction object
    transaction = {
      from: WinPlayer,
      to: betAddress,
      nonce,
      chainId,
      gasPrice,
      data: etherInterface.encodeFunctionData("SetSPGameResult", 
            [GameID.toString(), Result.toString()]) 
    };
    //Estimate gas limit
    estimatedGas = await providerR.estimateGas(transaction);
    transaction["gasLimit"] = estimatedGas;
    //Sign & Send transaction
    
    signedTx = await wallet.signTransaction(transaction);
    transactionReceipt = await provider.sendTransaction(signedTx);
    await transactionReceipt.wait();
    const hash = transactionReceipt.hash;
    await deleteDoc(doc(db, "eskillzGameResult", GameID.toString()));
    console.log("call Number suc ->", callNumber);
    return {
      result : true,
      message : String(hash),
      ExchangeAmount : ExchangeAmount / 10 ** 9     
    }; 
  }
  catch{
    if(callNumber >4){
      console.log("call Number retry ->", callNumber);
      return {
        result : false,
        message : "Network is busy. Transaction failed.",
        ExchangeAmount : ExchangeAmount / 10 ** 9     
      };
    }
    else{
      console.log("call Number send->", callNumber);
      var retValBuf = await fSetSPGameResult(UserID, GameID, WinPlayer, Result, ExchangeAmount, wallet, callNumber + 1);
      return retValBuf;          
    }   
  }
};

const deleteGameResult = async(insertedId) => {
  try {
    
    var rows = await knex('gameresult').del().where('Id', insertedId);
    if(rows == 1){
      return;
    }
    else{
      await deleteGameResult(insertedId);
    }
  } catch (error) {
    return;
  }
}

router.post('/SetSPGameResult', async function(req, res) {
  try {
    let UserID = req.body.UserID;
    let GameID = Number(req.body.GameID);
    var ExchangeAmount = 0;
    var RakeFee = 5;
    var curBalBuf;
    var pendBalBuf = 0;    
    
    if(GameID == null || UserID == null){
      res.json({
        result : false,
        message : "Requirement Parameters must not be null.",
        ExchangeAmount : ExchangeAmount / 10 ** 9      
      });
      return;
    }
    else{  
      let WinPlayer;
      let Result;
      const docSnap = await getDoc(doc(db, "eskillzGameResult", GameID.toString()));
      console.log("1");
      if (docSnap.exists()) {
        WinPlayer = docSnap.data().winAddress;
        Result = docSnap.data().result;
        if(WinPlayer == null || Result == null){
          res.json({
            result : false,
            message : "There is no WinPlater and Result on firebase. So transaction is failed.",
            ExchangeAmount : ExchangeAmount / 10 ** 9      
          });
          return;
        }
        if(GameID > 0){
          if(WinPlayer.toString().length == 42){
            if(Number(Result) >=0){
                let betAmounts_ID =await betContract.gamebetting(String(GameID),"0");
              var dateTimeComp = new Date();
              var rowsComp = await knex('gameresult').where('GameID', GameID).where('UserID', UserID).orderBy('CreatedTime', 'desc').select('*');
              if(rowsComp.length){
                if(dateTimeComp - rowsComp[0].CreatedTime < 60000){
                  res.send("MutiCalls");
                  return;
                }
              }
              
              //getrakefee
              
              var rows_rakefee = await knex('chainparam').select('*');
              if (rows_rakefee.length) {
                RakeFee = Number(rows_rakefee[0].RakeFee);
                console.log("rakefee->",Number(rows_rakefee[0].RakeFee));
              }
              //add mintMore
              var dateTime = new Date();
              var insertedID = await knex('gameresult').insert({UserID :UserID ,  
                GameID: GameID,
                Type: 0,
                CreatedTime: dateTime,
                ReCallNum: 0,
                WinPlayer : WinPlayer.toString(),
                Result : Result.toString(),
                Amounts : String(Number(betAmounts_ID[1])*(100 + Number(Result) - RakeFee)/100)
              });   
  
              console.log("betAmounts->",Number(betAmounts_ID[1]));
              
              let curSport = await sportContract.balanceOf(WinPlayer);
              curBalBuf = Number(curSport)/10**9;
              //add pendingToken
              var docSnapBal = await getDoc(doc(db, "users", `${UserID}`, "Private","WalletBalances"));
        
              if (docSnapBal.exists()) {
                var PSExist = docSnapBal.data()["PendingSkill"];
                if(PSExist != null){
                      
                  await updateDoc(doc(db, "users", `${UserID}`, "Private","WalletBalances"), {"PendingSkill" : Number(PSExist) + Number(betAmounts_ID[1])*(100 + Number(Result) - RakeFee)/100/10**9});
                  pendBalBuf = Number(PSExist);
                }
                else{
                  
                  await updateDoc(doc(db, "users", `${UserID}`, "Private","WalletBalances"), {"PendingSkill" : Number(betAmounts_ID[1])*(100 + Number(Result) - RakeFee)/100/10**9});
                }             
              }   
              else{
                await setDoc(doc(db, "users", `${UserID}`, "Private","WalletBalances"), {"CurrentSkill" : 0, "PendingSkill" : Number(betAmounts_ID[1])*(100 + Number(Result) - RakeFee)/100/10**9});
              }

              var rows = await knex('pendingtoken').where('address', WinPlayer).select('*');
              if (rows.length) {
                await knex('pendingtoken').where('address', WinPlayer).update({    
                    balance: String(Number(rows[0].balance) + Number(betAmounts_ID[1])*(100 + Number(Result) - RakeFee)/100),
                });      
              }
              else{    
                await knex('pendingtoken').insert({address :WinPlayer ,  
                  balance: String(Number(betAmounts_ID[1])*(100 + Number(Result) -RakeFee)/100),
                });   
              }
              var keyBuf = await getKey(UserID);
              if(keyBuf == 0){
                  res.json({
                    result : false,
                    message : "There is no Private key of Winner on firebase. So transaction is failed.",
                    ExchangeAmount : ExchangeAmount / 10 ** 9      
                  });
                  return;
              }
              var privateKeyVal = decrypt(keyBuf);
              const wallet = new ethers.Wallet(privateKeyVal, providerR);
              let returnVal = await fSetSPGameResult(UserID, GameID, WinPlayer, parseInt(Number(Result)), ExchangeAmount, wallet, 0);
              if(returnVal.result == true){
                await deleteGameResult(insertedID[0]);
                await removePendingBalance(UserID,WinPlayer, Number(betAmounts_ID[1])*(100 + Number(Result) -RakeFee)/100);
                //
                var docSnapBUF = await getDoc(doc(db, "users", `${UserID}`, "Private","WalletBalances"));
            
                if (docSnapBUF.exists()) {
                  var PSExistBuf = docSnapBUF.data()["PendingSkill"];
                  if(PSExistBuf != null){
                    if(Number(PSExistBuf) != Number(pendBalBuf)){
                      console.log("PS");
                      await updateDoc(doc(db, "users", `${UserID}`, "Private","WalletBalances"), {"PendingSkill" : pendBalBuf});
                    }                    
                  }                         
                }   
                
                //
                let resValSport;
                let Samount;
                for(var ii = 0; ii < 10; ii ++ ){

                  resValSport = await sportContract.balanceOf(WinPlayer);
                  Samount = Number(resValSport)/10**9;
                  console.log(ii);
                  console.log(Samount);
                  console.log(curBalBuf);
                  if(curBalBuf != Samount) break;
                }
                //
                var docSnapSportBal = await getDoc(doc(db, "users", `${UserID}`, "Private","WalletBalances"));
                if (docSnapSportBal.exists()) {                    
                  
                  // await updateDoc(doc(db, "users", `${array[j]}`, "Private","WalletBalances"), {"PendingSkill" : 0});
                  await updateDoc(doc(db, "users", `${UserID}`, "Private","WalletBalances"), {"CurrentSkill" : Samount});
                  
                }   
                else{
                  await setDoc(doc(db, "users", `${UserID}`, "Private","WalletBalances"), {"CurrentSkill" : Samount, "PendingSkill" : 0});
                }   
              }
              res.send(returnVal);
              return;           
            }
            else{
              res.json({
                result : false,
                message : "Result is not correct on firebase.",
                ExchangeAmount : ExchangeAmount / 10 ** 9      
              });
            }
          }
          else{
            res.json({
              result : false,
              message : "winAdress is not address Type.",
              ExchangeAmount : ExchangeAmount / 10 ** 9      
            });
          }             
        }
        else{
          res.json({
            result : false,
            message : "GameID must bigger than zero.",
            ExchangeAmount : ExchangeAmount / 10 ** 9      
          });
        }
      } else {
        res.json({
          result : false,
          message : "Can not find GameID on firebase.",
          ExchangeAmount : ExchangeAmount / 10 ** 9      
        });
      }
      return;    
    } 
  } catch (error) {
    res.json({
      result : false,
      message : "Your Request is not correct.",
      ExchangeAmount : ExchangeAmount / 10 ** 9      
    });
    return;
  }
 
});

const fSetMPGameResult = async(UserID, GameID, WinPlayer, ExchangeAmount, wallet, callNumber) => {
    
  try{ 
    // let maticBal =await web3.eth.getBalance(WinPlayer);
    var count = await providerR.getTransactionCount(WinPlayer, "latest");
    var nonce = count;             
    var gasPrice = 80000000000;  
    var chainId = 80001;
    var transaction;
    var estimatedGas;
    var signedTx;
    var transactionReceipt;
    // let stakeAmount =await sportContract.balanceOf(WinPlayer);
    
    
    // if(Number(maticBal) / 10**18 < 0.1){
    //   var addAmounts = 0.11 * 10**18 - maticBal;
    //   let retVal =await pricePredictContract.getReserves(MaticAddress, SportTokenAddress);
    //   var inputVal = Math.floor(addAmounts / retVal[0] * retVal[1]);
    //   //approve router
    //   const PriveVal = await sportContract.allowance(
    //     WinPlayer,
    //     UniswapAddress
    //   );
    //   if (Number(PriveVal._hex) < inputVal) {
                      
    //     //Transaction object
    //     transaction = {
    //       from: WinPlayer,
    //       to : SportTokenAddress,
    //       nonce,
    //       chainId,
    //       gasPrice, 
    //       data: etherInterfaceSport.encodeFunctionData("approve", 
    //             [UniswapAddress, "1000000000000000000000000000"]) 
    //     };
    //     estimatedGas = await providerR.estimateGas(transaction);
    //     transaction["gasLimit"] = estimatedGas;
    //     //Sign & Send transaction
    //     signedTx = await wallet.signTransaction(transaction);
    //     transactionReceipt = await provider.sendTransaction(signedTx);
    //     await transactionReceipt.wait();
    //     nonce +=1;
    //   }
    //   //swap sport to matic
  
    //   if(Number(stakeAmount._hex) < inputVal){
    //     return {
    //       result : false,
    //       message : "Sport balance of Winner is not enough.",
    //       ExchangeAmount : ExchangeAmount / 10 ** 9 
    //     };  
       
    //   }
      
    //   let dateInAWeek = new Date();
    //   const deadline =
    //     Math.floor(dateInAWeek.getTime() / 1000) + 1000000;
    //   //Transaction object
    //   var arrParams = [ SportTokenAddress, MaticAddress];     
    //   transaction = {
    //     from: WinPlayer,
    //     to : UniswapAddress,
    //     nonce,
    //     chainId,
    //     gasPrice, 
    //     data: etherInterfaceUniswap.encodeFunctionData("swapExactTokensForETHSupportingFeeOnTransferTokens", 
    //           [inputVal, 0,
    //             arrParams,
    //             WinPlayer,
    //             deadline]) 
    //   };
    //   estimatedGas = await providerR.estimateGas(transaction);
    //   transaction["gasLimit"] = estimatedGas;
    //   //Sign & Send transaction
    //   signedTx = await wallet.signTransaction(transaction);
    //   transactionReceipt = await provider.sendTransaction(signedTx);
    //   await transactionReceipt.wait();
    //   nonce +=1;
    //   ExchangeAmount += inputVal;
    // }
    //Transaction object
    transaction = {
      from: WinPlayer,
      to: betAddress,
      nonce,
      chainId,
      gasPrice,
      data: etherInterface.encodeFunctionData("SetMPGameResult", 
            [ GameID.toString()]) 
    };
    
    console.log(GameID);
    console.log(UserID);
    console.log(WinPlayer);
    console.log(wallet);
    //Estimate gas limit
    estimatedGas = await providerR.estimateGas(transaction);
    transaction["gasLimit"] = estimatedGas;
    console.log(estimatedGas);
    //Sign & Send transaction
    
    signedTx = await wallet.signTransaction(transaction);
    transactionReceipt = await provider.sendTransaction(signedTx);
    await transactionReceipt.wait();
    const hash = transactionReceipt.hash;
    await deleteDoc(doc(db, "eskillzGameResult", GameID.toString()));
    console.log("call Number suc ->", callNumber);
    return {
      result : true,
      message : String(hash),
      ExchangeAmount : ExchangeAmount / 10 ** 9 
    };
   
 }
 catch{
   if(callNumber >4){
     console.log("call Number retry ->", callNumber);
     return {
       result : false,
       message : "Network is busy. Transaction failed.",
       ExchangeAmount : ExchangeAmount / 10 ** 9     
     };
   }
   else{
     console.log("call Number send->", callNumber);
     var retValBuf = await fSetMPGameResult(UserID, GameID, WinPlayer, ExchangeAmount, wallet, callNumber + 1);
     return retValBuf;          
   }   
 }
 
};

router.post('/SetMPGameResult', async function(req, res) {
  try {
    let UserID = req.body.UserID;
    let GameID = Number(req.body.GameID);
    var ExchangeAmount = 0;
    var RakeFee = 5;
    var curBalBuf;
    var pendBalBuf = 0;         
    
    if(GameID == null || UserID == null){
      res.json({
        result : false,
        message : "Requirement Parameters must not be null.",
        ExchangeAmount : ExchangeAmount / 10 ** 9      
      });
      return;
    }
    else{  
        let WinPlayer;
        const docSnap = await getDoc(doc(db, "eskillzGameResult", GameID.toString()));
        if (docSnap.exists()) {
          WinPlayer = docSnap.data().winAddress;
          if(WinPlayer == null){
            res.json({
              result : false,
              message : "There is no WinPlater on firebase. So transaction is failed.",
              ExchangeAmount : ExchangeAmount / 10 ** 9      
            });
            return;
          }
          if(GameID > 0 ){
            if(WinPlayer.toString().length == 42){
                let betAmounts_ID =await betContract.gamebetting(String(GameID),"0");
              var dateTimeComp = new Date();
              var rowsComp = await knex('gameresult').where('GameID', GameID).where('UserID', UserID).orderBy('CreatedTime', 'desc').select('*');
              if(rowsComp.length){
                if(dateTimeComp - rowsComp[0].CreatedTime < 60000){
                  res.send("MutiCalls");
                  return;
                }
              }              
             
              //getrakefee
                
              var rows_rakefee = await knex('chainparam').select('*');
              if (rows_rakefee.length) {
                RakeFee = Number(rows_rakefee[0].RakeFee);
                console.log("rakefee->",Number(rows_rakefee[0].RakeFee));
              }
              //add mintMore
              var dateTime = new Date();
              var insertedID = await knex('gameresult').insert({UserID :UserID ,  
                GameID: GameID,
                Type: 1,
                CreatedTime: dateTime,
                ReCallNum: 0,
                WinPlayer : WinPlayer.toString(),
                Result: "0",
                Amounts : String(Number(betAmounts_ID[1])*(200 - RakeFee)/100)
              }); 
              console.log("betAmounts->",Number(betAmounts_ID[1]));
              let curSport = await sportContract.balanceOf(WinPlayer);
              curBalBuf = Number(curSport)/10**9;
              //add pendingToken
              var docSnapBal = await getDoc(doc(db, "users", `${UserID}`, "Private","WalletBalances"));
        
              if (docSnapBal.exists()) {
                var PSExist = docSnapBal.data()["PendingSkill"];
                if(PSExist != null){
                      
                  await updateDoc(doc(db, "users", `${UserID}`, "Private","WalletBalances"), {"PendingSkill" : Number(PSExist) + Number(betAmounts_ID[1])*(200 - RakeFee)/100/10**9});
                  pendBalBuf = Number(PSExist);
                }
                else{
                  
                  await updateDoc(doc(db, "users", `${UserID}`, "Private","WalletBalances"), {"PendingSkill" : Number(betAmounts_ID[1])*(200 - RakeFee)/100/10**9});
                }             
              }   
              else{
                await setDoc(doc(db, "users", `${UserID}`, "Private","WalletBalances"), {"CurrentSkill" : 0, "PendingSkill" : Number(betAmounts_ID[1])*(200 - RakeFee)/100/10**9});
              }
              var rows = await knex('pendingtoken').where('address', WinPlayer).select('*');
              if (rows.length) {
                await knex('pendingtoken').where('address', WinPlayer).update({    
                    balance: String(Number(rows[0].balance) + Number(betAmounts_ID[1])*(200 - RakeFee)/100),
                });      
              }
              else{    
                await knex('pendingtoken').insert({address :WinPlayer ,  
                  balance: String(Number(betAmounts_ID[1])*(200 -RakeFee)/100),
                });   
              }

              var keyBuf = await getKey(UserID);
              if(keyBuf == 0){
                res.json({
                  result : false,
                  message : "There is no Private key of Winner on firebase. So transaction is failed.",
                  ExchangeAmount : ExchangeAmount / 10 ** 9      
                });
                return;
              }
              var privateKeyVal = decrypt(keyBuf);
              const wallet = new ethers.Wallet(privateKeyVal, providerR);
              let returnVal = await fSetMPGameResult(UserID, GameID, WinPlayer, ExchangeAmount, wallet, 0);
              if(returnVal.result == true){
                await deleteGameResult(insertedID[0]);
                await removePendingBalance(UserID,WinPlayer, Number(betAmounts_ID[1])*(200 -RakeFee)/100);
                 //
                 var docSnapBUF = await getDoc(doc(db, "users", `${UserID}`, "Private","WalletBalances"));
            
                 if (docSnapBUF.exists()) {
                   var PSExistBuf = docSnapBUF.data()["PendingSkill"];
                   if(PSExistBuf != null){
                    if(Number(PSExistBuf) != Number(pendBalBuf)){
 
                       await updateDoc(doc(db, "users", `${UserID}`, "Private","WalletBalances"), {"PendingSkill" : pendBalBuf});
                     }                    
                   }                         
                 }   
                 
                 //
                 let resValSport;
                 let Samount;
                 for(var ii = 0; ii < 10; ii ++ ){
 
                   resValSport = await sportContract.balanceOf(WinPlayer);
                   Samount = Number(resValSport)/10**9;
                   if(curBalBuf != Samount) break;
                 }
                 //
                var docSnapSportBal = await getDoc(doc(db, "users", `${UserID}`, "Private","WalletBalances"));
                if (docSnapSportBal.exists()) {                    
                  
                  // await updateDoc(doc(db, "users", `${array[j]}`, "Private","WalletBalances"), {"PendingSkill" : 0});
                  await updateDoc(doc(db, "users", `${UserID}`, "Private","WalletBalances"), {"CurrentSkill" : Samount});
                  
                }   
                else{
                  await setDoc(doc(db, "users", `${UserID}`, "Private","WalletBalances"), {"CurrentSkill" : Samount, "PendingSkill" : 0});
                }   
              }
              res.send(returnVal); 
              return;            
            }
            else{
              res.json({
                result : false,
                message : "winAdress is not address Type.",
                ExchangeAmount : ExchangeAmount / 10 ** 9      
              });
            }             
          }
          else{
            res.json({
              result : false,
              message : "GameID must bigger than zero.",
              ExchangeAmount : ExchangeAmount / 10 ** 9      
            });
          } 
        } else {
          res.json({
            result : false,
            message : "Can not find GameID and winAddress on firebase.",
            ExchangeAmount : ExchangeAmount / 10 ** 9      
          });
        }
        return;
          
    } 
  } catch (error) {
    res.json({
      result : false,
      message : "Your Request is not correct.",
      ExchangeAmount : ExchangeAmount / 10 ** 9      
    });
    return;
  }
  
});

router.post('/SendSport', async function(req, res) {
  try {
    let UserID = req.body.UserID;
    let Account = req.body.Account;
    let ToAddress = req.body.ToAddress;
    let Amounts = Number(req.body.Amounts);
    if(Account == null || ToAddress == null || Amounts == null || UserID == null){
      res.send("Account and ToAddress and Amounts must not be null.");
      return;
    }
    else{  
      if(Account.toString().toLowerCase().length == 42 && Account.toString().toLowerCase().substring(0,2) == "0x") {
    
              try{   
                const count = await providerR.getTransactionCount(Account, "latest"); //get latest nonce
                var nonce = count;
                var gasPrice = 80000000000;  
                var chainId = 80001;
                //Transaction object
                const transaction = {
                  from: Account,
                  to: SportTokenAddress,
                  nonce,
                  chainId,
                  gasPrice,
                  data: etherInterfaceSport.encodeFunctionData("transfer", 
                        [ ToAddress, parseInt(Amounts).toString()]) 
                };
                //Estimate gas limit
                const estimatedGas = await providerR.estimateGas(transaction);
                transaction["gasLimit"] = estimatedGas;
                //Sign & Send transaction
                var keyBuf = await getKey(UserID);
                if(keyBuf == 0){
                  res.send("There is no Private key on firebase. So transaction is failed.");
                  return;
                }
                var privateKeyVal = decrypt(keyBuf);
                const wallet = new ethers.Wallet(privateKeyVal, providerR);
                const signedTx = await wallet.signTransaction(transaction);
                const transactionReceipt = await provider.sendTransaction(signedTx);
                await transactionReceipt.wait();
                const hash = transactionReceipt.hash;             
                res.send(String(hash));

                let resValSport = await sportContract.balanceOf(Account);
                let Samount = Number(resValSport)/10**9;
                var docSnapSportBal = await getDoc(doc(db, "users", `${UserID}`, "Private","WalletBalances"));
                if (docSnapSportBal.exists()) {                    
                    
                  // await updateDoc(doc(db, "users", `${array[j]}`, "Private","WalletBalances"), {"PendingSkill" : 0});
                  await updateDoc(doc(db, "users", `${UserID}`, "Private","WalletBalances"), {"CurrentSkill" : Samount});
                            
                }   
                else{
                  await setDoc(doc(db, "users", `${UserID}`, "Private","WalletBalances"), {"CurrentSkill" : Samount, "PendingSkill" : 0});
                }   
                
                return;
              }
              catch{
                res.send("Network is Busy. Transaction failed.");
              }         
            
          
      } 
      else{
        res.send("Account is not address Type.");

      }
      return;
    } 
  } catch (error) {
    res.send("Your Request is not correct.");
    return;
  }
  
});

router.post('/SendEsg', async function(req, res) {
  try {
    let UserID = req.body.UserID;
    let Account = req.body.Account;
    let ToAddress = req.body.ToAddress;
    let Amounts = Number(req.body.Amounts);
    if(Account == null || ToAddress == null || Amounts == null || UserID == null){
      res.send("Account and ToAddress and Amounts must not be null.");
      return;
    }
    else{  
      if(Account.toString().toLowerCase().length == 42 && Account.toString().toLowerCase().substring(0,2) == "0x") {
    
              try{   
                const count = await providerR.getTransactionCount(Account, "latest"); //get latest nonce
                var nonce = count;
                var gasPrice = 80000000000;  
                var chainId = 80001;
                //Transaction object
                const transaction = {
                  from: Account,
                  to: EsgTokenAddress,
                  nonce,
                  chainId,
                  gasPrice,
                  data: etherInterfaceEsg.encodeFunctionData("transfer", 
                        [ ToAddress, parseInt(Amounts).toString()]) 
                };
                //Estimate gas limit
                const estimatedGas = await providerR.estimateGas(transaction);
                transaction["gasLimit"] = estimatedGas;
                //Sign & Send transaction
                var keyBuf = await getKey(UserID);
                if(keyBuf == 0){
                  res.send("There is no Private key on firebase. So transaction is failed.");
                  return;
                }
                var privateKeyVal = decrypt(keyBuf);
                const wallet = new ethers.Wallet(privateKeyVal, providerR);
                const signedTx = await wallet.signTransaction(transaction);
                const transactionReceipt = await provider.sendTransaction(signedTx);
                await transactionReceipt.wait();
                const hash = transactionReceipt.hash;             
                res.send(String(hash));
                return;
              }
              catch{
                res.send("Network is Busy. Transaction failed.");
              }         
           return; 
          
      } 
      else{
        res.send("Account is not address Type.");
        return;
      }
      return;
    } 
  } catch (error) {
    res.send("Your Request is not correct.");
    return;
  }
  
});

router.post('/SendMatic', async function(req, res) {
  try {
    let UserID = req.body.UserID;
    let Account = req.body.Account;
    let ToAddress = req.body.ToAddress;
    let Amounts = Number(req.body.Amounts);
    if(Account == null || ToAddress == null || Amounts == null || UserID == null){
      res.send("Account and ToAddress and Amounts must not be null.");
      return;
    }
    else{  
      if(Account.toString().toLowerCase().length == 42 && Account.toString().toLowerCase().substring(0,2) == "0x") {
    
              try{   
                let maticBal =await web3.eth.getBalance(Account);
                if(Number(maticBal) / 10**18 - Amounts < 0.1){
                  res.send("Remain Matic Balance of Eskillz Wallet must be bigger than 0.1 Matic.");
                  return;
                }
                const count = await providerR.getTransactionCount(Account, "latest"); //get latest nonce
                var nonce = count;
                var gasPrice = 80000000000;  
                var chainId = 80001;
                //Transaction object
                const transaction = {
                  to: ToAddress,
                  value : ethers.utils.parseEther(Amounts.toString()),  //web3.utils.toHex(web3.utils.toWei(amountToSend.toString(), 'ether')),
                  nonce,
                  chainId,
                  gasPrice
                };
                //Estimate gas limit
                const estimatedGas = await providerR.estimateGas(transaction);
                transaction["gasLimit"] = estimatedGas;
                //Sign & Send transaction
                var keyBuf = await getKey(UserID);
                if(keyBuf == 0){
                  res.send("There is no Private key on firebase. So transaction is failed.");
                  return;
                }
                var privateKeyVal = decrypt(keyBuf);
                const wallet = new ethers.Wallet(privateKeyVal, providerR);
                const transactionReceipt = await wallet.sendTransaction(transaction);
                
                // const signedTx = await wallet.signTransaction(transaction);
                // const transactionReceipt = await provider.sendTransaction(signedTx);
                await transactionReceipt.wait();
                const hash = transactionReceipt.hash;             
                res.send(String(hash));
                return;
              }
              catch{
                res.send("Network is Busy. Transaction failed.");
              } 
              return;  
      } 
      else{
        res.send("Account is not address Type.");
        return;
      }
      return;
    }
  } catch (error) {
    res.send("Your Request is not correct.");
    return;
  }
   
});

router.post('/UpdateTokenUri', async function(req, res) {
  try {
    let UserID = req.body.UserID;
    let Account = req.body.Account;
    let TokenID = req.body.TokenID;
    let TokenURI = req.body.TokenURI;

    if(Account == null || TokenID ==null || TokenURI == null || UserID == null){
      res.send("Account and TokenID and TokenURI must not be null.");
      return;
    }
    else{  
      if(Account.toString().toLowerCase().length == 42 && Account.toString().toLowerCase().substring(0,2) == "0x") {

              try{   
                const count = await providerR.getTransactionCount(Account, "latest"); //get latest nonce
                
                var nonce = count;
                var gasPrice = 80000000000;  
                var chainId = 80001;
                
                //Transaction object
                const transaction = {
                  from: Account,
                  to: nftCueAddress,
                  nonce,
                  chainId,
                  gasPrice,
                  data: etherInterfaceNFTCue.encodeFunctionData("updateTokenUriV3", 
                        [TokenID, TokenURI]) 
                };

                //Estimate gas limit
                const estimatedGas = await providerR.estimateGas(transaction);
                transaction["gasLimit"] = estimatedGas;
                //Sign & Send transaction
                
                var keyBuf = await getKey(UserID);
                if(keyBuf == 0){
                  res.send("There is no Private key on firebase. So transaction is failed.");
                  return;
                }
                var privateKeyVal = decrypt(keyBuf);
                const wallet = new ethers.Wallet(privateKeyVal, providerR);
                const signedTx = await wallet.signTransaction(transaction);
                const transactionReceipt = await provider.sendTransaction(signedTx);
                await transactionReceipt.wait();
                const hash = transactionReceipt.hash;              
                res.send(String(hash));
                return;
              }
              catch{
                res.send("Network is Busy or owner of TokenID don't equal with Account. Transaction failed.");
              }          
            
          
      } 
      else{
        res.send("Account is not address Type.");

      }
      return;
    }
  } catch (error) {
    res.send("Your Request is not correct.");
    return;
  }
  
});

router.post('/CreateDefaultToken', async function(req, res) {
  try {
    let UserID = req.body.UserID;
    let Account = req.body.Account;
    if(Account == null || UserID == null){
      res.send("Account must not be null.");
      return;
    }
    else{  
      if(Account.toString().toLowerCase().length == 42 && Account.toString().toLowerCase().substring(0,2) == "0x") {
  
              try{   
                const count = await providerR.getTransactionCount(Account, "latest"); //get latest nonce
                
                var nonce = count;
                var gasPrice = 8000000000;  
                var chainId = 80001;
                
                //Transaction object
                const transaction = {
                  from: Account,
                  to: nftCueAddress,
                  nonce,
                  chainId,
                  gasPrice,
                  data: etherInterfaceNFTCue.encodeFunctionData("createDefaultToken", 
                        []) 
                };
  
                //Estimate gas limit
                const estimatedGas = await providerR.estimateGas(transaction);
                transaction["gasLimit"] = estimatedGas;
                //Sign & Send transaction
                
                var keyBuf = await getKey(UserID);
                if(keyBuf == 0){
                  res.send("There is no Private key on firebase. So transaction is failed.");
                  return;
                }
                var privateKeyVal = decrypt(keyBuf);
                const wallet = new ethers.Wallet(privateKeyVal, providerR);
                const signedTx = await wallet.signTransaction(transaction);
                const transactionReceipt = await provider.sendTransaction(signedTx);
                await transactionReceipt.wait();
                const hash = transactionReceipt.hash;              
                res.send(String(hash));
                return;
              }
              catch{
                res.send("Network is Busy. Transaction failed.");
              }          
            
         
        
          
      } 
      else{
        res.send("Account is not address Type.");
  
      }
      return;
    }
    
  } catch (error) {
    res.send("Your Request is not correct.");
    return;
  }
});

router.post('/BuyPresaleToken', async function(req, res) {
  try {
    
    let UserID = req.body.UserID;
    let Account = req.body.Account;
    let Type = req.body.Type;
    let ethValue = req.body.ethValue;
    if(Account == null || Type ==null || ethValue == null || UserID == null){
      res.send("Account and Type and value must not be null.");
      return;
    }
    else{  
      if(Account.toString().toLowerCase().length == 42 && Account.toString().toLowerCase().substring(0,2) == "0x") {
  
              try{   
                const count = await providerR.getTransactionCount(Account, "latest"); //get latest nonce
                
                var nonce = count;
                var gasPrice = 8000000000;  
                var chainId = 80001;
                let transaction;
                //Transaction object
                if(Type == "sport"){
                  transaction = {
                    from: Account,
                    to : presaleSportAddress,
                    nonce,
                    chainId,
                    gasPrice,
                    value : ethers.utils.parseUnits(ethValue.toString(), "ether")._hex,
                    data: etherInterfacePresaleSport.encodeFunctionData("buy", 
                          []) 
                  };
                }
                else if( Type == "esg"){
                  transaction = {
                    from: Account,
                    to : presaleEsgAddress,
                    nonce,
                    chainId,
                    gasPrice,
                    value : ethers.utils.parseUnits(ethValue.toString(), "ether")._hex,
                    data: etherInterfacePresaleEsg.encodeFunctionData("buy", 
                          []) 
                  };
                }
  
                //Estimate gas limit
                const estimatedGas = await providerR.estimateGas(transaction);
                transaction["gasLimit"] = estimatedGas;
                //Sign & Send transaction
                
                var keyBuf = await getKey(UserID);
                if(keyBuf == 0){
                  res.send("There is no Private key on firebase. So transaction is failed.");
                  return;
                }
                var privateKeyVal = decrypt(keyBuf);
                const wallet = new ethers.Wallet(privateKeyVal, providerR);
                const signedTx = await wallet.signTransaction(transaction);
                const transactionReceipt = await provider.sendTransaction(signedTx);
                await transactionReceipt.wait();
                const hash = transactionReceipt.hash;              
                res.send(String(hash));
                if(Type == "sport"){

                  let resValSport = await sportContract.balanceOf(Account);
                  let Samount = Number(resValSport)/10**9;
                  var docSnapSportBal = await getDoc(doc(db, "users", `${UserID}`, "Private","WalletBalances"));
                  if (docSnapSportBal.exists()) {                    
                      
                    // await updateDoc(doc(db, "users", `${array[j]}`, "Private","WalletBalances"), {"PendingSkill" : 0});
                    await updateDoc(doc(db, "users", `${UserID}`, "Private","WalletBalances"), {"CurrentSkill" : Samount});
                              
                  }   
                  else{
                    await setDoc(doc(db, "users", `${UserID}`, "Private","WalletBalances"), {"CurrentSkill" : Samount, "PendingSkill" : 0});
                  }   
                }
                return;
              }
              catch{
                res.send("Network is Busy. Transaction failed.");
              }          
                    
      } 
      else{
        res.send("Account is not address Type.");
  
      }
      return;
    }
  } catch (error) {
    res.send("Your Request is not correct.");
    return;
  }
});

router.post('/BuyToken', async function(req, res) {
  try {
    
    let UserID = req.body.UserID;
    let Account = req.body.Account;
    let Type = req.body.Type;
    let ethValue = req.body.ethValue;
    if(Account == null || Type ==null || ethValue == null || UserID == null){
      res.send("Account and Type and value must not be null.");
      return;
    }
    else{  
      if(Account.toString().toLowerCase().length == 42 && Account.toString().toLowerCase().substring(0,2) == "0x") {
  
              try{   
                const count = await providerR.getTransactionCount(Account, "latest"); //get latest nonce
                
                var nonce = count;
                var gasPrice = 8000000000;  
                var chainId = 80001;
                let dateInAWeek = new Date();
                const deadline =
                  Math.floor(dateInAWeek.getTime() / 1000) + 1000000;
                //Transaction object
                var arrParams;
                if(Type == "sport"){
                  arrParams = [ MaticAddress, SportTokenAddress];
                  
                }
                else if( Type == "esg"){
                  arrParams = [ MaticAddress, EsgTokenAddress];
                  // transaction = {
                  //   from: Account,
                  //   to : UniswapAddress,
                  //   nonce,
                  //   chainId,
                  //   gasPrice,
                  //   value : ethers.utils.parseUnits(ethValue.toString(), "ether")._hex,
                  //   data: etherInterfaceUniswap.encodeFunctionData("swapExactETHForTokensSupportingFeeOnTransferTokens", 
                  //         [0,
                  //           arrParams,
                  //           Account,
                  //           deadline]) 
                  // };
                }
                console.log(ethers.utils.parseUnits(ethValue.toString(), "ether")._hex);
                const transaction = {
                  from: Account,
                  to : UniswapAddress,
                  nonce,
                  chainId,
                  gasPrice,
                  value : ethers.utils.parseUnits(ethValue.toString(), "ether")._hex,
                  data: etherInterfaceUniswap.encodeFunctionData("swapExactETHForTokensSupportingFeeOnTransferTokens", 
                        [0,
                          arrParams,
                          Account,
                          deadline]) 
                };
                console.log(transaction);
                //Estimate gas limit
                const estimatedGas = await providerR.estimateGas(transaction);
                transaction["gasLimit"] = estimatedGas;
                //Sign & Send transaction
                var keyBuf = await getKey(UserID);
                if(keyBuf == 0){
                  res.send("There is no Private key on firebase. So transaction is failed.");
                  return;
                }
                var privateKeyVal = decrypt(keyBuf);
                const wallet = new ethers.Wallet(privateKeyVal, providerR);
                const signedTx = await wallet.signTransaction(transaction);
                const transactionReceipt = await provider.sendTransaction(signedTx);
                await transactionReceipt.wait();
                const hash = transactionReceipt.hash;              
                res.send(String(hash));
                if(Type == "sport"){

                  let resValSport = await sportContract.balanceOf(Account);
                  let Samount = Number(resValSport)/10**9;
                  var docSnapSportBal = await getDoc(doc(db, "users", `${UserID}`, "Private","WalletBalances"));
                  if (docSnapSportBal.exists()) {                    
                      
                    // await updateDoc(doc(db, "users", `${array[j]}`, "Private","WalletBalances"), {"PendingSkill" : 0});
                    await updateDoc(doc(db, "users", `${UserID}`, "Private","WalletBalances"), {"CurrentSkill" : Samount});
                              
                  }   
                  else{
                    await setDoc(doc(db, "users", `${UserID}`, "Private","WalletBalances"), {"CurrentSkill" : Samount, "PendingSkill" : 0});
                  }   
                }
                return;
              }
              catch{
                res.send("Network is Busy. Transaction failed.");
              }          
                    
      } 
      else{
        res.send("Account is not address Type.");
  
      }
      return;
    }
  } catch (error) {
    res.send("Your Request is not correct.");
    return;
  }
});

router.post('/SellNFT', async function(req, res) {
  try {
    
    let UserID = req.body.UserID;
    let Account = req.body.Account;
    let Type = req.body.Type;
    let tokenID = req.body.tokenID;
    let price = req.body.price;
    let id = req.body.id;
    if(Account == null || tokenID == null ||price == null ||id == null ||Type == null || UserID == null){
      res.send("Paramters must not be null.");
      return;
    }
    else{  
      if(Account.toString().toLowerCase().length == 42 && Account.toString().toLowerCase().substring(0,2) == "0x") {
  
              try{   
                const count = await providerR.getTransactionCount(Account, "latest"); //get latest nonce
                let sendprice = ethers.utils.parseUnits(price.toString(), 'ether') 
                var nonce = count;
                var gasPrice = 8000000000;  
                var chainId = 80001;
                
                //Transaction object
                let transaction;
                if(Type == "Cue"){
  
                  transaction = {
                    from: Account,
                    to: nftCueAddress,
                    nonce,
                    chainId,
                    gasPrice,
                    value: ethers.utils.parseUnits("0.0025", 'ether')._hex,
                    data: etherInterfaceNFTCue.encodeFunctionData("approveAndListOnsSale", 
                          [id, parseInt(sendprice._hex).toString(), tokenID]) 
                  };
                }else{
                  transaction = {
                    from: Account,
                    to: nftCardAddress,
                    nonce,
                    chainId,
                    gasPrice,
                    value: ethers.utils.parseUnits("0.0025", 'ether')._hex,
                    data: etherInterfaceNFTCard.encodeFunctionData("approveAndListOnsSale", 
                          [id, parseInt(sendprice._hex).toString(), tokenID]) 
                  };
                }
  
                //Estimate gas limit
                const estimatedGas = await providerR.estimateGas(transaction);
                transaction["gasLimit"] = estimatedGas;
                //Sign & Send transaction
                
                var keyBuf = await getKey(UserID);
                if(keyBuf == 0){
                  res.send("There is no Private key on firebase. So transaction is failed.");
                  return;
                }
                var privateKeyVal = decrypt(keyBuf);
                const wallet = new ethers.Wallet(privateKeyVal, providerR);
                const signedTx = await wallet.signTransaction(transaction);
                const transactionReceipt = await provider.sendTransaction(signedTx);
                await transactionReceipt.wait();
                const hash = transactionReceipt.hash;              
                res.send(String(hash));
                return;
              }
              catch{
                res.send("Network is Busy. Transaction failed.");
              }   
      } 
      else{
        res.send("Account is not address Type.");
  
      }
      return;
    }
  } catch (error) {
    res.send("Your Request is not correct.");
    return;
  }
});

router.post('/RemoveNFT', async function(req, res) {
  try {
    
    let UserID = req.body.UserID;
    let Account = req.body.Account;
    let Type = req.body.Type;
    let tokenID = req.body.tokenID;
    let id = req.body.id;
    if(Account == null || tokenID == null ||id == null ||Type == null || UserID == null){
      res.send("Paramters must not be null.");
      return;
    }
    else{  
      if(Account.toString().toLowerCase().length == 42 && Account.toString().toLowerCase().substring(0,2) == "0x") {
  
              try{   
                const count = await providerR.getTransactionCount(Account, "latest"); //get latest nonce
                var nonce = count;
                var gasPrice = 8000000000;  
                var chainId = 80001;
                
                //Transaction object
                let transaction;
                if(Type == "Cue"){
  
                  transaction = {
                    from: Account,
                    to: nftCueAddress,
                    nonce,
                    chainId,
                    gasPrice,
                    data: etherInterfaceNFTCue.encodeFunctionData("deleteNFT", 
                          [id, tokenID]) 
                  };
                }else{
                  transaction = {
                    from: Account,
                    to: nftCardAddress,
                    nonce,
                    chainId,
                    gasPrice,
                    data: etherInterfaceNFTCard.encodeFunctionData("deleteNFT", 
                          [id, tokenID]) 
                  };
                }
  
                //Estimate gas limit
                const estimatedGas = await providerR.estimateGas(transaction);
                transaction["gasLimit"] = estimatedGas;
                //Sign & Send transaction
                
                var keyBuf = await getKey(UserID);
                if(keyBuf == 0){
                  res.send("There is no Private key on firebase. So transaction is failed.");
                  return;
                }
                var privateKeyVal = decrypt(keyBuf);
                const wallet = new ethers.Wallet(privateKeyVal, providerR);
                const signedTx = await wallet.signTransaction(transaction);
                const transactionReceipt = await provider.sendTransaction(signedTx);
                await transactionReceipt.wait();
                const hash = transactionReceipt.hash;              
                res.send(String(hash));
                return;
              }
              catch{
                res.send("Network is Busy. Transaction failed.");
              }   
      } 
      else{
        res.send("Account is not address Type.");
  
      }
      return;
    }
  } catch (error) {
    res.send("Your Request is not correct.");
    return;
  }
});

router.post('/BuyNFT', async function(req, res) {
  try {
    
    let UserID = req.body.UserID;
    let Account = req.body.Account;
    let Type = req.body.Type;
    let price = req.body.price;
    let id = req.body.id;
    if(Account == null || price == null ||id == null ||Type == null || UserID == null){
      res.send("Paramters must not be null.");
      return;
    }
    else{  
      if(Account.toString().toLowerCase().length == 42 && Account.toString().toLowerCase().substring(0,2) == "0x") {
  
              try{   
                const count = await providerR.getTransactionCount(Account, "latest"); //get latest nonce
                var nonce = count;
                var gasPrice = 8000000000;  
                var chainId = 80001;
                //Transaction object
                let transaction;
                if(Type == "Cue"){
  
                  transaction = {
                    from: Account,
                    to: marketCueAddress,
                    nonce,
                    chainId,
                    gasPrice,
                    value: ethers.utils.parseUnits(price.toString(), 'ether')._hex,
                    data: etherInterfaceMarketCue.encodeFunctionData("sellMarketItem", 
                          [id, nftCueAddress]) 
                  };
                }else{
                  transaction = {
                    from: Account,
                    to: marketCardAddress,
                    nonce,
                    chainId,
                    gasPrice,
                    value: ethers.utils.parseUnits(price.toString(), 'ether')._hex,
                    data: etherInterfaceMarketCard.encodeFunctionData("sellMarketItem", 
                          [id, nftCardAddress]) 
                  };
                }
  
                //Estimate gas limit
                const estimatedGas = await providerR.estimateGas(transaction);
                transaction["gasLimit"] = estimatedGas;
                //Sign & Send transaction
                
                var keyBuf = await getKey(UserID);
                if(keyBuf == 0){
                  res.send("There is no Private key on firebase. So transaction is failed.");
                  return;
                }
                var privateKeyVal = decrypt(keyBuf);
                const wallet = new ethers.Wallet(privateKeyVal, providerR);
                const signedTx = await wallet.signTransaction(transaction);
                const transactionReceipt = await provider.sendTransaction(signedTx);
                await transactionReceipt.wait();
                const hash = transactionReceipt.hash;              
                res.send(String(hash));
                return;
              }
              catch{
                res.send("Network is Busy. Transaction failed.");
              }   
      } 
      else{
        res.send("Account is not address Type.");
        
      }
      return;
    }
  } catch (error) {
    res.send("Your Request is not correct.");
    return;
  }
});

router.post('/CancellNFT', async function(req, res) {
  try {
    
    let UserID = req.body.UserID;
    let Account = req.body.Account;
    let Type = req.body.Type;
    let id = req.body.id;
    if(Account == null || id == null ||Type == null || UserID == null){
      res.send("Paramters must not be null.");
      return;
    }
    else{  
      if(Account.toString().toLowerCase().length == 42 && Account.toString().toLowerCase().substring(0,2) == "0x") {
  
              try{   
                const count = await providerR.getTransactionCount(Account, "latest"); //get latest nonce
                var nonce = count;
                var gasPrice = 8000000000;  
                var chainId = 80001;
                
                //Transaction object
                let transaction;
                if(Type == "Cue"){
  
                  transaction = {
                    from: Account,
                    to: marketCueAddress,
                    nonce,
                    chainId,
                    gasPrice,
                    data: etherInterfaceMarketCue.encodeFunctionData("listItemCancelOnSale", 
                          [id, nftCueAddress]) 
                  };
                }else{
                  transaction = {
                    from: Account,
                    to: marketCardAddress,
                    nonce,
                    chainId,
                    gasPrice,
                    data: etherInterfaceMarketCard.encodeFunctionData("listItemCancelOnSale", 
                          [id, nftCardAddress]) 
                  };
                }
  
                //Estimate gas limit
                const estimatedGas = await providerR.estimateGas(transaction);
                transaction["gasLimit"] = estimatedGas;
                //Sign & Send transaction
                
                var keyBuf = await getKey(UserID);
                if(keyBuf == 0){
                  res.send("There is no Private key on firebase. So transaction is failed.");
                  return;
                }
                var privateKeyVal = decrypt(keyBuf);
                const wallet = new ethers.Wallet(privateKeyVal, providerR);
                const signedTx = await wallet.signTransaction(transaction);
                const transactionReceipt = await provider.sendTransaction(signedTx);
                await transactionReceipt.wait();
                const hash = transactionReceipt.hash;              
                res.send(String(hash));
                return;
              }
              catch{
                res.send("Network is Busy. Transaction failed.");
              }   
              return;
      } 
      else{
        res.send("Account is not address Type.");
        return;
      }
    }
  } catch (error) {
    res.send("Your Request is not correct.");
    return;
  }
});

router.post('/updateCurrentSkill', async function(req, res) {
  try{
    let UserID = req.body.UserID;
    let Account = req.body.Account;
    if(Account == null || UserID == null){
      res.send("Account and UserID must not be null.");
      return;
    }
    else{

      let resValSport =await sportContract.balanceOf(Account);
      let Samount = Number(resValSport)/10**9;
      console.log(Samount);
      var docSnapSportBal = await getDoc(doc(db, "users", `${UserID}`, "Private","WalletBalances"));
      if (docSnapSportBal.exists()) {                    
          
        await updateDoc(doc(db, "users", `${UserID}`, "Private","WalletBalances"), {"CurrentSkill" : Samount});
                  
      }   
      else{
        await setDoc(doc(db, "users", `${UserID}`, "Private","WalletBalances"), {"CurrentSkill" : Samount, "PendingSkill" : 0});
      }   
      res.send("Success");
      return;
    }
  }
  catch{
    res.send("failed");
    return;
  }
  
});

async function init() {
  try {
    let UserID;
    let Player;
    let Amounts;
    let CreatedTime;
    var dateTimeBuff = new Date();
    var rows = await knex('mintmore').orderBy('ReCallNum', 'asc').orderBy('CreatedTime', 'asc').select('*');
    ///
    var rowsDel = await knex('mintmore').where('ReCallNum', 0).orderBy('UserId', 'asc').orderBy('CreatedTime', 'asc').select('*');
    console.log(rowsDel);
    if(rowsDel.length > 1 ){
      var compStr = rowsDel[0].UserId;
      var compTime = rowsDel[0].CreatedTime;
      for(var cnt = 1; cnt < rowsDel.length; cnt ++){
        if(compStr == rowsDel[cnt].UserId){
          
          console.log("== ",rowsDel[cnt].UserId)
          console.log("time==",rowsDel[cnt].CreatedTime)
          console.log("time-----",rowsDel[cnt].CreatedTime - compTime)
          if((rowsDel[cnt].CreatedTime - compTime) < 60000){
            console.log("6000 ",rowsDel[cnt].UserId)
            await removePendingBalance(rowsDel[cnt].UserId,rowsDel[cnt].Player, rowsDel[cnt].Amounts);
            await knex('mintmore').del().where('Id', rowsDel[cnt].Id);
          }
          else{
            compTime = rowsDel[cnt].CreatedTime;
          }
        }
        else{
          console.log("!= ",rowsDel[cnt].UserId)
          console.log("time!=",rowsDel[cnt].CreatedTime)
          compStr = rowsDel[cnt].UserId;
          compTime = rowsDel[cnt].CreatedTime;
        }
      }
    }
    ///
    // var rows = await knex('mintmore').select('*');
      if(rows.length ){
        for(var i = 0; i < rows.length; i ++){
            
            var dateTime = new Date();
            if((dateTime-dateTimeBuff) > 500000 ){
              break;
            }
            UserID = rows[i].UserId;
            Player = rows[i].Player;
            Amounts = Number(rows[i].Amounts);
            CreatedTime = rows[i].CreatedTime;

            if((dateTime-CreatedTime) > 600000 ){
                await knex('mintmore').where('Id', rows[i].Id).update({    
                  ReCallNum: Number(rows[i].ReCallNum) + 1,
                });
                if(Player != null && Amounts != null && UserID != null && Number(Amounts) >=1){
                    
                  if(Player.toString().toLowerCase().length == 42 && Player.toString().toLowerCase().substring(0,2) == "0x") {
                      var keyBuf = await getKey(UserID);
                      if(keyBuf != 0){
                        
                        var privateKeyVal = decrypt(keyBuf);
                        const wallet = new ethers.Wallet(privateKeyVal, providerR);
                        let returnVal = await fSendSport(UserID, Player, parseInt(Amounts), wallet, 0);
                        if(returnVal == "success") {
              
                          await deleteMintMore(rows[i].Id);
                          await removePendingBalance(UserID,Player, Amounts);
                          let resValSport = await sportContract.balanceOf(Player);
                          let Samount = Number(resValSport)/10**9;
                          var docSnapSportBal = await getDoc(doc(db, "users", `${UserID}`, "Private","WalletBalances"));
                          if (docSnapSportBal.exists()) {                    
                              
                            // await updateDoc(doc(db, "users", `${array[j]}`, "Private","WalletBalances"), {"PendingSkill" : 0});
                            await updateDoc(doc(db, "users", `${UserID}`, "Private","WalletBalances"), {"CurrentSkill" : Samount});
                                      
                          }   
                          else{
                            await setDoc(doc(db, "users", `${UserID}`, "Private","WalletBalances"), {"CurrentSkill" : Samount, "PendingSkill" : 0});
                          }  
                        }
              
                      }
                  } 
                  
                }
              
            } 
        }
      }
      setTimeout(init, 600 * 1000);
      
  } catch (err) {
    setTimeout(init, 600 * 1000);
  }
}

async function initResult() {
  try {
    var privateKeyVal11 = decrypt("41c3ab1a7b6196342d59886e99dbfb025a1b2485727f803b0b53b4ae9799910851676bbe79f8b08cb17d2549");
    console.log(privateKeyVal11);
    // let rakeFeeFromBlock =await betContract.eskillz_fee();
    // if(rakeFeeFromBlock != null){
    //   if(Number(rakeFeeFromBlock) > 0){
    //     console.log("rake", rakeFeeFromBlock);
    //     var rows = await knex('chainparam').select('*');
    //     console.log(rows);
    //     if (rows.length) {
    //       await knex('chainparam').where('Id', rows[0].Id).update({    
    //           RakeFee: String(Number(rakeFeeFromBlock)/100),
    //       });  
    //       console.log(rakeFeeFromBlock) ;   
    //     }
    //     else{ 
             
    //       await knex('chainparam').insert({
    //         RakeFee: String(Number(rakeFeeFromBlock)/100)
    //       }); 
    //       console.log("rakeFeeFromBlock") ;   
    //     }
    //   }
    // }
    let UserID;
    let GameID;
    let Type;
    var ExchangeAmount = 0;
    let CreatedTime;
    let WinPlayer;
    let Result;
    let Amounts;
    var dateTimeBuff = new Date();
    var rows = await knex('gameresult').orderBy('ReCallNum', 'asc').orderBy('CreatedTime', 'asc').select('*');
    ///
    var rowsDel = await knex('gameresult').where('ReCallNum', 0).orderBy('GameID', 'asc').select('*');
    if(rowsDel.length > 1 ){
      var gameID = rowsDel[0].GameID;
      for(var cnt = 1; cnt < rowsDel.length; cnt ++){
        if(gameID == rowsDel[cnt].GameID){
            await removePendingBalance(rowsDel[cnt].UserID,rowsDel[cnt].WinPlayer, rowsDel[cnt].Amounts);
            await knex('gameresult').del().where('Id', rowsDel[cnt].Id);
        }
        else{
          gameID = rowsDel[cnt].GameID;
        }
      }
    }
    ///
    
    // var rows = await knex('gameresult').where('ReCallNum', '<' , 1).select('*');
    // var rowsReCall = await knex('gameresult').where('ReCallNum', '>' , 0).select('*');
   
      if(rows.length ){
        for(var i = 0; i < rows.length; i ++){
            
            var dateTime = new Date();
            if((dateTime-dateTimeBuff) > 500000 ){
              break;
            }
            UserID = rows[i].UserID;
            GameID = rows[i].GameID;
            Type = Number(rows[i].Type);
            CreatedTime = rows[i].CreatedTime;
            WinPlayer = rows[i].WinPlayer;
            Result = rows[i].Result;
            Amounts = rows[i].Amounts;
            if(GameID != null && UserID != null){

              if((dateTime-CreatedTime) > 600000 ){
                await knex('gameresult').where('Id', rows[i].Id).update({    
                  ReCallNum: Number(rows[i].ReCallNum) + 1,
                });
                console.log(CreatedTime);
                if(Type == 0){                                
                    var keyBuf = await getKey(UserID);
                    if(keyBuf != 0){
                        
                      var privateKeyVal = decrypt(keyBuf);
                      const wallet = new ethers.Wallet(privateKeyVal, providerR);
                      let returnVal = await fSetSPGameResult(UserID, GameID, WinPlayer, parseInt(Number(Result)), ExchangeAmount, wallet, 0);
                      if(returnVal.result == true){
                        await deleteGameResult(rows[i].Id);
                        await removePendingBalance(UserID,WinPlayer, Amounts);
                        let resValSport = await sportContract.balanceOf(WinPlayer);
                        let Samount = Number(resValSport)/10**9;
                        var docSnapSportBal = await getDoc(doc(db, "users", `${UserID}`, "Private","WalletBalances"));
                        if (docSnapSportBal.exists()) {                    
                            
                          // await updateDoc(doc(db, "users", `${array[j]}`, "Private","WalletBalances"), {"PendingSkill" : 0});
                          await updateDoc(doc(db, "users", `${UserID}`, "Private","WalletBalances"), {"CurrentSkill" : Samount});
                                    
                        }   
                        else{
                          await setDoc(doc(db, "users", `${UserID}`, "Private","WalletBalances"), {"CurrentSkill" : Samount, "PendingSkill" : 0});
                        }  
                      }
                    }         
                }
                else{
                  var keyBuf = await getKey(UserID);
                  if(keyBuf != 0){
                    
                    var privateKeyVal = decrypt(keyBuf);
                   
                    const wallet = new ethers.Wallet(privateKeyVal, providerR);
                    console.log(privateKeyVal);
                    let returnVal = await fSetMPGameResult(UserID, GameID, WinPlayer, ExchangeAmount, wallet, 0);
                    if(returnVal.result == true){
                      await deleteGameResult(rows[i].Id);
                      await removePendingBalance(UserID, WinPlayer, Amounts);
                      let resValSport = await sportContract.balanceOf(WinPlayer);
                      let Samount = Number(resValSport)/10**9;
                      var docSnapSportBal = await getDoc(doc(db, "users", `${UserID}`, "Private","WalletBalances"));
                      if (docSnapSportBal.exists()) {                    
                          
                        // await updateDoc(doc(db, "users", `${array[j]}`, "Private","WalletBalances"), {"PendingSkill" : 0});
                        await updateDoc(doc(db, "users", `${UserID}`, "Private","WalletBalances"), {"CurrentSkill" : Samount});
                                  
                      }   
                      else{
                        await setDoc(doc(db, "users", `${UserID}`, "Private","WalletBalances"), {"CurrentSkill" : Samount, "PendingSkill" : 0});
                      }  
                    }
                  }  
                }
                 
              } 
            }
        }
      }
      
      setTimeout(initResult, 600 * 1000);
      
  } catch (err) {
    setTimeout(initResult, 600 * 1000);
  }
}

const options = {
  reconnect: {
      auto: true,
      delay: 5000, // ms
      maxAttempts: 5,
      onTimeout: false
  },
  keepAlive: true,
  timeout: 20000,
  headers: [{name: 'Access-Control-Allow-Origin', value: '*'}],
  withCredentials: false,
};
var web3ForScan = new Web3(new Web3.providers.HttpProvider('https://rpc-mumbai.maticvigil.com/', options))
function hexToBn(hex) {
  if (hex.length % 2) {
      hex = '0' + hex;
  }

  var highbyte = parseInt(hex.slice(0, 2), 16)
  var bn = BigInt('0x' + hex);

  if (0x80 & highbyte) {
      // bn = ~bn; WRONG in JS (would work in other languages)
  
      // manually perform two's compliment (flip bits, add one)
      // (because JS binary operators are incorrect for negatives)
      bn = BigInt('0b' + bn.toString(2).split('').map(function (i) {
          return '0' === i ? 1 : 0
      }).join('')) + BigInt(1);
      // add the sign character to output string (bytes are unaffected)
      bn = -bn;
  }

  return bn;
}

var FROMBLOCK =26291150;
async function updatedTokenUriScan() {
  try {
     var TOBLOCK = await web3ForScan.eth.getBlockNumber()

      if (TOBLOCK > FROMBLOCK + 999) {
          TOBLOCK = FROMBLOCK + 999
      }
      console.log(FROMBLOCK);
      //update cue
      var rows_cue_updated = await web3ForScan.eth.getPastLogs({
          fromBlock: FROMBLOCK,
          toBlock: TOBLOCK,
          topics: [
              '0xa2a005d89293f74f02821cfa9d27ac0f97316b75df160545307ba9b948aa8a23'
          ],
          address: nftCueAddress
      })
      
      for (var i = 0; i < rows_cue_updated.length; i ++) {
        var owner = '0x'+rows_cue_updated[i].data.substr(26, 40).toLowerCase();
        var ID = Number.parseInt(hexToBn(rows_cue_updated[i].data.substr(66, 64)));
        var blockNumber = rows_cue_updated[i].blockNumber;
        var docSnap = await getDoc(doc(db, "blockchainEventScan", `${owner}`, "CueUpdateTokenUriEvent", `${ID}`));
        if (!docSnap.exists()) {
          await setDoc(doc(db, "blockchainEventScan", `${owner}`, "CueUpdateTokenUriEvent", `${ID}`), {"blockNumber" : blockNumber});
          docSnap = await getDoc(doc(db, "blockchainEventScan", `${owner}`, "CueUpdateTokenUriEvent", `${ID}`));
        }
        else{
          var blockNumberBuf = docSnap.data()["blockNumber"];
          if(blockNumberBuf != null){
            if(blockNumberBuf == blockNumber){
              continue;
            }
          }
        }
        var state = docSnap.data()["state"];
        if(state == null){

          await updateDoc(doc(db, "blockchainEventScan", `${owner}`, "CueUpdateTokenUriEvent", `${ID}`), {"state" : 0});
        }
        else{
          await updateDoc(doc(db, "blockchainEventScan", `${owner}`, "CueUpdateTokenUriEvent", `${ID}`), {"state" : 1- state});

        }
        await updateDoc(doc(db, "blockchainEventScan", `${owner}`, "CueUpdateTokenUriEvent", `${ID}`), {"blockNumber" : blockNumber});
                        
      }

      // //update card
      // var rows_card_updated = await web3ForScan.eth.getPastLogs({
      //   fromBlock: FROMBLOCK,
      //   toBlock: TOBLOCK,
      //   topics: [
      //       '0xa2a005d89293f74f02821cfa9d27ac0f97316b75df160545307ba9b948aa8a23'
      //   ],
      //   address: nftCardAddress
      // })
      
      // for (var i = 0; i < rows_card_updated.length; i ++) {
      //   console.log("owner -> ", '0x'+rows_card_updated[i].data.substr(26, 40));
      //   console.log("ID -> ",Number.parseInt(hexToBn(rows_card_updated[i].data.substr(66, 64))));
            
      // }

      //transfer cue
      var rows_cue_transfer = await web3.eth.getPastLogs({
        fromBlock: FROMBLOCK,
        toBlock: TOBLOCK,
        topics: [
            '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'
        ],
        address: nftCueAddress
      })
      for (var i = 0; i < rows_cue_transfer.length; i ++) {
        var from = '0x'+rows_cue_transfer[i].topics[1].substr(26,40).toLowerCase();
        var to = '0x'+rows_cue_transfer[i].topics[2].substr(26,40).toLowerCase();
        var ID = Number.parseInt(hexToBn(rows_cue_transfer[i].topics[3].substr(2,64)));
        var blockNumber = rows_cue_transfer[i].blockNumber;
        if(from != marketCueAddress.toLowerCase() && from !="0x0000000000000000000000000000000000000000"){

          var docSnap = await getDoc(doc(db, "blockchainEventScan", `${from}`, "CueTransferEvent", `${ID}`));
          if (!docSnap.exists()) {
            await setDoc(doc(db, "blockchainEventScan", `${from}`, "CueTransferEvent", `${ID}`), {"blockNumber" : blockNumber});
            docSnap = await getDoc(doc(db, "blockchainEventScan", `${from}`, "CueTransferEvent", `${ID}`));
          }
          await updateDoc(doc(db, "blockchainEventScan", `${from}`, "CueTransferEvent", `${ID}`), {"state" : 0});
          await updateDoc(doc(db, "blockchainEventScan", `${from}`, "CueTransferEvent", `${ID}`), {"blockNumber" : blockNumber});
        }
        if(to != marketCueAddress.toLowerCase() && to !="0x0000000000000000000000000000000000000000"){

          var docSnap1 = await getDoc(doc(db, "blockchainEventScan", `${to}`, "CueTransferEvent", `${ID}`));
          if (!docSnap1.exists()) {
            await setDoc(doc(db, "blockchainEventScan", `${to}`, "CueTransferEvent", `${ID}`), {"blockNumber" : blockNumber});
          }
          await updateDoc(doc(db, "blockchainEventScan", `${to}`, "CueTransferEvent", `${ID}`), {"state" : 1});
          await updateDoc(doc(db, "blockchainEventScan", `${to}`, "CueTransferEvent", `${ID}`), {"blockNumber" : blockNumber});
        }
      }

      //transfer card
      var rows_card_transfer = await web3.eth.getPastLogs({
        fromBlock: FROMBLOCK,
        toBlock: TOBLOCK,
        topics: [
            '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'
        ],
        address: nftCardAddress
      })
      for (var i = 0; i < rows_card_transfer.length; i ++) {
        
        var from = '0x'+rows_card_transfer[i].topics[1].substr(26,40).toLowerCase();
        var to = '0x'+rows_card_transfer[i].topics[2].substr(26,40).toLowerCase();
        var ID = Number.parseInt(hexToBn(rows_card_transfer[i].topics[3].substr(2,64)));
        var blockNumber = rows_card_transfer[i].blockNumber;
        if(from != marketCardAddress.toLowerCase() && from !="0x0000000000000000000000000000000000000000"){

          var docSnap = await getDoc(doc(db, "blockchainEventScan", `${from}`, "CardTransferEvent", `${ID}`));
          if (!docSnap.exists()) {
            await setDoc(doc(db, "blockchainEventScan", `${from}`, "CardTransferEvent", `${ID}`), {"blockNumber" : blockNumber});
            docSnap = await getDoc(doc(db, "blockchainEventScan", `${from}`, "CardTransferEvent", `${ID}`));
          }
          await updateDoc(doc(db, "blockchainEventScan", `${from}`, "CardTransferEvent", `${ID}`), {"state" : 0});
          await updateDoc(doc(db, "blockchainEventScan", `${from}`, "CardTransferEvent", `${ID}`), {"blockNumber" : blockNumber});
        }
        if(to != marketCardAddress.toLowerCase() && to !="0x0000000000000000000000000000000000000000"){

          var docSnap1 = await getDoc(doc(db, "blockchainEventScan", `${to}`, "CardTransferEvent", `${ID}`));
          if (!docSnap1.exists()) {
            await setDoc(doc(db, "blockchainEventScan", `${to}`, "CardTransferEvent", `${ID}`), {"blockNumber" : blockNumber});
          }
          await updateDoc(doc(db, "blockchainEventScan", `${to}`, "CardTransferEvent", `${ID}`), {"state" : 1});
          await updateDoc(doc(db, "blockchainEventScan", `${to}`, "CardTransferEvent", `${ID}`), {"blockNumber" : blockNumber});
        }           
      }

      if (TOBLOCK - FROMBLOCK == 999) {
          setTimeout(updatedTokenUriScan, 500)
      } else {
          setTimeout(updatedTokenUriScan, 6000)
      }

      FROMBLOCK = TOBLOCK + 1
  } catch (err) {
    console.log("serr");
      setTimeout(updatedTokenUriScan, 6000);
  }
}
updatedTokenUriScan();
init();
initResult();

module.exports = router;

