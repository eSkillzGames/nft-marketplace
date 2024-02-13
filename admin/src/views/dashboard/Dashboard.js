import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CProgress,
  CRow,
  CFormRange,
} from '@coreui/react'
import { CChartLine, CChartDoughnut, CChart } from '@coreui/react-chartjs'
import { getStyle, hexToRgba } from '@coreui/utils'
import CIcon from '@coreui/icons-react'
import { cilCloudDownload } from '@coreui/icons'
import WidgetsDropdown from '../widgets/WidgetsDropdown'
import { ethers } from 'ethers'
const Web3 = require("web3");
const NFTcontractABI = require('../../ABIs/NFT.json');
const NFTcontractAddress = "0xd7694bf6715dc2672c3c42558f09114e7a9fe6c3";
const CardNFTcontractABI = require('../../ABIs/NFT_CARD.json');
const sportcontractABI = require('../../ABIs/Sport.json');
const esgcontractABI = require('../../ABIs/Esg.json');
const tokenPricePredictABI = require('../../ABIs/getPricePredict.json');
const CardNFTcontractAddress = "0x4daf37319a02ae027b3165fd625fd5cf22ea622d";
const sportAddress = "0x2caFAb766a586a09659a09E92e9f4005DF827512";
const sportTokenAddress = "0xec1E041B32898b8a33F5a7789226f9d64c7ed287";
const esgAddress = "0x6637926e5c038c7ae3d3fd2c2d77c44e8be1ed28";
const maticAddress = "0x9c3c9283d3e44854697cd22d3faa240cfb032889";
const tokenPricePredictAddress = "0x544384Cd3fC67609C53b1ac9E51C3F30b78B65cA";
const provider = new ethers.providers.JsonRpcProvider("https://matic-mumbai.chainstacklabs.com");
// let contractNFTCue = new ethers.Contract(NFTcontractAddress, NFTcontractABI, provider);
// let contractNFTCard = new ethers.Contract(CardNFTcontractAddress, CardNFTcontractABI, provider);
// let contractSport = new ethers.Contract(sportAddress, sportcontractABI, provider);
// let contractEsg = new ethers.Contract(esgAddress, esgcontractABI, provider);
let tokenPricePredictContract = new ethers.Contract(tokenPricePredictAddress, tokenPricePredictABI, provider);

const Dashboard = () => {
  const random = (min, max) => Math.floor(Math.random() * (max - min + 1) + min)
  const [mintData, setMintData] = useState({})
  const [mintCardData, setMintCardData] = useState({})
  const [earnMarketData, setEarnMarketData] = useState({})
  const [earnMarketFeeData, setEarnMarketFeeData] = useState({})
  const [earnMarketCardData, setEarnMarketCardData] = useState({})
  const [earnMarketCardFeeData, setEarnMarketCardFeeData] = useState({})
  const [earnDataBet, setEarnBetData] = useState({})
  const [userData, setUserData] = useState({})
  const [mintSportData, setMintSportData] = useState({})
  const [earnDataEsg, setEarnESGData] = useState({})
  const [earnDataEsgMatic, setEarnESGMATICData] = useState({})
  const [earnDataEsgUsdt, setEarnESGUSDTData] = useState({})
  const [mintActive, setMintActive] = useState([false, true, false, false])
  const [mintCardActive, setMintCardActive] = useState([false, true, false, false])
  const [mintEarnActive, setMintEarnActive] = useState([false, true, false, false])
  const [mintEarnFeeActive, setMintEarnFeeActive] = useState([false, true, false, false])
  const [mintEarnCardActive, setMintEarnCardActive] = useState([false, true, false, false])
  const [mintEarnCardFeeActive, setMintEarnCardFeeActive] = useState([false, true, false, false])
  const [earnActive, setEarnActive] = useState([false, true, false, false])
  const [userActive, setUserActive] = useState([false, true, false, false])
  const [mintSportActive, setMintSportActive] = useState([false, true, false, false])
  const [earnEsgActive, setEarnEsgActive] = useState([false, true, false, false])
  const [totalMintCue, setTotalMintCue] = useState();
  const [totalSelMintCue, setTotalSelMintCue] = useState();
  const [totalSelMintCard, setTotalSelMintCard] = useState();
  const [liquidityVal, setLiquidityVal] = useState([0, 0, 0, 0]);
  const [totalEarnMintCue, setTotalEarnMintCue] = useState([0, 0]);
  const [totalEarnMintCueFee, setTotalEarnMintCueFee] = useState([0, 0]);
  const [totalEarnMintCard, setTotalEarnMintCARD] = useState([0, 0]);
  const [totalEarnMintCardFee, setTotalEarnMintCARDFee] = useState([0, 0]);
  const [totalMintCard, setTotalMintCard] = useState();
  const [totalSport, setTotalSport] = useState();
  const [totalEsg, setTotalEsg] = useState();
  const [totalSportSel, setTotalSportSel] = useState();
  const [totalMintSportSel, setTotalMintportSel] = useState();
  const [totalSportUsdSel, setTotalSportUsdSel] = useState();
  const [totalEsgSel, setTotalEsgSel] = useState();
  const [totalEsgUsdSel, setTotalEsgUsdSel] = useState();
  //////
  const [selUserCounts, setSelUserCount] = useState();
  const [totalUserCounts, setTotalUserCount] = useState();
  const [totalSportEarn, setTotalSportEarn] = useState();
  const [totalEsgEarn, setTotalEsgEarn] = useState();
  const [totalSportUsdEarn, setTotalSportUsdEarn] = useState();
  const [totalEsgUsdEarn, setTotalEsgUsdEarn] = useState();

  const [spGameData, setSPGameData] = useState({})
  const [mpGameData, setMPGameData] = useState({})
  const [spGameActive, setSPGameActive] = useState([false, true, false, false])
  const [mpGameActive, setMPGameActive] = useState([false, true, false, false])
  const [wagerSPGameData, setWagerSPGameData] = useState({})
  const [wagerMPGameData, setWagerMPGameData] = useState({})
  const [wagerSPGameActive, setWagerSPGameActive] = useState([false, true, false, false])
  const [wagerMPGameActive, setWagerMPGameActive] = useState([false, true, false, false])

  const progressExample = [
    { title: 'Total Earn', value: '$ 29.703', percent: 40, color: 'success' },
    { title: 'Total Mint', value: '$ 24.093', percent: 20, color: 'info' },
    { title: 'Bet Earn', value: '$ 78.706', percent: 60, color: 'warning' },
    { title: 'Tournaments Earn', value: '$ 22.123', percent: 80, color: 'danger' },
  ]

  useEffect(async () => {
    //
    init();

    //
    var mint = (await axios.get(process.env.REACT_APP_BASE_URL + '/getmintgraph?type=month&nftType=CUE')).data
    var mintcard = (await axios.get(process.env.REACT_APP_BASE_URL + '/getmintgraph?type=month&nftType=CARD')).data
    var earnMarket = (await axios.get(process.env.REACT_APP_BASE_URL + '/getmarketearngraph?type=month&nftType=CUE')).data
    var earnMarketCard = (await axios.get(process.env.REACT_APP_BASE_URL + '/getmarketearngraph?type=month&nftType=CARD')).data
    var earnBet = (await axios.get(process.env.REACT_APP_BASE_URL + '/getearngraph?type=month&earnType=BET&amountType=SPORT')).data
    var earnEsgFee = (await axios.get(process.env.REACT_APP_BASE_URL + '/getearngraph?type=month&earnType=ESG&amountType=ESGFEE')).data
    var earnEsgMaticFee = (await axios.get(process.env.REACT_APP_BASE_URL + '/getearngraph?type=month&earnType=ESG&amountType=MATICFEE')).data
    var earnEsgUsdFee = (await axios.get(process.env.REACT_APP_BASE_URL + '/getearngraph?type=month&earnType=ESG&amountType=USDTFEE')).data
    var totalEarnUSD = (await axios.get(process.env.REACT_APP_BASE_URL + '/getTotalEarn')).data
    var totalCueCount = (await axios.get(process.env.REACT_APP_BASE_URL + '/getTotalMint?type=month&nftType=CUE')).data
    var totalCardCount = (await axios.get(process.env.REACT_APP_BASE_URL + '/getTotalMint?type=month&nftType=CARD')).data
    var earnSelBet = (await axios.get(process.env.REACT_APP_BASE_URL + '/getSelectEarn?type=month&earnType=BET&amountType=SPORT')).data
    var earnSelEsgFee = (await axios.get(process.env.REACT_APP_BASE_URL + '/getSelectEarn?type=month&earnType=ESG&amountType=ESGFEE')).data
    var earnSelEsgMaticFee = (await axios.get(process.env.REACT_APP_BASE_URL + '/getSelectEarn?type=month&earnType=ESG&amountType=MATICFEE')).data
    var earnSelEsgUsdFee = (await axios.get(process.env.REACT_APP_BASE_URL + '/getSelectEarn?type=month&earnType=ESG&amountType=USDTFEE')).data
    var mintSport = (await axios.get(process.env.REACT_APP_BASE_URL + '/getSportMintgraph?type=month&amountType=SPORT')).data
    var mintSelAmounts = (await axios.get(process.env.REACT_APP_BASE_URL + '/getTotalMintSport?type=month&amountType=SPORT')).data
    var totalCounts = (await axios.get(process.env.REACT_APP_BASE_URL + '/getTotalUsers?type=month')).data
    var Users = (await axios.get(process.env.REACT_APP_BASE_URL + '/getUsergraph?type=month')).data
    //
    var marketEarnCueFee = (await axios.get(process.env.REACT_APP_BASE_URL + '/getSelectMarketEarn?type=month&earnType=CUE&amountType=FEE')).data
    var marketEarnCue = (await axios.get(process.env.REACT_APP_BASE_URL + '/getSelectMarketEarn?type=month&earnType=CUE&amountType=EARN')).data
    var marketEarnCardFee = (await axios.get(process.env.REACT_APP_BASE_URL + '/getSelectMarketEarn?type=month&earnType=CARD&amountType=FEE')).data
    var marketEarnCard = (await axios.get(process.env.REACT_APP_BASE_URL + '/getSelectMarketEarn?type=month&earnType=CARD&amountType=EARN')).data
    //        
    var spgames = (await axios.post(process.env.REACT_APP_BASE_URL + '/spgames?type=month')).data
    var mpgames = (await axios.post(process.env.REACT_APP_BASE_URL + '/mpgames?type=month')).data

    setUserData(Users)
    setSPGameData(spgames)
    setMPGameData(mpgames)
    setWagerSPGameData(spgames)
    setWagerMPGameData(mpgames)
    setTotalUserCount(String(totalCounts.total));
    setSelUserCount(String(totalCounts.selCount));
    setMintSportData(mintSport)
    setTotalMintportSel(String(mintSelAmounts.sel).substr(0, 12))
    setTotalSport(String(mintSelAmounts.total).substr(0, 12))

    setTotalMintCue(Number(totalCueCount.total));
    setTotalMintCard(Number(totalCardCount.total));
    setTotalSelMintCue(Number(totalCueCount.selCount));
    setTotalSelMintCard(Number(totalCardCount.selCount));
    setTotalSportEarn(String(totalEarnUSD.sport).substr(0, 8));
    setTotalSportUsdEarn(String(totalEarnUSD.sportUsd).substr(0, 8))
    setTotalEsgEarn(String(totalEarnUSD.esg).substr(0, 8));
    setTotalEsgUsdEarn(String(totalEarnUSD.esgUsd).substr(0, 8));
    setTotalSportSel(String(earnSelBet.token).substr(0, 8))
    setTotalSportUsdSel(String(earnSelBet.usd).substr(0, 8))
    setTotalEsgSel(String(earnSelEsgFee.token).substr(0, 8))
    setTotalEsgUsdSel(String(earnSelEsgFee.usd).substr(0, 8))

    setMintCardData(mintcard);
    setMintData(mint)
    setEarnMarketData(earnMarket);
    setEarnMarketFeeData(earnMarket);
    setEarnMarketCardData(earnMarketCard);
    setEarnMarketCardFeeData(earnMarketCard);
    setEarnBetData(earnBet);
    setEarnESGData(earnEsgFee);
    setEarnESGMATICData(earnEsgMaticFee);
    setEarnESGUSDTData(earnEsgUsdFee);
    //
    setTotalEarnMintCue([marketEarnCue.total, marketEarnCue.sel]);
    setTotalEarnMintCARD([marketEarnCard.total, marketEarnCard.sel]);
    setTotalEarnMintCueFee([marketEarnCueFee.total, marketEarnCueFee.sel]);
    setTotalEarnMintCARDFee([marketEarnCardFee.total, marketEarnCardFee.sel]);
    //
  }, [])
  async function init() {

    // let totalCueBuf = await contractNFTCue.totalNFTs();
    // let totalCardBuf = await contractNFTCard.totalNFTs();
    //let totalSportBuf = await contractSport.getCirculatingSupply();
    // let totalEsgBuf = await contractEsg.getCirculatingSupply();
    let reserveSportBuf = await tokenPricePredictContract.getReserves(sportAddress, maticAddress);
    // let reserveEsgBuf = await tokenPricePredictContract.getReserves(esgAddress, maticAddress);
    //setTotalSport(Number(totalSportBuf)/ 10**9);
    console.log(reserveSportBuf)
    // console.log(reserveEsgBuf)
    console.log(parseInt(Number(reserveSportBuf[0]) / 10 ** 7) / 100)
    // setTotalEsg(Number(totalEsgBuf)/ 10**9);
    setLiquidityVal([parseInt(Number(reserveSportBuf[0]) / 10 ** 7) / 100, parseInt(Number(reserveSportBuf[1]) / 10 ** 14) / 10000/*, parseInt(Number(reserveEsgBuf[0]) / 10**7)/100, parseInt(Number(reserveEsgBuf[1]) / 10**14)/10000*/])
  };
  async function onNFTMintDate(type, index, nftType) {
    var tmp = [false, false, false, false]
    var mint = (await axios.get(process.env.REACT_APP_BASE_URL + '/getmintgraph?type=' + type + '&nftType=' + nftType)).data

    tmp[index] = true
    var totalCount = (await axios.get(process.env.REACT_APP_BASE_URL + '/getTotalMint?type=' + type + '&nftType=' + nftType)).data

    if (nftType == 'CUE') {

      setMintActive(tmp)
      setMintData(mint)
      setTotalMintCue(Number(totalCount.total));
      setTotalSelMintCue(Number(totalCount.selCount));
    }
    else {
      setMintCardActive(tmp)
      setMintCardData(mint)
      setTotalMintCard(Number(totalCount.total));
      setTotalSelMintCard(Number(totalCount.selCount));

    }
  }
  async function onMintEarnDate(type, index, nftType, amountType) {
    var tmp = [false, false, false, false]
    var earn = (await axios.get(process.env.REACT_APP_BASE_URL + '/getmarketearngraph?type=' + type + '&nftType=' + nftType)).data
    var marketEarn = (await axios.get(process.env.REACT_APP_BASE_URL + '/getSelectMarketEarn?type=' + type + '&earnType=' + nftType + '&amountType=' + amountType)).data

    tmp[index] = true;
    if (nftType == 'CUE') {
      if (amountType == 'FEE') {

        setMintEarnFeeActive(tmp)
        setEarnMarketFeeData(earn)
        setTotalEarnMintCueFee([marketEarn.total, marketEarn.sel]);
      }
      else {

        setMintEarnActive(tmp)
        setEarnMarketData(earn)
        setTotalEarnMintCue([marketEarn.total, marketEarn.sel]);
      }
    }
    else {
      if (amountType == 'FEE') {

        setMintEarnCardFeeActive(tmp)
        setEarnMarketCardFeeData(earn)
        setTotalEarnMintCARDFee([marketEarn.total, marketEarn.sel]);
      }
      else {

        setMintEarnCardActive(tmp)
        setEarnMarketCardData(earn)
        setTotalEarnMintCARD([marketEarn.total, marketEarn.sel]);
      }


    }
  }
  async function onEarnDate(type, index, earnType, amountType) {
    var totalEarnUSD = (await axios.get(process.env.REACT_APP_BASE_URL + '/getTotalEarn')).data
    var tmp = [false, false, false, false]
    tmp[index] = true
    var earn = (await axios.get(process.env.REACT_APP_BASE_URL + '/getearngraph?type=' + type + '&earnType=' + earnType + '&amountType=' + amountType)).data
    var earnSelAmounts = (await axios.get(process.env.REACT_APP_BASE_URL + '/getSelectEarn?type=' + type + '&earnType=' + earnType + '&amountType=' + amountType)).data

    setTotalSportEarn(String(totalEarnUSD.sport).substr(0, 8));
    setTotalSportUsdEarn(String(totalEarnUSD.sportUsd).substr(0, 8))
    // setTotalEsgEarn(String(totalEarnUSD.esg).substr(0,8));
    // setTotalEsgUsdEarn(String(totalEarnUSD.esgUsd).substr(0,8));
    if (amountType == 'SPORT') {
      if (earnType == 'BET') {

        setEarnActive(tmp)
        setEarnBetData(earn)
        setTotalSportSel(String(earnSelAmounts.token).substr(0, 8))
        setTotalSportUsdSel(String(earnSelAmounts.usd).substr(0, 8))
      }
      else {
        //tournament
      }
    }
    // else if (amountType=='ESGFEE'){

    //   setEarnEsgActive(tmp)
    //   setEarnESGData(earn)
    //   setTotalEsgSel(String(earnSelAmounts.token).substr(0,8))
    //   setTotalEsgUsdSel(String(earnSelAmounts.usd).substr(0,8))
    // }
    else if (amountType == 'MATICFEE') {

    }
    else if (amountType == 'USDTFEE') {

    }
  }
  async function onUserCounts(type, index, earnType) {
    var totalCounts = (await axios.get(process.env.REACT_APP_BASE_URL + '/getTotalUsers?type=' + type)).data


    var tmp = [false, false, false, false]
    tmp[index] = true
    var Users = (await axios.get(process.env.REACT_APP_BASE_URL + '/getUsergraph?type=' + type)).data

    setTotalUserCount(String(totalCounts.total));
    setSelUserCount(String(totalCounts.selCount));
    setUserActive(tmp)
    setUserData(Users)
  }
  async function onSPGameData(type, index) {
    var tmp = [false, false, false, false]
    tmp[index] = true
    var Users = (await axios.post(process.env.REACT_APP_BASE_URL + '/spgames?type=' + type)).data

    setSPGameActive(tmp)
    setSPGameData(Users)
  }
  async function onMPGameData(type, index) {
    var tmp = [false, false, false, false]
    tmp[index] = true
    var Users = (await axios.post(process.env.REACT_APP_BASE_URL + '/mpgames?type=' + type)).data

    setMPGameActive(tmp)
    setMPGameData(Users)
  }
  async function onWagerSPGameData(type, index) {
    var tmp = [false, false, false, false]
    tmp[index] = true
    var Users = (await axios.post(process.env.REACT_APP_BASE_URL + '/spgames?type=' + type)).data

    setWagerSPGameActive(tmp)
    setWagerSPGameData(Users)
  }
  async function onWagerMPGameData(type, index) {
    var tmp = [false, false, false, false]
    tmp[index] = true
    var Users = (await axios.post(process.env.REACT_APP_BASE_URL + '/mpgames?type=' + type)).data

    setWagerMPGameActive(tmp)
    setWagerMPGameData(Users)
  }
  async function onMintDate(type, index, amountType) {
    var tmp = [false, false, false, false]
    tmp[index] = true
    var mint = (await axios.get(process.env.REACT_APP_BASE_URL + '/getSportMintgraph?type=' + type + '&amountType=' + amountType)).data
    var mintSelAmounts = (await axios.get(process.env.REACT_APP_BASE_URL + '/getTotalMintSport?type=' + type + '&amountType=' + amountType)).data

    if (amountType == 'SPORT') {

      setMintSportActive(tmp)
      setMintSportData(mint)
      setTotalMintportSel(String(mintSelAmounts.sel).substr(0, 12))
      setTotalSport(String(mintSelAmounts.total).substr(0, 12))

    }
    else if (amountType == 'ESG') {


    }
  }

  return (
    <>
      {/* <WidgetsDropdown /> */}
      <CCard className="mb-4">
        <CCardBody>
          <CRow>
            <CCol sm={6}>
              <h4 id="traffic" className="card-title mb-0">
                Current Liquidity Amounts
              </h4>
            </CCol>
          </CRow>
          <CRow>
            <CCol sm={12}>
              <h4 id="traffic" className="card-title mb-0">
                Skill / Matic : {liquidityVal[0]} SPORT / {liquidityVal[1]} MATIC
              </h4>
            </CCol>
          </CRow>
          {/* <CRow>
            <CCol sm={12}>
              <h4 id="traffic" className="card-title mb-0">
              ESG / Matic : {liquidityVal[2]} ESG / {liquidityVal[3]} MATIC
              </h4>
            </CCol>            
          </CRow>           */}
        </CCardBody>
      </CCard>
      <CCard className="mb-4">
        <CCardBody>
          <CRow>
            <CCol sm={6}>
              <h4 id="traffic" className="card-title mb-0">
                Total User Signups: {totalUserCounts}
              </h4>
              <div className="small text-medium-emphasis">{userData.from} ~ {userData.to}</div>
            </CCol>
            <CCol sm={6} style={{ textAlign: 'right' }}>
              <CButtonGroup role="group" aria-label="">
                <CButton color={"primary " + (userActive[0] == true ? 'active' : '')} onClick={() => onUserCounts('week', 0, 'ESG')}>Weekly</CButton>
                <CButton color={"primary " + (userActive[1] == true ? 'active' : '')} onClick={() => onUserCounts('month', 1, 'ESG')}>Monthly</CButton>
                <CButton color={"primary " + (userActive[2] == true ? 'active' : '')} onClick={() => onUserCounts('3month', 2, 'ESG')}>3 Monthly</CButton>
                <CButton color={"primary " + (userActive[3] == true ? 'active' : '')} onClick={() => onUserCounts('year', 3, 'ESG')}>Annual</CButton>
              </CButtonGroup>
            </CCol>
          </CRow>
          <CChart
            type="bar"
            height={100}
            data={{
              labels: userData.labels,
              datasets: [
                {
                  label: 'Users',
                  backgroundColor: 'rgb(255, 187, 68)',
                  data: userData.user,
                },
              ],
            }}
          />
        </CCardBody>
        <CCardFooter>
          <CRow xs={{ cols: 1 }} md={{ cols: 11 }} className="text-center">
            <CCol className="mb-sm-2 mb-0">
              <div className="text-medium-emphasis">Selected User Signups: &nbsp;
                <strong>
                  {selUserCounts}
                </strong>
              </div>
            </CCol>
          </CRow>
        </CCardFooter>
      </CCard>
      
      <CCard className="mb-4">
        <CCardBody>
          <CRow>
            <CCol sm={6}>
              <h4 id="traffic" className="card-title mb-0">
                Single player games played: {spGameData.total}
              </h4>
              <div className="small text-medium-emphasis">{spGameData.from} ~ {spGameData.to}</div>
            </CCol>
            <CCol sm={6} style={{ textAlign: 'right' }}>
              <CButtonGroup role="group" aria-label="">
                <CButton color={"primary " + (spGameActive[0] == true ? 'active' : '')} onClick={() => onSPGameData('week', 0)}>Weekly</CButton>
                <CButton color={"primary " + (spGameActive[1] == true ? 'active' : '')} onClick={() => onSPGameData('month', 1)}>Monthly</CButton>
                <CButton color={"primary " + (spGameActive[2] == true ? 'active' : '')} onClick={() => onSPGameData('3month', 2)}>3 Monthly</CButton>
                <CButton color={"primary " + (spGameActive[3] == true ? 'active' : '')} onClick={() => onSPGameData('year', 3)}>Annual</CButton>
              </CButtonGroup>
            </CCol>
          </CRow>
          <CChart
            type="bar"
            height={100}
            data={{
              labels: spGameData.labels,
              datasets: [
                {
                  label: 'Single Player',
                  backgroundColor: 'rgb(255, 187, 68)',
                  data: spGameData.user,
                },
              ],
            }}
          />
        </CCardBody>
        <CCardFooter>
          <CRow xs={{ cols: 1 }} md={{ cols: 11 }} className="text-center">
            <CCol className="mb-sm-2 mb-0">
              <div className="text-medium-emphasis">Selected SPGame Played: &nbsp;
                <strong>
                  {spGameData.selCount}
                </strong>
              </div>
            </CCol>
          </CRow>
        </CCardFooter>
      </CCard>

      <CCard className="mb-4">
        <CCardBody>
          <CRow>
            <CCol sm={6}>
              <h4 id="traffic" className="card-title mb-0">
                Multiplayer games played: {mpGameData.total}
              </h4>
              <div className="small text-medium-emphasis">{mpGameData.from} ~ {mpGameData.to}</div>
            </CCol>
            <CCol sm={6} style={{ textAlign: 'right' }}>
              <CButtonGroup role="group" aria-label="">
                <CButton color={"primary " + (mpGameActive[0] == true ? 'active' : '')} onClick={() => onMPGameData('week', 0)}>Weekly</CButton>
                <CButton color={"primary " + (mpGameActive[1] == true ? 'active' : '')} onClick={() => onMPGameData('month', 1)}>Monthly</CButton>
                <CButton color={"primary " + (mpGameActive[2] == true ? 'active' : '')} onClick={() => onMPGameData('3month', 2)}>3 Monthly</CButton>
                <CButton color={"primary " + (mpGameActive[3] == true ? 'active' : '')} onClick={() => onMPGameData('year', 3)}>Annual</CButton>
              </CButtonGroup>
            </CCol>
          </CRow>
          <CChart
            type="bar"
            height={100}
            data={{
              labels: mpGameData.labels,
              datasets: [
                {
                  label: 'Multi Player',
                  backgroundColor: 'rgb(255, 187, 68)',
                  data: mpGameData.user,
                },
              ],
            }}
          />
        </CCardBody>
        <CCardFooter>
          <CRow xs={{ cols: 1 }} md={{ cols: 11 }} className="text-center">
            <CCol className="mb-sm-2 mb-0">
              <div className="text-medium-emphasis">Selected MPGame Played: &nbsp;
                <strong>
                  {mpGameData.selCount}
                </strong>
              </div>
            </CCol>
          </CRow>
        </CCardFooter>
      </CCard>

      <CCard className="mb-4">
        <CCardBody>
          <CRow>
            <CCol sm={6}>
              <h4 id="traffic" className="card-title mb-0">
              Amount wagered on SP: {wagerSPGameData.totalWager}
              </h4>
              <div className="small text-medium-emphasis">{wagerSPGameData.from} ~ {wagerSPGameData.to}</div>
            </CCol>
            <CCol sm={6} style={{ textAlign: 'right' }}>
              <CButtonGroup role="group" aria-label="">
                <CButton color={"primary " + (wagerSPGameActive[0] == true ? 'active' : '')} onClick={() => onWagerSPGameData('week', 0)}>Weekly</CButton>
                <CButton color={"primary " + (wagerSPGameActive[1] == true ? 'active' : '')} onClick={() => onWagerSPGameData('month', 1)}>Monthly</CButton>
                <CButton color={"primary " + (wagerSPGameActive[2] == true ? 'active' : '')} onClick={() => onWagerSPGameData('3month', 2)}>3 Monthly</CButton>
                <CButton color={"primary " + (wagerSPGameActive[3] == true ? 'active' : '')} onClick={() => onWagerSPGameData('year', 3)}>Annual</CButton>
              </CButtonGroup>
            </CCol>
          </CRow>
          <CChart
            type="bar"
            height={100}
            data={{
              labels: wagerSPGameData.labels,
              datasets: [
                {
                  label: 'Single Player',
                  backgroundColor: 'rgb(255, 187, 68)',
                  data: wagerSPGameData.wager,
                },
              ],
            }}
          />
        </CCardBody>
        <CCardFooter>
          <CRow xs={{ cols: 1 }} md={{ cols: 11 }} className="text-center">
            <CCol className="mb-sm-2 mb-0">
              <div className="text-medium-emphasis">Selected Wager: &nbsp;
                <strong>
                  {wagerSPGameData.selWager}
                </strong>
              </div>
            </CCol>
            <CCol className="mb-sm-2 mb-0">
              <div className="text-medium-emphasis">Average Wager: &nbsp;
                <strong>
                  {Number(wagerSPGameData.selWager / wagerSPGameData.selCount).toFixed(1)}
                </strong>
              </div>
            </CCol>
          </CRow>
        </CCardFooter>
      </CCard>

      <CCard className="mb-4">
        <CCardBody>
          <CRow>
            <CCol sm={6}>
              <h4 id="traffic" className="card-title mb-0">
              Amount wagered on MP: {wagerMPGameData.totalWager}
              </h4>
              <div className="small text-medium-emphasis">{wagerMPGameData.from} ~ {wagerMPGameData.to}</div>
            </CCol>
            <CCol sm={6} style={{ textAlign: 'right' }}>
              <CButtonGroup role="group" aria-label="">
                <CButton color={"primary " + (wagerMPGameActive[0] == true ? 'active' : '')} onClick={() => onWagerMPGameData('week', 0)}>Weekly</CButton>
                <CButton color={"primary " + (wagerMPGameActive[1] == true ? 'active' : '')} onClick={() => onWagerMPGameData('month', 1)}>Monthly</CButton>
                <CButton color={"primary " + (wagerMPGameActive[2] == true ? 'active' : '')} onClick={() => onWagerMPGameData('3month', 2)}>3 Monthly</CButton>
                <CButton color={"primary " + (wagerMPGameActive[3] == true ? 'active' : '')} onClick={() => onWagerMPGameData('year', 3)}>Annual</CButton>
              </CButtonGroup>
            </CCol>
          </CRow>
          <CChart
            type="bar"
            height={100}
            data={{
              labels: wagerMPGameData.labels,
              datasets: [
                {
                  label: 'Multi Player',
                  backgroundColor: 'rgb(255, 187, 68)',
                  data: wagerMPGameData.wager,
                },
              ],
            }}
          />
        </CCardBody>
        <CCardFooter>
          <CRow xs={{ cols: 1 }} md={{ cols: 11 }} className="text-center">
            <CCol className="mb-sm-2 mb-0">
              <div className="text-medium-emphasis">Selected Wager: &nbsp;
                <strong>
                  {wagerMPGameData.selWager}
                </strong>
              </div>
            </CCol>
            <CCol className="mb-sm-2 mb-0">
              <div className="text-medium-emphasis">Average Wager: &nbsp;
                <strong>
                  {Number(wagerMPGameData.selWager / wagerMPGameData.selCount).toFixed(1)}
                </strong>
              </div>
            </CCol>
          </CRow>
        </CCardFooter>
      </CCard>

      <CCard className="mb-4">
        <CCardBody>
          <CRow>
            <CCol sm={6}>
              <h4 id="traffic" className="card-title mb-0">
                NFT(CUE) - Total Mint : {totalMintCue}
              </h4>
              <div className="small text-medium-emphasis">{mintData.from} ~ {mintData.to}</div>
            </CCol>
            <CCol sm={6} style={{ textAlign: 'right' }}>
              <CButtonGroup role="group" aria-label="">
                <CButton color={"primary " + (mintActive[0] == true ? 'active' : '')} onClick={() => onNFTMintDate('week', 0, 'CUE')}>Weekly</CButton>
                <CButton color={"primary " + (mintActive[1] == true ? 'active' : '')} onClick={() => onNFTMintDate('month', 1, 'CUE')}>Monthly</CButton>
                <CButton color={"primary " + (mintActive[2] == true ? 'active' : '')} onClick={() => onNFTMintDate('3month', 2, 'CUE')}>3 Monthly</CButton>
                <CButton color={"primary " + (mintActive[3] == true ? 'active' : '')} onClick={() => onNFTMintDate('year', 3, 'CUE')}>Annual</CButton>
              </CButtonGroup>
            </CCol>
          </CRow>
          <CChart
            type="bar"
            height={100}
            data={{
              labels: mintData.labels,
              datasets: [
                {
                  label: 'Mint(CUE)',
                  backgroundColor: 'rgb(74, 193, 142)',
                  data: mintData.mint,
                },
              ],
            }}
          />
        </CCardBody>
        <CCardFooter>
          <CRow xs={{ cols: 1 }} md={{ cols: 4 }} className="text-center">
            {/* {progressExample.map((item, index) => ( */}
            <CCol className="mb-sm-2 mb-0">
              <div className="text-medium-emphasis">Selected Count : &nbsp;
                <strong>
                  {totalSelMintCue}
                </strong>
              </div>

              {/* <CProgress thin className="mt-2" color={item.color} value={item.percent} /> */}
            </CCol>
            {/* ))} */}
          </CRow>
        </CCardFooter>
      </CCard>
      <CCard className="mb-4">
        <CCardBody>
          <CRow>
            <CCol sm={6}>
              <h4 id="traffic" className="card-title mb-0">
                NFT(CARD) - Total Mint : {totalMintCard}
              </h4>
              <div className="small text-medium-emphasis">{mintCardData.from} ~ {mintCardData.to}</div>
            </CCol>
            <CCol sm={6} style={{ textAlign: 'right' }}>
              <CButtonGroup role="group" aria-label="">
                <CButton color={"primary " + (mintCardActive[0] == true ? 'active' : '')} onClick={() => onNFTMintDate('week', 0, 'CARD')}>Weekly</CButton>
                <CButton color={"primary " + (mintCardActive[1] == true ? 'active' : '')} onClick={() => onNFTMintDate('month', 1, 'CARD')}>Monthly</CButton>
                <CButton color={"primary " + (mintCardActive[2] == true ? 'active' : '')} onClick={() => onNFTMintDate('3month', 2, 'CARD')}>3 Monthly</CButton>
                <CButton color={"primary " + (mintCardActive[3] == true ? 'active' : '')} onClick={() => onNFTMintDate('year', 3, 'CARD')}>Annual</CButton>
              </CButtonGroup>
            </CCol>
          </CRow>
          <CChart
            type="bar"
            height={100}
            data={{
              labels: mintCardData.labels,
              datasets: [
                {
                  label: 'Mint(Card)',
                  backgroundColor: 'rgb(74, 193, 142)',
                  data: mintCardData.mint,
                },
              ],
            }}
          />
        </CCardBody>
        <CCardFooter>
          <CRow xs={{ cols: 1 }} md={{ cols: 4 }} className="text-center">
            {/* {progressExample.map((item, index) => ( */}
            <CCol className="mb-sm-2 mb-0">
              <div className="text-medium-emphasis">Selected Count : &nbsp;
                <strong>
                  {totalSelMintCard}
                </strong>
              </div>

              {/* <CProgress thin className="mt-2" color={item.color} value={item.percent} /> */}
            </CCol>
            {/* ))} */}
          </CRow>
        </CCardFooter>
      </CCard>
      <CCard className="mb-4">
        <CCardBody>
          <CRow>
            <CCol sm={8}>
              <h4 id="traffic" className="card-title mb-0">
                Earn(Fee from Cue NFT Market) - Total : {totalEarnMintCueFee[0]} MATIC
              </h4>
              <div className="small text-medium-emphasis">{earnMarketFeeData.from} ~ {earnMarketFeeData.to}</div>
            </CCol>
            <CCol sm={4} style={{ textAlign: 'right' }}>
              <CButtonGroup role="group" aria-label="">
                <CButton color={"primary " + (mintEarnFeeActive[0] == true ? 'active' : '')} onClick={() => onMintEarnDate('week', 0, 'CUE', 'FEE')}>Weekly</CButton>
                <CButton color={"primary " + (mintEarnFeeActive[1] == true ? 'active' : '')} onClick={() => onMintEarnDate('month', 1, 'CUE', 'FEE')}>Monthly</CButton>
                <CButton color={"primary " + (mintEarnFeeActive[2] == true ? 'active' : '')} onClick={() => onMintEarnDate('3month', 2, 'CUE', 'FEE')}>3 Monthly</CButton>
                <CButton color={"primary " + (mintEarnFeeActive[3] == true ? 'active' : '')} onClick={() => onMintEarnDate('year', 3, 'CUE', 'FEE')}>Annual</CButton>
              </CButtonGroup>
            </CCol>
          </CRow>
          <CChart
            type="bar"
            height={100}
            data={{
              labels: earnMarketFeeData.labels,
              datasets: [
                {
                  label: 'Earn',
                  backgroundColor: 'rgb(255, 187, 68)',
                  data: earnMarketFeeData.fee,
                },
              ],
            }}
          />
        </CCardBody>
        <CCardFooter>
          <CRow xs={{ cols: 1 }} md={{ cols: 11 }} className="text-center">
            {/* {progressExample.map((item, index) => ( */}
            <CCol className="mb-sm-2 mb-0">
              <div className="text-medium-emphasis">Earned Amounts During Selected Time Period: &nbsp;
                <strong>
                  {totalEarnMintCueFee[1]}
                </strong>
                &nbsp;MATIC
              </div>

              {/* <CProgress thin className="mt-2" color={item.color} value={item.percent} /> */}
            </CCol>
            {/* ))} */}
          </CRow>
        </CCardFooter>
      </CCard>
      <CCard className="mb-4">
        <CCardBody>
          <CRow>
            <CCol sm={8}>
              <h4 id="traffic" className="card-title mb-0">
                Earn(Owner of Contract Earned By Selling Cue) - Total : {totalEarnMintCue[0]} MATIC
              </h4>
              <div className="small text-medium-emphasis">{earnMarketData.from} ~ {earnMarketData.to}</div>
            </CCol>
            <CCol sm={4} style={{ textAlign: 'right' }}>
              <CButtonGroup role="group" aria-label="">
                <CButton color={"primary " + (mintEarnActive[0] == true ? 'active' : '')} onClick={() => onMintEarnDate('week', 0, 'CUE', 'EARN')}>Weekly</CButton>
                <CButton color={"primary " + (mintEarnActive[1] == true ? 'active' : '')} onClick={() => onMintEarnDate('month', 1, 'CUE', 'EARN')}>Monthly</CButton>
                <CButton color={"primary " + (mintEarnActive[2] == true ? 'active' : '')} onClick={() => onMintEarnDate('3month', 2, 'CUE', 'EARN')}>3 Monthly</CButton>
                <CButton color={"primary " + (mintEarnActive[3] == true ? 'active' : '')} onClick={() => onMintEarnDate('year', 3, 'CUE', 'EARN')}>Annual</CButton>
              </CButtonGroup>
            </CCol>
          </CRow>
          <CChart
            type="bar"
            height={100}
            data={{
              labels: earnMarketData.labels,
              datasets: [
                {
                  label: 'Earn',
                  backgroundColor: 'rgb(255, 187, 68)',
                  data: earnMarketData.earn,
                },
              ],
            }}
          />
        </CCardBody>
        <CCardFooter>
          <CRow xs={{ cols: 1 }} md={{ cols: 11 }} className="text-center">
            {/* {progressExample.map((item, index) => ( */}
            <CCol className="mb-sm-2 mb-0">
              <div className="text-medium-emphasis">Earned Amounts During Selected Time Period: &nbsp;
                <strong>
                  {totalEarnMintCue[1]}
                </strong>
                &nbsp;MATIC
              </div>

              {/* <CProgress thin className="mt-2" color={item.color} value={item.percent} /> */}
            </CCol>
            {/* ))} */}
          </CRow>
        </CCardFooter>
      </CCard>
      <CCard className="mb-4">
        <CCardBody>
          <CRow>
            <CCol sm={8}>
              <h4 id="traffic" className="card-title mb-0">
                Earn(Fee from Card NFT Market) - Total : {totalEarnMintCardFee[0]} MATIC
              </h4>
              <div className="small text-medium-emphasis">{earnMarketCardFeeData.from} ~ {earnMarketCardFeeData.to}</div>
            </CCol>
            <CCol sm={4} style={{ textAlign: 'right' }}>
              <CButtonGroup role="group" aria-label="">
                <CButton color={"primary " + (mintEarnCardFeeActive[0] == true ? 'active' : '')} onClick={() => onMintEarnDate('week', 0, 'CARD', 'FEE')}>Weekly</CButton>
                <CButton color={"primary " + (mintEarnCardFeeActive[1] == true ? 'active' : '')} onClick={() => onMintEarnDate('month', 1, 'CARD', 'FEE')}>Monthly</CButton>
                <CButton color={"primary " + (mintEarnCardFeeActive[2] == true ? 'active' : '')} onClick={() => onMintEarnDate('3month', 2, 'CARD', 'FEE')}>3 Monthly</CButton>
                <CButton color={"primary " + (mintEarnCardFeeActive[3] == true ? 'active' : '')} onClick={() => onMintEarnDate('year', 3, 'CARD', 'FEE')}>Annual</CButton>
              </CButtonGroup>
            </CCol>
          </CRow>
          <CChart
            type="bar"
            height={100}
            data={{
              labels: earnMarketCardFeeData.labels,
              datasets: [
                {
                  label: 'Earn',
                  backgroundColor: 'rgb(255, 187, 68)',
                  data: earnMarketCardFeeData.fee,
                },
              ],
            }}
          />
        </CCardBody>
        <CCardFooter>
          <CRow xs={{ cols: 1 }} md={{ cols: 11 }} className="text-center">
            {/* {progressExample.map((item, index) => ( */}
            <CCol className="mb-sm-2 mb-0">
              <div className="text-medium-emphasis">Earned Amounts During Selected Time Period: &nbsp;
                <strong>
                  {totalEarnMintCardFee[1]}
                </strong>
                &nbsp;MATIC
              </div>

              {/* <CProgress thin className="mt-2" color={item.color} value={item.percent} /> */}
            </CCol>
            {/* ))} */}
          </CRow>
        </CCardFooter>
      </CCard>
      <CCard className="mb-4">
        <CCardBody>
          <CRow>
            <CCol sm={8}>
              <h4 id="traffic" className="card-title mb-0">
                Earn(Owner of Contract Earned By Selling Card) - Total : {totalEarnMintCard[0]} MATIC
              </h4>
              <div className="small text-medium-emphasis">{earnMarketCardData.from} ~ {earnMarketCardData.to}</div>
            </CCol>
            <CCol sm={4} style={{ textAlign: 'right' }}>
              <CButtonGroup role="group" aria-label="">
                <CButton color={"primary " + (mintEarnCardActive[0] == true ? 'active' : '')} onClick={() => onMintEarnDate('week', 0, 'CARD', 'EARN')}>Weekly</CButton>
                <CButton color={"primary " + (mintEarnCardActive[1] == true ? 'active' : '')} onClick={() => onMintEarnDate('month', 1, 'CARD', 'EARN')}>Monthly</CButton>
                <CButton color={"primary " + (mintEarnCardActive[2] == true ? 'active' : '')} onClick={() => onMintEarnDate('3month', 2, 'CARD', 'EARN')}>3 Monthly</CButton>
                <CButton color={"primary " + (mintEarnCardActive[3] == true ? 'active' : '')} onClick={() => onMintEarnDate('year', 3, 'CARD', 'EARN')}>Annual</CButton>
              </CButtonGroup>
            </CCol>
          </CRow>
          <CChart
            type="bar"
            height={100}
            data={{
              labels: earnMarketCardData.labels,
              datasets: [
                {
                  label: 'Earn',
                  backgroundColor: 'rgb(255, 187, 68)',
                  data: earnMarketCardData.earn,
                },
              ],
            }}
          />
        </CCardBody>
        <CCardFooter>
          <CRow xs={{ cols: 1 }} md={{ cols: 11 }} className="text-center">
            {/* {progressExample.map((item, index) => ( */}
            <CCol className="mb-sm-2 mb-0">
              <div className="text-medium-emphasis">Earned Amounts During Selected Time Period: &nbsp;
                <strong>
                  {totalEarnMintCard[1]}
                </strong>
                &nbsp;MATIC
              </div>

              {/* <CProgress thin className="mt-2" color={item.color} value={item.percent} /> */}
            </CCol>
            {/* ))} */}
          </CRow>
        </CCardFooter>
      </CCard>
      <CCard className="mb-4">
        <CCardBody>
          <CRow>
            <CCol sm={8}>
              <h4 id="traffic" className="card-title mb-0">
                SKILL - Total Earn By Betting Game : {totalSportEarn} SPORT ({totalSportUsdEarn} $)
              </h4>
              <div className="small text-medium-emphasis">{earnDataBet.from} ~ {earnDataBet.to}</div>
            </CCol>
            <CCol sm={4} style={{ textAlign: 'right' }}>
              <CButtonGroup role="group" aria-label="">
                <CButton color={"primary " + (earnActive[0] == true ? 'active' : '')} onClick={() => onEarnDate('week', 0, 'BET', 'SPORT')}>Weekly</CButton>
                <CButton color={"primary " + (earnActive[1] == true ? 'active' : '')} onClick={() => onEarnDate('month', 1, 'BET', 'SPORT')}>Monthly</CButton>
                <CButton color={"primary " + (earnActive[2] == true ? 'active' : '')} onClick={() => onEarnDate('3month', 2, 'BET', 'SPORT')}>3 Monthly</CButton>
                <CButton color={"primary " + (earnActive[3] == true ? 'active' : '')} onClick={() => onEarnDate('year', 3, 'BET', 'SPORT')}>Annual</CButton>
              </CButtonGroup>
            </CCol>
          </CRow>
          <CChart
            type="bar"
            height={100}
            data={{
              labels: earnDataBet.labels,
              datasets: [
                {
                  label: 'Earn(Bet)',
                  backgroundColor: 'rgb(255, 187, 68)',
                  data: earnDataBet.earn,
                },
              ],
            }}
            options={{
              plugins: {
                tooltip: {
                  callbacks: {
                    label: function (context) {
                      // console.log(context)
                      let label = context.dataset.label || '';

                      if (label) {
                        label += ': ';
                      }
                      if (context.parsed.y !== null) {
                        label += context.parsed.y.toFixed(10) + 'SPORT';
                      }
                      return label;
                    }
                  }
                }
              }
            }}
          />
        </CCardBody>

        <CCardFooter>
          <CRow xs={{ cols: 1 }} md={{ cols: 11 }} className="text-center">
            {/* {progressExample.map((item, index) => ( */}
            <CCol className="mb-sm-4 mb-0">
              <div className="text-medium-emphasis">Earned Amounts During Selected Time Period: &nbsp;
                <strong>
                  {totalSportSel}
                </strong>
                &nbsp; SPORT (
                <strong>
                  {totalSportUsdSel}
                </strong>
                $)

              </div>

              {/* <CProgress thin className="mt-2" color={item.color} value={item.percent} /> */}
            </CCol>
            {/* ))} */}
          </CRow>
        </CCardFooter>
      </CCard>
      <CCard className="mb-4">
        <CCardBody>
          <CRow>
            <CCol sm={6}>
              <h4 id="traffic" className="card-title mb-0">
                SKILL - TotalSupply : {totalSport} &nbsp; SPORT
              </h4>
              <div className="small text-medium-emphasis">{mintSportData.from} ~ {mintSportData.to}</div>
            </CCol>
            <CCol sm={6} style={{ textAlign: 'right' }}>
              <CButtonGroup role="group" aria-label="">
                <CButton color={"primary " + (mintSportActive[0] == true ? 'active' : '')} onClick={() => onMintDate('week', 0, 'SPORT')}>Weekly</CButton>
                <CButton color={"primary " + (mintSportActive[1] == true ? 'active' : '')} onClick={() => onMintDate('month', 1, 'SPORT')}>Monthly</CButton>
                <CButton color={"primary " + (mintSportActive[2] == true ? 'active' : '')} onClick={() => onMintDate('3month', 2, 'SPORT')}>3 Monthly</CButton>
                <CButton color={"primary " + (mintSportActive[3] == true ? 'active' : '')} onClick={() => onMintDate('year', 3, 'SPORT')}>Annual</CButton>
              </CButtonGroup>
            </CCol>
          </CRow>
          <CChart
            type="bar"
            height={100}
            data={{
              labels: mintSportData.labels,
              datasets: [
                {
                  label: 'Mint SPORT',
                  backgroundColor: 'rgb(255, 187, 68)',
                  data: mintSportData.mint,
                },
              ],
            }}
            options={{
              plugins: {
                tooltip: {
                  callbacks: {
                    label: function (context) {
                      // console.log(context)
                      let label = context.dataset.label || '';

                      if (label) {
                        label += ': ';
                      }
                      if (context.parsed.y !== null) {
                        label += context.parsed.y.toFixed(10) + 'SPORT';
                      }
                      return label;
                    }
                  }
                }
              }
            }}
          />
        </CCardBody>
        <CCardFooter>
          <CRow xs={{ cols: 1 }} md={{ cols: 11 }} className="text-center">
            <CCol className="mb-sm-2 mb-0">
              <div className="text-medium-emphasis">Minted Amounts During Selected Time Period: &nbsp;
                <strong>
                  {totalMintSportSel}
                </strong>
                &nbsp; SPORT
              </div>

            </CCol>
          </CRow>
        </CCardFooter>
      </CCard>
      {/* <CRow>
        <CCol xs={3}>
          <CCard className="mb-4">
            <CCardHeader>Total Earn</CCardHeader>
            <CCardBody>
              <CChartDoughnut
                data={{
                  labels: ['', 'Total Earn'],
                  datasets: [
                    {
                      backgroundColor: ['#FFFFFF', '#4ac18e'],
                      data: [40, 60],
                    },
                  ],
                }}
              />
              <CFormRange min="0" max="100" className="mt-4 green-range" defaultValue="60" />
              <CButton style={{ margin: '0px auto', display: 'block', background: '#4ac18e', border: '1px solid #4ac18e' }}>Save</CButton>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol xs={3}>
          <CCard className="mb-4">
            <CCardHeader>Total Mint</CCardHeader>
            <CCardBody>
              <CChartDoughnut
                data={{
                  labels: ['', 'Total Mint'],
                  datasets: [
                    {
                      backgroundColor: ['#FFFFFF', '#ffbb44'],
                      data: [30, 70],
                    },
                  ],
                }}
              />
              <CFormRange min="0" max="100" className="mt-4 yellow-range" defaultValue="70" />
              <CButton style={{ margin: '0px auto', display: 'block', background: '#ffbb44', border: '1px solid #ffbb44' }}>Save</CButton>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol xs={3}>
          <CCard className="mb-4">
            <CCardHeader>Betting Earn</CCardHeader>
            <CCardBody>
              <CChartDoughnut
                data={{
                  labels: ['', 'Total Mint'],
                  datasets: [
                    {
                      backgroundColor: ['#FFFFFF', '#8d6e63'],
                      data: [80, 20],
                    },
                  ],
                }}
              />
              <CFormRange min="0" max="100" className="mt-4 brown-range" defaultValue="20" />
              <CButton style={{ margin: '0px auto', display: 'block', background: '#8d6e63', border: '1px solid #8d6e63' }}>Save</CButton>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol xs={3}>
          <CCard className="mb-4">
            <CCardHeader>Tournaments Earn</CCardHeader>
            <CCardBody>
              <CChartDoughnut
                data={{
                  labels: ['', 'Tournaments Earn'],
                  datasets: [
                    {
                      backgroundColor: ['#FFFFFF', '#90a4ae'],
                      data: [90, 10],
                    },
                  ],
                }}
              />
              <CFormRange min="0" max="100" className="mt-4 gray-range" defaultValue="10" />
              <CButton style={{ margin: '0px auto', display: 'block', background: '#90a4ae', border: '1px solid #90a4ae' }}>Save</CButton>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow> */}
    </>
  )
}

export default Dashboard
