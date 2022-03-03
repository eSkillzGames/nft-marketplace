
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
const NFTcontractABI = require('../../NFT_CARD.json');
const MarketcontractABI = require('../../Marketplace_CARD.json');
// const NFTcontractAddress = "0xd95D493b5B048bE25bA70a89AD2360AC5f653a68";
// const MarketcontractAddress = "0x2c8a4c0B41300Df687DFd0c1931AECe146BAE559";
const NFTcontractAddress = "0x4Add67aC56C4DC86B87C7e4B73FE9495f7d0FF65";
const MarketcontractAddress = "0xcaF7aFD5C5CA7CB4f8Ec08E594dD6E7A818C013C";
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

const Card = (props) => {
  const classes = useStyles();
  const [sellprice, setPrice] = useState("");
  const [isPending, setIsPending] = useState(0);
  const [showDescrit, setShowDescrit] = useState(0);
  const { name, description, itemId, tokenId, yieldBonus, owned, image, strength, accuracy, control, freeItemDropChance, isActive, price, lastPrice, isAuto, isSelected,count,check, ...rest } = props;
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
     
    <div className={`${classes.card} ${isSelected ? classes.selected_card : ''}`} {...rest}>      
      <div>                        
        <div>        
          <h3 onMouseOver={showDescription} onMouseOut = {hideDescription}>{name}</h3>
          <div>
            <p>{yieldBonus} Yield Bonus</p>
            <LinearProgress variant="determinate" value={yieldBonus} />
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
        <Power power={freeItemDropChance} label="Free Item Drop Chance" />
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
              <label style = {{width : "30px", height : "20px", margin : "5px 0px"}}>{"ETH"}</label>
            </div>
            <div style = {{paddingTop : '5px'}}>              
              <span>{"Last Price : "}</span>
              <img src="/images/token.png" alt="" />
              <span>{lastPrice+" eth"}</span>              
            </div>
            <div>
                <Button id="upgrade" style = {{width : "10px",background : "#752f2f", width :"140px"}} >{pendingArray[itemId] == 2 ? "Pending": "Remove Cue"}</Button>
                
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
          //Cards();
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
      if(chainIDBuffer == 3){
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const nftContract = new ethers.Contract(NFTcontractAddress, NFTcontractABI, signer);  
        try {
          let nftTxn = await nftContract.deleteNFT(id, tokenID);   
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
  }catch{
    return;
  }
   
}

async function buyNft(id,price) {
  try{
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
          //cards();
        } catch (err) {
          pendingArray[id] = 0;
          eventEmit();
          //cards();
          return {
            error: err        
          };
        }            
      }   
    }
  }catch{
    return;
  }
  
}

async function cancelNft(id) {
  try{
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
          //cards();
        } catch (err) {
          pendingArray[id] = 0;
          eventEmit();
          //cards();
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

const Cards = (props) => {
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
    try{
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
    catch{
      return;
    }
    
    
  }

  useEffect(() => {
    getCurrentWalletConnected();
  }, [])

  async function getCurrentWalletConnected() {
    try{
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
    catch{
      return;
    }
     
  };

  async function loadMarketOwned(userAddress) {
    try{
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
              let tokenUri;
              try{
                tokenUri = await nftContract.tokenURI(i.tokenId);  
              } catch (err) {
                return;
              }        
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
                yieldBonus: meta.data.yieldBonus,
                strength: meta.data.strength,
                accuracy: meta.data.accuracy,
                control: meta.data.control,
                freeItemDropChance: meta.data.freeItemDropChance
              }
              return item
            }))
  
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
                  items[i].yieldBonus === items[j].yieldBonus &&
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
          if(chainIDBuffer == 3){
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const nftContract = new ethers.Contract(NFTcontractAddress, NFTcontractABI, signer);
            const marketContract = new ethers.Contract(MarketcontractAddress, MarketcontractABI, signer);
            let data = await marketContract.fetchAllItemsOnSaleOfNotOwner(userAddress); 
            const items = await Promise.all(data.map(async i => {
              let tokenUri;
              try{
                tokenUri = await nftContract.tokenURI(i.tokenId);  
              } catch (err) {
                return;
              }            
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
                yieldBonus: meta.data.yieldBonus,
                strength: meta.data.strength,
                accuracy: meta.data.accuracy,
                control: meta.data.control,
                freeItemDropChance: meta.data.freeItemDropChance
              }
              return item
            }))
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
                  items[i].yieldBonus === items[j].yieldBonus &&
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
          if(chainIDBuffer == 3){          
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const nftContract = new ethers.Contract(NFTcontractAddress, NFTcontractABI, signer);
            const marketContract = new ethers.Contract(MarketcontractAddress, MarketcontractABI, signer);
            let data = await marketContract.fetchAllItemsOnUseOfOwner(userAddress);         
            const items = await Promise.all(data.map(async i => {
              let tokenUri;
              try{
                tokenUri = await nftContract.tokenURI(i.tokenId);  
              } catch (err) {
                return;
              } 
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
                yieldBonus: meta.data.yieldBonus,
                strength: meta.data.strength,
                accuracy: meta.data.accuracy,
                control: meta.data.control,
                freeItemDropChance: meta.data.freeItemDropChance,
                isAuto: false,
              }
              
              return item
            }))
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
                  items[i].yieldBonus === items[j].yieldBonus &&
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
          nfts.map((card, index) =>(
            //if(repeatOwnedCheck[index] > 0){
              <Card 
              key={index}
              itemId = {card.itemId}
              tokenId = {card.tokenId}
              name={card.name}
              description = {card.description}
              yieldBonus={card.yieldBonus}
              image={card.image}
              strength={card.strength}
              accuracy={card.accuracy}
              control={card.control}
              freeItemDropChance={card.freeItemDropChance}
              isActive={card.isActive}
              price={card.price}
              lastPrice={card.lastPrice}
              isAuto={card.isAuto}
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
          marketNftsOwned.map((card, index) => (
            <Card 
            key={nfts.length+index}
            itemId = {card.itemId}
            tokenId = {card.tokenId}
            name={card.name}
            description = {card.description}
            owned = {card.owned}
            yieldBonus={card.yieldBonus}
            image={card.image}
            strength={card.strength}
            accuracy={card.accuracy}
            control={card.control}
            freeItemDropChance={card.freeItemDropChance}
            isActive={card.isActive}
            price={card.price}
            lastPrice={card.lastPrice}
            count = {index}
            check = {1}
            isSelected={selected === nfts.length+index}
            onClick={() => setSelected(nfts.length+index)}
          />            
          ))
        }
        { check === 0 &&
          marketNfts.map((card, index) => (
            <Card 
            key={nfts.length+marketNftsOwned.length+index}
            itemId = {card.itemId}
            tokenId = {card.tokenId}
            name={card.name}
            description = {card.description}
            owned = {card.owned}
            yieldBonus={card.yieldBonus}
            image={card.image}
            strength={card.strength}
            accuracy={card.accuracy}
            control={card.control}
            freeItemDropChance={card.freeItemDropChance}
            isActive={card.isActive}
            price={card.price}
            lastPrice={card.lastPrice}
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

export default Cards;