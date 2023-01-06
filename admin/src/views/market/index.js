import React from "react";
import { Button, makeStyles } from "@material-ui/core";
import Cues from "./Cues";
import Cards from "./Card";
import styles from "./style";
import { useEffect, useState } from "react";
import { ethers, providers } from "ethers";
import { useNavigate } from "react-router-dom";
// import { SpaOutlined } from '@material-ui/icons';
// import Link from 'next/link';
// import { useRouter } from "next/router";
const NFTcontractABI = require("../../ABIs/NFT.json");
const CardNFTcontractABI = require("../../ABIs/NFT_CARD.json");
const NFTcontractAddress = "0xd7694bf6715dc2672c3c42558f09114e7a9fe6c3";
const CardNFTcontractAddress = "0x4daf37319a02ae027b3165fd625fd5cf22ea622d";
const sportTokenAddress = "0x8B65efE0E27D090F6E46E0dFE93E73d3574E5d99";
const Web3 = require("web3");

let web3 = new Web3(
  new Web3.providers.WebsocketProvider(
    "wss://polygon-mumbai.g.alchemy.com/v2/4mg4dqqHfJ7nfo4sELW9PcnPiHXTDD93"
  )
  // new Web3.providers.HttpProvider("https://polygon-mumbai.infura.io/v3/4ee04b874a1b4ceeb448e8c8df37cdff")
);

var minABI = [
  // balanceOf
  {
    constant: true,
    inputs: [{ name: "_owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    type: "function",
  },
  // decimals
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint8" }],
    type: "function",
  },
];

const useStyles = makeStyles(styles);

function HomePage() {
  const classes = useStyles();

  const [selected, setSelected] = React.useState(0);
  const [sortValue, setSortValue] = React.useState(0);
  const [byAndSellSelected, setByAndSellSelected] = React.useState(0);
  const [presaleSelected, setPresaleSelected] = React.useState(0);
  const [stakingSelected, setStakingSelected] = React.useState(0);
  // const router = useRouter();
  // const history = useHistory();
  const navigate = useNavigate();
  const images = ["hall.png", "cues.png", "lifes.png"];

  const titles = ["CARDS", "CUES", "Connect Wallet"];
  const [balance, setBalance] = useState("");
  const [sportBalance, setSportBalance] = useState("");
  const [address, setAdress] = useState("");
  const [chainID, setChainID] = useState("");
  const [netName, setNetName] = useState("");

  const [loaded, setLoaded] = useState(0);
  const [web3Modal, setWeb3Modal] = useState(null);
  const [providerWe3Modal, setProvider] = useState(null);
  const [ethersProvider, setEthersProvider] = useState(null);
  const [signer, setSigner] = useState();
  const [userAddress, setUserAddress] = useState();
 
  var TokenContract = new web3.eth.Contract(NFTcontractABI, NFTcontractAddress);
  var CardTokenContract = new web3.eth.Contract(
    CardNFTcontractABI,
    CardNFTcontractAddress
  );
  var sportContract = new web3.eth.Contract(minABI, sportTokenAddress);
  if (loaded == 0) {
    setLoaded(1);
    TokenContract.events.Transfer((err, events) => {
      eventListened();
    });
    CardTokenContract.events.Transfer((err, events) => {
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
      if(address !=""){

        if (window.ethereum) {
          const addressArray = await window.ethereum.request({
            method: "eth_accounts",
          });
          var web3Window = new Web3(window.ethereum);
          const chainIDBuffer = await web3Window.eth.net.getId();
          if (addressArray.length > 0) {
            if (chainIDBuffer == 80001) {
              web3Window.eth.getBalance(addressArray[0], (err, balanceOf) => {
                let balETH = ethers.utils.formatUnits(balanceOf, "ether");
                var string = balETH.toString().split(".");
                if(string.length>1){
                  if(string[1].length > 3){
                    setBalance(string[0] +"." + string[1].substring(0,4) + " MATIC");
                  }
                  else{
                    setBalance(string[0] +"." + string[1] + " MATIC");
                  }
                }
                else{
                  setBalance(string[0] + " MATIC");
                }
              });
              sportContract.methods
                .balanceOf(addressArray[0])
                .call(function (err, res) {
                  if (res.length > 7) {
                    setSportBalance(
                      String(
                        parseInt(String(res).substring(0, res.length - 7)) / 100
                      ) + " SPORT"
                    );
                  } else {
                    setSportBalance("0.00 SPORT");
                  }
                });
            }
          }
        } 
      }
    } catch (err) {
      return {
        address: "",
      };
    }
  }
  
  useEffect(() => {
    try {
      if (window.ethereum) {
        window.ethereum.on("chainChanged", () => {
          navigate("/market");
        });
        window.ethereum.on("accountsChanged", () => {
          navigate("/market");
        });
        getCurrentWalletConnected();
      }
    } catch {
      return;
    }
  }, []);


  async function getCurrentWalletConnected() {
    try {
      if (window.ethereum) {
        const addressArray = await window.ethereum.request({
          method: "eth_accounts",
        });
        var web3Window = new Web3(window.ethereum);
        const chainIDBuffer = await web3Window.eth.net.getId();
        if (addressArray.length > 0) {
          setAdress(addressArray[0]);
          if (chainIDBuffer == 80001) {
            setNetName("");
            web3Window.eth.getBalance(addressArray[0], (err, balanceOf) => {
              let balETH = ethers.utils.formatUnits(balanceOf, "ether");
              var string = balETH.toString().split(".");
              if(string.length>1){
                if(string[1].length > 3){
                  setBalance(string[0] +"." + string[1].substring(0,4) + " MATIC");
                }
                else{
                  setBalance(string[0] +"." + string[1] + " MATIC");
                }
              }
              else{
                setBalance(string[0] + " MATIC");
              }
            });
            sportContract.methods
              .balanceOf(addressArray[0])
              .call(function (err, res) {
                if (res.length > 7) {
                  setSportBalance(
                    String(
                      parseInt(String(res).substring(0, res.length - 7)) / 100
                    ) + " SPORT"
                  );
                } else {
                  setSportBalance("0.00 SPORT");
                }
              });
          } else {
            setNetName("Wrong NET(DisConnect)");
          }
        }
      } 
    } catch (err) {
      return {
        address: "",
      };
    }
  }

  const connect_Wallet = async () => {
    const chainId = 80001;
    // try{
    if (window.ethereum) {
      var web3Window = new Web3(window.ethereum);
      if (window.ethereum.networkVersion != chainId) {
        try {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            //params: [{ chainId: web3.utils.toHex(chainId) }],
            params: [{ chainId: "0x" + chainId.toString(16) }],
          });
          if (address == "") {
            await window.ethereum.request({
              method: "wallet_requestPermissions",
              params: [
                {
                  eth_accounts: {},
                },
              ],
            });
            const addressArray = await window.ethereum.request({
              method: "eth_accounts",
            });
            if (addressArray.length > 0) {
              setAdress(addressArray[0]);
              setNetName("");
              web3Window.eth.getBalance(addressArray[0], (err, balanceOf) => {
                let balETH = ethers.utils.formatUnits(balanceOf, "ether");
                var string = balETH.toString().split(".");
                if(string.length>1){
                  if(string[1].length > 3){
                    setBalance(string[0] +"." + string[1].substring(0,4) + " MATIC");
                  }
                  else{
                    setBalance(string[0] +"." + string[1] + " MATIC");
                  }
                }
                else{
                  setBalance(string[0] + " MATIC");
                }
              });
              sportContract.methods
                .balanceOf(addressArray[0])
                .call(function (err, res) {
                  if (res.length > 7) {
                    setSportBalance(
                      String(
                        parseInt(String(res).substring(0, res.length - 7)) / 100
                      ) + " SPORT"
                    );
                  } else {
                    setSportBalance("0.00 SPORT");
                  }
                });
            }
          } else {
            setAdress("");
            setNetName("");
            setBalance("");
            setSportBalance("");
          }
        } catch (err) {
          // This error code indicates that the chain has not been added to MetaMask.
          if (err.code === 4902) {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainName: "Polygon Mumbai",
                  chainId: web3.utils.toHex(chainId),
                  nativeCurrency: {
                    name: "Matic",
                    decimals: 18,
                    symbol: "Matic",
                  },
                  rpcUrls: ["https://rpc-mumbai.maticvigil.com/"],
                },
              ],
            });
          }
        }
      } else {
        if (address == "") {
          await window.ethereum.request({
            method: "wallet_requestPermissions",
            params: [
              {
                eth_accounts: {},
              },
            ],
          });
          const addressArray = await window.ethereum.request({
            method: "eth_accounts",
          });
          if (addressArray.length > 0) {
            setAdress(addressArray[0]);
            setNetName("");
            web3Window.eth.getBalance(addressArray[0], (err, balanceOf) => {
              let balETH = ethers.utils.formatUnits(balanceOf, "ether");
              var string = balETH.toString().split(".");
              if(string.length>1){
                if(string[1].length > 3){
                  setBalance(string[0] +"." + string[1].substring(0,4) + " MATIC");
                }
                else{
                  setBalance(string[0] +"." + string[1] + " MATIC");
                }
              }
              else{
                setBalance(string[0] + " MATIC");
              }
              });
             // console.log(sportContract);
            // sportContract.methods
            //   .balanceOf(addressArray[0])
            //   .call(function (err, res) {
            //     console.log(res);
            //     if (res.length > 7) {
            //       setSportBalance(
            //         String(
            //           parseInt(String(res).substring(0, res.length - 7)) / 100
            //         ) + " SPORT"
            //       );
            //     } else {
            //       setSportBalance("0.00 SPORT");
            //     }
            //   });
          }
        } else {
          setAdress("");
          setNetName("");
          setBalance("");
          setSportBalance("");
        }
      }
    } 
    // }
    // catch{
    //   return;
    // }
  };

  return (
    <div style={{backgroundColor:'#072b36',padding:"20px"}}>
      <div
        className={classes.buttons}
        style={{ justifyContent: "center", marginTop: "24px" }}
      >
       
        <div
          className="seperator"
          style={{ width: "32px", flexShrink: "0%" }}
        ></div>
        <Button
          className={`${classes.btn} ${
            byAndSellSelected === 0 ? classes.selected_btn : ""
          }`}
          onClick={() => {
            setByAndSellSelected(0);
          }}
        >
          {"BUY"}
        </Button>
        <div
          className="seperator"
          style={{ width: "32px", flexShrink: "0%" }}
        ></div>
        <Button
          className={`${classes.btn} ${
            byAndSellSelected === 1 ? classes.selected_btn : ""
          }`}
          onClick={() => {
            setByAndSellSelected(1);
          }}
        >
          {"SELL"}
        </Button>
        <div
          className="last-div"
          style={{ flexDirection: "column", display: "flex" }}
        >
          <span style={{ color: "white" }}>
            &nbsp; &nbsp; ADDRESS : &nbsp;
            {address.length > 0
              ? String(address).substring(0, 8) +
                "..." +
                String(address).substring(36)
              : ""}
          </span>
          <span style={{ color: "#06f506" }}>
            &nbsp; &nbsp; MATIC BALANCE : &nbsp;
            {address.length > 0 ? balance : ""}
          </span>
          {/* <span style={{ color: "#00edff" }}>
            &nbsp; &nbsp; SPORT BALANCE : &nbsp;
            {address.length > 0 ? sportBalance : ""}
          </span> */}
        </div>
        
      </div>
      <div className={classes.hero}>
        <Button
          className={classes.circle_btn}
          onClick={() => {
            setSortValue(1 - sortValue);
          }}
        >
          {sortValue < 1 ? "↑" : "↓"}
        </Button>
        <div className={classes.buttons}>
          {images.map((img, index) => (
            <Button
              key={index}
              className={`${classes.btn} ${
                selected === index ? classes.selected_btn : ""
              }`}
              onClick={() => {
                if (index === 2) {
                  connect_Wallet();}
                else {
                  setSelected(index);
                }
              }}
            >
              <img src={"/images/" + img} alt="" />
              {index === 2
                ? netName == ""
                  ? balance.length == 0
                    ? titles[index]
                    : "DisConnect"
                  : netName
                : titles[index]}
            </Button>
          ))}
        </div>
        {selected === 0 &&
          byAndSellSelected === 1 &&
          sortValue == 1 &&
          address == "" && <Cards check={1} sortVal={1} connected={0} provider = {providerWe3Modal}/>}
        {selected === 0 &&
          byAndSellSelected === 1 &&
          sortValue == 0 &&
          address == "" && <Cards check={1} sortVal={0} connected={0} provider = {providerWe3Modal}/>}
        {selected === 0 &&
          byAndSellSelected === 0 &&
          sortValue == 1 &&
          address == "" && <Cards check={0} sortVal={1} connected={0} provider = {providerWe3Modal}/>}
        {selected === 0 &&
          byAndSellSelected === 0 &&
          sortValue == 0 &&
          address == "" && <Cards check={0} sortVal={0} connected={0} provider = {providerWe3Modal}/>}
        {selected === 0 &&
          byAndSellSelected === 1 &&
          sortValue == 1 &&
          address != "" && <Cards check={1} sortVal={1} connected={1} provider = {providerWe3Modal}/>}
        {selected === 0 &&
          byAndSellSelected === 1 &&
          sortValue == 0 &&
          address != "" && <Cards check={1} sortVal={0} connected={1} provider = {providerWe3Modal}/>}
        {selected === 0 &&
          byAndSellSelected === 0 &&
          sortValue == 1 &&
          address != "" && <Cards check={0} sortVal={1} connected={1} provider = {providerWe3Modal}/>}
        {selected === 0 &&
          byAndSellSelected === 0 &&
          sortValue == 0 &&
          address != "" && <Cards check={0} sortVal={0} connected={1} provider = {providerWe3Modal}/>}
        {selected === 1 &&
          byAndSellSelected === 1 &&
          sortValue == 1 &&
          address == "" && <Cues check={1} sortVal={1} connected={0} provider = {providerWe3Modal}/>}
        {selected === 1 &&
          byAndSellSelected === 1 &&
          sortValue == 0 &&
          address == "" && <Cues check={1} sortVal={0} connected={0} provider = {providerWe3Modal}/>}
        {selected === 1 &&
          byAndSellSelected === 0 &&
          sortValue == 1 &&
          address == "" && <Cues check={0} sortVal={1} connected={0} provider = {providerWe3Modal}/>}
        {selected === 1 &&
          byAndSellSelected === 0 &&
          sortValue == 0 &&
          address == "" && <Cues check={0} sortVal={0} connected={0} provider = {providerWe3Modal}/>}
        {selected === 1 &&
          byAndSellSelected === 1 &&
          sortValue == 1 &&
          address != "" && <Cues check={1} sortVal={1} connected={1} provider = {providerWe3Modal}/>}
        {selected === 1 &&
          byAndSellSelected === 1 &&
          sortValue == 0 &&
          address != "" && <Cues check={1} sortVal={0} connected={1} provider = {providerWe3Modal}/>}
        {selected === 1 &&
          byAndSellSelected === 0 &&
          sortValue == 1 &&
          address != "" && <Cues check={0} sortVal={1} connected={1} provider = {providerWe3Modal}/>}
        {selected === 1 &&
          byAndSellSelected === 0 &&
          sortValue == 0 &&
          address != "" && <Cues check={0} sortVal={0} connected={1} provider = {providerWe3Modal} />}
        {/* { selected === 2 && <LifesAndTokens /> } */}
      </div>
    </div>
  );
}

export default HomePage;
