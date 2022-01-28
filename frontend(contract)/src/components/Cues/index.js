
import React from 'react';
import { Button, FormControlLabel, Checkbox, makeStyles, LinearProgress } from '@material-ui/core';
import styles from './style';
import { ethers } from 'ethers'
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Directions } from '@material-ui/icons';
import { element } from 'prop-types';

const { EventEmitter } = require("events");

// import { useRouter } from 'next/router';
// import Router from 'next/router'
// import { Height } from '@material-ui/icons';
//const alchemyKey = "https://eth-ropsten.alchemyapi.io/v2/O1zFXAP1hugb6q3Iti5B8uFXtBbejZuc";
//require('dotenv').config();
//const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY;
//const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
//const web3 = createAlchemyWeb3(alchemyKey); 
const NFTcontractABI = require('../../NFT.json');
const MarketcontractABI = require('../../Marketplace.json');
// const NFTcontractAddress = "0xd95D493b5B048bE25bA70a89AD2360AC5f653a68";
// const MarketcontractAddress = "0x2c8a4c0B41300Df687DFd0c1931AECe146BAE559";
const NFTcontractAddress = "0x2dC7DE43f04Cf66fA0fa25cDAD796Ff3fcF9e56A";
const MarketcontractAddress = "0x5ef97ACc5C9b671f9c59f214b5733635580ef089";
var pendingArray = new Array(100000);

const Web3 = require("web3");

let web3 = new Web3(
    new Web3.providers.WebsocketProvider("wss://ropsten.infura.io/ws/v3/acc8266b5baf41c5ad44a05fe4a49925")
);
const useStyles = makeStyles(styles);

const myEmitter = new EventEmitter();
let eventvariable = 1;
export const connectWallet = async () => {
  const { ethereum } = window;
  if (ethereum) {
    try {
      const addressArray = await ethereum.request({
        method: "eth_requestAccounts",
      });
      const chainIDBuffer = await ethereum.networkVersion;
      if(chainIDBuffer == 3){
          return {
            status: "success : Connect",  
            address: addressArray[0],    
            chainID: chainID, 
          };
      }
      else{
        return {
          status: "error : Another network",  
          address: addressArray[0],     
          chainID: chainID,
        };
      }

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
  const [isPending, setIsPending] = useState(0);
  
  const { name, itemId, level, owned, exp, currentPower, totalPower, image, force, aim, spin, time, isActive, price, lastPrice, isAuto, isSelected, ...rest } = props;
  myEmitter.on('event1', () => {
    setIsPending(1-isPending);
  });
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
        {pendingArray[itemId] == 1 ? (
          <div style = {{flexDirection : 'column', alignItems : 'center'}}>
          {isActive ? (
            <>
            <div>
              <Button id="upgrade" style = {{width : "10px"}} onClick={() => {}}>Pending</Button>
              <input
                type="text"
                placeholder="0.00" 
                value={""}               
                style = {{width : "50px", height : "20px", margin : "5px 5px"}}
              />
              <label style = {{width : "30px", height : "20px", margin : "5px 0px"}}>{"ETH"}</label>
            </div>
            <div style = {{paddingTop : '5px'}}>              
              <span>{"Last Price : "}</span>
              <img src="/images/token.png" alt="" />
              <span>{lastPrice+" eth"}</span>              
            </div>
            </>
          ) : (
            <Button id="buy" onClick={() => {}}>
              Pending
              <img src="/images/token.png" alt="" />
              <span>{price+" eth"}</span>
            </Button>
          )}
        </div>          
        ) : (
          <div style = {{flexDirection : 'column', alignItems : 'center'}}>
            {isActive ? (
              <>
              <div>
                <Button id="upgrade" style = {{width : "10px"}} onClick={() => {eventvariable = 0;pendingArray[itemId] = 1;setIsPending(1-isPending);sellNft(itemId,sellprice);}}>Sell</Button>
                <input
                  type="text"
                  placeholder="0.00"
                  onChange={(event) => setPrice(event.target.value)}
                  style = {{width : "50px", height : "20px", margin : "5px 5px"}}
                />
                <label style = {{width : "30px", height : "20px", margin : "5px 0px"}}>{"ETH"}</label>
              </div>
              <div style = {{paddingTop : '5px'}}>
                  <span >{"Last Price : "}</span>
                  <img src="/images/token.png" alt="" />
                  <span>{lastPrice+" ETH"}</span>              
                </div>
              </>
            ) : (
              <div>
              {owned ? (
                <Button id="buy" onClick={() => {eventvariable = 0;pendingArray[itemId] = 1; setIsPending(1-isPending); cancelNft(itemId);}}>                
                Cancel
                <img src="/images/token.png" alt="" />
                <span>{price+" eth"}</span>
                </Button>
              ) :(
                <Button id="buy" onClick={() => {eventvariable = 0;pendingArray[itemId] = 1; setIsPending(1-isPending); buyNft(itemId,price);}}>
                Buy
                <img src="/images/token.png" alt="" />
                <span>{price}</span>
                <span>&nbsp;ETH</span>
                </Button> 
              )}
              </div>
              
            )}
          </div>          
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
  const { ethereum } = window;
  if (ethereum) {
    const chainIDBuffer = await ethereum.networkVersion;
    if(chainIDBuffer == 3){
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const nftContract = new ethers.Contract(NFTcontractAddress, NFTcontractABI, signer);         
      try {
        let nftTxn = await nftContract.approve(MarketcontractAddress, id);   
        await nftTxn.wait(); 
        if (ethereum) {
          const chainIDBuffer = await ethereum.networkVersion;
          if(chainIDBuffer == 3){            
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            let sendprice = ethers.utils.parseUnits(price.toString(), 'ether')
            const contractMark = new ethers.Contract(MarketcontractAddress, MarketcontractABI, signer);
            try {
              let nftTxn1 = await contractMark.listItemOnSale(id, NFTcontractAddress,parseInt(sendprice._hex).toString());   
              await nftTxn1.wait();              
              pendingArray[id] = 0; 
              
              eventEmit();

              //Cues();    
            } catch (err) {
              pendingArray[id] = 0;
              eventEmit();
              //Cues();
              return {
                error: err        
              };
            }                         
          }
        }     
      } catch (err) {
        pendingArray[id] = 0;
        eventEmit();        
        //Cues();
        return {
          error: err        
        };
      }   
    }
  } 
}

async function buyNft(id,price) {
  
  const { ethereum } = window;
  if (ethereum) {
    const chainIDBuffer = await ethereum.networkVersion;
    if(chainIDBuffer == 3){
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const contractMark = new ethers.Contract(MarketcontractAddress, MarketcontractABI, signer);
      try {
        let nftTxn = await contractMark.sellMarketItem(id, NFTcontractAddress, 
          {
            value: ethers.utils.parseUnits(price.toString(), 'ether')._hex,
          }        
        ); 
        await nftTxn.wait();
        pendingArray[id] = 0;
        eventEmit();
        //Cues();
      } catch (err) {
        pendingArray[id] = 0;
        eventEmit();
        //Cues();
        return {
          error: err        
        };
      }            
    }   
  }
}

async function cancelNft(id) {
  
  const { ethereum } = window;
  if (ethereum) {
    const chainIDBuffer = await ethereum.networkVersion;
    if(chainIDBuffer == 3){
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const contractMark = new ethers.Contract(MarketcontractAddress, MarketcontractABI, signer);
      try {
        let nftTxn = await contractMark.listItemCancelOnSale(id, NFTcontractAddress); 
        await nftTxn.wait();
        pendingArray[id] = 0;
        eventEmit();
        //Cues();
      } catch (err) {
        pendingArray[id] = 0;
        eventEmit();
        //Cues();
        return {
          error: err        
        };
      }            
    }   
  }
}

function eventEmit() {
  if(eventvariable == 0 ){
    eventvariable++;
    myEmitter.emit('event'+eventvariable);
  }
  
}

const Cues = (props) => {
  const classes = useStyles();
  const [nfts, setNfts] = useState([])
  const [marketNfts, setMarketNfts] = useState([])
  const [marketNftsOwned, setMarketNftsOwned] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')
  const [loaded, setLoaded] = useState(0)
  const [walletAddress, setWalletAddress] = useState(0)
  var TokenContract = new web3.eth.Contract(NFTcontractABI,NFTcontractAddress);
  const {check, sortVal} = props;
  if(loaded == 0){
    setLoaded(1);
    TokenContract.events.Transfer((err, events)=>{
      eventListened();      
    });    
  }
 
  async function eventListened() {
    if (window.ethereum) {
      try {
        const addressArray = await window.ethereum.request({
          method: "eth_accounts",
        });
        if (addressArray.length > 0) {
          setWalletAddress(addressArray[0]);
          loadNFTs(addressArray[0]);
          loadMarketOwned(addressArray[0]);
          loadMarket(addressArray[0]);
        } 
      } catch (err) {
        return {
          address: ""        
        };
      }
    }
    
  }

  useEffect(() => {
    getCurrentWalletConnected();
  }, [])

  async function getCurrentWalletConnected() {
    if (window.ethereum) {
      try {
        const addressArray = await window.ethereum.request({
          method: "eth_accounts",
        });
        
        if (addressArray.length > 0) {
          setWalletAddress(addressArray[0]);
          loadNFTs(addressArray[0]);
          loadMarketOwned(addressArray[0]);
          loadMarket(addressArray[0]);
        } 
      } catch (err) {
        return {
          address: ""        
        };
      }
    } 
  };

  async function loadMarketOwned(userAddress) {
    if(!check){
      const { ethereum } = window;
      if (ethereum) {
        const chainIDBuffer = await ethereum.networkVersion;
        if(chainIDBuffer == 3){
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const nftContract = new ethers.Contract(NFTcontractAddress, NFTcontractABI, signer);
          const marketContract = new ethers.Contract(MarketcontractAddress, MarketcontractABI, signer);
          let data = await marketContract.fetchAllItemsOnSaleOfOwner(userAddress); 
          const items = await Promise.all(data.map(async i => {
            const tokenUri = await nftContract.tokenURI(i.tokenId);          
            const meta = await axios.get(tokenUri);
            let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
            let lastPrice = ethers.utils.formatUnits(i.lastPrice.toString(), 'ether')
            // let ownedMarketItem = i.owner == address ? 1 : 0;
            //let price = parseInt(i.price);
            let item = {
              price,
              lastPrice,
              itemId: parseInt(i.itemId),
              lastseller: i.lastSeller,
              owner: i.owner,
              owned: 1,
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

          if(sortVal> 0){
            items.sort(function (a, b) {
              return b.price - a.price;
            });
          }
          else{
            items.sort(function (a, b) {
              return a.price - b.price;
            });
          }
          
          setMarketNftsOwned(items)
          setLoadingState('loaded')        
        }
      } 
    }       
  }

  async function loadMarket(userAddress) {
    if(!check){
      const { ethereum } = window;
      if (ethereum) {
        const chainIDBuffer = await ethereum.networkVersion;
        if(chainIDBuffer == 3){
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const nftContract = new ethers.Contract(NFTcontractAddress, NFTcontractABI, signer);
          const marketContract = new ethers.Contract(MarketcontractAddress, MarketcontractABI, signer);
          let data = await marketContract.fetchAllItemsOnSaleOfNotOwner(userAddress); 
          const items = await Promise.all(data.map(async i => {
            const tokenUri = await nftContract.tokenURI(i.tokenId);          
            const meta = await axios.get(tokenUri);
            let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
            let lastPrice = ethers.utils.formatUnits(i.lastPrice.toString(), 'ether')
            // let ownedMarketItem = i.owner == address ? 1 : 0;
            //let price = parseInt(i.price);
            let item = {
              price,
              lastPrice,
              itemId: parseInt(i.itemId),
              lastseller: i.lastSeller,
              owner: i.owner,
              owned: 0,
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
          if(sortVal> 0){
            items.sort(function (a, b) {
              return b.price - a.price;
            });
          }
          else{
            items.sort(function (a, b) {
              return a.price - b.price;
            });
          }
          setMarketNfts(items)
          setLoadingState('loaded')        
        }
      } 
    }       
  }

  async function loadNFTs(userAddress) { 
    if(check){
      const { ethereum } = window;
      if (ethereum) {
        const chainIDBuffer = await ethereum.networkVersion;
        if(chainIDBuffer == 3){
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const nftContract = new ethers.Contract(NFTcontractAddress, NFTcontractABI, signer);
          const marketContract = new ethers.Contract(MarketcontractAddress, MarketcontractABI, signer);
          let data = await marketContract.fetchAllItemsOnUseOfOwner(userAddress);         
          const items = await Promise.all(data.map(async i => {
            const tokenUri = await nftContract.tokenURI(i.tokenId);
            const meta = await axios.get(tokenUri);
            let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
            let lastPrice = ethers.utils.formatUnits(i.lastPrice.toString(), 'ether')
            //let price = parseInt(i.price);
            
            let item = {
              price,
              lastPrice,
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
          if(sortVal> 0){
            items.sort(function (a, b) {
              return b.price - a.price;
            });
          }
          else{
            items.sort(function (a, b) {
              return a.price - b.price;
            });
          }
          setNfts(items)
          setLoadingState('loaded')
        }
      }  
    }      
  }

  const [selected, setSelected] = React.useState(0);
  //if (loadingState === 'loaded' && !nfts.length&&!marketNfts.length) return (<h1>No items in marketplace</h1>)
  return (
    <>
      <div className={classes.hero}>
        { check === 1 &&
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
            lastPrice={cue.lastPrice}
            isAuto={cue.isAuto}
            isSelected={selected === index}
            onClick={() => setSelected(index)}
          />            
          ))
        }
        { check === 0 &&
          marketNftsOwned.map((cue, index) => (
            <Cue 
            key={nfts.length+index}
            itemId = {cue.itemId}
            name={cue.name}
            owned = {cue.owned}
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
            lastPrice={cue.lastPrice}
            isSelected={selected === nfts.length+index}
            onClick={() => setSelected(nfts.length+index)}
          />            
          ))
        }
        { check === 0 &&
          marketNfts.map((cue, index) => (
            <Cue 
            key={nfts.length+marketNftsOwned.length+index}
            itemId = {cue.itemId}
            name={cue.name}
            owned = {cue.owned}
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
            lastPrice={cue.lastPrice}
            isSelected={selected === nfts.length+marketNftsOwned.length+index}
            onClick={() => setSelected(nfts.length+marketNftsOwned.length+index)}
          />            
          ))
        }        
      </div>
    </>
  );
}

export default Cues;