import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import { useNavigate, useLocation  } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, Button, Dialog, Grid } from "@mui/material";
import * as loginActions from "../pages/register/store/actions";
import * as layoutActions from "./store/actions";
import WalletModal from "../Modal/WalletModal";
import { auth, db, firebase ,storage, storageRef} from "../utils/firebase";
import { useEffect } from "react";
import d_avatar from "../assets/image/davatar.png"
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { ethers, providers } from "ethers";
const Web3 = require("web3");

export default function Layout({ children }) {
  const navigate = useNavigate();
  const [auth, setAuth] = React.useState(true);
  const [walletModalShow, setWalletModalShow] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
 // const [avatar, setAvatar] = React.useState("");
  const { uid, address } = useSelector(({ authReducer }) => authReducer.auth);
  const { avatar } = useSelector(({ layoutReducer }) => layoutReducer.layout);
  const [metaMaskAddress, setMetaMaskAddress] = React.useState("");
  const [provider, setProvider] = React.useState(null);
  
  const location = useLocation();

  const dispatch = useDispatch();
  useEffect(() => {
      storageRef.child(`users/${uid}.jpeg`).getDownloadURL()
      .then((url) => {
        
        var xhr = new XMLHttpRequest();
        xhr.responseType = 'blob';
        xhr.onload = (event) => {
          var blob = xhr.response;
        };
        xhr.open('GET', url);
        xhr.send();

        // Or inserted into an <img> element
        //setAvatar(url);
        dispatch(layoutActions.setAvatar(url));
      })
      .catch((error) => {
        dispatch(layoutActions.setAvatar(""));
        //setAvatar("");
      });
    
  }, [uid]);
  const handleChange = (event) => {
    setAuth(event.target.checked);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  async function connectMetaMask() {
      var chainId = 80001;
      if (window.ethereum) {
        const addressArrayBuf = await window.ethereum.request({
          method: "eth_accounts",
        });
        if(addressArrayBuf.length ){
          setMetaMaskAddress(addressArrayBuf[0]);   
        }
        else{

          await window.ethereum.request({
            method: "wallet_requestPermissions",
            params: [{
                eth_accounts: {}
            }]
          });
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: "0x"+chainId.toString(16) }],
          }); 
          const addressArray = await window.ethereum.request({
            method: "eth_accounts",
          });
          setMetaMaskAddress(addressArray[0]);    
            
        }
         
      } else {
            //   const providerOptions = {
            //     walletconnect: {
            //         package: WalletConnectProvider,
            //         options: {
            //             infuraId: process.env.REACT_APP_INFURAID,
            //             rpc: {                            
            //                 //137: "https://polygon-mainnet.infura.io/v3/"+process.env.REACT_APP_INFURAID,
            //                 //80001: "https://matic-mumbai.chainstacklabs.com",
            //                 80001: "https://rpc-mumbai.maticvigil.com",
            //             },
            //             chainId: 80001,
            //         },
            //         display: {
            //             description: "Scan with a wallet to connect",
            //         },
            //     },
            // };
            
            // const web3Modal = new Web3Modal({
            //   cacheProvider: true, // very important
            //   providerOptions,
            // });
            // let providerBuf = await web3Modal.connect();    
            // const ethersProvider = new providers.Web3Provider(providerBuf);
            // providerBuf.updateRpcUrl(80001); 
            // const userAddress = await ethersProvider.getSigner().getAddress();    
            // setMetaMaskAddress(userAddress); 
            // const network = await ethersProvider.getNetwork();
            // const chainIdBuf = network.chainId;
            // if (!(Number(chainIdBuf) === Number(chainId))) {
            //   await ethersProvider.provider.request({
            //     method: "wallet_switchEthereumChain",
            //     params: [{ chainId: "0x"+chainId.toString(16) }],
            //   });            
            // }
            // setProvider(providerBuf);  
            
            const providerBuf = new WalletConnectProvider({
              infuraId: process.env.REACT_APP_INFURAID,
              rpc: {   
                1: "https://mainnet.infura.io/v3/" + process.env.REACT_APP_INFURAID,
                137: "https://polygon-mainnet.infura.io/v3/" + process.env.REACT_APP_INFURAID,
                80001: "https://matic-mumbai.chainstacklabs.com",  
                // 137: 'https://polygon-rpc.com',                       
                // //137: "https://polygon-mainnet.infura.io/v3/"+process.env.REACT_APP_INFURAID,
                // 80001: "https://matic-mumbai.chainstacklabs.com",
                // // 80001: "https://rpc-mumbai.maticvigil.com",
              },
              chainId: 80001,
            });            
          providerBuf.updateRpcUrl(80001);
          await providerBuf.enable();    
          providerBuf.updateRpcUrl(80001); 
          const ethersProvider = new providers.Web3Provider(providerBuf);
          const userAddress = await ethersProvider.getSigner().getAddress();    
          setMetaMaskAddress(userAddress); 
          const network = await ethersProvider.getNetwork();
          const chainIdBuf = network.chainId;
          if (!(Number(chainIdBuf) === Number(chainId))) {
            await ethersProvider.provider.request({
              method: "wallet_switchEthereumChain",
              params: [{ chainId: "0x"+chainId.toString(16) }],
            });            
          }
          setProvider(providerBuf);  
      }
  };

  const handleProfile = () => {
    handleClose();
    navigate("/profile");
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* <FormGroup>
        <FormControlLabel
          control={
            <Switch
              checked={auth}
              onChange={handleChange}
              aria-label="login switch"
            />
          }
          label={auth ? "Logout" : "Login"}
        />
      </FormGroup> */}
      <AppBar position="static">
        <Toolbar>
          {/* <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton> */}
          <Box
            component="img"
            sx={{
              height: "50px"
            }}
            alt="ESKILLZ"
            src="/images/logo-new.png"
          />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Eskillz
            
            <Button
              style={{
                marginLeft: "48px",
                textTransform: "capitalize"
              }}
              variant={location.pathname.indexOf("home") != -1 ? "outlined" : "text"}
              color="warning"
              onClick={() => {
                navigate("/home");
              }}
            >
              Home
            </Button>
            <Button
            style={{
              marginLeft: "12px",
              textTransform: "capitalize"
            }}
            variant={location.pathname.indexOf("leaderboard") != -1 ? "outlined" : "text"}
              color="warning"
              onClick={() => {
                navigate("/leaderboard");
              }}
            >
              Leader Boards
            </Button>
          </Typography>
          <div>
          </div>
          {uid && (
            <div>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => {
                  connectMetaMask();
                  setWalletModalShow(true);
                }}
              >
                {address.substr(0, 5)}...{address.substr(address.length - 6, 6)}
              </Button>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
               <Avatar sx={{width:"30px",height:'30px'}} src = {avatar?avatar:d_avatar}/>
                
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleProfile}>Profile</MenuItem>
                <MenuItem onClick={() => dispatch(loginActions.logout())}>
                  logout
                </MenuItem>
                {/* <MenuItem onClick={handleClose}>My account</MenuItem> */}
              </Menu>
            </div>
          )}
          {/* <Wallet
            show={walletModalShow}
            onHide={() => setWalletModalShow(false)}
          /> */}
          <Dialog
            maxWidth="sm"
            fullWidth
            open={walletModalShow}
            onClose={() => setWalletModalShow(false)}
          >
            <WalletModal metaMaskAddress = {metaMaskAddress} provider = {provider}/>
          </Dialog>
        </Toolbar>
      </AppBar>
      {children}
    </Box>
  );
}
