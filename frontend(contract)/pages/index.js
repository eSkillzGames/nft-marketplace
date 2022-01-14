import React from 'react';
import Home from './home';
import Cues  from "../src/components/Cues/index.js"; 
const NFTcontractABI = require('../src/NFT.json');
const NFTcontractAddress = "0xd95D493b5B048bE25bA70a89AD2360AC5f653a68";
const Web3 = require("web3");
let web3 = new Web3(
    new Web3.providers.WebsocketProvider("wss://ropsten.infura.io/ws/v3/acc8266b5baf41c5ad44a05fe4a49925")
);
var TokenContract = new web3.eth.Contract(NFTcontractABI,NFTcontractAddress);
export default function Index() {
  const [transferListen, setTransferListen] = React.useState(0);
  TokenContract.events.Transfer({})
      .on('data', async function(event){
        
        setTransferListen(1-transferListen);  
        
    })  
  return (
    <Home />
  );
}
