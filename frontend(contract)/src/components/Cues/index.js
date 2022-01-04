
import React from 'react';
import { Button, FormControlLabel, Checkbox, makeStyles, LinearProgress } from '@material-ui/core';
import styles from './style';
import { ethers } from 'ethers'
import { useEffect, useState } from 'react';
import axios from 'axios';

// import { useRouter } from 'next/router';
import Router from 'next/router'
import { Height } from '@material-ui/icons';
const alchemyKey = "https://eth-ropsten.alchemyapi.io/v2/O1zFXAP1hugb6q3Iti5B8uFXtBbejZuc";
//require('dotenv').config();
//const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
//const web3 = createAlchemyWeb3(alchemyKey); 
const NFTcontractABI = require('../../NFT.json');
const MarketcontractABI = require('../../Marketplace.json');
// const NFTcontractAddress = "0x428DF45323574E562AB4180F0e89Bff7BE187C46";
// const MarketcontractAddress = "0x588B1a01575DD533bf2A709490191b0438c4Eb33";
const NFTcontractAddress = "0xd95D493b5B048bE25bA70a89AD2360AC5f653a68";
const MarketcontractAddress = "0x2c8a4c0B41300Df687DFd0c1931AECe146BAE559";

const Web3 = require("web3");
let web3 = new Web3(
    new Web3.providers.WebsocketProvider("wss://ropsten.infura.io/ws/v3/acc8266b5baf41c5ad44a05fe4a49925")
);
const api = axios.create({
  baseURL: '/api'
  // headers: {
  //   'Content-Type': 'application/json'
  // }
});
const useStyles = makeStyles(styles);
export const connectWallet = async () => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      return {
        status: "👆🏽 Write a message in the text-field above.",  
        address: addressArray[0],     
      };      
    } catch (err) {
      return {
        status: "😥 " + err.message,
        address: "",
      };
    }
  } else {
    return {
      address: "",
      status: (
        <span>
          <p>
            {" "}
            🦊{" "}
            <a target="_blank" href={`https://metamask.io/download.html`}>
              You must install Metamask, a virtual Ethereum wallet, in your
              browser.
            </a>
          </p>
        </span>
      ),
    };
  }
};

const Cue = (props) => {
  const classes = useStyles();
  const [sellprice, setPrice] = useState("");
  const { name, itemId, level, exp, currentPower, totalPower, image, force, aim, spin, time, isActive, price, isAuto, isSelected, ...rest } = props;

  return (
    <div className={`${classes.cue} ${isSelected ? classes.selected_cue : ''}`} {...rest}>
      <div>
        <div>
          <h3>{name}</h3>
          <div>
            <p>{level} Level</p>
            <LinearProgress variant="determinate" value={exp} />
            <p>{currentPower}/{totalPower}</p>
            <img src="/images/power.png" alt="" />
          </div>
        </div>
        <img src={image} alt="" />
      </div>
      <div>
        <Power power={force} label="Force" />
        <Power power={aim} label="Aim" />
        <Power power={spin} label="Spin" />
        <Power power={time} label="Time" />
      </div>
      <div>
        {isActive ? (
          <>
          <div>
              <Button id="upgrade" style = {{width : "10px"}} onClick={() => sellNft(itemId,sellprice)}>Sell</Button>
              <input
                type="text"
                placeholder="0.00"
                onChange={(event) => setPrice(event.target.value)}
                style = {{width : "50px", height : "20px", margin : "5px 5px"}}
              />
              <label style = {{width : "30px", height : "20px", margin : "5px 0px"}}>{"ETH"}</label>
            </div>
            <div>
              <Button>
                <img src="/images/refresh.png" alt="" />
                <img src="/images/token.png" alt="" />
                <span>{price+" eth"}</span>
              </Button>
              <FormControlLabel control={<Checkbox checked={isAuto} style={{color: isAuto ? 'white' : 'grey'}} />} label="Auto" />
            </div>
          </>
        ) : (
          <Button id="buy" onClick={() => buyNft(itemId,price)}>
            Buy
            <img src="/images/token.png" alt="" />
            <span>{price+" eth"}</span>
          </Button>
        )}
      </div>
      { isSelected && <label>Selected</label> }
    </div>
  )
}

const Power = (props) => {
  const classes = useStyles();
  const { power, label } = props;

  return (
    <div className={classes.power}>
      {[...Array(10)].map((_, index) => (
        <div key={index} id={ power > index ? 'active' : '' } />
      ))}
      <p>{label}</p>
    </div>
  )
}

async function sellNft(id,price) {
  window.contractMark = await new web3.eth.Contract(MarketcontractABI, MarketcontractAddress);
  window.ContractNFT = await new web3.eth.Contract(NFTcontractABI, NFTcontractAddress);
  const transactionParameters = {
    to: NFTcontractAddress, // Required except during contract publications.
    from: window.ethereum.selectedAddress, // must match user's active address.
    'data': window.ContractNFT.methods.approve(MarketcontractAddress, id).encodeABI()//make call to NFT smart contract 
  };
  try {
    const receipt = await window.ethereum
    .request({
        method: 'eth_sendTransaction',
        params: [transactionParameters],
    });
  } catch (err) {
    return {
      error: err        
    };
  }
  var TokenContract_ = new web3.eth.Contract(NFTcontractABI,NFTcontractAddress);
  TokenContract_.events.Approval((err, events)=>{
    let sendprice = ethers.utils.parseUnits(price.toString(), 'ether')
    let priceStr = parseInt(sendprice._hex).toString()
    const transactionParameters = {
        to: MarketcontractAddress, // Required except during contract publications.
        from: window.ethereum.selectedAddress, // must match user's active address.
        'data': window.contractMark.methods.listItemOnSale(id, NFTcontractAddress,priceStr).encodeABI()//make call to NFT smart contract 
    };

    try {
      window.ethereum
      .request({
          method: 'eth_sendTransaction',
          params: [transactionParameters],
      });
    } catch (err) {
      return {
        error: err        
      };
    }
  });  
}

async function buyNft(id,price) {
  window.contractMark = await new web3.eth.Contract(MarketcontractABI, MarketcontractAddress);
  window.ContractNFT = await new web3.eth.Contract(NFTcontractABI, NFTcontractAddress);
  //var TokenContract = new web3.eth.Contract(NFTcontractABI,NFTcontractAddress);

  let sendprice = ethers.utils.parseUnits(price.toString(), 'ether')

  const transactionParameters = {
      to: MarketcontractAddress, // Required except during contract publications.
      from: window.ethereum.selectedAddress, // must match user's active address.
      value: sendprice._hex,
      'data': window.contractMark.methods.sellMarketItem(id, NFTcontractAddress).encodeABI()//make call to NFT smart contract 
  };

  // TokenContract.events.Transfer((err, events)=>{
  //   Router.reload(window.location.pathname);});

  try {
    const receipt = await window.ethereum
    .request({
        method: 'eth_sendTransaction',
        params: [transactionParameters],
    });
  } catch (err) {
    return {
      error: err        
    };
  }
}

const Cues = () => {
  const classes = useStyles();
  const [nfts, setNfts] = useState([])
  const [marketNfts, setMarketNfts] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')

  var TokenContract = new web3.eth.Contract(NFTcontractABI,NFTcontractAddress);
  TokenContract.events.Transfer((err, events)=>{Router.reload(window.location.pathname);});

  function addWalletListener() {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          loadNFTs(accounts[0]);
          loadMarket();    
        }
      });
    }
  }

  useEffect(() => {
    getCurrentWalletConnected();
    addWalletListener();       
    
  }, [])

  async function getCurrentWalletConnected() {
    if (window.ethereum) {
      try {
        const addressArray = await window.ethereum.request({
          method: "eth_accounts",
        });
        if (addressArray.length > 0) {
          loadNFTs(addressArray[0]);
          loadMarket();
          
        } 
      } catch (err) {
        return {
          address: ""        
        };
      }
    } 
  };
  async function loadMarket() {
    window.nftContract = await new web3.eth.Contract(NFTcontractABI, NFTcontractAddress);
    window.marketContract = await new web3.eth.Contract(MarketcontractABI, MarketcontractAddress);
    const data = await  window.marketContract.methods.fetchAllItemsOnSale().call();
    const items = await Promise.all(data.map(async i => {
      const tokenUri = await window.nftContract.methods.tokenURI(i.tokenId).call();
      const meta = await axios.get(tokenUri);
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
      //let price = parseInt(i.price);
      let item = {
        price,
        itemId: parseInt(i.itemId),
        lastseller: i.lastSeller,
        owner: i.owner,
        image: meta.data.image_url,
        name: meta.data.name,
        description: meta.data.description,
        isActive: false,
        level: meta.data.level,
        exp: meta.data.exp,
        currentPower: meta.data.currentPower,
        totalPower: meta.data.totalPower,
        force: meta.data.force,
        aim: meta.data.aim,
        spin: meta.data.spin,
        time: meta.data.time
      }
      return item
    }))
    setMarketNfts(items)
    setLoadingState('loaded')
  }
  async function loadNFTs(userAddress) { 
    window.nftContract = await new web3.eth.Contract(NFTcontractABI, NFTcontractAddress);
    window.marketContract = await new web3.eth.Contract(MarketcontractABI, MarketcontractAddress);
    const data = await  window.marketContract.methods.fetchAllItemsOfOwner(userAddress).call();
    const items = await Promise.all(data.map(async i => {
      const tokenUri = await window.nftContract.methods.tokenURI(i.tokenId).call();
      const meta = await axios.get(tokenUri);
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
      //let price = parseInt(i.price);
      
      let item = {
        price,
        itemId: parseInt(i.itemId),
        lastseller: i.lastSeller,
        owner: i.owner,
        image: meta.data.image_url,
        name: meta.data.name,
        description: meta.data.description,
        isActive: true,
        level: meta.data.level,
        exp: meta.data.exp,
        currentPower: meta.data.currentPower,
        totalPower: meta.data.totalPower,
        force: meta.data.force,
        aim: meta.data.aim,
        spin: meta.data.spin,
        time: meta.data.time,
        isAuto: false,
      }
      
      return item
    }))
    setNfts(items)
    setLoadingState('loaded')
  }

  const [selected, setSelected] = React.useState(0);
  //if (loadingState === 'loaded' && !nfts.length&&!marketNfts.length) return (<h1>No items in marketplace</h1>)
  return (
    <>
      <div className={classes.hero}>
        {
          nfts.map((cue, index) => (
            <Cue 
            key={index}
            itemId = {cue.itemId}
            name={cue.name}
            level={cue.level}
            exp={cue.exp}
            currentPower={cue.currentPower}
            totalPower={cue.totalPower}
            image={cue.image}
            force={cue.force}
            aim={cue.aim}
            spin={cue.spin}
            time={cue.time}
            isActive={cue.isActive}
            price={cue.price}
            isAuto={cue.isAuto}
            isSelected={selected === index}
            onClick={() => setSelected(index)}
          />            
          ))
        }
        {
          marketNfts.map((cue, index) => (
            <Cue 
            key={nfts.length+index}
            itemId = {cue.itemId}
            name={cue.name}
            level={cue.level}
            exp={cue.exp}
            currentPower={cue.currentPower}
            totalPower={cue.totalPower}
            image={cue.image}
            force={cue.force}
            aim={cue.aim}
            spin={cue.spin}
            time={cue.time}
            isActive={cue.isActive}
            price={cue.price}
            //isAuto={cue.isAuto}
            isSelected={selected === nfts.length+index}
            onClick={() => setSelected(nfts.length+index)}
          />            
          ))
        }
        {/* {data.map((cue, index) => (
          <Cue 
            key={index}
            //name={cue.name}
            name = {nfts}
            level={cue.level}
            exp={cue.exp}
            currentPower={cue.currentPower}
            totalPower={cue.totalPower}
            image={cue.image}
            force={cue.force}
            aim={cue.aim}
            spin={cue.spin}
            time={cue.time}
            isActive={cue.isActive}
            price={cue.price}
            isAuto={cue.isAuto}
            isSelected={selected === index}
            onClick={() => setSelected(index)}
          />
        ))} */}
      </div>
    </>
  );
}

export default Cues;