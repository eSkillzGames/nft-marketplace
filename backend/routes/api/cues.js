const express = require('express');
const axios = require('axios');
const config = require('config');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const normalize = require('normalize-url');
const { ethers } = require('ethers');
const { useState } = require('react');
require('dotenv').config();
const infuraKey = process.env.REACT_INFURA_KEY;
const NFTcontractAddress = process.env.NFT_CONTRACT_ADDRESS;
const MarketcontractAddress = process.env.MARKET_CONTRACT_ADDRESS;
const NFTcontractABI = require('../../abi/NFT.json');
const MarketcontractABI = require('../../abi/Marketplace.json');
const Web3 = require("web3");
let web3 = new Web3(new Web3.providers.WebsocketProvider(infuraKey));
const MarketContract = new web3.eth.Contract(MarketcontractABI,MarketcontractAddress);
const TokenContract = new web3.eth.Contract(NFTcontractABI,NFTcontractAddress);

router.post('/getTokenURI', async function(req, res) {
  let resVal =await TokenContract.methods.tokenURI(req.body.Id).call();
  res.send(resVal);
});

router.post('/fetchOnSale', async function(req, res) {
  let resVal =await MarketContract.methods.fetchAllItemsOnSale().call();
  const items = await Promise.all(resVal.map(async i => {
    let item = {
      itemId: i.itemId,
      lastPrice: i.lastPrice,
      lastSeller: i.lastSeller,
      nftContract: i.nftContract,
      onSale: i.onSale,
      owner: i.owner,
      prevOwners: i.prevOwners,
      price: i.price,
      tokenId: i.tokenId      
    }
    return item
  })) 
  res.send(items);
});

router.post('/fetchOfOwner', async function(req, res) {
  let resVal =await MarketContract.methods.fetchAllItemsOfOwner(req.body.address).call();
  const items = await Promise.all(resVal.map(async i => {
    let item = {
      itemId: i.itemId,
      lastPrice: i.lastPrice,
      lastSeller: i.lastSeller,
      nftContract: i.nftContract,
      onSale: i.onSale,
      owner: i.owner,
      prevOwners: i.prevOwners,
      price: i.price,
      tokenId: i.tokenId      
    }
    return item
  })) 
  res.send(items);
});

router.post('/getBalance', async function(req, res) {
  let resVal =await web3.eth.getBalance(req.body.address);
  res.send(resVal);
});

// router.get('/getBalance', async function(req, res) {
//   let resVal =await web3.eth.getBalance("0x89C30f2Af966Ed9e733E5dCFc76AE984EaAF5373");
//   res.send(resVal);
// });

router.post(
  '/getBuyParam',
  async function (req, res) {
    let sendprice = ethers.utils.parseUnits(req.body.price.toString(), 'ether');
    const transactionParameters = {
        to: MarketcontractAddress,
        from: req.body.address,
        value: sendprice._hex,
        'data': MarketContract.methods.sellMarketItem(req.body.id, NFTcontractAddress).encodeABI()
    };  
    res.send(transactionParameters);    
  }
);

router.post(
  '/getSellParam',
  async function (req, res) {
    let sendprice = ethers.utils.parseUnits(req.body.price.toString(), 'ether');
    const transactionParameters = {
        to: MarketcontractAddress,
        from: req.body.address,
        data: MarketContract.methods.listItemOnSale(req.body.id, NFTcontractAddress,parseInt(sendprice._hex).toString()).encodeABI()
    };
    res.send(transactionParameters);    
  }
);

router.post(
  '/getApproveParam',
  async function (req, res) {
    const transactionParameters = {
      to: NFTcontractAddress,
      from: req.body.address,
      data: TokenContract.methods.approve(MarketcontractAddress, req.body.id).encodeABI()
    };
    res.send(transactionParameters);    
  }
);

module.exports = router;