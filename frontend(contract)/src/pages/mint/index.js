
import React from 'react';
import { Button, makeStyles, TextField} from '@material-ui/core';
import FileUpload from 'react-material-file-upload';
import styles from './style';
import { ToggleButton, ToggleButtonGroup} from '@mui/material';
import { ethers } from 'ethers';
import Modal from "react-modal";
import { style } from '@mui/system';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from "react";

const axios = require('axios');
const IpfsHttpClient = require("ipfs-http-client");
const ipfsC = IpfsHttpClient.create({
  host: "ipfs.infura.io",
  port: "5001",
  protocol: "https",
});

const NFTcontractABI = require('../../NFT.json');
const NFTcontractAddress = "0xF1f88246D1809D520b89E5470F07beD7Ae9451e9";
const Web3 = require("web3");

let web3 = new Web3(
    new Web3.providers.WebsocketProvider("wss://ropsten.infura.io/ws/v3/acc8266b5baf41c5ad44a05fe4a49925")
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
  const [imgFIDC, setImageFIDC] = React.useState("");
  const [imgDescription, setImageDescription] = React.useState("");
  const [metadaState, setMetadaState] = React.useState("");
  const [beforeTokenURI, setBeforeTokenURI] = React.useState("");
  const [metaDatachanged, setMetaDatachanged] = React.useState(0);
  const [address, setAdress] = React.useState("");
  const [netName, setNetName] = React.useState("");
  const [balance, setBalance] = useState("");

  const router = useRouter();
  Modal.setAppElement("#__next");
  const upload = async (e) => {    
    
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
              setImgNameUpload("Image size is big than 1024 X 1024");
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
    // if(e.target.files[0].type == "image/png" || e.target.files[0].type == "image/jpeg"){
    //   if ((file = e.target.files[0])) {
    //     img = new Image();
    //     var objectUrl = _URL.createObjectURL(file);
    //     img.onload = async function () {  
    //       var image = document.getElementById('output');        
    //       if(this.width<=1024 && this.height<=1024){            
    //         image.src = objectUrl;
    //         _URL.revokeObjectURL(objectUrl);
    //         setMetaDatachanged(0);
    //         if(imgHash !="Pending"){
    //           if(e.target.files.length>0){
    //             setImgHash("Pending");
    //             setImgNameUpload("Pending");
    //             const addedToIPFS = await ipfsC.add(e.target.files[0]);
    //             setImgHash(addedToIPFS.path);
    //             setImgNameUpload(e.target.files[0].name);  
    //           }
    //           else{
    //             setImgHash("");
    //             setImgNameUpload("");
    //           }
    //         } 
    //       } 
    //       else{
    //         image.src = "";
    //         setImgNameUpload("Image size is big than 1024 X 1024");
    //       }              
    //     };          
    //     img.src = objectUrl;             
    //   }  
    // }
    // else{
    //   setMetaDatachanged(0);
    //   if(imgHash !="Pending"){
    //     if(e.target.files.length>0){
    //       setImgHash("Pending");
    //       setImgNameUpload("Pending");
    //       const addedToIPFS = await ipfsC.add(e.target.files[0]);
    //       setImgHash(addedToIPFS.path);
    //       setImgNameUpload(e.target.files[0].name);  
    //     }
    //     else{
    //       setImgHash("");
    //       setImgNameUpload("");
    //     }
    //   } 
    // }
       
   };

   const uploadMetaData = async () => {
    if (imgName.toString().trim() == "" || imgDescription.toString().trim() == "" || imgHash.toString().trim() == "" || imgHash.toString().trim() == "Pending" ||imgLevel.toString().trim() == "" ||imgStrength.toString().trim() == "" ||imgAccuracy.toString().trim() == "" ||imgControl.toString().trim() == "" ||imgFIDC.toString().trim() == "" ) { 
        setMetadaState("❗Please make sure all fields are completed before minting.");      
    }
    else{
      if(parseInt(imgLevel) > 0 && parseInt(imgStrength) > 0 && parseInt(imgAccuracy) > 0 && parseInt(imgControl) > 0 && parseInt(imgFIDC) > 0 ){
        
        if(address!=""){
          // make metaData
          const metadata = new Object();
          metadata.name = imgName;
          metadata.image_url = "https://gateway.pinata.cloud/ipfs/" + imgHash;
          metadata.description = imgDescription;   
          metadata.level = imgLevel;
          metadata.strength = imgStrength;
          metadata.accuracy = imgAccuracy;
          metadata.control = imgControl;
          metadata.FIDC = imgFIDC;
          if(metaDatachanged > 0) {
            mintNft(beforeTokenURI, metadata);
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
    
    const { ethereum } = window;
    if (ethereum) {
      const chainIDBuffer = await ethereum.networkVersion;
      if(chainIDBuffer == 3){
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contractNFT = new ethers.Contract(NFTcontractAddress, NFTcontractABI, signer);
        try {
          let nftTxn = await contractNFT.createTokens(_tokenUri, quantity);
          await nftTxn.wait(); 
          setImageName("");
          setImageDescription("");
          setImgNameUpload("");
          setImageLevel("");
          setImageStrength("");
          setImageAccuracy("");
          setImageControl("");
          setImageFIDC("");
          setImgHash("");
          var image = document.getElementById('output');
          image.src = "";
          if(quantity ==1){
            window.alert("1 NFT minted successfully");   
          }
          else{
            window.alert(quantity + " NFTs minted successfully");
          }             
        } catch (err) {          
          window.alert("Minting of the NFT failed");
        }            
      }   
    }
  }

  useEffect(() => {
    if(window.ethereum) {
      window.ethereum.on('chainChanged', () => {
        //router.reload();
        router.push('/mint');
      })
      window.ethereum.on('accountsChanged', () => {
        //router.reload();
        router.push('/mint');
      })
    }
    getCurrentWalletConnected(); 
    
  }, [])

  async function getCurrentWalletConnected() {
    if (window.ethereum) {
      try {
        const addressArray = await window.ethereum.request({
          method: "eth_accounts",
        });
        var web3Window = new Web3(window.ethereum);
        const chainIDBuffer = await web3Window.eth.net.getId();
        if(addressArray.length > 0){
          setAdress(addressArray[0]);
          if(chainIDBuffer == 3){
            setNetName("");  
            web3Window.eth.getBalance(addressArray[0], (err, balanceOf) => {
              let balETH = ethers.utils.formatUnits(balanceOf, 'ether');        
              setBalance(String(balETH).substring(0, 6) + " ETH");
            });           
          }
          else{  
            setNetName("Wrong NET(DisConnect)");  
          }
        }         
      } catch (err) {
        return {
          address: ""        
        };
      }
    } 
  };

  async function connect_Wallet() {
    
    if (window.ethereum) {
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
          const chainIDBuffer = await web3Window.eth.net.getId();        
          //setChainID(chainIDBuffer);
          if(addressArray.length > 0){
            setAdress(addressArray[0]);
            if(chainIDBuffer == 3){
              setNetName("");    
              web3Window.eth.getBalance(addressArray[0], (err, balanceOf) => {
                let balETH = ethers.utils.formatUnits(balanceOf, 'ether');        
                setBalance(String(balETH).substring(0, 6) + " ETH");
              });          
            }
            else{  
              setNetName("Wrong NET(DisConnect)");  
            }
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
  };

  return (
    <>      
      <div style={{flex:"row",display:"flex"}}>
        <div>
          <Button className={classes.circle_btn} onClick={() => router.push('/')}>
            {'<'}
          </Button>
        </div>
        
        <div style={{flex:"1 0 0%"}}></div>
        <div style={{marginLeft:"20px",display:"flex",flexDirection:"row"}}>
          <div style = {{flexDirection : 'column', display : 'flex',marginTop:"24px"}}>
              <span style={{color : 'white'}}>
                &nbsp;
                &nbsp;
                ADDRESS :
                &nbsp;
              {address.length> 0 ? (String(address).substring(0, 8) + "..." + String(address).substring(36)) : ("")}
              </span>
              <span style={{color : '#06f506'}}>
                &nbsp;
                &nbsp;
                ETHER BALANCE :
                &nbsp;
                {address.length> 0 ? balance : ""}            
              </span>            
          </div>
          <Button style={styles.presale_btn} variant="contained" onClick = {() =>{connect_Wallet();}}>
            {netName == "" ? (address.length == 0 ? "ConnectWallet" : "DisConnect") : netName}
          </Button>
        </div>
      </div>
      
      <div className={classes.hero}>   
        <img src="/images/mint_logo.png" alt=""/>
        <div className={classes.infos}>
          <span>Title</span>
          <TextField
            placeholder="Hall of fame"
            variant="filled"  
            value = {imgName}      
            onChange={(event) => {setImageName(event.target.value.substring(0,30)); setMetaDatachanged(0);}}
          />
          <span>Description</span>
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
              <span>Level</span>
              <TextField
                placeholder="0"
                variant="filled"      
                value = {imgLevel}  
                onChange={(event) => {setImageLevel(Number(event.target.value) > -1 && Number(event.target.value) < 101 ? Number(event.target.value) : 0); setMetaDatachanged(0);}}    
              />
            </div>
            <div>
              <span>Strength</span>
              <TextField
                placeholder="0"
                variant="filled"      
                value = {imgStrength}
                onChange={(event) => {setImageStrength(Number(event.target.value) > -1 && Number(event.target.value) < 101 ? Number(event.target.value) : 0); setMetaDatachanged(0);}}      
              />   
            </div>
            {/* <div>
              <span>CurrentPower</span>
              <TextField
                placeholder="0"
                variant="filled"      
                value = {imgCurrentPower}  
                onChange={(event) => {setImageCurrentPower(Number(event.target.value) > -1 && Number(event.target.value) < 101 ? Number(event.target.value) : 0); setMetaDatachanged(0);}}      
              />
            </div>
            <div>
              <span>TotalPower</span>
              <TextField
                placeholder="0"
                variant="filled"      
                value = {imgTotalPower}  
                onChange={(event) => {setImagePower(Number(event.target.value) > -1 && Number(event.target.value) < 101 ? Number(event.target.value) : 0); setMetaDatachanged(0);}}     
              />
            </div> */}
          </div>

          <div className="titles"> 
            <div>
              <span>Accuracy</span>
              <TextField
                placeholder="0"
                variant="filled"      
                value = {imgAccuracy}  
                onChange={(event) => {setImageAccuracy(Number(event.target.value) > -1 && Number(event.target.value) < 101 ? Number(event.target.value) : 0); setMetaDatachanged(0);}}      
              />
            </div>
            <div>
              <span>Control</span>
              <TextField
                placeholder="0"
                variant="filled"      
                value = {imgControl}  
                onChange={(event) => {setImageControl(Number(event.target.value) > -1 && Number(event.target.value) < 101 ? Number(event.target.value) : 0); setMetaDatachanged(0);}}       
              />
            </div>
            <div>
              <span>Free Item Drop Chance</span>
              <TextField
                placeholder="0"
                variant="filled"      
                value = {imgFIDC}  
                onChange={(event) => {setImageFIDC(Number(event.target.value) > -1 && Number(event.target.value) < 101 ? Number(event.target.value) : 0); setMetaDatachanged(0);}}     
              />
            </div>
            {/* <div>
              <span>Time</span>
              <TextField
                placeholder="0"
                variant="filled"      
                value = {imgTime}  
                onChange={(event) => {setImageTime(Number(event.target.value) > -1 && Number(event.target.value) < 11 ? Number(event.target.value) : 0); setMetaDatachanged(0);}}      
              />
            </div> */}
          </div>
          
          <div id="toggles">
            <div>
              <span>NFT Type</span>
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
              <span>Quantity</span>
              <Quantity quantity={quantity} setQuantity={setQuantity} />
            </div>
          </div>
          <span>Social Media URL (Optional)</span>
          <TextField
            placeholder="https://twitter.com/example"
            variant="filled"
          />
          <div style={{alignSelf:"center"}}>
            <Button id="submit" variant="contained" onClick = {() =>{uploadMetaData();}}>
              Submit
            </Button>
          </div>
          
          <span style={{margin : "20px 0px 0px 0px"}}>
            {metadaState}
          </span>
        </div>
        <div className={classes.vertical_line} />       
        <div className={classes.file_upload}>
          <div>
          <svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="CloudUploadIcon"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"></path></svg>
          <span style={{paddingBottom:"4px",color:"white",textTransform: "uppercase",}}>Upload your file here</span>
          <span>JPG, PNG or MP4 videos accepted. 10MB limit.</span>
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