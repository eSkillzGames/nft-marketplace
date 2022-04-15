
import React from 'react';
import { Button, makeStyles, TextField} from '@material-ui/core';
import styles from './style';
import { ToggleButton, ToggleButtonGroup} from '@mui/material';
import { ethers } from 'ethers';
// import Modal from "react-modal";
// import { useRouter } from 'next/router';
import { useEffect, useState } from "react";
import { blue } from '@material-ui/core/colors';

const axios = require('axios');
const IpfsHttpClient = require("ipfs-http-client");
const ipfsC = IpfsHttpClient.create({
  host: "ipfs.infura.io",
  port: "5001",
  protocol: "https",
});

const NFTcontractABI = require('../../ABIs/NFT.json');
const NFTcontractAddress = "0x80EaA1ed894566e9772187943E4DFC9740Ec9d3F";
const CardNFTcontractABI = require('../../ABIs/NFT_CARD.json');
const CardNFTcontractAddress = "0x9a14420A44D3BD7074B8bAfE96Ab5538EF0B1ABD";
const Web3 = require("web3");

let web3 = new Web3(
    new Web3.providers.WebsocketProvider("wss://polygon-mumbai.g.alchemy.com/v2/4mg4dqqHfJ7nfo4sELW9PcnPiHXTDD93")
);
const useStyles = makeStyles(styles);

const Quantity = (props) => {
  const classes = useStyles();
  const { quantity, setQuantity } = props;
  return (
    <div className={classes.quantity}>
      <Button variant="contained" onClick={() => setQuantity(quantity - 1)} disabled={quantity === 1}>-</Button>
      <span>{quantity}</span>
      <Button variant="contained" onClick={() => setQuantity(quantity + 1)}>+</Button>
    </div>
  )
}

function MintPage() {
  const classes = useStyles();
  const [nftType, setNftType] = React.useState(0);
  const [quantity, setQuantity] = React.useState(1);
  const [imgHash, setImgHash] = React.useState("");
  const [imgNameUpload, setImgNameUpload] = React.useState("");
  const [imgName, setImageName] = React.useState("");
  const [imgLevel, setImageLevel] = React.useState("");
  const [imgStrength, setImageStrength] = React.useState("");
  const [imgAccuracy, setImageAccuracy] = React.useState("");
  const [imgControl, setImageControl] = React.useState("");
  const [imgFreeItemDropChance, setImageFreeItemDropChance] = React.useState("");
  const [imgDescription, setImageDescription] = React.useState("");
  const [metadaState, setMetadaState] = React.useState("");
  const [beforeTokenURI, setBeforeTokenURI] = React.useState("");
  const [metaDatachanged, setMetaDatachanged] = React.useState(0);
  const [address, setAdress] = React.useState("");
  const [netName, setNetName] = React.useState("");
  const [balance, setBalance] = useState("");
  const [supportAddress, setSupportAddress] = useState("");
  const [equipType, setEquipType] = useState(0);

  // const router = useRouter();
  // Modal.setAppElement("#__next");
  const upload = async (e) => {    
    try{
      setMetaDatachanged(0);
      if(imgHash !="Pending"){
        var _URL = window.URL || window.webkitURL;
        var file, img;      
        var image = document.getElementById('output');
        if(e.target.files.length>0){
          file = e.target.files[0];        
          if(file.type == "image/png" || file.type == "image/jpeg"){
            img = new Image();
            var objectUrl = _URL.createObjectURL(file);
            img.onload = async function () {  
              if(this.width<=1024 && this.height<=1024){            
                image.src = objectUrl;
                _URL.revokeObjectURL(objectUrl);                
                setImgHash("Pending");
                setImgNameUpload("Pending");
                const addedToIPFS = await ipfsC.add(file);
                setImgHash(addedToIPFS.path);
                setImgNameUpload(file.name);    
              } 
              else{
                image.src = "";
                setImgNameUpload("Image size is bigger than 1024 X 1024");
              }              
            };          
            img.src = objectUrl;  
          }
          else{
            setImgHash("Pending");
            setImgNameUpload("Pending");
            const addedToIPFS = await ipfsC.add(file);
            setImgHash(addedToIPFS.path);
            setImgNameUpload(file.name);              
          }
        }
        else{
            image.src = "";
            setImgHash("");
            setImgNameUpload("");
        }
      }
    }
    catch{
      return;
    }
        
       
   };

   const uploadMetaData = async () => {
     try{
      if (imgName.toString().trim() == "" || imgDescription.toString().trim() == "" || imgHash.toString().trim() == "" || imgHash.toString().trim() == "Pending" ||imgLevel.toString().trim() == "" ||imgStrength.toString().trim() == "" ||imgAccuracy.toString().trim() == "" ||imgControl.toString().trim() == "" ||imgFreeItemDropChance.toString().trim() == "" ) { 
        setMetadaState("❗Please make sure all fields are completed before minting.");      
      }
      else{
        if(parseInt(imgLevel) > 0 && parseInt(imgStrength) > 0 && parseInt(imgAccuracy) > 0 && parseInt(imgControl) > 0 && parseInt(imgFreeItemDropChance) >= 0 ){
          
          if(address!=""){
            // make metaData
            const metadata = new Object();
            metadata.name = imgName;
            metadata.image_url = "https://gateway.pinata.cloud/ipfs/" + imgHash;
            metadata.description = imgDescription;   
            if(equipType == 0){
              metadata.level = imgLevel;
            }
            else{
              metadata.yieldBonus = imgLevel;
            }
            
            metadata.strength = imgStrength;
            metadata.accuracy = imgAccuracy;
            metadata.control = imgControl;
            metadata.freeItemDropChance = imgFreeItemDropChance;
            if(metaDatachanged > 0) {
              mintNft(beforeTokenURI);
            }
            else{
              if(metadaState != "Pending"){
                setMetadaState("Pending");          
                //make pinata call
                const pinataResponse = await pinJSONToIPFS(metadata);
                if (!pinataResponse.success) {
                  setMetadaState("😢 Something went wrong while uploading your tokenURI.");          
                } 
                else{
                  setMetadaState("PinataHash : " + pinataResponse.pinataUrl);
                  //setMetadaState("PinataUpload : Success.");
                  const tokenURI = pinataResponse.pinataUrl;   
                  setBeforeTokenURI(tokenURI);
                  setMetaDatachanged(1);
                  mintNft(tokenURI);      
                }
              }
            }    
          }
          else{
            window.alert("Connect to the MetaMask");
          }
                
          
        }
        else {
          setMetadaState("❗Please make sure all fields of Attributes are Integers and none zero.");
        }
        
              
      }  
     }catch{
       return;
     }
    
  };

  const pinJSONToIPFS = async(JSONBody) => {
    const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
    //making axios POST request to Pinata ⬇️
    return axios 
        .post(url, JSONBody, {
            headers: {
                pinata_api_key: "238047f870c7ab07af4b",
                pinata_secret_api_key: "1b57450a5dc199dd620cca759bf665c8abc323278469baf2368cb3d8372d9a6f",
            }
        })
        .then(function (response) {
           return {
               success: true,
               pinataUrl: "https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash
           };
        })
        .catch(function (error) {
            console.log(error)
            return {
                success: false,
                message: error.message,
            }

        });
  };

  async function mintNft(_tokenUri) {    
    try{
      const { ethereum } = window;
      if (window.ethereum) {
        const chainIDBuffer = await window.ethereum.networkVersion;
        if(chainIDBuffer == 80001){
          
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          let contractNFT = new ethers.Contract(NFTcontractAddress, NFTcontractABI, signer);
          if(equipType == 1){
            contractNFT = new ethers.Contract(CardNFTcontractAddress, CardNFTcontractABI, signer);
          }        
          try {
            let nftTxn;
            if(supportAddress.length == 42 && supportAddress.substring(0,2) == "0x"){
              //console.log(supportAddress);
              nftTxn = await contractNFT.createTokensForUser(_tokenUri, quantity, supportAddress);
            }
            else{
              nftTxn = await contractNFT.createTokens(_tokenUri, quantity);
            }
            //nftTxn = await contractNFT.createTokens(_tokenUri, quantity);
            await nftTxn.wait(); 
            setImageName("");
            setImageDescription("");
            setImgNameUpload("");
            setImageLevel("");
            setImageStrength("");
            setImageAccuracy("");
            setImageControl("");
            setImageFreeItemDropChance("");
            setImgHash("");
            var image = document.getElementById('output');
            image.src = "";
            if(equipType == 0){
              if(quantity ==1){
                window.alert("1 Cue minted successfully");   
              }
              else{
                window.alert(quantity + " Cues minted successfully");
              }
            }
            else{
              if(quantity ==1){
                window.alert("1 Card minted successfully");   
              }
              else{
                window.alert(quantity + " Cards minted successfully");
              }
            }
                        
          } catch (err) {          
            window.alert("Minting of the NFT failed");
          }            
        }   
      }
    }catch{
      return;
    }
    
  }

  useEffect(() => {
    try{
      if(window.ethereum) {
        window.ethereum.on('chainChanged', () => {
          window.location.reload();
        })
        window.ethereum.on('accountsChanged', () => {
          window.location.reload();
        })
      }
      getCurrentWalletConnected(); 
    }
    catch{
      return;
    }
    
    
  }, [])

  async function getCurrentWalletConnected() {
    try {
      if (window.ethereum) {
        
          const addressArray = await window.ethereum.request({
            method: "eth_accounts",
          });
          var web3Window = new Web3(window.ethereum);
          const chainIDBuffer = await web3Window.eth.net.getId();
          if(addressArray.length > 0){
            setAdress(addressArray[0]);
            if(chainIDBuffer == 80001){
              setNetName("");  
              web3Window.eth.getBalance(addressArray[0], (err, balanceOf) => {
                let balETH = ethers.utils.formatUnits(balanceOf, 'ether');        
                setBalance(String(balETH).substring(0, 6) + " MATIC");
              });           
            }
            else{  
              setNetName("Wrong NET(DisConnect)");  
            }
          }         
        
      } 
    } catch (err) {
      return {
        address: ""        
      };
    }
  };

  async function connect_Wallet() {
    const chainId = 80001;
    try{
      if (window.ethereum) {
        var web3Window = new Web3(window.ethereum);     
        if (window.ethereum.networkVersion != chainId) {
          
          try {            
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: "0x"+chainId.toString(16)}],
            });
            if(address== ""){
              try {          
                await window.ethereum.request({
                  method: "wallet_requestPermissions",
                  params: [{
                      eth_accounts: {}
                  }]
                });
                const addressArray = await window.ethereum.request({method: "eth_accounts",});
                var web3Window = new Web3(window.ethereum);
                //setChainID(chainIDBuffer);
                if(addressArray.length > 0){
                  setAdress(addressArray[0]);
                    setNetName("");    
                    web3Window.eth.getBalance(addressArray[0], (err, balanceOf) => {
                      let balETH = ethers.utils.formatUnits(balanceOf, 'ether');        
                      setBalance(String(balETH).substring(0, 6) + " MATIC");
                    }); 
                }        
              } catch (err) {
                return {
                  address: ""        
                };
              }
            }
            else{
              setAdress("");
              setNetName(""); 
            }   
          } catch (err) {
              // This error code indicates that the chain has not been added to MetaMask.
            if (err.code === 4902) {
              await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [
                  {
                    chainName: 'Polygon Mumbai',
                    chainId: web3.utils.toHex(chainId),
                    nativeCurrency: { name: 'Matic', decimals: 18, symbol: 'Matic' },
                    rpcUrls: ['https://rpc-mumbai.maticvigil.com/'],
                  },
                ],
              });
            }
          }
        }
        else{
          if(address== ""){
            try {          
              await window.ethereum.request({
                method: "wallet_requestPermissions",
                params: [{
                    eth_accounts: {}
                }]
              });
              const addressArray = await window.ethereum.request({method: "eth_accounts",});
              var web3Window = new Web3(window.ethereum);
              //setChainID(chainIDBuffer);
              if(addressArray.length > 0){
                setAdress(addressArray[0]);
                  setNetName("");    
                  web3Window.eth.getBalance(addressArray[0], (err, balanceOf) => {
                    let balETH = ethers.utils.formatUnits(balanceOf, 'ether');        
                    setBalance(String(balETH).substring(0, 6) + " MATIC");
                  }); 
              }        
            } catch (err) {
              return {
                address: ""        
              };
            }
          }
          else{
            setAdress("");
            setNetName(""); 
          }   
        }     
        
      }  
    }
    catch{
      return;
    }      
    
  };

  return (
    <>
      <div className={classes.header}>
        <div style={{marginLeft:"20px",display:"flex",flexDirection:"row"}}>          
          <Button className={`${classes.btn} ${equipType === 0 ? classes.selected_btn : ''} rect-btn`} onClick={() => {setEquipType(0);}}>              
            {"CUE"}
          </Button>
          <div className="seperator" style={{width:"32px",flexShrink:"0%"}}></div>
          <Button className={`${classes.btn} ${equipType === 1 ? classes.selected_btn : ''} rect-btn`} onClick={() => {setEquipType(1);}}>              
            {"CARD"}
          </Button>
        </div>
        
        <div className="seperator" style={{flex:"1 0 0%"}}></div>
        <div className="last-row" style={{marginLeft:"20px",display:"flex",flexDirection:"row"}}>
          <div style = {{flexDirection : 'column', display : 'flex'}}>
              <span style={{color : 'red'}}>
                ADDRESS:&nbsp;
              {address.length> 0 ? (String(address).substring(0, 8) + "..." + String(address).substring(36)) : ("")}
              </span>
              <span style={{color : 'blue'}}>
                MATIC BALANCE:&nbsp;
                {address.length> 0 ? balance : ""}            
              </span>            
          </div>
          <Button style={styles.presale_btn} variant="contained" onClick = {() =>{connect_Wallet();}}>
            {netName == "" ? (address.length == 0 ? "ConnectWallet" : "DisConnect") : netName}
          </Button>
        </div>
      </div>
      
      <div className={classes.hero} style = {{marginTop:"-20px"}}>   
        {/* <img src="/images/mint_logo.png" alt=""/> */}
        <div className={classes.infos}>
          <span style={{color : 'blue'}}>Title</span>
          <TextField
            placeholder="name of NFT"
            variant="filled"  
            value = {imgName}      
            onChange={(event) => {setImageName(event.target.value.substring(0,30)); setMetaDatachanged(0);}}
          />
          <span style={{color : 'blue'}}>Description</span>
          <TextField
            placeholder="A description about your NFT"
            variant="filled"
            multiline
            rows={4}   
            value = {imgDescription}         
            onChange={(event) => {setImageDescription(event.target.value.substring(0,256));setMetaDatachanged(0);}}
          />
          
          <div className="titles"> 
            <div>
              <span style={{color : 'blue'}}>{equipType ==0 ? 'Level' : 'Yield Bonus'}</span>
              <TextField
                placeholder="0"
                variant="filled"      
                value = {imgLevel}  
                onChange={(event) => {setImageLevel(Number(event.target.value) > -1 && Number(event.target.value) < 101 ? Number(event.target.value) : 0); setMetaDatachanged(0);}}    
              />
            </div>
            <div>
              <span style={{color : 'blue'}}>Strength</span>
              <TextField
                placeholder="0"
                variant="filled"      
                value = {imgStrength}
                onChange={(event) => {setImageStrength(Number(event.target.value) > -1 && Number(event.target.value) < 101 ? Number(event.target.value) : 0); setMetaDatachanged(0);}}      
              />   
            </div>            
          </div>

          <div className="titles"> 
            <div>
              <span style={{color : 'blue'}}>Accuracy</span>
              <TextField
                placeholder="0"
                variant="filled"      
                value = {imgAccuracy}  
                onChange={(event) => {setImageAccuracy(Number(event.target.value) > -1 && Number(event.target.value) < 101 ? Number(event.target.value) : 0); setMetaDatachanged(0);}}      
              />
            </div>
            <div>
              <span style={{color : 'blue'}}>Control</span>
              <TextField
                placeholder="0"
                variant="filled"      
                value = {imgControl}  
                onChange={(event) => {setImageControl(Number(event.target.value) > -1 && Number(event.target.value) < 101 ? Number(event.target.value) : 0); setMetaDatachanged(0);}}       
              />
            </div>
            <div>
              <span style={{marginLeft: "10px", color : 'blue'}}>Free Item Drop Chance</span>
              <TextField
                placeholder="0"
                variant="filled"      
                value = {imgFreeItemDropChance}  
                onChange={(event) => {setImageFreeItemDropChance(Number(event.target.value) > -1 && Number(event.target.value) < 101 ? Number(event.target.value) : 0); setMetaDatachanged(0);}}     
              />
            </div>            
          </div>
          
          <div id="toggles">
            <div>
              <span style={{color : 'blue'}}>NFT Type</span>
              <ToggleButtonGroup
                size="small"
                exclusive
                value={nftType}
                onChange={(e, v) => v !== null ? setNftType(v) : ''}
              >
                <ToggleButton value={0}>ERC721</ToggleButton>
                <ToggleButton value={1}>ERC1155</ToggleButton>
              </ToggleButtonGroup>
            </div>
            <div style={{flex:"1 0 0%"}}></div>
            <div>
              <span style={{color : 'blue'}}>Quantity</span>
              <Quantity quantity={quantity} setQuantity={setQuantity} />
            </div>
          </div>
          <span style={{color : 'blue'}}>Support Wallet Address</span>
          <TextField
            placeholder="0x12345..."
            variant="filled"
            value = {supportAddress}  
            onChange={(event) => {setSupportAddress(event.target.value); setMetaDatachanged(0);}}    
              
          />
          <div style={{alignSelf:"center"}}>
            <Button id="submit" variant="contained" onClick = {() =>{uploadMetaData();}}>
              Submit
            </Button>
          </div>
          
          <span style={{margin : "20px 0px 0px 0px", color : 'blue'}}>
            {metadaState}
          </span>
        </div>
        <div className={classes.vertical_line} />       
        <div className={classes.file_upload}>
          <div>
          <svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="CloudUploadIcon"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"></path></svg>
          <span style={{paddingBottom:"4px",color:"white",textTransform: "uppercase",}}>Upload your file here</span>
          <span>JPG, PNG or MP4 videos accepted. 1024x1024 limit.</span>
          <input
            type="file"
            accept={['image/jpeg', 'image/png', 'video/mp4']}
            maxSize={1024*1024*10}
            style={{ display: 'none' }}
            id="contained-button-file"
            onChange={(e) => { upload(e);}}
          />
          <label htmlFor="contained-button-file">
            <Button variant="contained" component="span">
              Click to Upload
            </Button>
          </label>   
          <span style={{margin : "20px 0px 0px 0px"}}>
            {imgNameUpload}
          </span>
          <img id="output" width="300" />
          </div>
          <ul></ul>
        </div>             
      </div>     
    </>    
  );
}

export default MintPage;