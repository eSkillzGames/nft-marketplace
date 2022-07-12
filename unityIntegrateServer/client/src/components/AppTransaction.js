import { useEffect, useState } from "react";
import { ethers } from 'ethers';
import api from '../utils/api';
import WalletConnectProvider from '@walletconnect/web3-provider';
import Web3Modal from "web3modal";
const SportABI = require('../ABI/Sport.json');
const BetABI = require('../ABI/Betting.json');
const NFTCueABI = require('../ABI/NFT.json');
const MarketCueABI = require('../ABI/Marketplace.json');
const NFTCardABI = require('../ABI/NFT_CARD.json');
const MarketCardABI = require('../ABI/Marketplace_CARD.json');
const Web3 = require("web3");

const Transaction = (props) => {
  const query = new URLSearchParams(props.location.search);
  const queryAction = query.get('action');
  const queryChainId = query.get('chainId');
  const queryTo = query.get('to');  
  const queryFrom = query.get('from');
  const queryMethods = query.get('methods');
  const queryContractName = query.get('contractName');
  var confirmString = query.get('confirmString');
  var confirmStringArr = confirmString.split("'/'");
  var queryDataLength = query.get('dataLength');
  var queryData = new Array(Number(queryDataLength)); 
  const [address_comp, setAdressComp] = useState("");
  for (var i = 0; i < Number(queryDataLength); i ++) {
      queryData[i] = query.get('data'+(i+1).toString());
  }
  useEffect(() => {
    init();
  }, [])
  function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
  }
  
  const init = async () => {  
    if(queryAction == "send"){
       try{ 
        const provider = new WalletConnectProvider({
          rpc: {
            80001: "https://matic-mumbai.chainstacklabs.com",
          },
          chainId: 80001,
        });
        await provider.enable();
        if(provider.chainId == null){
          await delay(20000);
          window.location.reload();
        }
        else{
          const ethersProvider = new ethers.providers.Web3Provider(provider);
          const connectedAddress = await ethersProvider.listAccounts();
          if(connectedAddress[0].toString().toLowerCase() != queryFrom.toLowerCase()){
            setAdressComp("wallet Address do not equals.");
            let result_data = {
              address: queryFrom,
              result : "fail",
              contract : queryContractName.toString().toLowerCase()
            }; 
            await api.post('/saveTransactionResult', JSON.stringify(result_data));
          }
          else{
  
            if (!(Number(provider.chainId) === Number(queryChainId))) {
                await provider.request({
                  method: 'wallet_switchEthereumChain',
                  params: [{ chainId: "0x"+Number(queryChainId).toString(16) }],
                });
            }    
              
               if(queryFrom != null){
                  
                       var _Address = queryTo.toString();
                       let readContractInstance;
    
                      
                       if(queryContractName.toString().toLowerCase()== "sport"){
                        readContractInstance = new ethers.Contract(_Address, SportABI, ethersProvider);
                       }
                       else if(queryContractName.toString().toLowerCase()== "bet"){
                        readContractInstance = new ethers.Contract(_Address, BetABI, ethersProvider);
                       }
                       else if(queryContractName.toString().toLowerCase()== "cuenft"){
                        readContractInstance = new ethers.Contract(_Address, NFTCueABI, ethersProvider);
                       }
                       else if(queryContractName.toString().toLowerCase()== "cardnft"){
                        readContractInstance = new ethers.Contract(_Address, NFTCardABI, ethersProvider);
                       }
                       else if(queryContractName.toString().toLowerCase()== "cuemarket"){
                        readContractInstance = new ethers.Contract(_Address, MarketCueABI, ethersProvider);
                       }
                       else if(queryContractName.toString().toLowerCase()== "cardmarket"){
                        readContractInstance = new ethers.Contract(_Address, MarketCardABI, ethersProvider);
                       }   
                       const fromSigner = ethersProvider.getSigner();
                       const WriteContractInstance = await readContractInstance.connect(fromSigner);  
                               
                       let nftTxn = await WriteContractInstance[`${queryMethods}`].apply(this, queryData);
                       
                       await nftTxn.wait();     
                       
                         let result_data = {
                           address: queryFrom,
                           result : "end",
                           contract : queryContractName.toString().toLowerCase()
                         }; 
                         await api.post('/saveTransactionResult', JSON.stringify(result_data));  
                 }
          }
        }
     } 
     catch (err){
        
           let result_data = {
             address: queryFrom,
             result : "fail",
             contract : queryContractName.toString().toLowerCase()
           }; 
           await api.post('/saveTransactionResult', JSON.stringify(result_data));
         
     } 
 }  
}

  return (
    <div className="Minter">
      {/* <button style={{ position: "absolute", top: "10%", left: "10%"}} onClick={send}>Click Here</button> */}
      {confirmStringArr.map((confirmStringPos, index) => (
          index == 0 ? 
          <h1 style={{ position: "absolute", top: "20%", left: "2%", fontSize:'10px'}}>🧙‍♂️ {confirmStringPos}</h1>
          :
          <h1 style={{ position: "absolute", top: 20+index*15+"%", left: "2%", fontSize:'10px'}}>{confirmStringPos}</h1>    
      ))}
      <h1 style={{ position: "absolute", top: "50%", left: "2%", color:'red',fontSize:'10px'}}>{address_comp}</h1>    
    </div>
  );
};


export default Transaction;

