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
  res.send(resVal);
});

router.post('/fetchOfOwner', async function(req, res) {
  let resVal =await MarketContract.methods.fetchAllItemsOfOwner(req.body.address).call();
  res.send(resVal);
});

router.post('/getBalance', async function(req, res) {
  let resVal =await web3.eth.getBalance(req.body.address);
  res.send(resVal);
});

router.post(
  '/getBuyParam/:id',
  async function (req, res) {
    let sendprice = ethers.utils.parseUnits(req.body.price.toString(), 'ether');
    const transactionParameters = {
        to: MarketcontractAddress,
        from: req.body.address,
        value: parseInt(sendprice._hex).toString(),
        data: MarketContract.methods.sellMarketItem(req.params.id, NFTcontractAddress).encodeABI()
    };  
    res.send(transactionParameters);    
  }
);

router.post(
  '/getSellParam/:id',
  async function (req, res) {
    let sendprice = ethers.utils.parseUnits(req.body.price.toString(), 'ether');
    const transactionParameters = {
        to: MarketcontractAddress,
        from: req.body.address,
        data: MarketContract.methods.listItemOnSale(req.params.id, NFTcontractAddress,parseInt(sendprice._hex).toString()).encodeABI()
    };
    res.send(transactionParameters);    
  }
);

router.post(
  '/getApproveParam/:id',
  async function (req, res) {
    const transactionParameters = {
      to: NFTcontractAddress,
      from: req.body.address,
      data: TokenContract.methods.approve(MarketcontractAddress, req.params.id).encodeABI()
    };
    res.send(transactionParameters);    
  }
);

module.exports = router;