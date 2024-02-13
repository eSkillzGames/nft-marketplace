import React from 'react'
import { makeStyles } from '@material-ui/core'
import styles from './style'
import { useState } from 'react'
import axios from 'axios'
import { ethers } from 'ethers'
import { CSpinner, CButton, CFormInput } from '@coreui/react'

const Web3 = require('web3')
const MarketContractInfo = require('./../../../ABIs/VersusXMarket.json')

let web3 = new Web3(process.env.REACT_APP_INFURA_KEY);
let MarketContract = new web3.eth.Contract(MarketContractInfo.abi, process.env.REACT_APP_MARKETPLACE);

// const API_URL = 'http://localhost:8000'
const API_URL = "https://versusxapi.net";
const PAGE_SIZE = 10

const useStyles = makeStyles(styles)

const GeneralNFT = (props) => {
  const classes = useStyles()
  const [sellprice, setPrice] = useState('')
  const [isPending, setIsPending] = useState(false)
  const [showDescrit, setShowDescrit] = useState(0)
  const { nft, isBuy } = props
  const imgRef = React.useRef(null)
  const [size, setSize] = useState({})

  async function sellNft(tokenId, nftType, nftContract, price) {
    try {
      setIsPending(true);
      var count = await web3.eth.getTransactionCount(process.env.REACT_APP_TREASURY_ADDRESS, "latest"); //get latest nonce
      var nonce = count;
      var gasPrice = 80000000000;

      let sendprice = ethers.utils.parseUnits(price.toString(), 'ether');
      let tx = MarketContract.methods.listItemOnSale(tokenId + "", nftType == "ERC721" ? "0" : "1", nftContract, sendprice.toString());
      let data = tx.encodeABI();
      let gas = await tx.estimateGas({
        from: process.env.REACT_APP_TREASURY_ADDRESS,
        to: process.env.REACT_APP_MARKETPLACE,
        data,
        value: ethers.utils.parseUnits('0.0025', 'ether').toString(),
        nonce,
      });
      let signedTx = await web3.eth.accounts.signTransaction(
        {
          from: process.env.REACT_APP_TREASURY_ADDRESS,
          to: process.env.REACT_APP_MARKETPLACE,
          data,
          gas: gas * 2,
          gasPrice,
          value: ethers.utils.parseUnits('0.0025', 'ether').toString(),
          nonce,
        },
        process.env.REACT_APP_TREASURY_PRIVATEKEY
      );
      let transactionReceipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

      console.log(transactionReceipt);
      setIsPending(false);
      props.onSell();
      return transactionReceipt.logs[0].address;
    }
    catch (err) {
      console.log(err);
      setIsPending(false);
      return "";
    }
  }

  async function removeNft(id, tokenID) {
    try {
      const response = await axios.post(
        API_URL + "/sendtransaction/v1/RemoveNFT",
        {
          Account: process.env.REACT_APP_OWNER_WALLET,
          tokenID: tokenID,
          id: id,
          Type: "Cue",
          UserID: process.env.REACT_APP_OWNER_FIREBASEID,
          nftContract: collection.nftContract,
        }
      );
      console.log("response->", response.data);
      // dispatch(homeActions.setBalance(address));
      window.location.reload();
      pendingArray[id] = 0;
      eventEmit();
    } catch {
      pendingArray[id] = 0;
      eventEmit();
      return;
    }
  }

  async function buyNft(itemId, nftType, nftContract, price) {
    try {
      setIsPending(true);
      var count = await web3.eth.getTransactionCount(process.env.REACT_APP_TREASURY_ADDRESS, "latest"); //get latest nonce
      var nonce = count;
      var gasPrice = 80000000000;

      let tx = MarketContract.methods.sellMarketItem(itemId + "", nftType == "ERC721" ? "0" : "1", nftContract);
      let data = tx.encodeABI();
      let gas = await tx.estimateGas({
        from: process.env.REACT_APP_TREASURY_ADDRESS,
        to: process.env.REACT_APP_MARKETPLACE,
        data,
        value: price,
        nonce,
      });
      let signedTx = await web3.eth.accounts.signTransaction(
        {
          from: process.env.REACT_APP_TREASURY_ADDRESS,
          to: process.env.REACT_APP_MARKETPLACE,
          data,
          gas: gas * 2,
          gasPrice,
          value: price,
          nonce,
        },
        process.env.REACT_APP_TREASURY_PRIVATEKEY
      );
      let transactionReceipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

      console.log(transactionReceipt);
      setIsPending(false);
      props.onBuy();
      return transactionReceipt.logs[0].address;
    }
    catch (err) {
      console.log(err);
      setIsPending(false);
      return "";
    }
  }

  async function cancelNft(itemId) {
    try {
      setIsPending(true);
      var count = await web3.eth.getTransactionCount(process.env.REACT_APP_TREASURY_ADDRESS, "latest"); //get latest nonce
      var nonce = count;
      var gasPrice = 80000000000;

      let tx = MarketContract.methods.listItemCancelOnSale(itemId + "");
      let data = tx.encodeABI();
      let gas = await tx.estimateGas({
        from: process.env.REACT_APP_TREASURY_ADDRESS,
        to: process.env.REACT_APP_MARKETPLACE,
        data,
        nonce,
      });
      let signedTx = await web3.eth.accounts.signTransaction(
        {
          from: process.env.REACT_APP_TREASURY_ADDRESS,
          to: process.env.REACT_APP_MARKETPLACE,
          data,
          gas: gas * 2,
          gasPrice,
          nonce,
        },
        process.env.REACT_APP_TREASURY_PRIVATEKEY
      );
      let transactionReceipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

      console.log(transactionReceipt);
      setIsPending(false);
      props.onCancel();
      return transactionReceipt.logs[0].address;
    }
    catch (err) {
      console.log(err);
      setIsPending(false);
      return "";
    }
  }

  return (
    <div className={`${classes.cue}`}>
      <div style={{
        maxWidth: "400px",
      }}>
        <h4>
          {nft.title} {nft.balance && props.collection.collection_type == "ERC1155" ? `(${nft.balance})` : ""}
        </h4>
        <h6 style={{ padding: '4px 0px', margin: '0px' }}> {nft.description}</h6>

        <img
          ref={imgRef}
          src={nft.thumbnail}
          alt=""
          width={"100px"}
          height={"fit-content"}
        />
      </div>
      <div>
        {isPending == false ? (
          <div style={{ flexDirection: 'column', alignItems: 'center' }}>
            {isBuy ? (
              <>
                {nft.price && (<div>{ethers.utils.formatEther(nft.price).toString()} MATIC</div>)}
                <CButton
                  id="buy"
                  color="danger"
                  onClick={() => {
                    if (nft.isOwned) {
                      cancelNft(nft.itemId)
                    } else {
                      buyNft(nft.itemId, props.collection.collection_type, nft.address, nft.price)
                    }
                  }}
                >
                  {nft.isOwned ? "Cancel" : "Buy"}
                </CButton>
              </>) : (
              <>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <label style={{}}>{'MATIC'}</label>
                  <CFormInput type="text" placeholder="0.00" onChange={(event) => setPrice(event.target.value)} className='mx-2' style={{ width: "80px" }} />

                  <CButton color="info" onClick={() => {
                    if (Number(sellprice) > 0) {
                      sellNft(nft.id, props.collection.collection_type, nft.address, sellprice)
                    }
                  }}>Sell</CButton>
                </div>
                {/* <div style={{ paddingTop: '5px' }}>
              <span>{'Last Price : '}</span>
              <img src="/images/token.png" alt="" />
              <span>{lastPrice + ' MATIC'}</span>
            </div> */}
                {/* <div style={{ marginTop: "8px", textAlign: "right" }}>
                  <CButton color="warning" onClick={() => {
                    removeNft(nft.id, tokenId)
                  }}>Remove</CButton>
                </div> */}
              </>
            )}
          </div>
        ) : (
          <CSpinner color="light" />

        )}
      </div>
    </div>
  )
}

export default GeneralNFT
