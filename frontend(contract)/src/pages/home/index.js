import React from "react";
import { Button, makeStyles } from "@material-ui/core";
import Cues from "../../components/Cues";
import Cards from "../../components/Card";
import styles from "./style";
import { useEffect, useState } from "react";
import { ethers, providers } from "ethers";

import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { homeActions } from "./../../store/actions";

import { Select, MenuItem, InputBase, Grid } from "@mui/material";
import { styled } from "@mui/material/styles";
const axios = require("axios");

const NFTcontractABI = require("../../NFT.json");
const CardNFTcontractABI = require("../../NFT_CARD.json");
const NFTcontractAddress = "0xd7694bf6715dc2672c3c42558f09114e7a9fe6c3";
const CardNFTcontractAddress = "0x4daf37319a02ae027b3165fd625fd5cf22ea622d";
const Web3 = require("web3");

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

function HomePage() {
  const classes = useStyles();
  const { uid, address } = useSelector(({ authReducer }) => authReducer.auth);
  const { balance } = useSelector(({ homeReducer }) => homeReducer.home);
  const [selected, setSelected] = React.useState(0);
  const [sortValue, setSortValue] = React.useState(0);
  const [byAndSellSelected, setByAndSellSelected] = React.useState(0);
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const images = ["hall.png", "cues.png", "presale.png"];

  const titles = ["CARDS", "CUES", "PRESALE"];
  const [maticbalance, setBalance] = useState("");
  const [sportBalance, setSportBalance] = useState("");
  const [esgBalance, setEsgBalance] = useState("");

  const [loaded, setLoaded] = useState(0);

  const [collectionData, setCollectionData] = useState([]);
  const [curCollection, setCurCollection] = useState(null);
  const [equipType, setEquipType] = useState(0);

  if (loaded == 0) {
    setLoaded(1);
  }
  useEffect(() => {
    if (address) {
      dispatch(homeActions.setBalance(address));
    }
  }, [address]);
  useEffect(() => {
    if (balance.MaticBal != null) {
      init();
    }
  }, [balance]);

  async function init() {
    try {
      // let balETH = ethers.utils.formatUnits(
      //   balance.MaticBal.toString(),
      //   "ether"
      // );
      // var string = balETH.toString().split(".");

      // if (string.length > 1) {
      //   if (string[1].length > 3) {
      //     setBalance(string[0] + "." + string[1].substring(0, 4) + " MATIC");
      //   } else {
      //     setBalance(string[0] + "." + string[1] + " MATIC");
      //   }
      // } else {
      //   setBalance(string[0] + " MATIC");
      // }
      setBalance(balance.MaticBal.toFixed(2) + " MATIC");
      if (String(balance.SportBal).length > 7) {
        setSportBalance(
          String(
            parseInt(
              String(balance.SportBal).substring(
                0,
                String(balance.SportBal).length - 7
              )
            ) / 100
          ) + " SKILL"
        );
      } else {
        setSportBalance("0.00 SKILL");
      }
      if (String(balance.EsgBal).length > 7) {
        setEsgBalance(
          String(
            parseInt(
              String(balance.EsgBal).substring(
                0,
                String(balance.EsgBal).length - 7
              )
            ) / 100
          ) + " ESG"
        );
      } else {
        setEsgBalance("0.00 ESG");
      }
    } catch (err) { }
  }

  useEffect(() => {
    getAllCollections();
  }, []);

  useEffect(() => {
    console.log(collectionData);
    if (collectionData.length > 0) {
      setCurCollection(collectionData[0]);
    }
  }, [collectionData]);

  useEffect(() => {
    console.log(curCollection);
  }, [curCollection]);

  const onChangeCollection = (val) => {
    setCurCollection(collectionData[val]);
    setEquipType(parseInt(val));
  };

  const getAllCollections = async () => {
    console.log("API URL", process.env.REACT_APP_API_URL);
    try {
      const res = await axios({
        method: "post",
        url: process.env.REACT_APP_API_URL + "/api/v1/getCollections",
        data: {},
        headers: {
          "Content-Type": `application/json`,
        },
      });
      if (res.data.status == true) {
        console.log(res.data.data);
        setCollectionData(
          res.data.data.map((e) => {
            e.jsonProperties = JSON.parse(e.jsonProperties);
            return e;
          })
        );
      }
    } catch { }
  };

  return (
    <>
      <div
        className={classes.buttons}
        style={{ justifyContent: "center", marginTop: "24px" }}
      >
        {collectionData.length > 0 && (
          <Select
            value={equipType}
            onChange={(event) => {
              onChangeCollection(Number(event.target.value));
            }}
            displ
            ayEmpty
            input={<BootstrapInput />}
          >
            {collectionData.map((e, ci) => {
              return <MenuItem value={ci}>{e.name}</MenuItem>;
            })}
          </Select>
        )}
        <div
          className="seperator"
          style={{ width: "32px", flexShrink: "0%" }}
        ></div>
        <Button
          className={`${classes.btn} ${byAndSellSelected === 0 ? classes.selected_btn : ""
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
          className={`${classes.btn} ${byAndSellSelected === 1 ? classes.selected_btn : ""
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
          <span style={{ color: "#06f506" }}>
            &nbsp; &nbsp; MATIC BALANCE : &nbsp;
            {maticbalance}
          </span>
          <span style={{ color: "#00edff" }}>
            &nbsp; &nbsp; SKILL BALANCE : &nbsp;
            {sportBalance}
          </span>
          {/* <span style={{ color: "#ffedff" }}>
            &nbsp; &nbsp; ESG BALANCE : &nbsp;
            {esgBalance}
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
        {/* <div className={classes.buttons}>
          {images.map((img, index) => (
            <Button
              key={index}
              className={`${classes.btn} ${
                selected === index ? classes.selected_btn : ""
              }`}
              onClick={() => {
                if (index === 2) {
                  navigate("/presale");
                
                } else {
                  setSelected(index);
                }
              }}
            >
              <img src={"/images/" + img} alt="" />
              {titles[index]}
            </Button>
          ))}
        </div> */}
        {/*Card, Sell, Sort Up*/}
        {curCollection != null && curCollection.name == "Card" && (
          <Cards
            check={byAndSellSelected}
            sortVal={sortValue}
            collection={curCollection}
          />
        )}
        {curCollection != null && curCollection.name == "Cue" && (
          <Cues
            check={byAndSellSelected}
            sortVal={sortValue}
            collection={curCollection}
          />
        )}
        {/* {selected === 0 && byAndSellSelected === 1 && sortValue == 1 && (
          <Cards check={1} sortVal={1} collection={curCollection} />
        )}
        {selected === 0 && byAndSellSelected === 1 && sortValue == 0 && (
          <Cards check={1} sortVal={0} />
        )}
        {selected === 0 && byAndSellSelected === 0 && sortValue == 1 && (
          <Cards check={0} sortVal={1} />
        )}
        {selected === 0 && byAndSellSelected === 0 && sortValue == 0 && (
          <Cards check={0} sortVal={0} />
        )}

        {selected === 1 && byAndSellSelected === 1 && sortValue == 1 && (
          <Cues check={1} sortVal={1} />
        )}
        {selected === 1 && byAndSellSelected === 1 && sortValue == 0 && (
          <Cues check={1} sortVal={0} />
        )}
        {selected === 1 && byAndSellSelected === 0 && sortValue == 1 && (
          <Cues check={0} sortVal={1} />
        )}
        {selected === 1 && byAndSellSelected === 0 && sortValue == 0 && (
          <Cues check={0} sortVal={0} />
        )} */}
      </div>
    </>
  );
}

export default HomePage;
