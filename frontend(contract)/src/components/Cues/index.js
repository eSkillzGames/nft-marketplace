
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
//const alchemyKey = "https://polygon-mumbai.g.alchemy.com/v2/4mg4dqqHfJ7nfo4sELW9PcnPiHXTDD93";
//require('dotenv').config();
//const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY;
//const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
//const web3 = createAlchemyWeb3(alchemyKey); 
const NFTcontractABI = require('../../NFT.json');
const MarketcontractABI = require('../../Marketplace.json');
// const NFTcontractAddress = "0xd95D493b5B048bE25bA70a89AD2360AC5f653a68";
// const MarketcontractAddress = "0x2c8a4c0B41300Df687DFd0c1931AECe146BAE559";
const NFTcontractAddress = "0x80EaA1ed894566e9772187943E4DFC9740Ec9d3F";
const MarketcontractAddress = "0x02D33105b3AafdBBBbeCE8886aB90324D37E232f";
var pendingArray = new Array(100000);

const Web3 = require("web3");

let web3 = new Web3(
    new Web3.providers.WebsocketProvider("wss://polygon-mumbai.g.alchemy.com/v2/4mg4dqqHfJ7nfo4sELW9PcnPiHXTDD93")
);


const useStyles = makeStyles(styles);

const myEmitter = new EventEmitter();
let eventvariable = 1;
var repeatMarkOwnedCheck = new Array(100000);
var repeatOwnedCheck = new Array(100000);
var repeatMarkCheck = new Array(100000);
export const connectWallet = async () => {
  try{
    const { ethereum } = window;
 
    if (ethereum) {
      try {     
        const addressArray = await ethereum.request({
          method: "eth_requestAccounts",
        });
        const chainIDBuffer = await ethereum.networkVersion;
        if(chainIDBuffer == 80001){
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
  }
  catch{
    return;
  }
   
};

const Cue = (props) => {
  const classes = useStyles();
  const [sellprice, setPrice] = useState("");
  const [isPending, setIsPending] = useState(0);
  const [showDescrit, setShowDescrit] = useState(0);
  const { name, description, itemId, tokenId, level, owned, image, strength, accuracy, control, freeItemDropChance, isActive, price, lastPrice, isAuto, isSelected,count,check, ...rest } = props;
  const imgRef = React.useRef(null);
  const [size, setSize] = useState({});
  myEmitter.on('event1', () => {
    setIsPending(1-isPending);
  });
  function showDescription(e) {
    setShowDescrit(1);
  }
  function hideDescription(e) {
    setShowDescrit(0)
  }
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
      <div className="first-div">                        
        <div>        
          <h3 onMouseOver={showDescription} onMouseOut = {hideDescription}>{name}</h3>
          <div>
            <p>{level} Level</p>
            <LinearProgress variant="determinate" value={level} />
          </div>
        </div>
       <h4 style={{textAlign: "center", padding:"4px 0px", margin : "0px"}}> {showDescrit == 1 ? description : ""}</h4>        
        <div style={{maxWidth:"400px", maxHeight : "30px"}}>
          <img ref={imgRef} src={image} alt="" style={{width : size.width, height : size.height}} onLoad={event => {
              if(event.target.naturalHeight/event.target.naturalWidth > 30/400){
                setSize({
                  height: 30,
                  width: event.target.naturalWidth*30/event.target.naturalHeight
                });
              }
              else{
                setSize({
                  height: event.target.naturalHeight*400/event.target.naturalWidth,
                  width: 400
                });
              }              
            }}
          />          
        </div>
        
      </div>
      <div>
        <span style={{margin : "0px 50%", color : "white", fontSize : "20px",paddingTop:"30px"}}>
          {countReal > 1 ? countReal : ""}
        </span> 
      </div>
      <div>
        <Power power={strength} label="Strength" />
        <Power power={accuracy} label="Accuracy" />
        <Power power={control} label="Control" />
        {/* <Power power={freeItemDropChance} label="Free Item Drop Chance" /> */}
      </div>
      <div>
        {pendingArray[itemId] > 0 ? (
          <div style = {{flexDirection : 'column', alignItems : 'center'}}>
          {isActive ? (
            <>
            <div>
              
              <Button id="upgrade" style = {{width : "10px"}} onClick={() => {}}>{pendingArray[itemId] == 1 ? "Pending": "Sell"}</Button>
              <input
                type="text"
                placeholder="0.00" 
                value={""}               
                style = {{width : "50px", height : "20px", margin : "5px 5px"}}
              />
              <label style = {{width : "30px", height : "20px", margin : "5px 0px"}}>{"MATIC"}</label>
            </div>
            <div style = {{paddingTop : '5px'}}>              
              <span>{"Last Price : "}</span>
              <img src="/images/token.png" alt="" />
              <span>{lastPrice+" MATIC"}</span>              
            </div>
            <div>
                <Button id="upgrade" style = {{width : "10px",background : "#752f2f", width :"140px"}} >{pendingArray[itemId] == 2 ? "Pending": "Remove Cue"}</Button>
                
              </div>
            </>
          ) : (
            <Button id="buy" >
              Pending
              <img src="/images/token.png" alt="" />
              <span>{price+" MATIC"}</span>
            </Button>
          )}
        </div>          
        ) : (
          <div style = {{flexDirection : 'column', alignItems : 'center'}}>
            {isActive ? (
              <>
              <div>
                <Button id="upgrade" style = {{width : "10px"}} onClick={() => {if(Number(sellprice) > 0) {eventvariable = 0;pendingArray[itemId] = 1;setIsPending(1-isPending);sellNft(itemId,tokenId,sellprice); setPrice(0); }}}>Sell</Button>
                <input
                  type="text"
                  placeholder="0.00"
                  onChange={(event) => setPrice(event.target.value)}
                  style = {{width : "50px", height : "20px", margin : "5px 5px"}}
                />
                <label style = {{width : "30px", height : "20px", margin : "5px 0px"}}>{"MATIC"}</label>
              </div>
              <div style = {{paddingTop : '5px'}}>
                  <span >{"Last Price : "}</span>
                  <img src="/images/token.png" alt="" />
                  <span>{lastPrice+" MATIC"}</span>              
              </div>
              <div>
                <Button id="upgrade" style = {{width : "10px",background : "#752f2f", width :"140px"}} onClick={() => {eventvariable = 0;pendingArray[itemId] = 2;setIsPending(1-isPending);removeNft(itemId,tokenId);}}>Remove Cue</Button>
                
              </div>
              </>
            ) : (
              <div>
              {owned ? (
                <Button id="buy" onClick={() => {eventvariable = 0;pendingArray[itemId] = 1; setIsPending(1-isPending); cancelNft(itemId);}}>                
                Cancel
                <img src="/images/token.png" alt="" />
                <span>{price+" MATIC"}</span>
                </Button>
              ) :(
                <Button id="buy" onClick={() => {eventvariable = 0;pendingArray[itemId] = 1; setIsPending(1-isPending); buyNft(itemId,price);}}>
                Buy
                <img src="/images/token.png" alt="" />
                <span>{price}</span>
                <span>&nbsp;MATIC</span>
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
      {[...Array(20)].map((_, index) => (
        <div key={index} id={ power/5 > index ? 'active' : '' } />
      ))}
      <p>{label}</p>
    </div>
  )
}

async function sellNft(id,tokenID, price) {
  try{
    const { ethereum } = window;
    if (ethereum) {
      const chainIDBuffer = await ethereum.networkVersion;
      if(chainIDBuffer == 80001){
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
          //pendingArray[id] = 0;  
          //eventEmit();            
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
  catch{
    return;
  }
  
}

async function removeNft(id,tokenID) {
  try{
    const { ethereum } = window;
    if (ethereum) {
      const chainIDBuffer = await ethereum.networkVersion;
      if(chainIDBuffer == 80001){
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const nftContract = new ethers.Contract(NFTcontractAddress, NFTcontractABI, signer);  
        try {
          let nftTxn = await nftContract.deleteNFT(id, tokenID);   
          await nftTxn.wait(); 
          //pendingArray[id] = 0;               
          //eventEmit();            
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
  catch{
    return;
  }
   
}

async function buyNft(id,price) {
  try{
    const { ethereum } = window;
    if (ethereum) {
      const chainIDBuffer = await ethereum.networkVersion;
      if(chainIDBuffer == 80001){
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
          //pendingArray[id] = 0;
          //eventEmit();
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
  catch{
    return;
  }
  
}

async function cancelNft(id) {
  try{
    const { ethereum } = window;
    if (ethereum) {
      const chainIDBuffer = await ethereum.networkVersion;
      if(chainIDBuffer == 80001){
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contractMark = new ethers.Contract(MarketcontractAddress, MarketcontractABI, signer);
        try {
          let nftTxn = await contractMark.listItemCancelOnSale(id, NFTcontractAddress); 
          await nftTxn.wait();
          //pendingArray[id] = 0;
          //eventEmit();
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
  catch{
    return;
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
  function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }
  async function eventListened() {
    await sleep(15000);
    try {
      if (window.ethereum) {
        
          const addressArray = await window.ethereum.request({
            method: "eth_accounts",
          });
          if (addressArray.length > 0) {
            setWalletAddress(addressArray[0]);
            loadNFTs(addressArray[0]);
            loadMarketOwned(addressArray[0]);
            loadMarket(addressArray[0]);
          } 
        
      }
    } catch (err) {
      return {
        address: ""        
      };
    }
  }

  useEffect(() => {
    getCurrentWalletConnected();
  }, [])

  async function getCurrentWalletConnected() {
    try {
      if (window.ethereum) {
        
          const addressArray = await window.ethereum.request({
            method: "eth_accounts",
          });
          
          if (addressArray.length > 0) {
            setWalletAddress(addressArray[0]);
            loadNFTs(addressArray[0]);
            loadMarketOwned(addressArray[0]);
            loadMarket(addressArray[0]);
          } 
        
      } 
    } catch (err) {
      return {
        address: ""        
      };
    }
  };

  async function loadMarketOwned(userAddress) {

    try{
      if(!check && connected){
        const { ethereum } = window;
        if (ethereum) {
          const chainIDBuffer = await ethereum.networkVersion;
          if(chainIDBuffer == 80001){
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const nftContract = new ethers.Contract(NFTcontractAddress, NFTcontractABI, signer);
            const marketContract = new ethers.Contract(MarketcontractAddress, MarketcontractABI, signer);
            let data = await marketContract.fetchAllItemsOnSaleOfOwner(userAddress); 
            const realItems = await Promise.all(data.map(async i => {
              let tokenUri;
              let meta;
              try{
                tokenUri = await nftContract.tokenURI(i.tokenId);  
                meta = await axios.get(tokenUri);
              } catch (err) {
                return;
              }           
              
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
                strength: meta.data.strength,
                accuracy: meta.data.accuracy,
                control: meta.data.control,
                freeItemDropChance: meta.data.freeItemDropChance
              }
              return item
            }))
            var items = []; 
            for (var i = 0; i < realItems.length; i++) { 
              if(realItems[i]!=null){
                items.push(realItems[i]);
              }
            }
  
            if(sortVal> 0){
              items.sort(function (a, b) {
                try{
                  return b.price - a.price;
                }
                catch{
                  return 0;
                }
                });
            }
            else{
              items.sort(function (a, b) {
                try{
                  return a.price - b.price;
                }
                catch{
                  return 0;
                }
                
              });
            }
  
            for (var i = 0; i < items.length; i++) {
              repeatMarkOwnedCheck[i] = 1;
              for(var j = 0; j < i; j++){
                if(items[i].price === items[j].price && items[i].image === items[j].image && items[i].name === items[j].name && items[i].description === items[j].description && 
                  items[i].level === items[j].level &&
                  items[i].strength === items[j].strength &&items[i].accuracy === items[j].accuracy &&items[i].control === items[j].control &&items[i].freeItemDropChance === items[j].freeItemDropChance &&repeatMarkOwnedCheck[j] > 0){
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
    } catch (err) {
      return;
    } 
           
  }

  async function loadMarket(userAddress) {
    try{
      if(!check && connected){
        const { ethereum } = window;
        if (ethereum) {
          const chainIDBuffer = await ethereum.networkVersion;
          if(chainIDBuffer == 80001){
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const nftContract = new ethers.Contract(NFTcontractAddress, NFTcontractABI, signer);
            const marketContract = new ethers.Contract(MarketcontractAddress, MarketcontractABI, signer);
            let data = await marketContract.fetchAllItemsOnSaleOfNotOwner(userAddress); 
            const realItems = await Promise.all(data.map(async i => {
              let tokenUri;
              let meta;
              try{
                tokenUri = await nftContract.tokenURI(i.tokenId);
                meta = await axios.get(tokenUri);
              } catch (err) {
                return;
              }     
              
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
                strength: meta.data.strength,
                accuracy: meta.data.accuracy,
                control: meta.data.control,
                freeItemDropChance: meta.data.freeItemDropChance
              }
              return item
            }))
            var items = []; 
            for (var i = 0; i < realItems.length; i++) { 
              if(realItems[i]!=null){
                items.push(realItems[i]);
              }
            }
            if(sortVal> 0){
              items.sort(function (a, b) {
                try{
                  return b.price - a.price;
                }
                catch{
                  return 0;
                }
                });
            }
            else{
              items.sort(function (a, b) {
                try{
                  return a.price - b.price;
                }
                catch{
                  return 0;
                }
                
              });
            }
            for (var i = 0; i < items.length; i++) {
              repeatMarkCheck[i] = 1;
              for(var j = 0; j < i; j++){
                if(items[i].price === items[j].price && items[i].image === items[j].image && items[i].name === items[j].name && items[i].description === items[j].description && 
                  items[i].level === items[j].level &&
                  items[i].strength === items[j].strength &&items[i].accuracy === items[j].accuracy &&items[i].control === items[j].control &&items[i].freeItemDropChance === items[j].freeItemDropChance &&repeatMarkCheck[j] > 0){
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
    } catch (err) {
      return;
    } 
           
  }

  async function loadNFTs(userAddress) { 
    try{
      if(check && connected){
        const { ethereum } = window;
        if (ethereum) {
          const chainIDBuffer = await ethereum.networkVersion;
          if(chainIDBuffer == 80001){
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const nftContract = new ethers.Contract(NFTcontractAddress, NFTcontractABI, signer);
            const marketContract = new ethers.Contract(MarketcontractAddress, MarketcontractABI, signer);
            let data = await marketContract.fetchAllItemsOnUseOfOwner(userAddress);         
            const realItems = await Promise.all(data.map(async i => {
              let tokenUri;
              let meta;
              try{
                tokenUri = await nftContract.tokenURI(i.tokenId);  
                
                meta = await axios.get(tokenUri);
              } catch (err) {
                return;
              } 
              
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
                strength: meta.data.strength,
                accuracy: meta.data.accuracy,
                control: meta.data.control,
                freeItemDropChance: meta.data.freeItemDropChance,
                isAuto: false,
              }
              
              return item
            }))
            var items = []; 
            for (var i = 0; i < realItems.length; i++) { 
              if(realItems[i]!=null){
                items.push(realItems[i]);
              }
            }
            if(sortVal> 0){
              items.sort(function (a, b) {
                try{
                  return b.price - a.price;
                }
                catch{
                  return 0;
                }
                });
            }
            else{
              items.sort(function (a, b) {
                try{
                  return a.price - b.price;
                }
                catch{
                  return 0;
                }
                
              });
            }
            for (var i = 0; i < items.length; i++) {
              repeatOwnedCheck[i] = 1;
              for(var j = 0; j < i; j++){
                if(items[i].lastPrice === items[j].lastPrice && items[i].image === items[j].image && items[i].name === items[j].name && items[i].description === items[j].description && 
                  items[i].level === items[j].level &&
                  items[i].strength === items[j].strength &&items[i].accuracy === items[j].accuracy &&items[i].control === items[j].control &&items[i].freeItemDropChance === items[j].freeItemDropChance &&repeatOwnedCheck[j] > 0){
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
    } catch (err) {
      return;
    } 
          
  }

  const [selected, setSelected] = React.useState(0);
  //const [showDescription, setShowDescription] = React.useState(0);
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
              image={cue.image}
              strength={cue.strength}
              accuracy={cue.accuracy}
              control={cue.control}
              freeItemDropChance={cue.freeItemDropChance}
              isActive={cue.isActive}
              price={cue.price}
              lastPrice={cue.lastPrice}
              isAuto={cue.isAuto}
              count = {index}
              check = {0}
              isSelected={selected === index}
              onClick={() => setSelected(index)}
              // showDescription = {showDescription}
              // onmouseover = {()=> setShowDescription(1)}
              // onmouseout = {()=> setShowDescription(0)}
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
            image={cue.image}
            strength={cue.strength}
            accuracy={cue.accuracy}
            control={cue.control}
            freeItemDropChance={cue.freeItemDropChance}
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
            image={cue.image}
            strength={cue.strength}
            accuracy={cue.accuracy}
            control={cue.control}
            freeItemDropChance={cue.freeItemDropChance}
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