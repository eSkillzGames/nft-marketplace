import {
  Button,
  ButtonBase,
  Dialog,
  Grid,
  IconButton,
  styled,
  Typography,
  InputBase,
  FormGroup,
  ButtonGroup,
  CircularProgress,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { grey } from "@mui/material/colors";
import { QRCodeSVG } from "qrcode.react";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import MetamaskModal from "./MetamaskModal";
import metamask from "../../../assets/image/metamask.webp";
import { ethers, providers } from "ethers";
import { useDispatch, useSelector } from "react-redux";
import { fuseActions, homeActions } from "../../../store/actions";
import sportABI from "../../../Sport.json";
import sportJson from "../../../Sport_m.json";
import esgABI from "../../../Esg.json";
// import Web3Modal from "web3modal";
// import WalletConnectProvider from "@walletconnect/web3-provider";
const { default: axios } = require("axios");
// const sportTokenAddress = "0x2caFAb766a586a09659a09E92e9f4005DF827512";
const sportTokenAddress = "0xec1E041B32898b8a33F5a7789226f9d64c7ed287";
const esgTokenAddress = "0x6637926e5c038c7ae3d3fd2c2d77c44e8be1ed28";
const QRDiv = styled("div")(({ theme }) => ({
  padding: 12,
  borderRadius: 12,
  backgroundColor: "white",
  display: "flex",
}));
const StyledInputRoot = styled("div")(({ theme }) => ({
  backgroundColor: grey[900],
  padding: "0px 6px",
  width: "100%",
  borderRadius: 12,
}));
const StyledInput = styled(InputBase)(({ theme }) => ({
  backgroundColor: grey[900],
  width: "100%",
  padding: 6,
  color: "white",
  borderRadius: 12,
}));

const Root = styled("div")(({ theme }) => ({
  borderRadius: 12,
  backgroundColor: theme.palette.grey[900],
  padding: 4,
}));

const Deposit = (props) => {
  const { selected, metaMaskAddress, provider, ...other } = props;
  const { address } = useSelector(({ authReducer }) => authReducer.auth);
  const [ethAmount, setEthAmount] = React.useState(0);
  const [metaMaskMatic, setMetaMaskMatic] = React.useState(0);
  const [metaMaskSport, setMetaMaskSport] = React.useState(0);
  const [maxBalance, setMaxBalance] = React.useState(0);
  // const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const [providerMobile, setProvider] = React.useState(null);
  const [web3Modal, setWeb3Modal] = React.useState(null);
  const { balance } = useSelector(({ homeReducer }) => homeReducer.home);
  const [isLoading, setLoading] = React.useState(false);

  useEffect(() => {
    if (balance.MaticBal != null) {
      btnChanged();
    }
  }, [selected]);

  useEffect(() => {
    if (balance.MaticBal != null) {
      getMetaMaskBalance();
      btnChanged();
    }
  }, [metaMaskAddress, balance]);

  async function btnChanged() {
    setEthAmount(0);

    if (selected == 0) {
      setMaxBalance(metaMaskMatic);
    } else if (selected == 1) {
      setMaxBalance(metaMaskSport);
    }
  }
  async function getMetaMaskBalance() {
    setLoading(true);
    if (metaMaskAddress == "" || metaMaskAddress == null) {
      return;
    }
    const response1 = await axios.post(
      process.env.REACT_APP_API_URL + "/api/v1/getMaticBalanceFromWallet",
      { address: metaMaskAddress }
    );

    setMetaMaskMatic(Number(response1.data));
    const response2 = await axios.post(
      process.env.REACT_APP_API_URL + "/api/v1/getSportBalanceFromWallet",
      { address: metaMaskAddress }
    );
    setMetaMaskSport(Number(response2.data));
    if (selected == 0) {
      setMaxBalance(Number(response1.data));
    } else if (selected == 1) {
      setMaxBalance(Number(response2.data));
    }
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }
  async function deposit_Coin() {
    try {
      if (Number(ethAmount) > 0) {
        let ethAmountBuf = parseInt(Number(ethAmount) * 10 ** 7) / 10 ** 7;
        setEthAmount(0);
        var chainID = 80001;
        if (selected == 0) {
          if (window.ethereum) {
            // const ethersProvider = new ethers.providers.Web3Provider(provider);
            // const signer = await ethersProvider.getSigner();
            // await ethersProvider.send("eth_requestAccounts", []);
            await window.ethereum.request({
              method: "wallet_switchEthereumChain",
              params: [{ chainId: "0x" + chainID.toString(16) }],
            });
            const providerBuf = new ethers.providers.Web3Provider(
              window.ethereum
            );

            await providerBuf.send("eth_requestAccounts", []);

            const signer = providerBuf.getSigner();

            const tx = await signer.sendTransaction({
              to: address,
              value: ethers.utils.parseEther(ethAmountBuf.toString()),
            });
            await tx.wait();
            dispatch(homeActions.setBalance(address));
            dispatch(
              fuseActions.showMessage({
                message: "Deposited " + ethAmountBuf + "Matic successfuly.",
                variant: "success",
                timer: 10000,
              })
            );
          } else {
            // let providerM;
            // if(providerMobile == null){
            //   providerM = await web3Modal.connect();
            //   setProvider(providerM);
            // }
            // else{
            //   providerM = providerMobile;
            // }
            // let providerM = await web3Modal.connect();
            provider.updateRpcUrl(80001);
            const ethersProvider = new ethers.providers.Web3Provider(provider);
            const network = await ethersProvider.getNetwork();
            const chainIdBuf = network.chainId;
            if (!(Number(chainIdBuf) === Number(chainID))) {
              await ethersProvider.provider.request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId: "0x" + chainID.toString(16) }],
              });
            }
            const signer = await ethersProvider.getSigner();
            await ethersProvider.send("eth_requestAccounts", []);

            const tx = await signer.sendTransaction({
              to: address,
              value: ethers.utils.parseUnits(ethAmountBuf.toString(), "ether")
                ._hex,
            });
            await tx.wait();
            dispatch(homeActions.setBalance(address));
            dispatch(
              fuseActions.showMessage({
                message: "Deposited " + ethAmountBuf + "Matic successfuly.",
                variant: "success",
                timer: 10000,
              })
            );
          }
        } else if (selected == 1) {
          if (window.ethereum) {
            await window.ethereum.request({
              method: "wallet_switchEthereumChain",
              params: [{ chainId: "0x" + chainID.toString(16) }],
            });
            const addressArray = await window.ethereum.request({
              method: "eth_accounts",
            });
            if (addressArray.length == 0) {
              await window.ethereum.request({
                method: "wallet_requestPermissions",
                params: [
                  {
                    eth_accounts: {},
                  },
                ],
              });
            }
            const providerBuf = new ethers.providers.Web3Provider(
              window.ethereum
            );
            const signer = providerBuf.getSigner();
            var sportContract = new ethers.Contract(
              sportTokenAddress,
              sportJson.abi,
              signer
            );
            let nftTxn = await sportContract.transfer(
              address,
              String(ethAmountBuf * 10 ** 9)
            );
            await nftTxn.wait();
            dispatch(homeActions.setBalance(address));
            dispatch(
              fuseActions.showMessage({
                message: "Deposited " + ethAmountBuf + "Skill successfuly.",
                variant: "success",
                timer: 10000,
              })
            );
          } else {
            // let providerM;
            // if(providerMobile == null){
            //   providerM = await web3Modal.connect();
            //   setProvider(providerM);
            // }
            // else{
            //   providerM = providerMobile;
            // }
            // providerM = await web3Modal.connect();
            // let providerM = await web3Modal.connect();
            provider.updateRpcUrl(80001);
            const ethersProvider = new ethers.providers.Web3Provider(provider);
            const network = await ethersProvider.getNetwork();
            const chainIdBuf = network.chainId;
            if (!(Number(chainIdBuf) === Number(chainID))) {
              await ethersProvider.provider.request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId: "0x" + chainID.toString(16) }],
              });
            }
            const signer = await ethersProvider.getSigner();
            var sportContract = new ethers.Contract(
              sportTokenAddress,
              sportJson.abi,
              signer
            );
            let nftTxn = await sportContract.transfer(
              address,
              String(ethAmountBuf * 10 ** 9)
            );
            await nftTxn.wait();
            dispatch(homeActions.setBalance(address));
            dispatch(
              fuseActions.showMessage({
                message: "Deposited " + ethAmountBuf + "Skill successfuly.",
                variant: "success",
                timer: 10000,
              })
            );
          }
        } else {
          if (window.ethereum) {
            await window.ethereum.request({
              method: "wallet_switchEthereumChain",
              params: [{ chainId: "0x" + chainID.toString(16) }],
            });
            const addressArray = await window.ethereum.request({
              method: "eth_accounts",
            });
            if (addressArray.length == 0) {
              await window.ethereum.request({
                method: "wallet_requestPermissions",
                params: [
                  {
                    eth_accounts: {},
                  },
                ],
              });
            }
            const providerBuf = new ethers.providers.Web3Provider(
              window.ethereum
            );
            const signer = providerBuf.getSigner();
            var esgContract = new ethers.Contract(
              esgTokenAddress,
              esgABI,
              signer
            );
            let nftTxn = await esgContract.transfer(
              address,
              ethAmountBuf * 10 ** 9
            );
            await nftTxn.wait();
            dispatch(homeActions.setBalance(address));
            dispatch(
              fuseActions.showMessage({
                message: "Deposited " + ethAmountBuf + "Esg successfuly.",
                variant: "success",
                timer: 10000,
              })
            );
          } else {
            // let providerM;
            // if(providerMobile == null){
            //   providerM = await web3Modal.connect();
            //   setProvider(providerM);
            // }
            // else{
            //   providerM = providerMobile;
            // }
            // let providerM = await web3Modal.connect();
            provider.updateRpcUrl(80001);
            const ethersProvider = new providers.Web3Provider(provider);
            const network = await ethersProvider.getNetwork();
            const chainIdBuf = network.chainId;
            if (!(Number(chainIdBuf) === Number(chainID))) {
              await ethersProvider.provider.request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId: "0x" + chainID.toString(16) }],
              });
            }
            const signer = await ethersProvider.getSigner();
            var esgContract = new ethers.Contract(
              esgTokenAddress,
              esgABI,
              signer
            );
            let nftTxn = await esgContract.transfer(
              address,
              ethAmountBuf * 10 ** 9
            );
            await nftTxn.wait();
            dispatch(homeActions.setBalance(address));
            dispatch(
              fuseActions.showMessage({
                message: "Deposited " + ethAmountBuf + "Esg successfuly.",
                variant: "success",
                timer: 10000,
              })
            );
          }
        }
      } else {
        dispatch(
          fuseActions.showMessage({
            message: "Top-up Amount must be bigger than zero.",
            variant: "error",
            timer: 3000,
          })
        );
      }
    } catch (err) {
      dispatch(
        fuseActions.showMessage({
          message: err,
          variant: "error",
          timer: 3000,
        })
      );
    }
  }
  const copy = async () => {
    dispatch(
      fuseActions.showMessage({
        message: "MetaMask Walllet Address Copied.",
        variant: "success",
        timer: 3000,
      })
    );
    await navigator.clipboard.writeText(metaMaskAddress);
  };

  // const showModal = (val) => {
  //   setOpen(val);
  // };
  return (
    <div>
      {/* <Typography variant="caption">Your Address</Typography>        
      <Root>
        <Grid container spacing={4} alignItems="center">          
          <Grid item>
            <Typography variant="body2" sx={{ wordBreak: "break-all" }}>
              <span style={{ color: "lightgreen" }}>
                {address.substr(0, 8)}
              </span>
              <span>{address.substr(8, address.length - 13)}</span>
              <span style={{ color: "lightgreen" }}>{address.substr(-5)}</span>
              <IconButton onClick={copy}>
                <ContentCopyIcon color="secondary" />
              </IconButton>
            </Typography>
          </Grid>
          {/* <Grid item md={4}>
            <QRDiv>
              <QRCodeSVG value={address} style={{ width: "100%" }} />
            </QRDiv>
          </Grid> 
        </Grid>
      </Root> */}
      {isLoading && (
        <div style={{ color: "white", textAlign: "center" }}>
          <CircularProgress
            color="inherit"
            style={{
              width: "30px",
              height: "30px",
            }}
          />
        </div>
      )}
      <FormGroup>
        <Typography variant="caption">MetaMask Address</Typography>
        <StyledInputRoot
          style={{
            display: "flex",
          }}
        >
          <StyledInput
            variant="filled"
            value={metaMaskAddress}
            readOnly={true}
          />
          <IconButton onClick={copy}>
            <ContentCopyIcon color="secondary" />
          </IconButton>
        </StyledInputRoot>
      </FormGroup>
      {/* <Grid container flexDirection="column">
        <Typography variant="caption" sx={{ mt: 4 }}>
          Top-up Amount
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
      </Grid> */}
      <FormGroup sx={{ my: 4 }}>
        <Typography variant="caption">Top-up Amount</Typography>
        <StyledInputRoot>
          <Grid container alignItems="center">
            <Grid item md>
              <StyledInput
                placeholder="0"
                variant="filled"
                value={ethAmount}
                onChange={(event) => {
                  event.preventDefault();
                  setEthAmount(
                    Number(event.target.value) >= 0 &&
                      Number(event.target.value) <= Number(maxBalance)
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
            <Grid item>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <ButtonGroup>
                    <Button
                      variant="outlined"
                      sx={{
                        borderRadius: "16px 1px 1px 16px",
                        textTransform: "capitalize",
                      }}
                      onClick={() => {
                        if (isLoading) {
                          return;
                        }
                        setEthAmount(maxBalance / 20);
                      }}
                    >
                      Min
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => {
                        if (isLoading) {
                          return;
                        }
                        setEthAmount(maxBalance / 4);
                      }}
                    >
                      25%
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => {
                        if (isLoading) {
                          return;
                        }
                        setEthAmount(maxBalance / 2);
                      }}
                    >
                      50%
                    </Button>
                    <Button
                      variant="outlined"
                      sx={{
                        borderRadius: "1px 16px 16px 1px",
                        textTransform: "capitalize",
                      }}
                      onClick={() => {
                        if (isLoading) {
                          return;
                        }
                        setEthAmount(maxBalance);
                      }}
                    >
                      Max
                    </Button>
                  </ButtonGroup>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </StyledInputRoot>
      </FormGroup>
      <Grid container justifyContent="center">
        <Grid item md={6}>
          <Button
            variant="contained"
            onClick={() => {
              if (isLoading) {
                return;
              }
              deposit_Coin();
            }}
            fullWidth
            sx={{ borderRadius: 8, mt: 4, textTransform: "none" }}
          >
            Top-up From MetaMask &nbsp;&nbsp;
            <Grid item>
              <img src={metamask} alt="metamask" width="25px" />
            </Grid>
          </Button>
        </Grid>
      </Grid>
      {/* <Dialog open={open} onClose={() => setOpen(false)}>
        <MetamaskModal selected = {selected} showModal = {showModal}/>
      </Dialog> */}
    </div>
  );
};

export default Deposit;
