import * as React from "react";
import { useState, useEffect } from "react";
import { Box, Typography, Grid, Divider } from "@mui/material";
import Modal from '@mui/material/Modal';
import { useDispatch} from "react-redux";
import { fuseActions } from "./../../store/actions";
import { useWeb3React } from '@web3-react/core'

import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { InjectedConnector } from "@web3-react/injected-connector";

const Web3 = require("web3");

const WalletConnect = new WalletConnectConnector({
  rpcUrl: `https://mainnet.infura.io/v3/${process.env.REACT_APP_INFURAID}`,
  bridge: "https://bridge.walletconnect.org",
  qrcode: true,
});

const Injected = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 10, 25, 42, 56, 137, 250, 2222, 8217, 42161, 43114, 80001]
});

const VersusWalletOption = (props) => {
  const dispatch = useDispatch();
  const {open, handleClose, startLoading, endLoading} = props;
  const [size, setSize] = useState([0, 0]);

  const { activate, deactivate, active, chainId, account, library } = useWeb3React();

  const switchNetwork = async () => {
    try {
      await library.provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x13881" }],
      });
    } catch (switchError) {
      // 4902 error code indicates the chain is missing on the wallet
      if (switchError.code === 4902) {
        try {
          await library.provider.request({
            method: "wallet_addEthereumChain",
            params: [{
              chainId: '0x13881',
              chainName: 'Polygon Mumbai',
              nativeCurrency: {
                name: 'MATIC',
                symbol: 'MATIC',
                decimals: 18
              },
              rpcUrls: ['https://rpc-mumbai.maticvigil.com'],
            }],
          });
        } catch (error) {
           console.error(error)
        }
      }
    }
  };
  
  useEffect(() => {
    console.log("active state changed", active)
    if(active && account != "") {
      if(chainId != 80001) {
        console.log("switch network triggered")
        switchNetwork();
      }
    } else {
      dispatch(fuseActions.showWalletAddress({
        address: ""
      }));
    }
  }, [active]);
  
  useEffect(() => {
    console.log("testing chainId", chainId)
    if(chainId == 80001) {
      dispatch(fuseActions.showWalletAddress({
        address: account
      }));
      handleClose();
    }
  }, [chainId]);

  useEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  },[]);

  const onMetamaskConnectButtonClick = async () => {
    activate(Injected);
  }

  return (
    <>
      <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          style={{backgroundColor: "rgba(0, 0, 0, 0.7)"}}
        >
         <Box style={{padding:"2rem 4rem", background:"#fff", borderRadius:"1rem",position:"absolute", 
          left:"50%", top:"50%", width:size[0] > 576 ? "auto": "90%", opacity:"1", transform: "translate(-50%, -50%)", outline: "none"}}>
              <Box display="flex" alignItems={"center"} justifyContent={"center"}>
                  <Typography variant='h6' fontWeight={"bold"} color="black" padding="1rem" sx={{textWrap: "nowrap"}}>Select a wallet provider</Typography>
              </Box>
              <Box display="flex" alignItems={"center"} justifyContent={"space-between"}>
                  <Box
                    display="flex"
                    flexDirection={"column"}
                    alignItems={"center"}
                    justifyContent={"center"}
                    margin={"0 1rem"}
                    sx={{cursor: "pointer", width: "50%"}}
                    onClick={() => { onMetamaskConnectButtonClick() }}
                  >   
                      <img src={"/imgs/metamask.svg"} style={{width:"3rem", height:"3rem", marginBottom:"0.5rem"}}/>
                      <Typography variant="subtitle2" color="black">
                        Metamask
                      </Typography>
                      <p style={{fontSize: "11px", margin: 0, color: "#3389fb", visibility: (library && active && "metamask" == library.connection.url) ? "visible" : "hidden"}}>(Connected)</p>
                  </Box>
                  <Box
                    display="flex"
                    flexDirection={"column"}
                    alignItems={"center"}
                    justifyContent={"center"}
                    margin={"0 1rem"}
                    sx={{cursor: "pointer", width: "50%"}}
                    onClick={() => {activate(WalletConnect);}}
                  >   
                      <img src={"/imgs/walletconnector.svg"} style={{width:"3rem", height:"3rem", marginBottom:"0.5rem"}}/>
                      <Typography variant="subtitle2" color="black" sx={{textWrap: "nowrap"}}>
                        Wallet Connector
                      </Typography>
                      <p style={{fontSize: "11px", fontSize: "10px", margin: 0, color: "#3389fb", visibility: (library && active && "metamask" != library.connection.url) ? "visible" : "hidden"}}>(Connected)</p>
                  </Box>
                  {/* {error && <div>{error.message}</div>} */}
              </Box>
          </Box> 
      </Modal>
    </>
  )
}

export default VersusWalletOption