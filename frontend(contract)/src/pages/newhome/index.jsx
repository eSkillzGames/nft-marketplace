import { Typography, Box } from "@mui/material";
import axios from "axios";
import React from "react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import VersusCard from "../../components/VersusCard";
import VersusCardContent from "../../components/VersusCardContent";
import VersusCardHeader from "../../components/VersusCardHeader";
import VersusButton from "../../components/VersusButton";
import VersusInput from "../../components/VersusInput";
import VersusMenu from "../../components/VersusMenu";
import VersusNFT from "../../components/VersusNFT";
import VersusLoading from "../../components/VersusLoading";
import { Grid } from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { fuseActions, authActions } from "../../store/actions";

import { ethers } from "ethers";

const getSaleNfts = async (nftaddress, nfttype, useraddress) => {
  try {
    let nftListData = await axios.post(process.env.REACT_APP_API_URL + '/api/v1/fetchAllItemsOnSale',
      {
        "page": "0",
        "nftaddress": nftaddress,
        "nfttype": nfttype,
        "userAddress": useraddress
      });
    return nftListData.data.data;
  } catch (e) {
    console.log(e);
    return [];
  }
}

const getOwnNfts = async (nftaddress, useraddress) => {
  try {
    let nftListData = await axios.get(`https://polygon-mumbai.g.alchemy.com/nft/v2/${process.env.REACT_APP_ALCHEMY_KEY}/getNFTs?owner=${useraddress}&contractAddresses[]=${nftaddress}&withMetadata=true&pageSize=100`);
    let nftList = nftListData.data.ownedNfts;

    const items = await Promise.all(nftList.map(async nftItem => {
      let nftMetadata = await axios.get(`https://polygon-mumbai.g.alchemy.com/nft/v2/${process.env.REACT_APP_ALCHEMY_KEY}/getNFTMetadata?contractAddress=${nftaddress}&tokenId=${ethers.BigNumber.from(nftItem["id"]["tokenId"]).toNumber().toString()}&refreshCache=true`).then(res=>res.data);
      // console.log("~~~~~~~~~~");
      // console.log(nftMetadata["metadata"]["image_url"]);
      // console.log("~~~~~~~~~~");
      return {
        id: nftItem["id"]["tokenId"],
        balance: nftItem["balance"],
        address: nftItem["contract"]["address"],
        thumbnail: nftMetadata["metadata"]["image_url"],
        title: nftItem["title"],
        description: nftItem["description"],
        metadata: nftMetadata["metadata"],
        isOwned: true
      };
    }))
    return items;
  } catch (e) {
    console.log(e);
    return [];
  }
}

const NewHome = () => {
  const { address: userAddress } = useSelector(({ authReducer }) => authReducer.auth);
  const [buysell, setBuySell] = useState("BUY");
  const [collectionData, setCollectionData] = useState([]);
  const [curCollection, setCurCollection] = useState(null);
  const [nftName, setNftName] = useState("");
  const [nfts, setNfts] = useState([]);

  const [page, setPage] = useState(1);
  const [pageArray, setPageArray] = useState([]);

  const [sortVal, setSortVal] = useState(0);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    getAllCollections();
  }, []);

  useEffect(() => {
    setNfts([]);
    if (nftName != "") {
      loadNFTs();
    }
  }, [nftName, buysell]);

  const getAllCollections = async () => {
    try {
      const res = await axios({
        method: "post",
        url: process.env.REACT_APP_ADMIN_URL + "/getCollections",
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
              setNftName(e.collection_name);
              setCurCollection(e);
            }
            e.properties = e.properties == "" ? [] : e.properties.split(",");
            return e;
          });
        console.log(tempa);
        setCollectionData(tempa);
      }
    } catch (err) {
    }
  };

  const loadNFTs = async () => {
    console.log(curCollection);
    setLoading(true);
    let items = [];
    if (buysell == "BUY") {
      items = await getSaleNfts(curCollection.collection_address, curCollection.collection_type, userAddress);
    } else {
      items = await getOwnNfts(curCollection.collection_address, userAddress);
    }
    console.log("======");
    console.log(items);
    console.log("======");
    setNfts(items);
    setLoading(false);
  };

  return (
    !loading ?
      <>
        <VersusCard title={"HOME"}>
          <VersusCardHeader showToken={true}>
            <Box display="flex" alignItems="center">
              <img src="/imgs/arrow-up.png" style={{ width: "1.5rem" }} onClick={() => {
                setSortVal(sortVal == 0 ? 1 : 0);
              }} />
              <VersusMenu
                style={{ marginLeft: "1rem" }}
                value={nftName}
                items={collectionData.map((e, ci) => {
                  return {
                    label: e.collection_name,
                    onClick: () => {
                      setCurCollection(e);
                      setNftName(e.collection_name);
                    },
                    key: ci
                  };
                })}
              />
            </Box>
          </VersusCardHeader>
          <VersusCardContent style={{ padding: "0px" }}>
            <Box display={"flex"} justifyContent={"space-between"}>
              <Box
                sx={{
                  border: buysell == "BUY" ? "1px solid #FFFFFF" : "1px solid #00BDFF",
                  background: buysell == "BUY" ? "#FFFFFF33" : "#25253080",
                  width: "50%",
                  color: buysell == "BUY" ? "white" : "#00BDFF",
                  cursor: "pointer"
                }}
                textAlign="center"
                py={1}
                onClick={() => {
                  setBuySell("BUY");
                }}
              >
                <Typography variant="subtitle1" fontWeight="bold">
                  BUY
                </Typography>
              </Box>
              <Box
                sx={{
                  border:
                    buysell == "SELL" ? "1px solid #FFFFFF" : "1px solid #00BDFF",
                  background: buysell == "SELL" ? "#FFFFFF33" : "#25253080",
                  width: "50%",
                  color: buysell == "SELL" ? "white" : "#00BDFF",
                  cursor: "pointer"
                }}
                textAlign="center"
                py={1}
                onClick={() => {
                  setBuySell("SELL");
                }}
              >
                <Typography variant="subtitle1" fontWeight="bold">
                  SELL
                </Typography>
              </Box>
            </Box>

            <Grid container spacing={5} padding={"2.5rem"}>
              {nfts.map((e, index) => {
                return (
                  <Grid item md={4} sm={6} xs={12} key={index}>
                    <VersusNFT nft={e} buysell={buysell} collection={curCollection}
                      onBuy={() => {
                        dispatch(authActions.setBalance(userAddress));
                        loadNFTs();
                      }}
                      onSell={() => {
                        loadNFTs();
                      }}
                      onCancel={() => {
                        loadNFTs();
                      }}
                      onLoading={setLoading}
                    />
                  </Grid>
                );
              })}
            </Grid>
            <Box
              display={"flex"}
              alignItems={"center"}
              justifyContent={"space-between"}
              p={2}
            >
              {/* <Box>
              <VersusInput placeholder="Search..." />
            </Box> */}
              <Box display={"flex"} alignItems={"center"} style={{ fontSize: "1rem" }}>
                <VersusButton
                  label={
                    <>
                      <ChevronLeft />
                      BACK
                    </>
                  }
                />
                <VersusButton
                  label={"1"}
                  style={{ margin: "0 0.5rem" }}
                  outline={true}
                />
                <VersusButton
                  label={
                    <>
                      NEXT
                      <ChevronRight />
                    </>
                  }
                />
              </Box>
            </Box>
          </VersusCardContent>
        </VersusCard>
      </>
      :
      <VersusLoading />
  );
};

export default NewHome;
