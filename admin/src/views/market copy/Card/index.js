import React from 'react'
import { Button, FormControlLabel, Checkbox, makeStyles, LinearProgress } from '@material-ui/core'
import styles from './style'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { Directions } from '@material-ui/icons'
import { element } from 'prop-types'
import { ethers, providers } from 'ethers'
const { EventEmitter } = require('events')
import { Select, MenuItem, InputBase, CircularProgress } from '@mui/material'
import { styled } from '@mui/material/styles'

const NFTcontractABI = require('../../../ABIs/NFT_CARD.json')
const MarketcontractABI = require('../../../ABIs/Marketplace_CARD.json')
// const NFTcontractAddress = "0xd95D493b5B048bE25bA70a89AD2360AC5f653a68";
// const MarketcontractAddress = "0x2c8a4c0B41300Df687DFd0c1931AECe146BAE559";
const NFTcontractAddress = '0x4daf37319a02ae027b3165fd625fd5cf22ea622d'
const MarketcontractAddress = '0x39ff109be68aee2dbba16d1acdddde957321303d'
var pendingArray = new Array(100000)

const Web3 = require('web3')

let web3 = new Web3(new Web3.providers.WebsocketProvider('wss://polygon-mumbai.g.alchemy.com/v2/4mg4dqqHfJ7nfo4sELW9PcnPiHXTDD93'))

// const API_URL = "http://localhost:8000";
const API_URL = 'https://versusxapi.net'
const PAGE_SIZE = 10
const METAKEEP_DEV = '0x141a7ca9b5435377EdCf9438e1253DDB968EBf89'

const useStyles = makeStyles(styles)

const BootstrapInput = styled(InputBase)(({ theme }) => ({
  'label + &': {
    marginTop: theme.spacing(3),
  },
  '& .MuiInputBase-input': {
    borderRadius: 4,
    position: 'relative',
    backgroundColor: '#00748d',
    border: '1px solid #00748d',
    color: 'white',
    fontSize: 16,
    padding: '10px 26px 10px 12px',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    // Use the system font instead of the default Roboto font.
    fontFamily: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif', '"Apple Color Emoji"', '"Segoe UI Emoji"', '"Segoe UI Symbol"'].join(','),
    '&:focus': {
      borderRadius: 4,
      borderColor: '#009bb9',
      boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
    },
  },
  '& .MuiSelect-icon': {
    color: 'white',
  },
}))

const myEmitter = new EventEmitter()
let eventvariable = 1
var repeatMarkOwnedCheck = new Array(100000)
var repeatOwnedCheck = new Array(100000)
var repeatMarkCheck = new Array(100000)

const Card = (props) => {
  const classes = useStyles()
  const [sellprice, setPrice] = useState('')
  const [isPending, setIsPending] = useState(0)
  const [showDescrit, setShowDescrit] = useState(0)
  const { collection, name, description, itemId, tokenId, yieldBonus, owned, image, strength, accuracy, control, freeItemDropChance, isActive, price, lastPrice, isAuto, isSelected, count, check, ...rest } = props
  const imgRef = React.useRef(null)
  const [size, setSize] = useState({})

  async function sellNft(id, tokenID, price) {
    try {
      const response = await axios.post(API_URL + '/sendtransaction/v1/SellNFT', {
        Account: process.env.REACT_APP_OWNER_WALLET,
        tokenID: tokenID,
        price: price,
        id: id,
        Type: 'Cue',
        UserID: process.env.REACT_APP_OWNER_FIREBASEID,
        nftContract: collection.nftContract,
      })
      console.log('response->', response.data)
      // dispatch(homeActions.setBalance(address));
      pendingArray[id] = 0
      eventEmit()
      window.location.reload();
    } catch {
      pendingArray[id] = 0
      eventEmit()
      return
    }
  }

  async function removeNft(id, tokenID) {
    try {
      const response = await axios.post(API_URL + '/sendtransaction/v1/RemoveNFT', {
        Account: process.env.REACT_APP_OWNER_WALLET,
        tokenID: tokenID,
        id: id,
        Type: 'Cue',
        UserID: process.env.REACT_APP_OWNER_FIREBASEID,
        nftContract: collection.nftContract,
      })
      console.log('response->', response.data)
      // dispatch(homeActions.setBalance(address));
      pendingArray[id] = 0
      eventEmit()
      window.location.reload();
    } catch {
      pendingArray[id] = 0
      eventEmit()
      return
    }
  }

  async function buyNft(id, price) {
    try {
      const response = await axios.post(API_URL + '/sendtransaction/v1/BuyNFT', {
        Account: process.env.REACT_APP_OWNER_WALLET,
        price: price,
        id: id,
        Type: 'Cue',
        UserID: process.env.REACT_APP_OWNER_FIREBASEID,
        nftContract: collection.nftContract,
      })
      console.log('response->', response.data)
      // dispatch(homeActions.setBalance(address));
      pendingArray[id] = 0
      eventEmit()
      window.location.reload();
    } catch {
      pendingArray[id] = 0
      eventEmit()
      return
    }
  }

  async function cancelNft(id) {
    try {
      const response = await axios.post(API_URL + '/sendtransaction/v1/CancellNFT', {
        Account: process.env.REACT_APP_OWNER_WALLET,
        id: id,
        Type: 'Cue',
        UserID: process.env.REACT_APP_OWNER_FIREBASEID,
        nftContract: collection.nftContract,
      })
      console.log('response->', response.data)
      // dispatch(homeActions.setBalance(address));
      pendingArray[id] = 0
      eventEmit()
      window.location.reload();
    } catch {
      pendingArray[id] = 0
      eventEmit()
      return
    }
  }

  function eventEmit() {
    if (eventvariable == 0) {
      eventvariable++
      myEmitter.emit('event' + eventvariable)
    }
  }

  myEmitter.on('event1', () => {
    setIsPending(1 - isPending)
  })
  function showDescription(e) {
    setShowDescrit(1)
  }
  function hideDescription(e) {
    setShowDescrit(0)
  }
  var countReal = 0
  if (check == 0) {
    countReal = repeatOwnedCheck[count]
  } else if (check == 1) {
    countReal = repeatMarkOwnedCheck[count]
  } else {
    countReal = repeatMarkCheck[count]
  }
  if (countReal > 0) {
    return (
      <div className={`${classes.card} ${isSelected ? classes.selected_card : ''}`} {...rest}>
        <div className="first-div">
          <div>
            <h3 onMouseOver={showDescription} onMouseOut={hideDescription}>
              {name}
            </h3>
            <div>
              <p>{yieldBonus} Yield Bonus</p>
              <LinearProgress variant="determinate" value={yieldBonus} />
            </div>
          </div>
          <h4 style={{ textAlign: 'center', padding: '4px 0px', margin: '0px' }}> {showDescrit == 1 ? description : ''}</h4>
          <div style={{ maxWidth: '400px', maxHeight: '30px' }}>
            <img
              ref={imgRef}
              src={image}
              alt=""
              style={{ width: size.width, height: size.height }}
              onLoad={(event) => {
                if (event.target.naturalHeight / event.target.naturalWidth > 30 / 400) {
                  setSize({
                    height: 30,
                    width: (event.target.naturalWidth * 30) / event.target.naturalHeight,
                  })
                } else {
                  setSize({
                    height: (event.target.naturalHeight * 400) / event.target.naturalWidth,
                    width: 400,
                  })
                }
              }}
            />
          </div>
        </div>
        <div>
          <span style={{ width: '100%', textAlign: 'center', color: 'white', fontSize: '20px', display: 'block', paddingTop: '30px' }}>{countReal > 1 ? countReal : ''}</span>
        </div>
        <div>
          <Power power={strength} label="Strength" />
          <Power power={accuracy} label="Accuracy" />
          <Power power={control} label="Control" />
          <Power power={freeItemDropChance} label="Free Item Drop Chance" />
        </div>
        <div>
          {pendingArray[itemId] > 0 ? (
            <div style={{ flexDirection: 'column', alignItems: 'center' }}>
              {isActive ? (
                <>
                  <div>
                    <Button id="upgrade" style={{ width: '10px' }} onClick={() => { }}>
                      {pendingArray[itemId] == 1 ? 'Pending' : 'Sell'}
                    </Button>
                    <input type="text" placeholder="0.00" value={''} style={{ width: '50px', height: '20px', margin: '5px 5px' }} />
                    <label style={{ width: '30px', height: '20px', margin: '5px 0px' }}>{'MATIC'}</label>
                  </div>
                  <div style={{ paddingTop: '5px' }}>
                    <span>{'Last Price : '}</span>
                    <img src="/images/token.png" alt="" />
                    <span>{lastPrice + ' MATIC'}</span>
                  </div>
                  <div>
                    <Button id="upgrade" style={{ width: '10px', background: '#752f2f', width: '140px' }}>
                      {pendingArray[itemId] == 2 ? 'Pending' : 'Remove Card'}
                    </Button>
                  </div>
                </>
              ) : (
                <Button id="buy">
                  Pending
                  <img src="/images/token.png" alt="" />
                  <span>{price + ' MATIC'}</span>
                </Button>
              )}
            </div>
          ) : (
            <div style={{ flexDirection: 'column', alignItems: 'center' }}>
              {isActive ? (
                <>
                  <div>
                    <Button
                      id="upgrade"
                      style={{ width: '10px' }}
                      onClick={() => {
                        if (Number(sellprice) > 0) {
                          eventvariable = 0
                          pendingArray[itemId] = 1
                          setIsPending(1 - isPending)
                          sellNft(itemId, tokenId, sellprice)
                          setPrice(0)
                        }
                      }}
                    >
                      Sell
                    </Button>
                    <input type="text" placeholder="0.00" onChange={(event) => setPrice(event.target.value)} style={{ width: '50px', height: '20px', margin: '5px 5px' }} />
                    <label style={{ width: '30px', height: '20px', margin: '5px 0px' }}>{'MATIC'}</label>
                  </div>
                  <div style={{ paddingTop: '5px' }}>
                    <span>{'Last Price : '}</span>
                    <img src="/images/token.png" alt="" />
                    <span>{lastPrice + ' MATIC'}</span>
                  </div>
                  <div>
                    <Button
                      id="upgrade"
                      style={{ width: '10px', background: '#752f2f', width: '140px' }}
                      onClick={() => {
                        eventvariable = 0
                        pendingArray[itemId] = 2
                        setIsPending(1 - isPending)
                        removeNft(itemId, tokenId)
                      }}
                    >
                      Remove Card
                    </Button>
                  </div>
                </>
              ) : (
                <div>
                  {owned ? (
                    <Button
                      id="buy"
                      onClick={() => {
                        eventvariable = 0
                        pendingArray[itemId] = 1
                        setIsPending(1 - isPending)
                        cancelNft(itemId)
                      }}
                    >
                      Cancel
                      <img src="/images/token.png" alt="" />
                      <span>{price + ' MATIC'}</span>
                    </Button>
                  ) : (
                    <Button
                      id="buy"
                      onClick={() => {
                        eventvariable = 0
                        pendingArray[itemId] = 1
                        setIsPending(1 - isPending)
                        buyNft(itemId, price)
                      }}
                    >
                      Buy
                      <img src="/images/token.png" alt="" />
                      <span>{price}</span>
                      <span>&nbsp;MATIC</span>
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
        {isSelected && <label>Selected</label>}
      </div>
    )
  } else {
    return <div />
  }
}

const Power = (props) => {
  const classes = useStyles()
  const { power, label } = props

  return (
    <div className={classes.power}>
      {[...Array(20)].map((_, index) => (
        <div key={index} id={power / 5 > index ? 'active' : ''} />
      ))}
      <p>{label}</p>
    </div>
  )
}

const Cards = (props) => {
  const classes = useStyles()
  const [nfts, setNfts] = useState([])
  const [marketNfts, setMarketNfts] = useState([])
  const [marketNftsOwned, setMarketNftsOwned] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')
  const [loaded, setLoaded] = useState(0)
  const [walletAddress, setWalletAddress] = useState(0)
  var TokenContract = new web3.eth.Contract(NFTcontractABI, NFTcontractAddress)
  const { check, sortVal, connected, provider, collection } = props

  const [page, setPage] = useState(1)
  const [pageArray, setPageArray] = useState([])

  if (loaded == 0) {
    setLoaded(1)
    TokenContract.events.Transfer((err, events) => {
      eventListened()
    })
  }
  function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms)
    })
  }
  async function eventListened() {
    // await sleep(15000)
    // try {
    //   if (window.ethereum) {
    //     const addressArray = await window.ethereum.request({
    //       method: 'eth_accounts',
    //     })
    //     if (addressArray.length > 0) {
    //       setWalletAddress(addressArray[0])
    //       loadNFTs(addressArray[0])
    //       loadMarketOwned(addressArray[0])
    //       loadMarket(addressArray[0])
    //     }
    //   }
    // } catch (err) {
    //   return {
    //     address: '',
    //   }
    // }
  }

  useEffect(() => {
    // getCurrentWalletConnected()
    loadNFTs(process.env.REACT_APP_OWNER_WALLET)
    loadMarketOnSale()
  }, [page, check])

  async function getCurrentWalletConnected() {
    try {
      if (window.ethereum) {
        const addressArray = await window.ethereum.request({
          method: 'eth_accounts',
        })

        if (addressArray.length > 0) {
          setWalletAddress(addressArray[0])
          loadNFTs(addressArray[0])
          loadMarketOwned(addressArray[0])
          loadMarket(addressArray[0])
        }
      }
    } catch (err) {
      return {
        address: '',
      }
    }
  }

  async function loadMarketOwned(userAddress) {
    try {
      if (!check /* && connected*/) {
        let data = await marketContract.fetchAllItemsOnSaleOfOwner(userAddress)
        const realItems = await Promise.all(
          data.map(async (i) => {
            let tokenUri
            let meta
            try {
              tokenUri = await nftContract.tokenURI(i.tokenId)
              meta = await axios.get(tokenUri)
            } catch (err) {
              return
            }

            let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
            let lastPrice = ethers.utils.formatUnits(i.lastPrice.toString(), 'ether')
            // let ownedMarketItem = i.owner == address ? 1 : 0;
            //let price = parseInt(i.price);
            let item = {
              price,
              lastPrice,
              itemId: parseInt(i.itemId),
              tokenId: parseInt(i.tokenId),
              lastseller: i.lastSeller,
              owner: i.owner,
              owned: 1,
              image: meta.data.image_url,
              name: meta.data.name,
              description: meta.data.description,
              isActive: false,
              yieldBonus: meta.data.yieldBonus,
              strength: meta.data.strength,
              accuracy: meta.data.accuracy,
              control: meta.data.control,
              freeItemDropChance: meta.data.freeItemDropChance,
            }
            return item
          }),
        )
        var items = []
        for (var i = 0; i < realItems.length; i++) {
          if (realItems[i] != null) {
            items.push(realItems[i])
          }
        }

        if (sortVal > 0) {
          items.sort(function (a, b) {
            try {
              return b.price - a.price
            } catch {
              return 0
            }
          })
        } else {
          items.sort(function (a, b) {
            try {
              return a.price - b.price
            } catch {
              return 0
            }
          })
        }

        for (var i = 0; i < items.length; i++) {
          repeatMarkOwnedCheck[i] = 1
          for (var j = 0; j < i; j++) {
            if (items[i].price === items[j].price && items[i].image === items[j].image && items[i].name === items[j].name && items[i].description === items[j].description && items[i].yieldBonus === items[j].yieldBonus && items[i].strength === items[j].strength && items[i].accuracy === items[j].accuracy && items[i].control === items[j].control && items[i].freeItemDropChance === items[j].freeItemDropChance && repeatMarkOwnedCheck[j] > 0) {
              repeatMarkOwnedCheck[i] = 0
              repeatMarkOwnedCheck[j] += 1
              break
            }
          }
        }
        setMarketNftsOwned(items)
        setLoadingState('loaded')
        // const { ethereum } = window;
        // if (ethereum) {
        //   const chainIDBuffer = await ethereum.networkVersion;
        //   if(chainIDBuffer == 80001){
        //     const provider = new ethers.providers.Web3Provider(ethereum);
        //     const signer = provider.getSigner();
        //     const nftContract = new ethers.Contract(NFTcontractAddress, NFTcontractABI, signer);
        //     const marketContract = new ethers.Contract(MarketcontractAddress, MarketcontractABI, signer);

        //   }
        // }
      }
    } catch (err) {
      return
    }
  }

  async function loadMarket(userAddress) {
    try {
      if (!check && connected) {
        const { ethereum } = window
        if (ethereum) {
          const chainIDBuffer = await ethereum.networkVersion
          if (chainIDBuffer == 80001) {
            const provider = new ethers.providers.Web3Provider(ethereum)
            const signer = provider.getSigner()
            const nftContract = new ethers.Contract(NFTcontractAddress, NFTcontractABI, signer)
            const marketContract = new ethers.Contract(MarketcontractAddress, MarketcontractABI, signer)
            let data = await marketContract.fetchAllItemsOnSaleOfNotOwner(userAddress)
            const realItems = await Promise.all(
              data.map(async (i) => {
                let tokenUri
                let meta
                try {
                  tokenUri = await nftContract.tokenURI(i.tokenId)
                  meta = await axios.get(tokenUri)
                } catch (err) {
                  return
                }

                let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
                let lastPrice = ethers.utils.formatUnits(i.lastPrice.toString(), 'ether')
                // let ownedMarketItem = i.owner == address ? 1 : 0;
                //let price = parseInt(i.price);
                let item = {
                  price,
                  lastPrice,
                  itemId: parseInt(i.itemId),
                  tokenId: parseInt(i.tokenId),
                  lastseller: i.lastSeller,
                  owner: i.owner,
                  owned: 0,
                  image: meta.data.image_url,
                  name: meta.data.name,
                  description: meta.data.description,
                  isActive: false,
                  yieldBonus: meta.data.yieldBonus,
                  strength: meta.data.strength,
                  accuracy: meta.data.accuracy,
                  control: meta.data.control,
                  freeItemDropChance: meta.data.freeItemDropChance,
                }
                return item
              }),
            )
            var items = []
            for (var i = 0; i < realItems.length; i++) {
              if (realItems[i] != null) {
                items.push(realItems[i])
              }
            }
            if (sortVal > 0) {
              items.sort(function (a, b) {
                try {
                  return b.price - a.price
                } catch {
                  return 0
                }
              })
            } else {
              items.sort(function (a, b) {
                try {
                  return a.price - b.price
                } catch {
                  return 0
                }
              })
            }
            for (var i = 0; i < items.length; i++) {
              repeatMarkCheck[i] = 1
              for (var j = 0; j < i; j++) {
                if (items[i].price === items[j].price && items[i].image === items[j].image && items[i].name === items[j].name && items[i].description === items[j].description && items[i].yieldBonus === items[j].yieldBonus && items[i].strength === items[j].strength && items[i].accuracy === items[j].accuracy && items[i].control === items[j].control && items[i].freeItemDropChance === items[j].freeItemDropChance && repeatMarkCheck[j] > 0) {
                  repeatMarkCheck[i] = 0
                  repeatMarkCheck[j] += 1
                  break
                }
              }
            }

            setMarketNfts(items)
            setLoadingState('loaded')
          }
        }
      }
    } catch (err) {
      return
    }
  }

  async function loadMarketOnSale() {
    try {
      if (!check /* && connected*/) {
        // let data = await marketContract.fetchAllItemsOnSaleOfNotOwner(userAddress)
        setLoadingState('not-loaded')
        let axiosResp = await axios({
          method: 'post',
          url: API_URL + '/api/v1/fetchAllItemsOnSale',
          data: {
            nftAddr: collection.nftContract,
            page: page - 1,
          },
          headers: {
            'Content-Type': `application/json`,
          },
        })
        let data = axiosResp.data['data']
        let count = axiosResp.data['count']
        let tPage = Math.ceil(count / PAGE_SIZE)
        let tempPages = []
        for (let i = 0; i < tPage; i++) {
          tempPages.push(i + 1 + '')
        }
        setPageArray(tempPages)
        const realItems = await Promise.all(
          data.map(async (i) => {
            let tokenUri
            let meta
            try {
              // tokenUri = await nftContract.tokenURI(i.tokenId)
              // meta = await axios.get(tokenUri)
              let axiosDetailResp = await axios({
                method: 'post',
                url: API_URL + '/api/v1/fetchNftDetails',
                data: { Id: i.tokenId, nftContract: i.nftContract },
                headers: {
                  'Content-Type': `application/json`,
                },
              })
              meta = axiosDetailResp
            } catch (err) {
              return
            }

            let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
            let lastPrice = ethers.utils.formatUnits(i.lastPrice.toString(), 'ether')
            // let ownedMarketItem = i.owner == address ? 1 : 0;
            //let price = parseInt(i.price);
            let item = {
              price,
              lastPrice,
              itemId: parseInt(i.itemId),
              tokenId: parseInt(i.tokenId),
              lastseller: i.lastSeller,
              owner: i.owner,
              owned: i.owner == process.env.REACT_APP_OWNER_WALLET ? 1 : 0,
              image: meta.data.image_url,
              name: meta.data.name,
              description: meta.data.description,
              isActive: false,
              yieldBonus: meta.data.yieldBonus,
              strength: meta.data.strength,
              accuracy: meta.data.accuracy,
              control: meta.data.control,
              freeItemDropChance: meta.data.freeItemDropChance,
            }
            return item
          }),
        )
        var items = []
        for (var i = 0; i < realItems.length; i++) {
          if (realItems[i] != null) {
            items.push(realItems[i])
          }
        }
        if (sortVal > 0) {
          items.sort(function (a, b) {
            try {
              return b.price - a.price
            } catch {
              return 0
            }
          })
        } else {
          items.sort(function (a, b) {
            try {
              return a.price - b.price
            } catch {
              return 0
            }
          })
        }
        for (var i = 0; i < items.length; i++) {
          repeatMarkCheck[i] = 1
          for (var j = 0; j < i; j++) {
            if (items[i].price === items[j].price && items[i].image === items[j].image && items[i].name === items[j].name && items[i].description === items[j].description && items[i].yieldBonus === items[j].yieldBonus && items[i].strength === items[j].strength && items[i].accuracy === items[j].accuracy && items[i].control === items[j].control && items[i].freeItemDropChance === items[j].freeItemDropChance && repeatMarkCheck[j] > 0) {
              repeatMarkCheck[i] = 0
              repeatMarkCheck[j] += 1
              break
            }
          }
        }

        setMarketNfts(items)
        setLoadingState('loaded')
        // const { ethereum } = window
        // if (ethereum) {
        //   const chainIDBuffer = await ethereum.networkVersion
        //   if (chainIDBuffer == 80001) {
        //     const provider = new ethers.providers.Web3Provider(ethereum)
        //     const signer = provider.getSigner()
        //     const nftContract = new ethers.Contract(NFTcontractAddress, NFTcontractABI, signer)
        //     const marketContract = new ethers.Contract(MarketcontractAddress, MarketcontractABI, signer)

        //   }
        // }
      }
    } catch (err) {
      setLoadingState('loaded')
      return
    }
  }

  async function loadNFTs(userAddress) {
    try {
      if (check /* && connected*/) {
        setLoadingState('not-loaded')
        // let data = await marketContract.fetchAllItemsOnUseOfOwner(userAddress)
        let axiosResp = await axios({
          method: 'post',
          url: API_URL + '/api/v1/fetchAllItemsOnUseOfOwner',
          data: {
            owner: userAddress,
            nftAddr: collection.nftContract,
            page: page - 1,
          },
          headers: {
            'Content-Type': `application/json`,
          },
        })
        let data = axiosResp.data['data']
        let count = axiosResp.data['count']
        let tPage = Math.ceil(count / PAGE_SIZE)
        let tempPages = []
        for (let i = 0; i < tPage; i++) {
          tempPages.push(i + 1 + '')
        }
        setPageArray(tempPages)
        const realItems = await Promise.all(
          data.map(async (i) => {
            let tokenUri
            let meta
            try {
              // tokenUri = await nftContract.tokenURI(i.tokenId)

              // meta = await axios.get(tokenUri)
              let axiosDetailResp = await axios({
                method: 'post',
                url: API_URL + '/api/v1/fetchNftDetails',
                data: { Id: i.tokenId, nftContract: i.nftContract },
                headers: {
                  'Content-Type': `application/json`,
                },
              })
              meta = axiosDetailResp
            } catch (err) {
              return
            }

            let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
            let lastPrice = ethers.utils.formatUnits(i.lastPrice.toString(), 'ether')
            //let price = parseInt(i.price);

            let item = {
              price,
              lastPrice,
              itemId: parseInt(i.itemId),
              tokenId: parseInt(i.tokenId),
              lastseller: i.lastSeller,
              owner: i.owner,
              image: meta.data.image_url,
              name: meta.data.name,
              description: meta.data.description,
              isActive: true,
              yieldBonus: meta.data.yieldBonus,
              strength: meta.data.strength,
              accuracy: meta.data.accuracy,
              control: meta.data.control,
              freeItemDropChance: meta.data.freeItemDropChance,
              isAuto: false,
            }

            return item
          }),
        )
        var items = []
        for (var i = 0; i < realItems.length; i++) {
          if (realItems[i] != null) {
            items.push(realItems[i])
          }
        }
        if (sortVal > 0) {
          items.sort(function (a, b) {
            try {
              return b.price - a.price
            } catch {
              return 0
            }
          })
        } else {
          items.sort(function (a, b) {
            try {
              return a.price - b.price
            } catch {
              return 0
            }
          })
        }
        for (var i = 0; i < items.length; i++) {
          repeatOwnedCheck[i] = 1
          for (var j = 0; j < i; j++) {
            if (items[i].lastPrice === items[j].lastPrice && items[i].image === items[j].image && items[i].name === items[j].name && items[i].description === items[j].description && items[i].yieldBonus === items[j].yieldBonus && items[i].strength === items[j].strength && items[i].accuracy === items[j].accuracy && items[i].control === items[j].control && items[i].freeItemDropChance === items[j].freeItemDropChance && repeatOwnedCheck[j] > 0) {
              repeatOwnedCheck[i] = 0
              repeatOwnedCheck[j] += 1
              break
            }
          }
        }

        setNfts(items)
        setLoadingState('loaded')
        // const { ethereum } = window
        // if (ethereum) {
        //   const chainIDBuffer = await ethereum.networkVersion
        //   if (chainIDBuffer == 80001) {
        //     const provider = new ethers.providers.Web3Provider(ethereum)
        //     const signer = provider.getSigner()
        //     const nftContract = new ethers.Contract(NFTcontractAddress, NFTcontractABI, signer)
        //     const marketContract = new ethers.Contract(MarketcontractAddress, MarketcontractABI, signer)

        //   }
        // }
      }
    } catch (err) {
      setLoadingState('loaded')
      return
    }
  }

  const [selected, setSelected] = React.useState(0)
  //const [showDescription, setShowDescription] = React.useState(0);
  //if (loadingState === 'loaded' && !nfts.length&&!marketNfts.length) return (<h1>No items in marketplace</h1>)
  return (
    <>
      <div style={{ alignSelf: 'start' }}>
        {pageArray.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ color: 'white', fontSize: '18px' }}>Page: </span>
            <Select
              value={page}
              onChange={(event) => {
                setPage(parseInt(event.target.value))
              }}
              displayEmpty
              input={<BootstrapInput />}
            >
              {pageArray.map((e) => {
                return <MenuItem value={e}>{e}</MenuItem>
              })}
            </Select>
            {loadingState == 'not-loaded' && (
              <CircularProgress
                color="inherit"
                style={{
                  width: '30px',
                  height: '30px',
                  color: 'white',
                  marginLeft: '10px',
                }}
              />
            )}
          </div>
        )}
      </div>
      {loadingState == 'loaded' && (
        <div className={classes.hero}>
          {check === 1 &&
            nfts.map((card, index) => (
              //if(repeatOwnedCheck[index] > 0){
              <Card
                key={index}
                itemId={card.itemId}
                tokenId={card.tokenId}
                name={card.name}
                description={card.description}
                yieldBonus={card.yieldBonus}
                image={card.image}
                strength={card.strength}
                accuracy={card.accuracy}
                control={card.control}
                freeItemDropChance={card.freeItemDropChance}
                isActive={card.isActive}
                price={card.price}
                lastPrice={card.lastPrice}
                isAuto={card.isAuto}
                count={index}
                check={0}
                isSelected={selected === index}
                onClick={() => setSelected(index)}
              // showDescription = {showDescription}
              // onmouseover = {()=> setShowDescription(1)}
              // onmouseout = {()=> setShowDescription(0)}
              />
              // }
            ))}
          {/* {check === 0 && marketNftsOwned.map((card, index) => <Card key={nfts.length + index} itemId={card.itemId} tokenId={card.tokenId} name={card.name} description={card.description} owned={card.owned} yieldBonus={card.yieldBonus} image={card.image} strength={card.strength} accuracy={card.accuracy} control={card.control} freeItemDropChance={card.freeItemDropChance} isActive={card.isActive} price={card.price} lastPrice={card.lastPrice} count={index} check={1} isSelected={selected === nfts.length + index} onClick={() => setSelected(nfts.length + index)} />)} */}
          {check === 0 && marketNfts.map((card, index) => <Card key={nfts.length + marketNftsOwned.length + index} itemId={card.itemId} tokenId={card.tokenId} name={card.name} description={card.description} owned={card.owned} yieldBonus={card.yieldBonus} image={card.image} strength={card.strength} accuracy={card.accuracy} control={card.control} freeItemDropChance={card.freeItemDropChance} isActive={card.isActive} price={card.price} lastPrice={card.lastPrice} count={index} check={2} isSelected={selected === nfts.length + marketNftsOwned.length + index} onClick={() => setSelected(nfts.length + marketNftsOwned.length + index)} />)}
        </div>
      )}
    </>
  )
}

export default Cards
