
import React from 'react';
import { Button, FormControlLabel, Checkbox, makeStyles, LinearProgress } from '@material-ui/core';
import styles from './style';
import { ethers } from 'ethers';
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
const NFTcontractAddress = "0xF1f88246D1809D520b89E5470F07beD7Ae9451e9";
const MarketcontractAddress = "0x1A885f35a076e5075C98062a8b61c657862Fd252";
var pendingArray = new Array(100000);

const Web3 = require("web3");

let web3 = new Web3(
    new Web3.providers.WebsocketProvider("wss://ropsten.infura.io/ws/v3/acc8266b5baf41c5ad44a05fe4a49925")
);


const useStyles = makeStyles(styles);

const myEmitter = new EventEmitter();
let eventvariable = 1;
var repeatMarkOwnedCheck = new Array(100000);
var repeatOwnedCheck = new Array(100000);
var repeatMarkCheck = new Array(100000);
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
            chainID: chainIDBuffer, 
          };
      }
      else{
        return {
          status: "error : Another network",  
          address: addressArray[0],     
          chainID: chainIDBuffer,
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
  
  const { name, description, itemId, tokenId, level, owned, exp, currentPower, totalPower, image, force, aim, spin, time, isActive, price, lastPrice, isAuto, isSelected,count,check, ...rest } = props;
  myEmitter.on('event1', () => {
    setIsPending(1-isPending);
  });
  var countReal = 0;
  if(check == 0){
    countReal = repeatOwnedCheck[count];
  }
  else if(check == 1){
    countReal = repeatMarkOwnedCheck[count];
  }
  else{
    countReal = repeatMarkCheck[count];
  }
  if(countReal > 0){
  
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
        <h4 style={{textAlign: "center", padding:"4px 0px", margin : "0px"}}>{description}</h4>
        <div style={{maxWidth:"400px", maxHeight : "30px"}}>
          <img src={image} alt="" width="100%"/>          
        </div>
        
      </div>
      <div>
        <span style={{margin : "0px 50%", color : "white", fontSize : "20px",paddingTop:"30px"}}>
          {countReal > 1 ? countReal : ""}
        </span> 
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
                <Button id="upgrade" style = {{width : "10px"}} onClick={() => {eventvariable = 0;pendingArray[itemId] = 1;setIsPending(1-isPending);sellNft(itemId,tokenId,sellprice);}}>Sell</Button>
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
  )}
  else{
    return(<div/>)
  }
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

async function sellNft(id,tokenID, price) {
  const { ethereum } = window;
  if (ethereum) {
    const chainIDBuffer = await ethereum.networkVersion;
    if(chainIDBuffer == 3){
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const nftContract = new ethers.Contract(NFTcontractAddress, NFTcontractABI, signer);  
      let sendprice = ethers.utils.parseUnits(price.toString(), 'ether')       
      try {
        let nftTxn = await nftContract.approveAndListOnsSale(id, parseInt(sendprice._hex).toString(), tokenID,
          {
            value: ethers.utils.parseUnits("0.0025", 'ether')._hex,
          }
        );   
        await nftTxn.wait(); 
        pendingArray[id] = 0;               
        eventEmit();            
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
  const {check, sortVal, connected} = props;
  
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
    if(!check && connected){
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
              tokenId: parseInt(i.tokenId),
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

          for (var i = 0; i < items.length; i++) {
            repeatMarkOwnedCheck[i] = 1;
            for(var j = 0; j < i; j++){
              if(items[i].price === items[j].price && items[i].image === items[j].image && items[i].name === items[j].name && items[i].description === items[j].description && 
                items[i].level === items[j].level &&items[i].exp === items[j].exp &&items[i].currentPower === items[j].currentPower &&items[i].totalPower === items[j].totalPower &&
                items[i].force === items[j].force &&items[i].aim === items[j].aim &&items[i].spin === items[j].spin &&items[i].time === items[j].time &&repeatMarkOwnedCheck[j] > 0){
                repeatMarkOwnedCheck[i] = 0;
                repeatMarkOwnedCheck[j]+=1;
                break;
              }
            }
            
          }
          setMarketNftsOwned(items)          
          setLoadingState('loaded')        
        }
      } 
    }       
  }

  async function loadMarket(userAddress) {
    if(!check && connected){
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
              tokenId: parseInt(i.tokenId),
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
          for (var i = 0; i < items.length; i++) {
            repeatMarkCheck[i] = 1;
            for(var j = 0; j < i; j++){
              if(items[i].price === items[j].price && items[i].image === items[j].image && items[i].name === items[j].name && items[i].description === items[j].description && 
                items[i].level === items[j].level &&items[i].exp === items[j].exp &&items[i].currentPower === items[j].currentPower &&items[i].totalPower === items[j].totalPower &&
                items[i].force === items[j].force &&items[i].aim === items[j].aim &&items[i].spin === items[j].spin &&items[i].time === items[j].time &&repeatMarkCheck[j] > 0){
                repeatMarkCheck[i] = 0;
                repeatMarkCheck[j]+=1;
                break;
              }
            }
            
          }
          
          setMarketNfts(items)
          setLoadingState('loaded')        
        }
      } 
    }       
  }

  async function loadNFTs(userAddress) { 
    if(check && connected){
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
              tokenId: parseInt(i.tokenId),
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
          for (var i = 0; i < items.length; i++) {
            repeatOwnedCheck[i] = 1;
            for(var j = 0; j < i; j++){
              if(items[i].lastPrice === items[j].lastPrice && items[i].image === items[j].image && items[i].name === items[j].name && items[i].description === items[j].description && 
                items[i].level === items[j].level &&items[i].exp === items[j].exp &&items[i].currentPower === items[j].currentPower &&items[i].totalPower === items[j].totalPower &&
                items[i].force === items[j].force &&items[i].aim === items[j].aim &&items[i].spin === items[j].spin &&items[i].time === items[j].time &&repeatOwnedCheck[j] > 0){
                repeatOwnedCheck[i] = 0;
                repeatOwnedCheck[j]+= 1;
                break;
              }
            }
            
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
          nfts.map((cue, index) =>(
            //if(repeatOwnedCheck[index] > 0){
              <Cue 
              key={index}
              itemId = {cue.itemId}
              tokenId = {cue.tokenId}
              name={cue.name}
              description = {cue.description}
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
              count = {index}
              check = {0}
              isSelected={selected === index}
              onClick={() => setSelected(index)}
            />
           // }                        
          ))
        }
        { check === 0 &&
          marketNftsOwned.map((cue, index) => (
            <Cue 
            key={nfts.length+index}
            itemId = {cue.itemId}
            tokenId = {cue.tokenId}
            name={cue.name}
            description = {cue.description}
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
            count = {index}
            check = {1}
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
            tokenId = {cue.tokenId}
            name={cue.name}
            description = {cue.description}
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
            count = {index}
            check = {2}
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