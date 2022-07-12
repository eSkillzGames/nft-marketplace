const express = require('express');
const axios = require('axios');
const config = require('config');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const normalize = require('normalize-url');
const { ethers } = require('ethers');
const { useState } = require('react');
require('dotenv').config();
const IpfsHttpClient = require("ipfs-http-client");
const ipfsC = IpfsHttpClient.create({
  host: "ipfs.infura.io",
  port: "5001",
  protocol: "https",
});
const IPFS = require('ipfs-core');

const infuraKey = process.env.REACT_INFURA_KEY;
const NFTcontractAddress = process.env.NFT_CONTRACT_ADDRESS;
const MarketcontractAddress = process.env.MARKET_CONTRACT_ADDRESS;
const CARDNFTcontractAddress = process.env.CARD_NFT_CONTRACT_ADDRESS;
const CARDMarketcontractAddress = process.env.CARD_MARKET_CONTRACT_ADDRESS;
const SportTokenAddress = process.env.SPORT_TOKEN_ADDRESS;
const EsgTokenAddress = process.env.ESG_TOKEN_ADDRESS;
const tokenPriceAddress = process.env.TOKEN_PRICE_ADDRESS;
const betAddress = process.env.BET_ADDRESS;
const NFTcontractABI = require('../../abi/NFT.json');
const MarketcontractABI = require('../../abi/Marketplace.json');
const CardNFTcontractABI = require('../../abi/NFT_CARD.json');
const CardMarketcontractABI = require('../../abi/Marketplace_CARD.json');
const tokenPriceABI = require('../../abi/GetTokenPrice.json');
const betABI = require('../../abi/Bet.json');

const Web3 = require("web3");
if (typeof web3 !== 'undefined') {
  var web3 = new Web3(web3.currentProvider);
} else {
  var web3 = new Web3(new Web3.providers.HttpProvider(infuraKey));
}
//let web3 = new Web3(new Web3.providers.WebsocketProvider(infuraKey));
const MarketContract = new web3.eth.Contract(MarketcontractABI,MarketcontractAddress);
const TokenContract = new web3.eth.Contract(NFTcontractABI,NFTcontractAddress);
const CardMarketContract = new web3.eth.Contract(CardMarketcontractABI,CARDMarketcontractAddress);
const CardTokenContract = new web3.eth.Contract(CardNFTcontractABI,CARDNFTcontractAddress);
var tokenPriceContract = new web3.eth.Contract(tokenPriceABI,tokenPriceAddress);                        
var betContract = new web3.eth.Contract(betABI,betAddress);

var minABI = [
  // balanceOf
  {
    "constant":true,
    "inputs":[{"name":"_owner","type":"address"}],
    "name":"balanceOf",
    "outputs":[{"name":"balance","type":"uint256"}],
    "type":"function"
  }
];
var sportContract = new web3.eth.Contract(minABI, SportTokenAddress);
var esgContract = new web3.eth.Contract(minABI, EsgTokenAddress);
router.post('/fetchNftDetails', async function(req, res) {
  let gameType = req.body.gameType;
  let NFTType = req.body.NFTType;
  var ID  = parseInt(req.body.Id);
  if(gameType == null || NFTType == null || ID == null){
    res.send("{}");
  }
  else{
    if(gameType.trim().toLowerCase() == "pool"){
      if(NFTType.trim().toLowerCase() == "cue"){
        if(ID > 0){
          try{
            let resVal =await TokenContract.methods.tokenURI(ID).call();
            let resJson = await axios.get(resVal);
            res.send(JSON.stringify(resJson.data));
          }
          catch{
            res.send("{}");
          }          
        }
        else{
          res.send("{}");
        }      
      }
      else if(NFTType.trim().toLowerCase() == "card"){
        if(ID > 0){
          try{
            let resVal =await CardTokenContract.methods.tokenURI(ID).call();
            let resJson = await axios.get(resVal);
            res.send(JSON.stringify(resJson.data));
          }
          catch{
            res.send("{}");
          }          
        }
        else{
          res.send("{}");
        }      
      }
      else{
        res.send("{}");
      }
    }
    else{
      res.send("{}");
    }
  }
  
   
});

router.post('/getUpdatedTokenURI', async function(req, res) {

  let gameType = req.body.gameType;
  let NFTType = req.body.NFTType;
  var ID  = parseInt(req.body.Id);
  let level = req.body.level;
  let yieldBonus = req.body.yieldBonus;
  let strength = req.body.strength;
  let accuracy = req.body.accuracy;
  let control = req.body.control;
  let freeItemDropChance = req.body.freeItemDropChance;

  const metadata = new Object();
  if(gameType == null || NFTType == null || ID == null){
    res.send("{}");
  }
  else{
    if(gameType.trim().toLowerCase() == "pool"){
      if(NFTType.trim().toLowerCase() == "cue"){
        if(ID > 0){
          try{
            let resVal =await TokenContract.methods.tokenURI(ID).call();
            let origin = await axios.get(resVal);            
            metadata.name = origin.data.name;
            metadata.image_url = origin.data.image_url;
            metadata.description = origin.data.description;  
            if(level !=null){
              metadata.level = level;
            }
            else{
              if(origin.data.level !=null){
                metadata.level = origin.data.level;
              }
              else{
                metadata.level = "0";
              }
            }
            if(strength !=null){
              metadata.strength = strength;
            }
            else{
              if(origin.data.strength !=null){
                metadata.strength = origin.data.strength;
              }
              else{
                metadata.strength = "0";
              }              
            }
            if(accuracy !=null){
              metadata.accuracy = accuracy;
            }
            else{
              if(origin.data.accuracy !=null){
                metadata.accuracy = origin.data.accuracy;
              }
              else{
                metadata.accuracy = "0";
              } 
            }
            if(control !=null){
              metadata.control = control;
            }
            else{
              if(origin.data.control !=null){
                metadata.control = origin.data.control;
              }
              else{
                metadata.control = "0";
              } 
            }
            if(freeItemDropChance !=null){
              metadata.freeItemDropChance = freeItemDropChance;
            }
            else{
              if(origin.data.freeItemDropChance !=null){
                metadata.freeItemDropChance = origin.data.freeItemDropChance;
              }
              else{
                metadata.freeItemDropChance = "0";
              } 
            }
            const pinataResponse = await pinJSONToIPFS(metadata);
            if (!pinataResponse.success) {
              res.send("{}");         
            } 
            else{
              const myArray = resVal.split("/");
              if(myArray.length  > 2 ){

                const unpinRes = await unpinFileFromIPFS(myArray[myArray.length-1]);
              }
              res.send(pinataResponse.pinataUrl); 
            }
          }
          catch{
            res.send("{}");
          }          
        }
        else{
          res.send("{}");
        }      
      }
      else if(NFTType.trim().toLowerCase() == "card"){
        if(ID > 0){
          try{
            let resVal =await CardTokenContract.methods.tokenURI(ID).call();
            let origin = await axios.get(resVal);            
            metadata.name = origin.data.name;
            metadata.image_url = origin.data.image_url;
            metadata.description = origin.data.description;  
            if(yieldBonus !=null){
              metadata.yieldBonus = yieldBonus;
            }
            else{
              if(origin.data.yieldBonus !=null){
                metadata.yieldBonus = origin.data.yieldBonus;
              }
              else{
                metadata.yieldBonus = "0";
              }
            }
            if(strength !=null){
              metadata.strength = strength;
            }
            else{
              if(origin.data.strength !=null){
                metadata.strength = origin.data.strength;
              }
              else{
                metadata.strength = "0";
              }              
            }
            if(accuracy !=null){
              metadata.accuracy = accuracy;
            }
            else{
              if(origin.data.accuracy !=null){
                metadata.accuracy = origin.data.accuracy;
              }
              else{
                metadata.accuracy = "0";
              } 
            }
            if(control !=null){
              metadata.control = control;
            }
            else{
              if(origin.data.control !=null){
                metadata.control = origin.data.control;
              }
              else{
                metadata.control = "0";
              } 
            }
            if(freeItemDropChance !=null){
              metadata.freeItemDropChance = freeItemDropChance;
            }
            else{
              if(origin.data.freeItemDropChance !=null){
                metadata.freeItemDropChance = origin.data.freeItemDropChance;
              }
              else{
                metadata.freeItemDropChance = "0";
              } 
            }
            const pinataResponse = await pinJSONToIPFS(metadata);
            if (!pinataResponse.success) {
              res.send("{}");         
            } 
            else{
              res.send(pinataResponse.pinataUrl); 
            }
          }
          catch{
            res.send("{}");
          }          
        }
        else{
          res.send("{}");
        }      
      }
      else{
        res.send("{}");
      }
    }
    else{
      res.send("{}");
    }
  };    
});

router.post('/getTokenURI', async function(req, res) {

  let gameType = req.body.gameType;
  let NFTType = req.body.NFTType;
  let name = req.body.name;
  let description = req.body.description;
  let image_url = req.body.image_url;
  let level = req.body.level;
  let yieldBonus = req.body.yieldBonus;
  let strength = req.body.strength;
  let accuracy = req.body.accuracy;
  let control = req.body.control;
  let freeItemDropChance = req.body.freeItemDropChance;

  const metadata = new Object();
  if(gameType == null || NFTType == null){
    res.send("{}");
  }
  else{
    if(gameType.trim().toLowerCase() == "pool"){
      if(NFTType.trim().toLowerCase() == "cue"){
          try{  
            if(name !=null){
              metadata.name = name;
            }
            else{
              metadata.name = "";
            }   
            if(description !=null){
              metadata.description = description;
            }
            else{
              metadata.description = "";
            }                
            if(image_url !=null){
              metadata.image_url = image_url;
            }
            else{
              metadata.image_url = "";
            }
            if(level !=null){
              metadata.level = level;
            }
            else{
              metadata.level = "0";
            }
            if(strength !=null){
              metadata.strength = strength;
            }
            else{
              metadata.strength = "0";         
            }
            if(accuracy !=null){
              metadata.accuracy = accuracy;
            }
            else{
              metadata.accuracy = "0";
            }
            if(control !=null){
              metadata.control = control;
            }
            else{
              metadata.control = "0";
            }
            if(freeItemDropChance !=null){
              metadata.freeItemDropChance = freeItemDropChance;
            }
            else{
              metadata.freeItemDropChance = "0";
            }
            const pinataResponse = await pinJSONToIPFS(metadata);
            if (!pinataResponse.success) {
              res.send("{}");         
            } 
            else{
              res.send(pinataResponse.pinataUrl); 
            }
          }
          catch{
            res.send("{}");
          }          
             
      }
      else if(NFTType.trim().toLowerCase() == "card"){
          try{
              
            if(name !=null){
              metadata.name = name;
            }
            else{
              metadata.name = "";
            }   
            if(description !=null){
              metadata.description = description;
            }
            else{
              metadata.description = "";
            }                
            if(image_url !=null){
              metadata.image_url = image_url;
            }
            else{
              metadata.image_url = "";
            }
            if(yieldBonus !=null){
              metadata.yieldBonus = yieldBonus;
            }
            else{
              metadata.yieldBonus = "0";
            }
            if(strength !=null){
              metadata.strength = strength;
            }
            else{
              metadata.strength = "0";         
            }
            if(accuracy !=null){
              metadata.accuracy = accuracy;
            }
            else{
              metadata.accuracy = "0";
            }
            if(control !=null){
              metadata.control = control;
            }
            else{
              metadata.control = "0";
            }
            if(freeItemDropChance !=null){
              metadata.freeItemDropChance = freeItemDropChance;
            }
            else{
              metadata.freeItemDropChance = "0";
            }
            const pinataResponse = await pinJSONToIPFS(metadata);
            if (!pinataResponse.success) {
              res.send("{}");         
            } 
            else{
              res.send(pinataResponse.pinataUrl); 
            }
          }
          catch{
            res.send("{}");
          }          
            
      }
      else{
        res.send("{}");
      }
    }
    else{
      res.send("{}");
    }
  };    
});

const pinJSONToIPFS = async(JSONBody) => {
  const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
  //making axios POST request to Pinata ⬇️
  return axios 
      .post(url, JSONBody, {
          headers: {
              pinata_api_key: "17ee866f4a92583500ae",
              pinata_secret_api_key: "04a0885ff6a11e37ce5177c068bf05c21cb335c0da45bce0e2aa2332072986eb",
          }
      })
      .then(function (response) {
         return {
             success: true,
             pinataUrl: "https://eskillzpool.mypinata.cloud/ipfs/" + response.data.IpfsHash
         };
      })
      .catch(function (error) {
          //console.log(error)
          return {
              success: false,
              message: error.message,
          }

      });
};

// const pinFileToIPFS = async() => {
//   const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

//     //we gather a local file for this example, but any valid readStream source will work here.
//     let data = new FormData();
//     data.append('file', fs.createReadStream('./1.png'));

//     return axios.post(url,
//         data,
//         {
//             maxContentLength: 'Infinity', //this is needed to prevent axios from erroring out with large files
//             headers: {
//                 'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
//                 'pinata_api_key': "17ee866f4a92583500ae",
//                 'pinata_secret_api_key': "04a0885ff6a11e37ce5177c068bf05c21cb335c0da45bce0e2aa2332072986eb"
//             }
//         }
//     ).then(function (response) {
//         //handle response here
//         return {
//           success: true,
//           pinataUrl: "https://eskillzpool.mypinata.cloud/ipfs/" + response.data.IpfsHash
//       };
//     }).catch(function (error) {
//         //handle error here
//         console.log(error)
//           return {
//               success: false,
//               message: error.message,
//           }
//     });
 
// };

const unpinFileFromIPFS = async(CID) => {
  var config = {
    method: 'delete',
    url: 'https://api.pinata.cloud/pinning/unpin/'+CID,
    headers: { 
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI2YWUyZmJkZC1jMTI1LTQ5M2YtYjlkZi04ZDMwOTUxNDYxZjQiLCJlbWFpbCI6ImRlYW5AcmVkY2hhaW5nYW1lcy5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiMTdlZTg2NmY0YTkyNTgzNTAwYWUiLCJzY29wZWRLZXlTZWNyZXQiOiIwNGEwODg1ZmY2YTExZTM3Y2U1MTc3YzA2OGJmMDVjMjFjYjMzNWMwZGE0NWJjZTBlMmFhMjMzMjA3Mjk4NmViIiwiaWF0IjoxNjU2NTQ2NzUzfQ.qmfX8SmQb4L3jmyAk0z-4QE49W5Dzh7UCvS7DGakqW4',
    }
  };
  
  const resData = await axios(config);
  return resData.data;
 
};



router.post('/fetchNFTList', async function(req, res) {
  let gameType = req.body.gameType;
  let NFTType = req.body.NFTType;
  var address  = req.body.address.toString().toLowerCase();
  if(gameType == null || NFTType == null||address == null){
    res.send("{}");
  }
  else{
    if(gameType.trim().toLowerCase() == "pool"){
      if(NFTType.trim().toLowerCase() == "cue"){
        if(address.length == 42 && address.substring(0,2) == "0x"){
          try{
            let resVal =await MarketContract.methods.fetchAllItemsOfOwner(address).call();
            const items = await Promise.all(resVal.map(async i => {
              let item = {
                // itemId: i.itemId,
                lastPrice: i.lastPrice,
                lastSeller: i.lastSeller,
                NFTContractAddress: i.nftContract,
                onSale: i.onSale,
                owner: i.owner,
                prevOwners: i.prevOwners,
                price: i.price,
                tokenId: i.tokenId      
              }
              return item
            })) 
            res.send(items);
          }
          catch{
            res.send("{}");
          }
          
        }
        else{
          res.send("{}");
        }      
      }
      else if(NFTType.trim().toLowerCase() == "card"){
        if(address.length == 42 && address.substring(0,2) == "0x"){
          try{
            let resVal =await CardMarketContract.methods.fetchAllItemsOfOwner(address).call();
            const items = await Promise.all(resVal.map(async i => {
              let item = {
                // itemId: i.itemId,
                lastPrice: i.lastPrice,
                lastSeller: i.lastSeller,
                NFTContractAddress: i.nftContract,
                onSale: i.onSale,
                owner: i.owner,
                prevOwners: i.prevOwners,
                price: i.price,
                tokenId: i.tokenId      
              }
              return item
            })) 
            res.send(items);
          }
          catch{
            res.send("{}");
          }
          
        }
        else{
          res.send("{}");
        }      
      }
      else{
        res.send("{}");
      }
    }
    else{
      res.send("{}");
    }
  }
  
});

router.post('/getMATICBalance', async function(req, res) {
  var address  = req.body.address.toString().toLowerCase();
  if(address == null){
    res.send("{address : null}");
  }
  else{
    if(address.length == 42 && address.substring(0,2) == "0x"){
      try{
        let resVal =await web3.eth.getBalance(address);
        let realETHVal = Number(resVal)/10**18;
        res.send(String(realETHVal));
      }
      catch{
        res.send("{state: error}");
      }    
    }
    else{
      res.send("{address : is not type of address}");
    }
  }
  
});

router.post('/getSportBalanceFromWallet', async function(req, res) {
  var address  = req.body.address.toString().toLowerCase();
  if(address == null){
    res.send("{}");
  }
  else{
    if(address.length == 42 && address.substring(0,2) == "0x"){
      try{
        let resVal =await sportContract.methods.balanceOf(address).call();
        let realSportVal = Number(resVal)/10**9;
        res.send(String(realSportVal));
      }
      catch{
        res.send("{}");
      }
      
    }
    else{
      res.send("{}");
    }
  }
  
});

router.post('/getESGBalance', async function(req, res) {
  var address  = req.body.address.toString().toLowerCase();
  if(address == null){
    res.send("{}");
  }
  else{
    if(address.length == 42 && address.substring(0,2) == "0x"){
      try{
        let resVal =await esgContract.methods.balanceOf(address).call();
        let realEsgVal = Number(resVal)/10**9;
        res.send(String(realEsgVal));
      }
      catch{
        res.send("{}");
      }      
    }
    else{
      res.send("{}");
    }
  }
  
});

router.post('/getTokenPrice', async function(req, res) {
  var address  = req.body.address.toString().toLowerCase();
  var amount  = req.body.amount;
  if(address == null || amount == null){
    res.send("{}");
  }
  else{
    if(address.length == 42 && address.substring(0,2) == "0x"){
      try{  
        let resVal =await tokenPriceContract.methods.getPriceUsingAmount(address, amount).call();
        let PriceVal = Number((resVal[0] * resVal[2] / resVal[1]/10**6));
        
        res.send(String(PriceVal));
      }
      catch{
        res.send("{}");
      }      
    }
    else{
      res.send("{}");
    }
  }
  
});

router.post('/getSportBalanceFromContract', async function(req, res) {
  var address  = req.body.address.toString().toLowerCase();
  if(address == null){
    res.send("{}");
  }
  else{
    if(address.length == 42 && address.substring(0,2) == "0x"){
      try{
        let resVal =await betContract.methods.getStakingAmountsOfPlayer(address).call();
        let realSportVal = Number(resVal)/10**9;
        res.send(String(realSportVal));
      }
      catch{
        res.send("{}");
      }
      
    }
    else{
      res.send("{}");
    }
  }
  
});

// router.post('/getSportClaimAmounts', async function(req, res) {
//   var address  = req.body.address.toString().toLowerCase();
//   if(address == null){
//     res.send("{}");
//   }
//   else{
//     if(address.length == 42 && address.substring(0,2) == "0x"){
//       try{
//         let resVal =await betContract.methods.getClaimAmountsOfPlayer(address).call();
//         let realSportVal = Number(resVal)/10**9;
//         res.send(String(realSportVal));
//       }
//       catch{
//         res.send("{}");
//       }
      
//     }
//     else{
//       res.send("{}");
//     }
//   }
  
// });

router.post('/getSportAvailableWithDrawAmount', async function(req, res) {
  try{
    let resVal =await betContract.methods.getAvailableAmountOfContract().call();
    let realSportVal = Number(resVal)/10**9;
    res.send(String(realSportVal));
  }
  catch{
    res.send("{}");
  }
});

router.post('/getRakeFee', async function(req, res) {
  try{
    let resVal =await betContract.methods.eskillz_fee().call();
    res.send(String(resVal));
  }
  catch{
    res.send("{}");
  }
});

router.post('/getPlayersOfGame', async function(req, res) {
  var gameID  = Number(req.body.gameID.toString());
  if(gameID == null){
    res.send("{}");
  }
  else{
    if(gameID > 0){
      try{
        let resVal =await betContract.methods.getPlayerLength(gameID).call();
        res.send(String(resVal));
      }
      catch{
        res.send("{}");
      }
      
    }
    else{
      res.send("{}");
    }
  }
  
});

router.post('/minBetAmounts', async function(req, res) {
  try{
    let resVal =await betContract.methods.minBetAmounts().call();
    let realSportVal = Number(resVal)/10**9;
    res.send(String(realSportVal));
  }
  catch{
    res.send("{}");
  }
  
});

module.exports = router;