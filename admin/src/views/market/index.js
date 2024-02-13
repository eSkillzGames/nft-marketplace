import React from "react";
import { Button, makeStyles } from "@material-ui/core";
import Cues from "./Cues";
import Cards from "./Card";
import GeneralNFTs from "./General";
import styles from "./style";
import { useEffect, useState } from "react";
import { ethers, providers } from "ethers";
import { useNavigate } from "react-router-dom";

import { Select, MenuItem, InputBase } from "@mui/material";
import { styled } from "@mui/material/styles";
import GeneralNFT from "./General";
import { CRow, CCol, CCardBody, CCardHeader, CCard, CButton } from '@coreui/react'

const Web3 = require("web3");
const axios = require('axios');

const MarketContractInfo = require('./../../ABIs/VersusXMarket.json')
const VersusX721Info = require('./../../ABIs/VersusX721.json')
const VersusX1155Info = require('./../../ABIs/VersusX1155.json')

console.log(process.env.REACT_APP_INFURA_KEY, process.env.REACT_APP_MARKETPLACE);
let web3 = new Web3(process.env.REACT_APP_INFURA_KEY);
let MarketContract = new web3.eth.Contract(MarketContractInfo.abi, process.env.REACT_APP_MARKETPLACE);

const useStyles = makeStyles(styles);

const BootstrapInput = styled(InputBase)(({ theme }) => ({
  "label + &": {
    marginTop: theme.spacing(3),
  },
  "& .MuiInputBase-input": {
    borderRadius: 4,
    position: "relative",
    backgroundColor: "#00748d",
    border: "1px solid #00748d",
    color: "white",
    fontSize: 16,
    padding: "10px 26px 10px 12px",
    transition: theme.transitions.create(["border-color", "box-shadow"]),
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
    "&:focus": {
      borderRadius: 4,
      borderColor: "#009bb9",
      boxShadow: "0 0 0 0.2rem rgba(0,123,255,.25)",
    },
  },
  "& .MuiSelect-icon": {
    color: "white",
  },
}));

const getSaleNfts = async (nftaddress, nfttype) => {
  try {
    let nftList = await MarketContract.methods.fetchMarketItems(nftaddress).call();
    const items = await Promise.all(nftList.map(async nftItem => {
      let nftInfo;
      if (nfttype == 'ERC721') {
        let VersusX721Contract = new web3.eth.Contract(VersusX721Info.abi, nftaddress);
        nftInfo = await VersusX721Contract.methods.tokenURI(nftItem.tokenId).call();
      } else {
        let VersusX1155Contract = new web3.eth.Contract(VersusX1155Info.abi, nftaddress);
        nftInfo = await VersusX1155Contract.methods.uri(nftItem.tokenId).call();
      }
      let nftMetadata = await axios.get(nftInfo);
      return {
        id: nftItem["tokenId"],
        itemId: nftItem["itemId"],
        address: nftItem["nftContract"],
        thumbnail: nftMetadata.data["image_url"],
        title: nftMetadata.data["name"],
        description: nftMetadata.data["description"],
        metadata: nftMetadata.data,
        isOwned: nftItem["seller"] == process.env.REACT_APP_TREASURY_ADDRESS,
        price: nftItem["price"]
      };
    }))
    return items;
  } catch (e) {
    console.log(e);
    return [];
  }
}

const getOwnNfts = async (nftaddress) => {
  try {
    let nftListData = await axios.get(`https://polygon-mumbai.g.alchemy.com/nft/v2/${process.env.REACT_APP_ALCHEMY_KEY}/getNFTs?owner=${process.env.REACT_APP_TREASURY_ADDRESS}&contractAddresses[]=${nftaddress}&withMetadata=true&pageSize=100`);
    let nftList = nftListData.data.ownedNfts;

    const items = await Promise.all(nftList.map(async nftItem => {
      return {
        id: nftItem["id"]["tokenId"],
        balance: nftItem["balance"],
        address: nftItem["contract"]["address"],
        thumbnail: nftItem["metadata"]["image_url"],
        title: nftItem["title"],
        description: nftItem["description"],
        metadata: nftItem["metadata"],
        isOwned: true
      };
    }))
    return items;
  } catch (e) {
    console.log(e);
    return [];
  }
}

function HomePage() {
  const classes = useStyles();

  const [sortValue, setSortValue] = React.useState(0);
  const [byAndSellSelected, setByAndSellSelected] = React.useState(1);
  // const router = useRouter();
  // const history = useHistory();

  const [loaded, setLoaded] = useState(0);

  const [collectionData, setCollectionData] = useState([]);
  const [curCollection, setCurCollection] = useState(null);
  const [collectionIndex, setCollectionIndex] = useState(0);
  const [nfts, setNfts] = useState([]);

  useEffect(() => {
    getAllCollections();
  }, []);

  const onChangeCollection = (val) => {
    setCurCollection(collectionData[val]);
    setCollectionIndex(parseInt(val));
    loadNfts();
  };

  useEffect(() => {
    loadNfts();
  }, [curCollection]);

  const getAllCollections = async () => {
    try {
      const res = await axios({
        method: "post",
        url: process.env.REACT_APP_BASE_URL + "/getCollections",
        data: {},
        headers: {
          "Content-Type": `application/json`,
        },
      });
      if (res.data.status == true) {
        let tempa = res.data.data
          .map((e, i) => {
            console.log(e);
            if (i == 0) {
              setCurCollection(e);
            }
            e.properties = e.properties == "" ? [] : e.properties.split(",");
            return e;
          });
        console.log(tempa);
        setCollectionData(tempa);
      }
    } catch (er) {
      console.log(er);
    }
  };

  useEffect(() => {
    loadNfts();
  }, [byAndSellSelected]);

  const loadNfts = async () => {
    console.log(curCollection);
    let items = [];
    if (byAndSellSelected == 0) {
      items = await getSaleNfts(curCollection.collection_address, curCollection.collection_type);
    } else {
      items = await getOwnNfts(curCollection.collection_address);
    }
    console.log("======");
    console.log(items);
    console.log("======");
    setNfts(items);
  }

  return (
    <CCard>
      <CCardHeader>
        NFTs
      </CCardHeader>
      <CCardBody>
        <div
          className={classes.buttons}
          style={{ justifyContent: "center", marginTop: "24px" }}
        >
          {collectionData.length > 0 && (
            <Select
              value={collectionIndex}
              onChange={(event) => {
                onChangeCollection(Number(event.target.value));
              }}
              displayEmpty
              input={<BootstrapInput />}
            >
              {collectionData.map((e, ci) => {
                return <MenuItem style={{ display: "grid" }} value={ci}>{e.collection_name}</MenuItem>;
              })}
            </Select>
          )}
          <div
            className="seperator"
            style={{ width: "32px", flexShrink: "0%" }}
          ></div>
          <CButton color="info"
            variant={byAndSellSelected === 0 ? "" : "outline"}
            onClick={() => {
              setByAndSellSelected(0);
            }}
          >BUY</CButton>

          <div
            className="seperator"
            style={{ width: "32px", flexShrink: "0%" }}
          ></div>
          <CButton color="info"
            variant={byAndSellSelected === 1 ? "" : "outline"}
            onClick={() => {
              setByAndSellSelected(1);
            }}
          >SELL</CButton>
        </div>

        {/* <Button
        className={classes.circle_btn}
        onClick={() => {
          setSortValue(1 - sortValue);
        }}
      >
        {sortValue < 1 ? "↑" : "↓"}
      </Button> */}
        <CRow className="mt-3">
          {nfts.map((e) => (
            <CCol xs={12}>
              <GeneralNFTs isBuy={byAndSellSelected == 0} nft={e} collection={curCollection}
                onSell={() => { loadNfts() }}
                onBuy={() => { loadNfts() }}
                onCancel={() => { loadNfts() }}
              />
            </CCol>
          ))}
        </CRow>
      </CCardBody>
    </CCard>

  );
}

export default HomePage;
