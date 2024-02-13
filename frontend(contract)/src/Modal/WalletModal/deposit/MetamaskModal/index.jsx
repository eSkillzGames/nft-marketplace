import {
  Button,
  FormGroup,
  Grid,
  InputBase,
  styled,
  Typography,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import React, { useEffect, useState } from "react";
import metamask from "../../../../assets/image/metamask.webp";
import { ethers, providers } from "ethers";
import { useDispatch, useSelector } from "react-redux";
import {homeActions} from "../../../../store/actions";
import sportABI from '../../../../Sport.json';
import esgABI from '../../../../Esg.json';
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
const sportTokenAddress = "0x2caFAb766a586a09659a09E92e9f4005DF827512";
const esgTokenAddress = "0x6637926e5c038c7ae3d3fd2c2d77c44e8be1ed28";
const StyledInput = styled(InputBase)(({ theme }) => ({
  backgroundColor: grey[900],
  width: "300px",
  padding: 6,
  color: "white",
  borderRadius: 12,
}));

const MetamaskModal = (props) => {
  const { showModal, selected, ...other } = props;
  const { address } = useSelector(({ authReducer }) => authReducer.auth);
  const [ethAmount, setEthAmount] = React.useState(null);
  const dispatch = useDispatch();
  const [providerMobile, setProvider] = React.useState(null);
  const [web3Modal, setWeb3Modal] = React.useState(null);
  useEffect(() => {
    try {
             
        const providerOptions = {
          walletconnect: {
            package: WalletConnectProvider,
            options: {
              rpc: {                
                80001: "https://matic-mumbai.chainstacklabs.com",
            },
            },
          },
        };

        const newWeb3Modal = new Web3Modal({
          cacheProvider: true, // very important
          providerOptions,
        });

        setWeb3Modal(newWeb3Modal);

               
     
    } catch {
      return;
    }
  }, []);
  async function deposit_Coin() {
    try {
      var chainID = 80001;
      if(selected == 0){
        if(window.ethereum){
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: "0x"+chainID.toString(16) }],
          }); 
          const provider = new ethers.providers.Web3Provider(window.ethereum)
  
          await provider.send("eth_requestAccounts", []);
  
          const signer = provider.getSigner()
  
          showModal(false);
          const tx = await signer.sendTransaction({
              to: address,
              value: ethers.utils.parseEther(ethAmount)
          });
          await tx.wait();
          dispatch(homeActions.setBalance(address)); 
        }
        else{
          let providerM;
          if(providerMobile == null){
            providerM = await web3Modal.connect();    
            setProvider(providerM);
          }
          else{
            providerM = providerMobile;
          }
          const ethersProvider = new providers.Web3Provider(providerM);
          const signer = await ethersProvider.getSigner();
          await ethersProvider.send("eth_requestAccounts", []);  
 
          showModal(false);
          const tx = await signer.sendTransaction({
              to: address,
              value: ethers.utils.parseEther(ethAmount)
          });
          await tx.wait();
          dispatch(homeActions.setBalance(address)); 
        }
      }
      else if (selected == 1){
        if(window.ethereum){
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: "0x"+chainID.toString(16) }],
          });
          const addressArray = await window.ethereum.request({
            method: "eth_accounts",
          });
          if(addressArray.length == 0){
            await window.ethereum.request({
              method: "wallet_requestPermissions",
              params: [
                {
                  eth_accounts: {},
                },
              ],
            });
          }
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          var sportContract = new ethers.Contract(sportTokenAddress, sportABI, signer);
          showModal(false);
          let nftTxn = await sportContract.transfer(address,ethAmount * 10**9); 
          await nftTxn.wait();
          dispatch(homeActions.setBalance(address)); 
        }
        else{
          let providerM;
          if(providerMobile == null){
            providerM = await web3Modal.connect();    
            setProvider(providerM);
          }
          else{
            providerM = providerMobile;
          }
          const ethersProvider = new providers.Web3Provider(providerM);
          const signer = await ethersProvider.getSigner();
          var sportContract = new ethers.Contract(sportTokenAddress, sportABI, signer);
          showModal(false);
          let nftTxn = await sportContract.transfer(address,ethAmount * 10**9); 
          await nftTxn.wait();
          dispatch(homeActions.setBalance(address)); 
        }
      }
      else{
        if(window.ethereum){
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: "0x"+chainID.toString(16) }],
          }); 
          const addressArray = await window.ethereum.request({
            method: "eth_accounts",
          });
          if(addressArray.length == 0){
            await window.ethereum.request({
              method: "wallet_requestPermissions",
              params: [
                {
                  eth_accounts: {},
                },
              ],
            });
          }
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          var esgContract = new ethers.Contract(esgTokenAddress, esgABI, signer);
          showModal(false);
          let nftTxn = await esgContract.transfer(address,ethAmount * 10**9); 
          await nftTxn.wait();
          dispatch(homeActions.setBalance(address)); 
        }
        else{
          let providerM;
          if(providerMobile == null){
            providerM = await web3Modal.connect();    
            setProvider(providerM);
          }
          else{
            providerM = providerMobile;
          }
          const ethersProvider = new providers.Web3Provider(providerM);
          const signer = await ethersProvider.getSigner();
          var esgContract = new ethers.Contract(esgTokenAddress, esgABI, signer);
          showModal(false);
          let nftTxn = await esgContract.transfer(address,ethAmount * 10**9); 
          await nftTxn.wait();
          dispatch(homeActions.setBalance(address)); 
        }
      }
      } catch (err) {
        
      }
    }
  return (
    <div>
      <Grid container alignItems="center" spacing={1}>
        <Grid item>
          <img src={metamask} alt="metamask" width="40px" />
        </Grid>
        <Grid item>
          <Typography variant="caption">Deposit with </Typography>
          <Typography variant="h6">Metamask </Typography>
        </Grid>
      </Grid>
      <Grid container flexDirection="column">
        <Typography variant="caption" sx={{ mt: 4 }}>
          Deposit Amount
        </Typography>
        <StyledInput 
          placeholder="0"
          variant="filled"
          value={ethAmount}
          onChange={(event) => {
            event.preventDefault();
            setEthAmount(
              Number(event.target.value) >= 0 
                ? event.target.value.toString().length == 2 &&
                  event.target.value.toString()[0] == "0" &&
                  Number(event.target.value.toString()[1]) >= 0
                  ? event.target.value.toString()[1]
                  : Number(event.target.value) >= 0
                  ? event.target.value
                  : ""
                : 0
            );
          }}
        />
      </Grid>

      {/* <FormGroup> */}
      {/* </FormGroup> */}

      <Button fullWidth variant="contained" sx={{ borderRadius: 10, mt: 4, textTransform: "capitalize"}} 
        onClick={() => deposit_Coin()}
      >
        Deposit
      </Button>
    </div>
  );
};

export default MetamaskModal;
