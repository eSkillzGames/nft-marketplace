import { useEffect, useState } from "react";
import { ethers } from 'ethers';
import api from '../utils/api';
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
       if(window.ethereum ){            
         
         var chainId = Number(queryChainId);   
         
           try{   

             if(window.ethereum.networkVersion== null){
               await delay(30000);
               window.location.reload();
             }
             else{                  
               await window.ethereum.request({
                 method: 'wallet_switchEthereumChain',
                 params: [{ chainId: "0x"+chainId.toString(16) }],
               });                
               
               const addressArray = await window.ethereum.request({
                 method: "eth_requestAccounts",
               });
               if(queryFrom != null){
                 if(addressArray[0].toString().toLowerCase() != queryFrom.toLowerCase()){
                     setAdressComp("wallet Address do not equals.");                      
                     let result_data = {
                       address: queryFrom,
                       result : "fail",
                       contract : queryContractName.toString().toLowerCase()
                     }; 
                     await api.post('/saveTransactionResult', JSON.stringify(result_data));                                          
                 }
                 else{
                   const provider = new ethers.providers.Web3Provider(window.ethereum);
                   const signer = provider.getSigner();
                   var _Address = queryTo.toString();
                   let _contract;
                   if(queryContractName.toString().toLowerCase()== "sport"){
                     _contract = new ethers.Contract(_Address, SportABI, signer);
                   }
                   else if(queryContractName.toString().toLowerCase()== "bet"){
                     _contract = new ethers.Contract(_Address, BetABI, signer);
                   }
                   else if(queryContractName.toString().toLowerCase()== "cuenft"){
                     _contract = new ethers.Contract(_Address, NFTCueABI, signer);
                   }
                   else if(queryContractName.toString().toLowerCase()== "cardnft"){
                     _contract = new ethers.Contract(_Address, NFTCardABI, signer);
                   }
                   else if(queryContractName.toString().toLowerCase()== "cuemarket"){
                     _contract = new ethers.Contract(_Address, MarketCueABI, signer);
                   }
                   else if(queryContractName.toString().toLowerCase()== "cardmarket"){
                     _contract = new ethers.Contract(_Address, MarketCardABI, signer);
                   }                
                   
                   let nftTxn = await _contract[`${queryMethods}`].apply(this, queryData);
         
                   await nftTxn.wait();       
                   
                   let result_data = {
                     address: addressArray[0],
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
}

//   const send = async () => {  
//        if(queryAction == "send"){
//           if(window.ethereum ){            
            
//             var chainId = Number(queryChainId);   
            
//               try{   

//                 // if(window.ethereum.networkVersion== null){
//                 //   await delay(30000);
//                 //   window.location.reload();
//                 // }
//                 // else{                  
//                   await window.ethereum.request({
//                     method: 'wallet_switchEthereumChain',
//                     params: [{ chainId: "0x"+chainId.toString(16) }],
//                   });                
                  
//                   const addressArray = await window.ethereum.request({
//                     method: "eth_requestAccounts",
//                   });
//                   if(queryFrom != null){
//                     if(addressArray[0].toString().toLowerCase() != queryFrom.toLowerCase()){
//                         setAdressComp("wallet Address do not equals.");                      
//                         let result_data = {
//                           address: queryFrom,
//                           result : "fail",
//                           contract : queryContractName.toString().toLowerCase()
//                         }; 
//                         await api.post('/saveTransactionResult', JSON.stringify(result_data));                                          
//                     }
//                     else{
//                       const provider = new ethers.providers.Web3Provider(window.ethereum);
//                       const signer = provider.getSigner();
//                       var _Address = queryTo.toString();
//                       let _contract;
//                       if(queryContractName.toString().toLowerCase()== "sport"){
//                         _contract = new ethers.Contract(_Address, SportABI, signer);
//                       }
//                       else if(queryContractName.toString().toLowerCase()== "bet"){
//                         _contract = new ethers.Contract(_Address, BetABI, signer);
//                       }
//                       else if(queryContractName.toString().toLowerCase()== "cuenft"){
//                         _contract = new ethers.Contract(_Address, NFTCueABI, signer);
//                       }
//                       else if(queryContractName.toString().toLowerCase()== "cardnft"){
//                         _contract = new ethers.Contract(_Address, NFTCueABI, signer);
//                       }
//                       else if(queryContractName.toString().toLowerCase()== "cuemarket"){
//                         _contract = new ethers.Contract(_Address, NFTCueABI, signer);
//                       }
//                       else if(queryContractName.toString().toLowerCase()== "cardmarket"){
//                         _contract = new ethers.Contract(_Address, NFTCueABI, signer);
//                       }                
                      
//                       let nftTxn = await _contract[`${queryMethods}`].apply(this, queryData);
            
//                       await nftTxn.wait();       
                      
//                       let result_data = {
//                         address: addressArray[0],
//                         result : "end",
//                         contract : queryContractName.toString().toLowerCase()
//                       }; 
//                       await api.post('/saveTransactionResult', JSON.stringify(result_data));
//                     }
                   
//                   }               
                  
//                // }

//               }
//               catch (err){
//                   let result_data = {
//                     address: queryFrom,
//                     result : "fail",
//                     contract : queryContractName.toString().toLowerCase()
//                   }; 
//                   await api.post('/saveTransactionResult', JSON.stringify(result_data));
//               }
//           }
         
//        }    
// }

  return (
    <div className="Minter">
      {/* <button style={{ position: "absolute", top: "10%", left: "40%"}} onClick={send}>Click Here</button> */}
      {confirmStringArr.map((confirmStringPos, index) => (
          index == 0 ? 
          <h1 style={{ position: "absolute", top: "30%", left: "20%"}}>🧙‍♂️ {confirmStringPos}</h1>
          :
          <h1 style={{ position: "absolute", top: 30+index*7+"%", left: "23%"}}>{confirmStringPos}</h1>    
      ))}
      <h1 style={{ position: "absolute", top: "45%", left: "20%", color:'red',fontSize:'23px'}}>{address_comp}</h1>   
    </div>
  );
};


export default Transaction;

