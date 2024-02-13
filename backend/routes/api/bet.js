const express = require('express');
const axios = require('axios');
const router = express.Router();
const Web3 = require('web3');
const { ethers, utils } = require('ethers');
require('dotenv').config();
const CONFIG = require('./../../config')

// fierbase
const moment = require("moment");
const { initializeApp } = require('firebase/app');
const {
  collectionGroup,
  initializeFirestore,
  getFirestore,
  collection,
  query,
  limit,
  getDocs,
  doc,
  getDoc,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  deleteField,
  arrayUnion,
  where
} = require('firebase/firestore');

const app = initializeApp(CONFIG.FIREBASE);
const db = initializeFirestore(app, {
  experimentalAutoDetectLongPolling: true
});

const options = {
  reconnect: {
    auto: true,
    delay: 5000, // ms
    maxAttempts: 5,
    onTimeout: false
  },
  keepAlive: true,
  timeout: 20000,
  headers: [{ name: 'Access-Control-Allow-Origin', value: '*' }],
  withCredentials: false
};

// db
const knex = require('knex')(CONFIG.MYSQL);

// metakeep
/* Init SDK */
// const sdk = new MetaKeepModule.MetaKeep({
//   appId: process.env.METAKEEP_APP_ID,
//   chainId: 80001,
//   rpcNodeUrls: {
//       80001: "https://matic-mumbai.chainstacklabs.com"
//   }
// });
// var web3;

const METAKEEP_API_KEY = process.env.METAKEEP_API_KEY;
const UNISWAPADDRESS = process.env.UNISWAPADDRESS;
const infuraKey = process.env.REACT_INFURA_KEY;
const TreasuryWallet = process.env.TREASURY_WALLET_ADDRESS;
const SportTokenAddress = process.env.SPORT_TOKEN_ADDRESS;
const MaticAddress = process.env.MATIC_ADDRESS;
const FactoryAddress = "0x5757371414417b8c6caad45baef941abc7d3ab32";

const sportContract = require('../../abi/Sport_m.json');
const betContract = require('../../abi/Bet_m.json');
const nftBetContract = require('../../abi/NFTBet_m.json');
const tournamentContract = require('../../abi/Tournament_m.json');
const nftContract = require('../../abi/NFT_m1.json');
const marketplaceContract = require('../../abi/Marketplace_m1.json');
const getPriceContract = require('../../abi/GetPrice_m.json');
const tokenABI = require('../../abi/Token.json');
const proxyMetaContract = require('../../abi/ProxyMeta.json');
const marketGetDataContract = require('../../abi/MarketGetData.json');
const MToken = require('../../abi/TestToken.json');

// lambda
// var BetLambda = "0xCbd16025e415bdB8F8d3e7C73018FE34992acd1C";
var BetLambda = "0x8d02978eC75815874aba5E0D1Abd6eB0F1E67d6E";
var NFTBetLambda = "0x43d6D110ce612f5C6d9e6cF66B112aAf48957A82";
var SkillLambda = "0xec1E041B32898b8a33F5a7789226f9d64c7ed287";

var MarketplaceLambda = "0xCb23906630411090085a2e7B1225ec5e433653B1";
var NFTLambda = '0xA38638EdD0BAF1F40431A84F6e70516e6a6b8De2'; //Cue

var TournamentLambda = "0x33168dF37A320830684Ad7B958489B625Fb936D0";
var GetPriceLambda = "0x29d9dc2174539e2cA077Fa70aC802158cc5D5F70"

var ProxyMetaLambda = "0x29d9dc2174539e2cA077Fa70aC802158cc5D5F70"
var MarketGetDataLambda = "0xCc1580c9716A6A08ffb0F5E8E93c7fafFe469d47";

// let web3 = new Web3(new Web3.providers.HttpProvider('https://rpc-mumbai.maticvigil.com', options));
let web3 = new Web3(infuraKey);
const provider = new ethers.providers.JsonRpcProvider(infuraKey);
const etherInterfaceNFT = new ethers.utils.Interface(nftContract.abi);
const etherInterfaceMarket = new ethers.utils.Interface(marketplaceContract.abi);

let nftTempContract = new web3.eth.Contract(nftContract.abi, "0x0Ae71D3fAe3200F12b6401a0FDb030a5Bed616b5");

var sportContract1;
const sportABI = require('../../abi/Sport.json');
sportContract1 = new web3.eth.Contract(sportABI, SportTokenAddress);

var marketCueContract;
const marketCueABI = require('../../abi/Marketplace.json');
marketCueContract = new web3.eth.Contract(marketCueABI, process.env.MARKET_CONTRACT_ADDRESS);

const MarketContractInfo = require('./../../abi/VersusXMarket.json')
let MarketContract = new web3.eth.Contract(MarketContractInfo.abi, process.env.VERSUSX_MARKET_ADDRESS);

const VersusX721Info = require('./../../abi/VersusX721.json')
const VersusX1155Info = require('./../../abi/VersusX1155.json')

function encrypt(pri_key) {
  try {
    if (pri_key.length == 66) {
      var keybuffer = pri_key.substr(2, 64);
      var temp = new Array(4);
      temp[0] = keybuffer.substr(32, 16); //3
      temp[1] = keybuffer.substr(0, 16); //1
      temp[2] = keybuffer.substr(48, 16); //4
      temp[3] = keybuffer.substr(16, 16); //2
      var add_lenth = new Array(4);
      var add_str = new Array(4);
      add_lenth[0] = Math.floor((Math.random() * 100) % 9) + 1;
      add_lenth[1] = Math.floor((Math.random() * 100) % 9) + 1;
      add_lenth[2] = Math.floor((Math.random() * 100) % 9) + 1;
      add_lenth[3] = Math.floor((Math.random() * 100) % 9) + 1;
      add_str[0] = String(
        Math.floor(Math.random() * Math.pow(10, add_lenth[0]))
      );
      add_str[1] = String(
        Math.floor(Math.random() * Math.pow(10, add_lenth[1]))
      );
      add_str[2] = String(
        Math.floor(Math.random() * Math.pow(10, add_lenth[2]))
      );
      add_str[3] = String(
        Math.floor(Math.random() * Math.pow(10, add_lenth[3]))
      );
      var changebuffer =
        add_str[0] +
        temp[0] +
        add_str[1] +
        temp[1] +
        add_str[2] +
        temp[2] +
        add_str[3] +
        temp[3] +
        String(add_str[0].length) +
        String(add_str[1].length) +
        String(add_str[2].length) +
        String(add_str[3].length);

      return changebuffer;
    } else {
      return 0;
    }
  } catch (error) {
    return 0;
  }
}

function decrypt(pri_key) {
  try {
    if (pri_key.length >= 68) {
      var add_lenth = new Array(4);
      add_lenth[0] = Number(pri_key.substr(pri_key.length - 4, 1));
      add_lenth[1] = Number(pri_key.substr(pri_key.length - 3, 1));
      add_lenth[2] = Number(pri_key.substr(pri_key.length - 2, 1));
      add_lenth[3] = Number(pri_key.substr(pri_key.length - 1, 1));
      var temp = new Array(4);
      temp[0] = pri_key.substr(add_lenth[0], 16); //3
      temp[1] = pri_key.substr(add_lenth[0] + add_lenth[1] + 16, 16); //1
      temp[2] = pri_key.substr(
        add_lenth[0] + add_lenth[1] + add_lenth[2] + 32,
        16
      ); //4
      temp[3] = pri_key.substr(
        add_lenth[0] + add_lenth[1] + add_lenth[2] + add_lenth[3] + 48,
        16
      ); //2

      var changebuffer = '0x' + temp[1] + temp[3] + temp[0] + temp[2];

      return changebuffer;
    } else {
      return '0x0';
    }
  } catch (error) {
    return '0x0';
  }
}

async function getKey(uID) {
  try {
    var docSnap = await getDoc(
      doc(db, 'users', `${uID}`, 'Profile', 'ProfileData')
    );
    if (docSnap.exists()) {
      var KeyExist = docSnap.data()['eSkillzKey'];
      if (KeyExist != null) {
        return KeyExist;
      } else {
        return 0;
      }
    } else {
      return 0;
    }
  } catch {
    return 0;
  }
}

async function getDeveloperWallet() {
  try {
    let resultJson = await axios.post(
      'https://api.metakeep.xyz/v3/getDeveloperWallet',
      {},
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'x-api-key': METAKEEP_API_KEY
        }
      }
    );

    return resultJson.data.wallet.ethAddress;
  } catch (err) {
    console.log(err);
    return '';
  }
}

async function metakeepCreate(funcArgs, lambdaName, bytecode, abi) {
  let metakeepDev = await getDeveloperWallet();
  if (metakeepDev == '') {
    return {
      status: false,
      msg: 'Please check MetaKeep Wallet'
    };
  }
  try {
    let resJson = await axios.post(
      'https://api.metakeep.xyz/v2/app/lambda/create',
      {
        constructor: { args: [...funcArgs, metakeepDev, lambdaName] },
        bytecode: bytecode,
        abi: abi
      },
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'x-api-key': METAKEEP_API_KEY,
          'Idempotency-Key': 'Idempotency-Key' + Math.random().toString()
        }
      }
    );
    return resJson.data;
  } catch {
    return {
      status: false,
      data: 'something went wrong'
    };
  }
}

async function metakeepRead(funcName, funcArgs, lambda) {
  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'x-api-key': METAKEEP_API_KEY,
    'Idempotency-Key': 'Idempotency-Key' + Math.random().toString()
  };

  // let metakeepDev = await getDeveloperWallet();
  // if (metakeepDev == '') {
  //   return {
  //     status: false,
  //     msg: 'Please check MetaKeep Wallet'
  //   };
  // }

  try {
    let resJson = await axios.post(
      'https://api.metakeep.xyz/v2/app/lambda/read',
      {
        function: {
          name: funcName,
          args: funcArgs
        },
        lambda: lambda
      },
      {
        headers: headers
      }
    );
    console.log(resJson.data);
    return {
      status: true,
      data: resJson.data.data
    };
  } catch (error) {
    console.log(error);
    return {
      status: false,
      data: 'something went wrong'
    };
  }
}

async function metakeepInvoke(funcName, funcArgs, lambda, reason) {
  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'x-api-key': METAKEEP_API_KEY,
    'Idempotency-Key': 'Idempotency-Key' + Math.random().toString()
  };

  // let metakeepDev = await getDeveloperWallet();
  // if (metakeepDev == '') {
  //   return {
  //     status: false,
  //     msg: 'Please check MetaKeep Wallet'
  //   };
  // }

  try {
    let invokeData = await axios.post(
      'https://api.metakeep.xyz/v2/app/lambda/invoke',
      {
        function: {
          name: funcName,
          args: funcArgs
        },
        lambda: lambda,
        reason: reason
      },
      {
        headers: headers
      }
    );

    headers['Idempotency-Key'] = 'Idempotency-Key' + Math.random().toString();
    let status = 'QUEUED';
    let statusData;
    while (status == 'QUEUED') {
      statusData = await axios.post(
        'https://api.metakeep.xyz/v2/app/transaction/status',
        {
          transactionId: invokeData.data.transactionId
        },
        {
          headers: headers
        }
      );
      status = statusData.data.status;
    }

    console.log(statusData.data);

    if (statusData.data.status != 'COMPLETED') {
      return {
        status: false,
        msg: statusData.data.failureReason
      };
    }

    return {
      status: true,
      data: statusData.data
    };
  } catch (error) {
    console.log(error);
    return {
      status: false,
      msg: 'something went wrong'
    };
  }
}

async function getMaticBalance(addr) {
  try {
    let resJson = await axios.post(
      'https://api.metakeep.xyz/v2/app/coin/balance',
      {
        coin: {
          currency: '0x0000000000000000000000000000000000001010'
        },
        of: { ethAddress: addr }
      },
      {
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          'x-api-key': METAKEEP_API_KEY
        }
      }
    );
    return Number(resJson.data.balance);
  } catch (error) {
    return -1;
  }
}

router.post('/getAdminWallet', async function (req, res) {
  let wallet = await getDeveloperWallet();
  return res.json({
    wallet: wallet
  });
});

router.post('/getMaticBalance', async function (req, res) {
  return res.json({
    balance: await getMaticBalance(req.body.address)
  });
});

router.post('/create/getPrice', async function (req, res) {
  let result = await metakeepCreate(
    [FactoryAddress],
    'GetPriceLambda',
    getPriceContract.bytecode,
    getPriceContract.abi
  );
  return res.json(result);
});

router.post('/create/skill', async function (req, res) {
  try {
    let metakeepDev = await getDeveloperWallet();
    if (metakeepDev == '') {
      return res.json({
        status: false,
        msg: 'Please check MetaKeep Wallet'
      });
    }
    let resJson = await axios.post(
      'https://api.metakeep.xyz/v2/app/lambda/create',
      {
        constructor: { args: [UNISWAPADDRESS, metakeepDev, 'SkillLambda'] },
        bytecode: sportContract.bytecode,
        abi: sportContract.abi
      },
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'x-api-key': METAKEEP_API_KEY,
          'Idempotency-Key': 'Idempotency-Key' + Math.random().toString()
        }
      }
    );
    return res.send(resJson.data);
  } catch (err) {
    console.log(err);
    return res.send('{}');
  }
});

router.post('/create/bet', async function (req, res) {
  try {
    let metakeepDev = await getDeveloperWallet();
    if (metakeepDev == '') {
      return res.json({
        status: false,
        msg: 'Please check MetaKeep Wallet'
      });
    }
    let resJson = await axios.post(
      'https://api.metakeep.xyz/v2/app/lambda/create',
      {
        constructor: { args: [req.body.sport, metakeepDev, 'BetLambda'] },
        bytecode: betContract.bytecode,
        abi: betContract.abi
      },
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'x-api-key': METAKEEP_API_KEY,
          'Idempotency-Key': 'Idempotency-Key' + Math.random().toString()
        }
      }
    );
    return res.send(resJson.data);
  } catch (err) {
    console.log(err);
    return res.send('{}');
  }
});

router.post('/create/nft_bet', async function (req, res) {
  try {
    let metakeepDev = await getDeveloperWallet();
    if (metakeepDev == '') {
      return res.json({
        status: false,
        msg: 'Please check MetaKeep Wallet'
      });
    }
    let resJson = await axios.post(
      'https://api.metakeep.xyz/v2/app/lambda/create',
      {
        constructor: { args: [req.body.sport, req.body.bet, metakeepDev, 'NFTBetLambda'] },
        bytecode: nftBetContract.bytecode,
        abi: nftBetContract.abi
      },
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'x-api-key': METAKEEP_API_KEY,
          'Idempotency-Key': 'Idempotency-Key' + Math.random().toString()
        }
      }
    );
    return res.send(resJson.data);
  } catch (err) {
    console.log(err);
    return res.send('{}');
  }
});

router.post('/create/tournament', async function (req, res) {
  try {
    let metakeepDev = await getDeveloperWallet();
    if (metakeepDev == '') {
      return res.json({
        status: false,
        msg: 'Please check MetaKeep Wallet'
      });
    }
    let resJson = await axios.post(
      'https://api.metakeep.xyz/v2/app/lambda/create',
      {
        constructor: {
          args: [req.body.sport, metakeepDev, 'TournamentLambda']
        },
        bytecode: tournamentContract.bytecode,
        abi: tournamentContract.abi
      },
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'x-api-key': METAKEEP_API_KEY,
          'Idempotency-Key': 'Idempotency-Key' + Math.random().toString()
        }
      }
    );
    return res.send(resJson.data);
  } catch (err) {
    console.log(err);
    return res.send('{}');
  }
});

router.post('/create/marketplace', async function (req, res) {
  try {
    let metakeepDev = await getDeveloperWallet();
    if (metakeepDev == '') {
      return res.json({
        status: false,
        msg: 'Please check MetaKeep Wallet'
      });
    }
    let resJson = await axios.post(
      'https://api.metakeep.xyz/v2/app/lambda/create',
      {
        constructor: { args: [metakeepDev, 'MarketplaceLambda'] },
        bytecode: marketplaceContract.bytecode,
        abi: marketplaceContract.abi
      },
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'x-api-key': METAKEEP_API_KEY,
          'Idempotency-Key': 'Idempotency-Key' + Math.random().toString()
        }
      }
    );
    return res.send(resJson.data);
  } catch (err) {
    console.log(err);
    return res.send('{}');
  }
});

router.post('/create/nft', async function (req, res) {
  try {
    let metakeepDev = await getDeveloperWallet();
    if (metakeepDev == '') {
      return res.json({
        status: false,
        msg: 'Please check MetaKeep Wallet'
      });
    }
    let resJson = await axios.post(
      'https://api.metakeep.xyz/v2/app/lambda/create',
      {
        constructor: {
          args: [
            req.body.marketplace,
            req.body.marketplace,
            metakeepDev,
            'NFTLambda'
          ]
        },
        bytecode: nftContract.bytecode,
        abi: nftContract.abi
      },
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'x-api-key': METAKEEP_API_KEY,
          'Idempotency-Key': 'Idempotency-Key' + Math.random().toString()
        }
      }
    );
    return res.send(resJson.data);
  } catch (err) {
    console.log(err);
    return res.send('{}');
  }
});

// router.post('/create/marketplace_card', async function (req, res) {
//   try {
//     let metakeepDev = await getDeveloperWallet();
//     if (metakeepDev == '') {
//       return res.json({
//         status: false,
//         msg: 'Please check MetaKeep Wallet'
//       });
//     }
//     let resJson = await axios.post(
//       'https://api.metakeep.xyz/v2/app/lambda/create',
//       {
//         constructor: { args: [metakeepDev, 'CMarketplaceLambda'] },
//         bytecode: marketplaceCardContract.bytecode,
//         abi: marketplaceCardContract.abi
//       },
//       {
//         headers: {
//           Accept: 'application/json',
//           'Content-Type': 'application/json',
//           'x-api-key': METAKEEP_API_KEY,
//           'Idempotency-Key': 'Idempotency-Key' + Math.random().toString()
//         }
//       }
//     );
//     return res.send(resJson.data);
//   } catch (err) {
//     console.log(err);
//     return res.send('{}');
//   }
// });

// router.post('/create/nft_card', async function (req, res) {
//   try {
//     let metakeepDev = await getDeveloperWallet();
//     if (metakeepDev == '') {
//       return res.json({
//         status: false,
//         msg: 'Please check MetaKeep Wallet'
//       });
//     }
//     let resJson = await axios.post(
//       'https://api.metakeep.xyz/v2/app/lambda/create',
//       {
//         constructor: {
//           args: [
//             req.body.marketplace,
//             req.body.marketplace,
//             metakeepDev,
//             'CNFTLambda'
//           ]
//         },
//         bytecode: nftCardContract.bytecode,
//         abi: nftCardContract.abi
//       },
//       {
//         headers: {
//           Accept: 'application/json',
//           'Content-Type': 'application/json',
//           'x-api-key': METAKEEP_API_KEY,
//           'Idempotency-Key': 'Idempotency-Key' + Math.random().toString()
//         }
//       }
//     );
//     return res.send(resJson.data);
//   } catch (err) {
//     console.log(err);
//     return res.send('{}');
//   }
// });


router.post('/getMaticAuto', async function (req, res) {
  const from = process.env.MATIC_WALLET_ADDRESS;
  const private_key_from = process.env.MATIC_WALLET_PRIVATEKEY;
  const to = req.body.address;
  const nonce = await web3.eth.getTransactionCount(from, 'latest'); //get latest nonce
  const tx = {
    from,
    to,
    nonce,
    gas: 500000,
    gasPrice: 80000000000,
    chainId: 80001,
    value: ethers.utils.parseUnits('0.5', 'ether')._hex
  };

  const signedTx = await web3.eth.accounts.signTransaction(
    tx,
    private_key_from
  );
  await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
  return res.send('success');
});

router.post('/CreateEskillzAccount', async function (req, res) {

  try {
    let UserID = req.body.UserID;
    let UserName = req.body.userName;
    let BirthDay = req.body.birthDay;
    if (UserID == null || UserName == null || BirthDay == null) {
      res.send('Parameters must not be null.');
      return;
    } else {
      if (UserID.length == 28) {
        try {
          //var temp = 0;
          var docSnap = await getDoc(
            doc(db, 'users', `${UserID}`, 'Profile', 'ProfileData')
          );
          if (!docSnap.exists()) {
            await setDoc(
              doc(db, 'users', `${UserID}`, 'Profile', 'ProfileData'),
              { userid: `${UserID}` }
            );
            docSnap = await getDoc(
              doc(db, 'users', `${UserID}`, 'Profile', 'ProfileData')
            );
            //temp = 1;
          }

          var docSnap1 = await getDoc(
            doc(db, 'users', `${UserID}`, 'Profile', 'KYC')
          );
          if (!docSnap1.exists()) {
            await setDoc(doc(db, 'users', `${UserID}`, 'Profile', 'KYC'), {
              AddressField1: ''
            });
            //temp = 1;
          }

          var walletAddressExist = docSnap.data()['eSkillzWalletAddress'];
          if (walletAddressExist == null) {
            const { address, privateKey } = web3.eth.accounts.create();
            const from = process.env.MATIC_WALLET_ADDRESS;
            const private_key_from = process.env.MATIC_WALLET_PRIVATEKEY;
            const to = address;
            const nonce = await web3.eth.getTransactionCount(from, 'latest'); //get latest nonce
            const tx = {
              from,
              to,
              nonce,
              gas: 500000,
              gasPrice: 80000000000,
              chainId: 80001,
              value: ethers.utils.parseUnits('0.5', 'ether')._hex
            };

            const signedTx = await web3.eth.accounts.signTransaction(
              tx,
              private_key_from
            );
            await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

            // await updateDoc(doc(db, "users", `${UserID}`, "Profile","ProfileData"), {"FramesLost" : 0});
            // await updateDoc(doc(db, "users", `${UserID}`, "Profile","ProfileData"), {"FramesWon" : 0});
            await updateDoc(
              doc(db, 'users', `${UserID}`, 'Profile', 'ProfileData'),
              { IsOnline: 0 }
            );
            // await updateDoc(doc(db, "users", `${UserID}`, "Profile","ProfileData"), {"LastPlayed" : null});
            // await updateDoc(doc(db, "users", `${UserID}`, "Profile","ProfileData"), {"PlayerLevel" : 1});
            // await updateDoc(doc(db, "users", `${UserID}`, "Profile","ProfileData"), {"PlayerXP" : 0});
            // await updateDoc(doc(db, "users", `${UserID}`, "Profile","ProfileData"), {"SkillPoints" : 0});
            // await updateDoc(doc(db, "users", `${UserID}`, "Profile","ProfileData"), {"Wins" : 0});
            await updateDoc(
              doc(db, 'users', `${UserID}`, 'Profile', 'ProfileData'),
              { eSkillzKey: encrypt(String(privateKey)) }
            );
            await updateDoc(
              doc(db, 'users', `${UserID}`, 'Profile', 'ProfileData'),
              { eSkillzWalletAddress: address }
            );
            // await updateDoc(doc(db, "users", `${UserID}`, "Profile","ProfileData"), {"gamesplayed" : 0});
            // await updateDoc(doc(db, "users", `${UserID}`, "Profile","ProfileData"), {"lost" : 0});
            await updateDoc(
              doc(db, 'users', `${UserID}`, 'Profile', 'ProfileData'),
              { userName: UserName }
            );
            await updateDoc(
              doc(db, 'users', `${UserID}`, 'Profile', 'ProfileData'),
              { userid: `${UserID}` }
            );
            // await updateDoc(doc(db, "users", `${UserID}`, "Profile","ProfileData"), {"walletAddress" : ""});
            await updateDoc(
              doc(db, 'users', `${UserID}`, 'Profile', 'ProfileData'),
              { birthDay: BirthDay }
            );

            await updateDoc(doc(db, 'users', `${UserID}`, 'Profile', 'KYC'), {
              AddressField1: ''
            });
            await updateDoc(doc(db, 'users', `${UserID}`, 'Profile', 'KYC'), {
              AddressField2: ''
            });
            await updateDoc(doc(db, 'users', `${UserID}`, 'Profile', 'KYC'), {
              AddressField3: ''
            });
            await updateDoc(doc(db, 'users', `${UserID}`, 'Profile', 'KYC'), {
              AddressField4: ''
            });
            await updateDoc(doc(db, 'users', `${UserID}`, 'Profile', 'KYC'), {
              Country: ''
            });
            await updateDoc(doc(db, 'users', `${UserID}`, 'Profile', 'KYC'), {
              CountryState: ''
            });
            await updateDoc(doc(db, 'users', `${UserID}`, 'Profile', 'KYC'), {
              DOB: ''
            });
            await updateDoc(doc(db, 'users', `${UserID}`, 'Profile', 'KYC'), {
              DocumentID: ''
            });
            await updateDoc(doc(db, 'users', `${UserID}`, 'Profile', 'KYC'), {
              DocumentImageStorageUrl: ''
            });
            await updateDoc(doc(db, 'users', `${UserID}`, 'Profile', 'KYC'), {
              Postcode: ''
            });
            await updateDoc(doc(db, 'users', `${UserID}`, 'Profile', 'KYC'), {
              documentType: ''
            });
            res.send(address);
            return;
          } else {
            res.send('Wallet Address already exist now.');
            return;
          }
        } catch {
          res.send('Network is busy now, retry please.');
        }
      } else {
        res.send('Type of UserID is not correct.');
      }
    }
  } catch (error) {
    res.send('Your Request is not correct.');
    return;
  }
});

router.post('/UpdateEskillzAccount', async function (req, res) {

  try {
    let UserID = req.body.UserID;

    if (UserID == null) {
      res.send('UserID must not be null.');
      return;
    } else {
      if (UserID.length == 28) {
        try {
          var docSnap = await getDoc(
            doc(db, 'users', `${UserID}`, 'Profile', 'ProfileData')
          );

          if (docSnap.exists()) {
            var walletAddressExist = docSnap.data()['eSkillzWalletAddress'];
            if (walletAddressExist != null) {
              const { address, privateKey } = web3.eth.accounts.create();
              await updateDoc(
                doc(db, 'users', `${UserID}`, 'Profile', 'ProfileData'),
                { userid: `${UserID}` }
              );
              await updateDoc(
                doc(db, 'users', `${UserID}`, 'Profile', 'ProfileData'),
                { eSkillzKey: encrypt(String(privateKey)) }
              );
              await updateDoc(
                doc(db, 'users', `${UserID}`, 'Profile', 'ProfileData'),
                { eSkillzWalletAddress: address }
              );
              res.send(address);
              return;
            } else {
              res.send('Wallet Address does not exist now.');
              return;
            }
          } else {
            await setDoc(
              doc(db, 'users', `${UserID}`, 'Profile', 'ProfileData'),
              { userid: `${UserID}` }
            );
            await updateDoc(
              doc(db, 'users', `${UserID}`, 'Profile', 'ProfileData'),
              { userid: deleteField() }
            );
            res.send('Wallet Address does not exist now.');
            return;
          }
        } catch {
          res.send('Network is busy now, retry please.');
        }
      } else {
        res.send('Type of UserID is not correct.');
      }
    }
  } catch (error) {
    res.send('Your Request is not correct.');
    return;
  }
});

router.post('/DeleteEskillzAccount', async function (req, res) {

  try {
    let UserID = req.body.UserID;
    if (UserID == null) {
      res.send('UserID must not be null.');
      return;
    } else {
      if (UserID.length == 28) {
        try {
          var docSnap = await getDoc(
            doc(db, 'users', `${UserID}`, 'Profile', 'ProfileData')
          );
          if (docSnap.exists()) {
            var walletAddressExist = docSnap.data()['eSkillzWalletAddress'];
            if (walletAddressExist != null) {
              await updateDoc(
                doc(db, 'users', `${UserID}`, 'Profile', 'ProfileData'),
                { userid: deleteField() }
              );
              await updateDoc(
                doc(db, 'users', `${UserID}`, 'Profile', 'ProfileData'),
                { eSkillzKey: deleteField() }
              );
              await updateDoc(
                doc(db, 'users', `${UserID}`, 'Profile', 'ProfileData'),
                { eSkillzWalletAddress: deleteField() }
              );
              res.send('Successed');
              return;
            } else {
              res.send('Wallet Address does not exist now.');
              return;
            }
          } else {
            await setDoc(
              doc(db, 'users', `${UserID}`, 'Profile', 'ProfileData'),
              { userid: `${UserID}` }
            );
            await updateDoc(
              doc(db, 'users', `${UserID}`, 'Profile', 'ProfileData'),
              { userid: deleteField() }
            );
            res.send('Wallet Address does not exist now.');
            return;
          }
        } catch {
          res.send('Network is busy now, retry please.');
        }
      } else {
        res.send('Type of UserID is not correct.');
      }
    }
  } catch (error) {
    res.send('Your Request is not correct.');
    return;
  }
});

router.post('/getEskillzAccount', async function (req, res) {

  try {
    let UserID = req.body.UserID;

    if (UserID == null) {
      res.send('UserID must not be null.');
      return;
    } else {
      if (UserID.length == 28) {
        try {
          var docSnap = await getDoc(
            doc(db, 'users', `${UserID}`, 'Profile', 'ProfileData')
          );
          if (docSnap.exists()) {
            var walletAddressExist = docSnap.data()['eSkillzWalletAddress'];
            if (walletAddressExist != null) {
              res.send(walletAddressExist);
              return;
            } else {
              res.send('Wallet Address does not exist now.');
              return;
            }
          } else {
            await setDoc(
              doc(db, 'users', `${UserID}`, 'Profile', 'ProfileData'),
              { userid: `${UserID}` }
            );
            await updateDoc(
              doc(db, 'users', `${UserID}`, 'Profile', 'ProfileData'),
              { userid: deleteField() }
            );
            res.send('Wallet Address does not exist now.');
            return;
          }
        } catch {
          res.send('Network is busy now, retry please.');
        }
      } else {
        res.send('Type of UserID is not correct.');
      }
    }
  } catch (error) {
    res.send('Your Request is not correct.');
    return;
  }
});



router.post('/set/bet', async function (req, res) {
  try {
    let resJson = await metakeepInvoke(
      'setEskillzBet',
      [BetLambda],
      SkillLambda,
      'SetEskillzBet'
    );
    return res.send(resJson.data);
  } catch (err) {
    console.log(err);
    return res.send('{}');
  }
});

router.post('/set/treasury', async function (req, res) {
  try {
    let resJson = await metakeepInvoke(
      'setTresury',
      [TreasuryWallet],
      BetLambda,
      'SetTresury'
    );
    return res.send(resJson.data);
  } catch (err) {
    console.log(err);
    return res.send('{}');
  }
});

router.post('/set/feereceiver', async function (req, res) {
  try {
    let resJson = await metakeepInvoke(
      'setFeeReceiver',
      [TreasuryWallet],
      BetLambda,
      'setFeeReceiver'
    );
    return res.send(resJson.data);
  } catch (err) {
    console.log(err);
    return res.send('{}');
  }
});


router.post('/EarnSport', async function (req, res) {
  try {
    let UserID = req.body.UserID;
    let Player = req.body.Player;
    let Amounts = Number(req.body.Amounts);
    var curBalBuf;
    var pendBalBuf = 0;
    if (Player == null || Amounts == null || UserID == null) {
      res.send('Parameters must not be null.');
      return;
    } else {
      if (
        Player.toString().toLowerCase().length == 42 &&
        Player.toString().toLowerCase().substring(0, 2) == '0x'
      ) {
        if (Number(Amounts) < 1) {
          res.send('Mint Amounts must be bigger than one.');
          return;
        }
        var dateTimeComp = new Date();
        var rowsComp = await knex('mintmore')
          .where('Player', Player)
          .where('UserId', UserID)
          .where('Amounts', String(Amounts))
          .orderBy('CreatedTime', 'desc')
          .select('*');
        if (rowsComp.length) {
          if (dateTimeComp - rowsComp[0].CreatedTime < 60000) {
            res.send('MutiCalls');
            return;
          }
        }

        let curSport = await metakeepRead(
          'balanceOf',
          [Player],
          SkillLambda
        );

        curBalBuf = Number(curSport.data) / 10 ** 9;
        //add pendingToken
        var docSnap = await getDoc(
          doc(db, 'users', `${UserID}`, 'Private', 'WalletBalances')
        );

        if (docSnap.exists()) {
          var PSExist = docSnap.data()['PendingSkill'];
          if (PSExist != null) {
            await updateDoc(
              doc(db, 'users', `${UserID}`, 'Private', 'WalletBalances'),
              { PendingSkill: Number(PSExist) + Number(Amounts) / 10 ** 9 }
            );
            pendBalBuf = Number(PSExist);
          } else {
            await updateDoc(
              doc(db, 'users', `${UserID}`, 'Private', 'WalletBalances'),
              { PendingSkill: Number(Amounts) / 10 ** 9 }
            );
          }
        } else {
          await setDoc(
            doc(db, 'users', `${UserID}`, 'Private', 'WalletBalances'),
            { CurrentSkill: 0, PendingSkill: Number(Amounts) / 10 ** 9 }
          );
        }
        var rows = await knex('pendingtoken')
          .where('address', Player)
          .select('*');
        if (rows.length) {
          await knex('pendingtoken')
            .where('address', Player)
            .update({
              balance: String(Number(rows[0].balance) + Amounts)
            });
        } else {
          await knex('pendingtoken').insert({
            address: Player,
            balance: String(Amounts)
          });
        }
        //add mintMore
        var dateTime = new Date();
        var insertedID = await knex('mintmore').insert({
          UserId: UserID,
          Player: Player,
          Amounts: String(Amounts),
          CreatedTime: dateTime,
          ReCallNum: 0
        });

        let mintData = await metakeepInvoke(
          'mintSportToUser',
          [parseInt(Number(Amounts)).toString(), Player],
          SkillLambda,
          'Mint Sport To User'
        );

        // let resJson = await metakeepRead("balanceOf", [Player], SkillLambda);

        if (mintData.status) {
          await deleteMintMore(insertedID[0]);
          await removePendingBalance(UserID, Player, Amounts);
          //
          var docSnapBUF = await getDoc(
            doc(db, 'users', `${UserID}`, 'Private', 'WalletBalances')
          );

          if (docSnapBUF.exists()) {
            var PSExistBuf = docSnapBUF.data()['PendingSkill'];
            if (PSExistBuf != null) {
              // console.log(Number(PSExistBuf));
              // console.log(pendBalBuf);
              if (Number(PSExistBuf) != Number(pendBalBuf)) {
                // console.log("PS")
                await updateDoc(
                  doc(db, 'users', `${UserID}`, 'Private', 'WalletBalances'),
                  { PendingSkill: pendBalBuf }
                );
              }
            }
          }

          // update current balance
          let curBal = await metakeepRead(
            'balanceOf',
            [Player],
            SkillLambda
          );
          var docSnapSportBal = await getDoc(
            doc(db, 'users', `${UserID}`, 'Private', 'WalletBalances')
          );
          if (docSnapSportBal.exists()) {
            await updateDoc(
              doc(db, 'users', `${UserID}`, 'Private', 'WalletBalances'),
              { CurrentSkill: Number(curBal.data / 10 ** 9) }
            );
          } else {
            await setDoc(
              doc(db, 'users', `${UserID}`, 'Private', 'WalletBalances'),
              {
                CurrentSkill: Number(curBal.data / 10 ** 9),
                PendingSkill: 0
              }
            );
          }
          return res.send('success');
        } else {
          return res.send('fail');
        }
      } else {
        res.send('Player is not address Type.');
        return;
      }
    }
  } catch (error) {
    console.log(error);
    res.send('Your Request is not correct.');
    return;
  }
});

router.post('/CreateSPGame', async function (req, res) {
  try {
    let UserID = req.body.UserID;
    let CreatePlayer = req.body.CreatePlayer;
    let BetAmounts = Number(req.body.BetAmounts);
    let TokenAddress = req.body.TokenAddress;

    let isSport = TokenAddress == SkillLambda;
    var ExchangeAmount = 0;
    if (CreatePlayer == null || BetAmounts == null || UserID == null) {
      res.send('Parameters must not be null.');
      return;
    } else {
      if (
        CreatePlayer.toString().toLowerCase().length == 42 &&
        CreatePlayer.toString().toLowerCase().substring(0, 2) == '0x'
      ) {
        if (Number(BetAmounts) < 1) {
          res.send('Mint Amounts must be bigger than one.');
          return;
        }

        // let minBetAmounts = await metakeepRead("minBetAmounts", [], BetLambda);
        // if(!minBetAmounts.status){
        //   return res.json({
        //     result : minBetAmounts.status,
        //     message : minBetAmounts.msg,
        //     GameID : 0,
        //     BetFee : 0,
        //     ExchangeAmount : ExchangeAmount / 10 ** 9
        //   });
        // }

        let rakeFee = await metakeepRead('eskillz_fee', [], BetLambda);
        if (!rakeFee.status) {
          return res.json({
            result: rakeFee.status,
            message: rakeFee.msg,
            GameID: 0,
            BetFee: 0,
            ExchangeAmount: ExchangeAmount / 10 ** 9
          });
        }

        // if(BetAmounts < minBetAmounts){
        //   return res.json({
        //     result : false,
        //     message : "BetAmounts must bigger than minBetAmounts.",
        //     GameID : 0,
        //     BetFee : 0,
        //     ExchangeAmount : ExchangeAmount / 10 ** 9
        //   });
        // }

        // CreateSPGame
        // let maticBal = await getMaticBalance(CreatePlayer);
        // if(maticBal == -1 || maticBal < 0.1){
        //   return {
        //     result : false,
        //     message : "Matic balance of Create Player is smaller than 0.1 Matic.",
        //     GameID : 0,
        //     BetFee : 0,
        //     ExchangeAmount : ExchangeAmount / 10 ** 9
        //   };
        // }

        if (isSport) {
          let stakeAmount = await metakeepRead("balanceOf", [CreatePlayer], SkillLambda);
          if (!stakeAmount.status) {
            return res.json({
              result: stakeAmount.status,
              message: stakeAmount.msg,
              GameID: 0,
              BetFee: 0,
              ExchangeAmount: ExchangeAmount / 10 ** 9
            });
          }
          stakeAmount = stakeAmount.data;

          if (Number(stakeAmount) < BetAmounts) {
            return res.json({
              result: false,
              message: "Sport balance of Create Player is smaller than BetAmounts.",
              GameID: 0,
              BetFee: 0,
              ExchangeAmount: ExchangeAmount / 10 ** 9
            });
          }

          let cSpGame = await metakeepInvoke(
            'approveAndCreateSPGame',
            [BetLambda, CreatePlayer, BetAmounts.toString()],
            SkillLambda,
            'Approve CreateSPGame'
          );
          if (!cSpGame.status) {
            return res.json({
              result: cSpGame.status,
              message: cSpGame.msg,
              GameID: 0,
              BetFee: 0,
              ExchangeAmount: ExchangeAmount / 10 ** 9
            });
          }
        } else {
          // let retVal =await pricePredictContract.methods.getReserves(MaticAddress, SportTokenAddress).call();
          // var inputVal = Math.floor(addAmounts / retVal[0] * retVal[1]);
          let skillAmount = await getSkillAmount(TokenAddress, BetAmounts);
          if (skillAmount == 0) {
            return res.json({
              result: false,
              message: "Converting Skill is failed.",
              GameID: 0,
              BetFee: 0,
              ExchangeAmount: ExchangeAmount / 10 ** 9
            });
          }

          let cSpGame = await metakeepInvoke(
            'CreateSPGameByToken',
            [CreatePlayer, skillAmount.toString()],
            BetLambda,
            'CreateSPGameByToken'
          );
          if (!cSpGame.status) {
            return res.json({
              result: cSpGame.status,
              message: cSpGame.msg,
              GameID: 0,
              BetFee: 0,
              ExchangeAmount: ExchangeAmount / 10 ** 9
            });
          }
          let retVal = await sendTokenToTreasury(CreatePlayer, UserID, TokenAddress, BetAmounts);
          if (!retVal) {
            return res.json({
              result: false,
              message: "Insufficient funds for gas price.",
              GameID: 0,
              BetFee: 0,
              ExchangeAmount: ExchangeAmount / 10 ** 9
            });
          }
        }

        let gameid = await metakeepRead('GameIDs', [], BetLambda);

        let curBal = await metakeepRead(
          'balanceOf',
          [CreatePlayer],
          SkillLambda
        );

        var docSnapSportBal = await getDoc(
          doc(db, 'users', `${UserID}`, 'Private', 'WalletBalances')
        );
        if (docSnapSportBal.exists()) {
          await updateDoc(
            doc(db, 'users', `${UserID}`, 'Private', 'WalletBalances'),
            { CurrentSkill: Number(curBal.data / 10 ** 9) }
          );
        } else {
          await setDoc(
            doc(db, 'users', `${UserID}`, 'Private', 'WalletBalances'),
            { CurrentSkill: Number(curBal.data / 10 ** 9), PendingSkill: 0 }
          );
        }

        await axios.post(process.env.ADMIN_URL + "/create_spgame", {
          UserID,
          CreatePlayer,
          GameID: gameid.data,
          BetAmounts,
          TokenAddress
        });

        return res.send({
          result: true,
          message: 'success',
          GameID: gameid.data,
          BetFee: (BetAmounts * Number(rakeFee.data)) / 10000 / 10 ** 9,
          ExchangeAmount: ExchangeAmount / 10 ** 9
        });
      } else {
        res.send('CreatePlayer is not address Type.');
        return;
      }
    }
  } catch (error) {
    console.log(error);
    res.send('Your Request is not correct.');
    return;
  }
});

const deleteGameResult = async (insertedId) => {
  try {
    var rows = await knex('gameresult').del().where('Id', insertedId);
    if (rows == 1) {
      return;
    } else {
      await deleteGameResult(insertedId);
    }
  } catch (error) {
    return;
  }
};

const deleteMintMore = async (insertedId) => {
  try {
    var rows = await knex('mintmore').del().where('Id', insertedId);
    if (rows == 1) {
      return;
    } else {
      await deleteMintMore(insertedId);
    }
  } catch (error) {
    return;
  }
};

const removePendingBalance = async (UserID, Player, Amounts) => {
  try {
    var docSnap = await getDoc(
      doc(db, 'users', `${UserID}`, 'Private', 'WalletBalances')
    );

    if (docSnap.exists()) {
      var PSExist = docSnap.data()['PendingSkill'];
      if (PSExist != null) {
        if (Number(PSExist) - Number(Amounts) / 10 ** 9 > 0) {
          await updateDoc(
            doc(db, 'users', `${UserID}`, 'Private', 'WalletBalances'),
            { PendingSkill: Number(PSExist) - Number(Amounts) / 10 ** 9 }
          );
        } else {
          await updateDoc(
            doc(db, 'users', `${UserID}`, 'Private', 'WalletBalances'),
            { PendingSkill: 0 }
          );
        }
      } else {
        await updateDoc(
          doc(db, 'users', `${UserID}`, 'Private', 'WalletBalances'),
          { PendingSkill: 0 }
        );
      }
    } else {
      await setDoc(doc(db, 'users', `${UserID}`, 'Private', 'WalletBalances'), {
        CurrentSkill: 0,
        PendingSkill: 0
      });
    }

    var rowsSel = await knex('pendingtoken')
      .where('address', Player)
      .select('*');
    if (rowsSel.length) {
      var rows;
      if (Number(rowsSel[0].balance) - Amounts > 0) {
        rows = await knex('pendingtoken')
          .where('address', Player)
          .update({
            balance: String(Number(rowsSel[0].balance) - Amounts)
          });
      } else {
        rows = await knex('pendingtoken').where('address', Player).update({
          balance: '0'
        });
      }
      if (rows == 1) {
        return;
      } else {
        await removePendingBalance(UserID, Player, Amounts);
      }
    } else {
      return;
    }
  } catch (error) {
    return;
  }
};

router.post('/SetSPGameResult', async function (req, res) {
  try {
    let UserID = req.body.UserID;
    let ReductionFee = req.body.ReductionFee;
    let GameID = Number(req.body.GameID);
    if (GameID == null || UserID == null || ReductionFee == null) {
      res.send('Parameters must not be null.');
      return;
    } else {
      let WinPlayer;
      let Result;
      const docSnap = await getDoc(
        doc(db, 'eskillzGameResult', GameID.toString())
      );
      if (docSnap.exists()) {
        WinPlayer = docSnap.data().winAddress;
        Result = docSnap.data().result;
        if (WinPlayer == null || Result == null) {
          return res.json({
            result: false,
            message:
              'There is no WinPlater and Result on firebase. So transaction is failed.',
            ExchangeAmount: ExchangeAmount / 10 ** 9
          });
        }
        if (GameID > 0) {
          if (WinPlayer.toString().length == 42) {
            if (Number(Result) >= 0) {
              let betAmounts_ID = await metakeepRead(
                'gamebetting',
                [String(GameID), '0'],
                BetLambda
              );
              betAmounts_ID = betAmounts_ID.data;

              var dateTimeComp = new Date();
              var rowsComp = await knex('gameresult')
                .where('GameID', GameID)
                .where('UserID', UserID)
                .orderBy('CreatedTime', 'desc')
                .select('*');
              if (rowsComp.length) {
                if (dateTimeComp - rowsComp[0].CreatedTime < 60000) {
                  res.send('MutiCalls');
                  return;
                }
              }

              //getrakefee
              var rows_rakefee = await knex('chainparam').select('*');
              if (rows_rakefee.length) {
                RakeFee = Number(rows_rakefee[0].RakeFee);
                // console.log("rakefee->",Number(rows_rakefee[0].RakeFee));
              }
              //add mintMore
              var dateTime = new Date();
              var insertedID = await knex('gameresult').insert({
                UserID: UserID,
                GameID: GameID,
                Type: 0,
                CreatedTime: dateTime,
                ReCallNum: 0,
                WinPlayer: WinPlayer.toString(),
                Result: Result.toString(),
                Amounts: String(
                  (Number(betAmounts_ID[1]) *
                    (100 + Number(Result) - RakeFee)) /
                  100
                )
              });

              //add pendingToken
              var docSnapBal = await getDoc(
                doc(db, 'users', `${UserID}`, 'Private', 'WalletBalances')
              );
              var pendBalBuf;
              if (docSnapBal.exists()) {
                var PSExist = docSnapBal.data()['PendingSkill'];
                if (PSExist != null) {
                  await updateDoc(
                    doc(db, 'users', `${UserID}`, 'Private', 'WalletBalances'),
                    {
                      PendingSkill:
                        Number(PSExist) +
                        (Number(betAmounts_ID[1]) *
                          (100 + Number(Result) - RakeFee)) /
                        100 /
                        10 ** 9
                    }
                  );
                  pendBalBuf = Number(PSExist);
                } else {
                  await updateDoc(
                    doc(db, 'users', `${UserID}`, 'Private', 'WalletBalances'),
                    {
                      PendingSkill:
                        (Number(betAmounts_ID[1]) *
                          (100 + Number(Result) - RakeFee)) /
                        100 /
                        10 ** 9
                    }
                  );
                }
              } else {
                await setDoc(
                  doc(db, 'users', `${UserID}`, 'Private', 'WalletBalances'),
                  {
                    CurrentSkill: 0,
                    PendingSkill:
                      (Number(betAmounts_ID[1]) *
                        (100 + Number(Result) - RakeFee)) /
                      100 /
                      10 ** 9
                  }
                );
              }

              var rows = await knex('pendingtoken')
                .where('address', WinPlayer)
                .select('*');
              if (rows.length) {
                await knex('pendingtoken')
                  .where('address', WinPlayer)
                  .update({
                    balance: String(
                      Number(rows[0].balance) +
                      (Number(betAmounts_ID[1]) *
                        (100 + Number(Result) - RakeFee)) /
                      100
                    )
                  });
              } else {
                await knex('pendingtoken').insert({
                  address: WinPlayer,
                  balance: String(
                    (Number(betAmounts_ID[1]) *
                      (100 + Number(Result) - RakeFee)) /
                    100
                  )
                });
              }

              let returnVal;
              if (Number(betAmounts_ID[3]) == 0) {
                returnVal = await metakeepInvoke(
                  'SetSPGameResult',
                  [WinPlayer, GameID.toString(), Result.toString(), ReductionFee.toString()],
                  BetLambda,
                  'SetSPGameResult'
                );
              } else {
                returnVal = await metakeepInvoke(
                  'SetSPGameResultByToken',
                  [WinPlayer, GameID.toString(), Result.toString(), ReductionFee.toString()],
                  BetLambda,
                  'SetSPGameResultByToken'
                );
              }
              //await fSetSPGameResult(UserID, GameID, WinPlayer, parseInt(Number(Result)), ExchangeAmount, privateKeyVal, 0);
              if (returnVal.status == true) {
                await deleteDoc(
                  doc(db, 'eskillzGameResult', GameID.toString())
                );
                await deleteGameResult(insertedID[0]);
                await removePendingBalance(
                  UserID,
                  WinPlayer,
                  (Number(betAmounts_ID[1]) *
                    (100 + Number(Result) - RakeFee)) /
                  100
                );
                //
                var docSnapBUF = await getDoc(
                  doc(db, 'users', `${UserID}`, 'Private', 'WalletBalances')
                );

                if (docSnapBUF.exists()) {
                  var PSExistBuf = docSnapBUF.data()['PendingSkill'];
                  if (PSExistBuf != null) {
                    if (Number(PSExistBuf) != Number(pendBalBuf)) {
                      // console.log("PS");
                      await updateDoc(
                        doc(
                          db,
                          'users',
                          `${UserID}`,
                          'Private',
                          'WalletBalances'
                        ),
                        { PendingSkill: pendBalBuf }
                      );
                    }
                  }
                }

                //
                let curBal = await metakeepRead(
                  'balanceOf',
                  [WinPlayer],
                  SkillLambda
                );
                var docSnapSportBal = await getDoc(
                  doc(db, 'users', `${UserID}`, 'Private', 'WalletBalances')
                );
                if (docSnapSportBal.exists()) {
                  await updateDoc(
                    doc(db, 'users', `${UserID}`, 'Private', 'WalletBalances'),
                    { CurrentSkill: Number(curBal.data / 10 ** 9) }
                  );
                } else {
                  await setDoc(
                    doc(db, 'users', `${UserID}`, 'Private', 'WalletBalances'),
                    {
                      CurrentSkill: Number(curBal.data / 10 ** 9),
                      PendingSkill: 0
                    }
                  );
                }

                return res.send({
                  result: true,
                  message: returnVal.data.transactionHash,
                  ExchangeAmount: 0
                });
              }
              return res.send({
                result: false,
                message: returnVal.data.msg,
                ExchangeAmount: 0
              });
            } else {
              return res.json({
                result: false,
                message: 'Result is not correct on firebase.'
              });
            }
          } else {
            return res.json({
              result: false,
              message: 'winAdress is not address Type.'
            });
          }
        } else {
          return res.json({
            result: false,
            message: 'GameID must bigger than zero.'
          });
        }
      } else {
        return res.json({
          result: false,
          message: 'Can not find GameID on firebase.'
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.send('Your Request is not correct.');
    return;
  }
});

const fCreateMPGame = async (
  CreatePlayer,
  JoinPlayer,
  UserID_Creator,
  BetAmounts,
  ExchangeAmount1,
  ExchangeAmount2,
  rakeFee,
  TokenAddress,
) => {
  try {
    let isSport = TokenAddress == SkillLambda;
    let stakeAmount1 = await metakeepRead(
      'balanceOf',
      [CreatePlayer],
      SkillLambda
    );
    if (!stakeAmount1.status) {
      return res.json({
        result: stakeAmount1.status,
        message: stakeAmount1.msg,
        GameID: 0,
        BetFee: 0,
        ExchangeAmount1: ExchangeAmount1 / 10 ** 9,
        ExchangeAmount2: ExchangeAmount2 / 10 ** 9
      });
    }
    stakeAmount1 = stakeAmount1.data;

    let stakeAmount2 = await metakeepRead(
      'balanceOf',
      [JoinPlayer],
      SkillLambda
    );
    if (!stakeAmount2.status) {
      return res.json({
        result: stakeAmount2.status,
        message: stakeAmount2.msg,
        GameID: 0,
        BetFee: 0,
        ExchangeAmount1: ExchangeAmount1 / 10 ** 9,
        ExchangeAmount2: ExchangeAmount2 / 10 ** 9
      });
    }
    stakeAmount2 = stakeAmount2.data;

    // let maticBal1 = await getMaticBalance(CreatePlayer);
    // let maticBal2 = await getMaticBalance(JoinPlayer);

    // if (maticBal1 == -1 || maticBal1 < 0.1) {
    //   return {
    //     result: false,
    //     message: 'Matic balance of Create Player is smaller than 0.1 Matic.',
    //     GameID: 0,
    //     BetFee: 0,
    //     ExchangeAmount1: ExchangeAmount1 / 10 ** 9,
    //     ExchangeAmount2: ExchangeAmount2 / 10 ** 9
    //   };
    // }
    // if (maticBal2 == -1 || maticBal2 < 0.1) {
    //   return {
    //     result: false,
    //     message: 'Matic balance of Join Player is smaller than 0.1 Matic.',
    //     GameID: 0,
    //     BetFee: 0,
    //     ExchangeAmount1: ExchangeAmount1 / 10 ** 9,
    //     ExchangeAmount2: ExchangeAmount2 / 10 ** 9
    //   };
    // }

    let cMpGame;
    if (isSport) {
      if (Number(stakeAmount1) < BetAmounts) {
        return {
          result: false,
          message: 'Sport balance of Create Player is smaller than BetAmounts.',
          GameID: 0,
          BetFee: 0,
          ExchangeAmount1: ExchangeAmount1 / 10 ** 9,
          ExchangeAmount2: ExchangeAmount2 / 10 ** 9
        };
      }
      if (Number(stakeAmount2) < BetAmounts) {
        return {
          result: false,
          message: 'Sport balance of Join Player is smaller than BetAmounts.',
          GameID: 0,
          BetFee: 0,
          ExchangeAmount1: ExchangeAmount1 / 10 ** 9,
          ExchangeAmount2: ExchangeAmount2 / 10 ** 9
        };
      }
      cMpGame = await metakeepInvoke(
        'approveAndCreateMPGame',
        [BetLambda, CreatePlayer, BetAmounts.toString()],
        SkillLambda,
        'Approve CreateMPGame'
      );
    } else {
      let skillAmount = await getSkillAmount(TokenAddress, BetAmounts);
      if (skillAmount == 0) {
        return res.json({
          result: false,
          message: "Converting Skill is failed.",
          GameID: 0,
          BetFee: 0,
          ExchangeAmount1: ExchangeAmount1 / 10 ** 9,
          ExchangeAmount2: ExchangeAmount2 / 10 ** 9
        });
      }

      cMpGame = await metakeepInvoke(
        'CreateMPGameByToken',
        [CreatePlayer, skillAmount.toString()],
        BetLambda,
        'CreateMPGameByToken'
      );

      if (cMpGame.status) {
        let retVal = await sendTokenToTreasury(CreatePlayer, UserID_Creator, TokenAddress, BetAmounts);
        if (!retVal) {
          return res.json({
            result: false,
            message: "Sending Token is failed.",
            GameID: 0,
            BetFee: 0,
            ExchangeAmount1: ExchangeAmount1 / 10 ** 9,
            ExchangeAmount2: ExchangeAmount2 / 10 ** 9
          });
        }
      }
    }

    if (!cMpGame.status) {
      return res.json({
        result: cMpGame.status,
        message: cMpGame.msg,
        GameID: 0,
        BetFee: 0,
        ExchangeAmount1: ExchangeAmount1 / 10 ** 9,
        ExchangeAmount2: ExchangeAmount2 / 10 ** 9
      });
    }

    let gameid = await metakeepRead('GameIDs', [], BetLambda);

    return {
      result: true,
      message: 'success',
      GameID: gameid.data,
      BetFee: (BetAmounts * Number(rakeFee)) / 10000 / 10 ** 9,
      ExchangeAmount1: ExchangeAmount1 / 10 ** 9,
      ExchangeAmount2: ExchangeAmount2 / 10 ** 9
    };
  } catch {
    return {
      result: false,
      message: 'Network is Busy.Transaction failed.',
      GameID: 0,
      BetFee: 0,
      ExchangeAmount1: ExchangeAmount1 / 10 ** 9,
      ExchangeAmount2: ExchangeAmount2 / 10 ** 9
    };
  }
};

const fJoinMPGame = async (JoinPlayer, UserID_Joiner, BetAmounts, returnVal, TokenAddress) => {
  try {
    let isSport = TokenAddress == SkillLambda;
    let joinData;
    if (isSport) {
      joinData = await metakeepInvoke(
        'approveAndJoinMPGame',
        [BetLambda, JoinPlayer, BetAmounts.toString(), returnVal.GameID],
        SkillLambda,
        'Approve And JoinMPGame'
      );
    } else {
      let skillAmount = await getSkillAmount(TokenAddress, BetAmounts);
      if (skillAmount == 0) {
        returnVal.GameID = 0;
        returnVal.result = false;
        returnVal.message = 'Converting Skill is failed';
        returnVal.BetFee = 0;
        return returnVal;
      }

      joinData = await metakeepInvoke(
        'JoinMPGameByToken',
        [JoinPlayer, returnVal.GameID, skillAmount.toString()],
        BetLambda,
        'JoinMPGameByToken'
      );

      if (joinData.status) {
        let retVal = await sendTokenToTreasury(JoinPlayer, UserID_Joiner, TokenAddress, BetAmounts);
        if (!retVal) {
          returnVal.GameID = 0;
          returnVal.result = false;
          returnVal.message = 'Sending Token is failed';
          returnVal.BetFee = 0;
          return returnVal;
        }
      }
    }
    if (joinData.status) {
      return returnVal;
    }
    returnVal.GameID = 0;
    returnVal.result = false;
    returnVal.message = 'JoinMPGame is failed';
    returnVal.BetFee = 0;
    return returnVal;
  } catch {
    returnVal.GameID = 0;
    returnVal.result = false;
    returnVal.message = 'Network is Busy.Transaction failed.';
    returnVal.BetFee = 0;
    return returnVal;
  }
};

const fCreateMPGameForNFT = async (
  CreatePlayer,
  JoinPlayer,
  ExchangeAmount1,
  ExchangeAmount2,
  NftIds,
  NftContracts
) => {
  try {

    let docSnapNFTBettingFee = await getDoc(doc(db, 'eskillzGeneral', "NFTBetting"));
    if (!docSnapNFTBettingFee.exists()) {
      return {
        result: false,
        message: 'Network is Busy.Transaction failed.',
        GameID: 0,
        BetFee: 0,
        ExchangeAmount1: ExchangeAmount1 / 10 ** 9,
        ExchangeAmount2: ExchangeAmount2 / 10 ** 9
      };
    }
    let nftBetFee = (Number(docSnapNFTBettingFee.data()["fee"]) * 10 ** 9).toString();

    let stakeAmount1 = await metakeepRead(
      'balanceOf',
      [CreatePlayer],
      SkillLambda
    );
    if (!stakeAmount1.status) {
      return res.json({
        result: stakeAmount1.status,
        message: stakeAmount1.msg,
        GameID: 0,
        BetFee: 0,
        ExchangeAmount1: ExchangeAmount1 / 10 ** 9,
        ExchangeAmount2: ExchangeAmount2 / 10 ** 9
      });
    }
    stakeAmount1 = stakeAmount1.data;

    let stakeAmount2 = await metakeepRead(
      'balanceOf',
      [JoinPlayer],
      SkillLambda
    );
    if (!stakeAmount2.status) {
      return res.json({
        result: stakeAmount2.status,
        message: stakeAmount2.msg,
        GameID: 0,
        BetFee: 0,
        ExchangeAmount1: ExchangeAmount1 / 10 ** 9,
        ExchangeAmount2: ExchangeAmount2 / 10 ** 9
      });
    }
    stakeAmount2 = stakeAmount2.data;

    let cMpGame;
    if (Number(stakeAmount1) < nftBetFee) {
      return {
        result: false,
        message: 'Sport balance of Create Player is smaller than BetAmounts.',
        GameID: 0,
        BetFee: 0,
        ExchangeAmount1: ExchangeAmount1 / 10 ** 9,
        ExchangeAmount2: ExchangeAmount2 / 10 ** 9
      };
    }
    if (Number(stakeAmount2) < nftBetFee) {
      return {
        result: false,
        message: 'Sport balance of Join Player is smaller than BetAmounts.',
        GameID: 0,
        BetFee: 0,
        ExchangeAmount1: ExchangeAmount1 / 10 ** 9,
        ExchangeAmount2: ExchangeAmount2 / 10 ** 9
      };
    }

    let approveInfo = await metakeepInvoke(
      'approveFrom',
      [CreatePlayer, NFTBetLambda, nftBetFee],
      SkillLambda,
      'approveFrom'
    );
    if (!approveInfo.status) {
      return res.json({
        result: cMpGame.status,
        message: cMpGame.msg,
        GameID: 0,
        BetFee: 0,
        ExchangeAmount1: ExchangeAmount1 / 10 ** 9,
        ExchangeAmount2: ExchangeAmount2 / 10 ** 9
      });
    }
    for (let i = 0; i < NftIds.length; i++) {
      let nftOwner = await metakeepRead("ownerOf", [NftIds[i] + ""], NftContracts[i]);
      if (nftOwner.data != NFTBetLambda) {
        const count = await provider.getTransactionCount(CreatePlayer, 'latest'); //get latest nonce

        var gasPrice = 8000000000;
        var chainId = 80001;
        var nonce = count;
        // approve
        let transaction1;
        transaction1 = {
          from: CreatePlayer,
          to: NftContracts[i],
          nonce,
          chainId,
          gasPrice,
          data: etherInterfaceNFT.encodeFunctionData(
            'approve',
            [NFTBetLambda, NftIds[i] + ""]
          )
        };

        //Estimate gas limit
        const estimatedGas1 = await provider.estimateGas(transaction1);
        transaction1['gasLimit'] = estimatedGas1;
        //Sign & Send transaction

        var nftOwnerPrivateKey = await getPrivateKeyFromWallet(CreatePlayer);

        const wallet1 = new ethers.Wallet(nftOwnerPrivateKey, provider);
        const signedTx1 = await wallet1.signTransaction(transaction1);
        const transactionReceipt1 = await provider.sendTransaction(signedTx1);
        await transactionReceipt1.wait();
        console.log(transactionReceipt1.hash);
      }
    }

    let docSnapPrize = await getDoc(doc(db, 'eskillzGeneral', "PrizeSettings"));
    if (!docSnapPrize.exists()) {
      return {
        result: false,
        message: 'Network is Busy.Transaction failed.',
        GameID: 0,
        BetFee: 0,
        ExchangeAmount1: ExchangeAmount1 / 10 ** 9,
        ExchangeAmount2: ExchangeAmount2 / 10 ** 9
      };
    }

    let docPrizeInfo = docSnapPrize.data();

    cMpGame = await metakeepInvoke(
      'CreateMPGameForNFT',
      [CreatePlayer, nftBetFee, docPrizeInfo["address"], NftIds, NftContracts],
      NFTBetLambda,
      'CreateMPGameForNFT'
    );

    if (!cMpGame.status) {
      return res.json({
        result: cMpGame.status,
        message: cMpGame.msg,
        GameID: 0,
        BetFee: 0,
        ExchangeAmount1: ExchangeAmount1 / 10 ** 9,
        ExchangeAmount2: ExchangeAmount2 / 10 ** 9
      });
    }

    let gameid = await metakeepRead('GameIDs', [], BetLambda);

    return {
      result: true,
      message: 'success',
      GameID: gameid.data,
      BetFee: nftBetFee,
      ExchangeAmount1: ExchangeAmount1 / 10 ** 9,
      ExchangeAmount2: ExchangeAmount2 / 10 ** 9
    };
  } catch (err) {
    return {
      result: false,
      message: 'Network is Busy.Transaction failed.',
      GameID: 0,
      BetFee: 0,
      ExchangeAmount1: ExchangeAmount1 / 10 ** 9,
      ExchangeAmount2: ExchangeAmount2 / 10 ** 9
    };
  }
};

const fJoinMPGameForNFT = async (JoinPlayer, returnVal, NftIds, NftContracts) => {
  try {
    let docSnapNFTBettingFee = await getDoc(doc(db, 'eskillzGeneral', "NFTBetting"));
    if (!docSnapNFTBettingFee.exists()) {
      return {
        result: false,
        message: 'Network is Busy.Transaction failed.',
        GameID: 0,
        BetFee: 0,
        ExchangeAmount1: ExchangeAmount1 / 10 ** 9,
        ExchangeAmount2: ExchangeAmount2 / 10 ** 9
      };
    }
    let nftBetFee = (Number(docSnapNFTBettingFee.data()["fee"]) * 10 ** 9).toString();

    let approveInfo = await metakeepInvoke(
      'approveFrom',
      [JoinPlayer, NFTBetLambda, nftBetFee],
      SkillLambda,
      'approveFrom'
    );
    if (!approveInfo.status) {
      returnVal.GameID = 0;
      returnVal.result = false;
      returnVal.message = 'JoinMPGame is failed';
      returnVal.BetFee = 0;
      return returnVal;
    }

    for (let i = 0; i < NftIds.length; i++) {
      const count = await provider.getTransactionCount(JoinPlayer, 'latest'); //get latest nonce

      var gasPrice = 8000000000;
      var chainId = 80001;
      var nonce = count;
      // approve
      let transaction1;
      transaction1 = {
        from: JoinPlayer,
        to: NftContracts[i],
        nonce,
        chainId,
        gasPrice,
        data: etherInterfaceNFT.encodeFunctionData(
          'approve',
          [NFTBetLambda, NftIds[i] + ""]
        )
      };

      //Estimate gas limit
      const estimatedGas1 = await provider.estimateGas(transaction1);
      transaction1['gasLimit'] = estimatedGas1;
      //Sign & Send transaction

      var nftOwnerPrivateKey = await getPrivateKeyFromWallet(JoinPlayer);

      const wallet1 = new ethers.Wallet(nftOwnerPrivateKey, provider);
      const signedTx1 = await wallet1.signTransaction(transaction1);
      const transactionReceipt1 = await provider.sendTransaction(signedTx1);
      await transactionReceipt1.wait();
      console.log(transactionReceipt1.hash);
    }

    let docSnapPrize = await getDoc(doc(db, 'eskillzGeneral', "PrizeSettings"));
    if (!docSnapPrize.exists()) {
      return {
        result: false,
        message: 'Network is Busy.Transaction failed.',
        GameID: 0,
        BetFee: 0,
        ExchangeAmount1: ExchangeAmount1 / 10 ** 9,
        ExchangeAmount2: ExchangeAmount2 / 10 ** 9
      };
    }

    let docPrizeInfo = docSnapPrize.data();

    let joinData;
    joinData = await metakeepInvoke(
      'JoinMPGameForNFT',
      [JoinPlayer, returnVal.GameID, nftBetFee, docPrizeInfo["address"], NftIds, NftContracts],
      NFTBetLambda,
      'JoinMPGameForNFT'
    );
    if (joinData.status) {
      return returnVal;
    }
    returnVal.GameID = 0;
    returnVal.result = false;
    returnVal.message = 'JoinMPGame is failed';
    returnVal.BetFee = 0;
    return returnVal;
  } catch {
    returnVal.GameID = 0;
    returnVal.result = false;
    returnVal.message = 'Network is Busy.Transaction failed.';
    returnVal.BetFee = 0;
    return returnVal;
  }
};

router.post('/CreateMPGame', async function (req, res) {
  try {
    let UserID_Creator = req.body.UserID_Creator;
    let UserID_Joiner = req.body.UserID_Joiner;
    let CreatePlayer = req.body.CreatePlayer;
    let JoinPlayer = req.body.JoinPlayer;
    let BetAmounts = Number(req.body.BetAmounts);
    let TokenAddress = req.body.TokenAddress;

    // let isSport = TokenAddress == SkillLambda;

    var ExchangeAmount1 = 0;
    var ExchangeAmount2 = 0;
    var curBalBuf;
    if (
      CreatePlayer == null ||
      JoinPlayer == null ||
      req.body.BetAmounts == null ||
      UserID_Creator == null ||
      UserID_Joiner == null
    ) {
      return res.json({
        result: false,
        message: 'Requirement Parameters must not be null.',
        GameID: 0,
        BetFee: 0,
        ExchangeAmount1: ExchangeAmount1 / 10 ** 9,
        ExchangeAmount2: ExchangeAmount2 / 10 ** 9
      });
    } else {
      if (
        CreatePlayer.toString().toLowerCase().length == 42 &&
        CreatePlayer.toString().toLowerCase().substring(0, 2) == '0x'
      ) {
        if (
          JoinPlayer.toString().toLowerCase().length == 42 &&
          JoinPlayer.toString().toLowerCase().substring(0, 2) == '0x'
        ) {
          if (
            JoinPlayer.toString().toLowerCase() ==
            CreatePlayer.toString().toLowerCase()
          ) {
            return res.json({
              result: false,
              message: 'JoinPlayer is equal to Create Player.',
              GameID: 0,
              BetFee: 0,
              ExchangeAmount1: ExchangeAmount1 / 10 ** 9,
              ExchangeAmount2: ExchangeAmount2 / 10 ** 9
            });
          } else {
            // let minBetAmounts = await metakeepRead(
            //   'minBetAmounts',
            //   [],
            //   BetLambda
            // );
            // if (!minBetAmounts.status) {
            //   return res.json({
            //     result: false,
            //     message: minBetAmounts.msg,
            //     GameID: 0,
            //     BetFee: 0,
            //     ExchangeAmount1: ExchangeAmount1 / 10 ** 9,
            //     ExchangeAmount2: ExchangeAmount2 / 10 ** 9
            //   });
            // }
            // minBetAmounts = minBetAmounts.data;

            let rakeFee = await metakeepRead('eskillz_fee', [], BetLambda);
            if (!rakeFee.status) {
              return res.json({
                result: false,
                message: rakeFee.msg,
                GameID: 0,
                BetFee: 0,
                ExchangeAmount1: ExchangeAmount1 / 10 ** 9,
                ExchangeAmount2: ExchangeAmount2 / 10 ** 9
              });
            }
            rakeFee = rakeFee.data;

            /*if (BetAmounts >= Number(minBetAmounts))*/
            if (BetAmounts >= 0) {
              let returnVal = await fCreateMPGame(
                CreatePlayer,
                JoinPlayer,
                UserID_Creator,
                parseInt(BetAmounts),
                ExchangeAmount1,
                ExchangeAmount2,
                rakeFee,
                TokenAddress
              );

              if (returnVal.GameID > 0) {
                let returnVal1 = await fJoinMPGame(
                  JoinPlayer,
                  UserID_Joiner,
                  parseInt(BetAmounts),
                  returnVal,
                  TokenAddress
                );

                let curBal = await metakeepRead(
                  'balanceOf',
                  [JoinPlayer],
                  SkillLambda
                );
                var docSnapSportBal = await getDoc(
                  doc(
                    db,
                    'users',
                    `${UserID_Joiner}`,
                    'Private',
                    'WalletBalances'
                  )
                );
                if (docSnapSportBal.exists()) {
                  await updateDoc(
                    doc(
                      db,
                      'users',
                      `${UserID_Joiner}`,
                      'Private',
                      'WalletBalances'
                    ),
                    { CurrentSkill: Number(curBal.data / 10 ** 9) }
                  );
                } else {
                  await setDoc(
                    doc(
                      db,
                      'users',
                      `${UserID_Joiner}`,
                      'Private',
                      'WalletBalances'
                    ),
                    {
                      CurrentSkill: Number(curBal.data / 10 ** 9),
                      PendingSkill: 0
                    }
                  );
                }

                let curBalC = await metakeepRead(
                  'balanceOf',
                  [CreatePlayer],
                  SkillLambda
                );
                var docSnapSportBalC = await getDoc(
                  doc(
                    db,
                    'users',
                    `${UserID_Creator}`,
                    'Private',
                    'WalletBalances'
                  )
                );
                if (docSnapSportBalC.exists()) {
                  await updateDoc(
                    doc(
                      db,
                      'users',
                      `${UserID_Creator}`,
                      'Private',
                      'WalletBalances'
                    ),
                    { CurrentSkill: Number(curBalC.data / 10 ** 9) }
                  );
                } else {
                  await setDoc(
                    doc(
                      db,
                      'users',
                      `${UserID_Creator}`,
                      'Private',
                      'WalletBalances'
                    ),
                    {
                      CurrentSkill: Number(curBalC.data / 10 ** 9),
                      PendingSkill: 0
                    }
                  );
                }

                await axios.post(process.env.ADMIN_URL + "/create_mpgame", {
                  UserID_Creator,
                  CreatePlayer,
                  UserID_Joiner,
                  JoinPlayer,
                  GameID: returnVal1['GameID'],
                  BetAmounts,
                  TokenAddress
                });

                return res.send(returnVal1);
              }

              return res.send(returnVal);
            }
            return res.json({
              result: false,
              message: 'BetAmounts must bigger than minBetAmounts.',
              GameID: 0,
              BetFee: 0,
              ExchangeAmount1: ExchangeAmount1 / 10 ** 9,
              ExchangeAmount2: ExchangeAmount2 / 10 ** 9
            });
          }
        } else {
          return res.json({
            result: false,
            message: 'Join Player is not address Type.',
            GameID: 0,
            BetFee: 0,
            ExchangeAmount1: ExchangeAmount1 / 10 ** 9,
            ExchangeAmount2: ExchangeAmount2 / 10 ** 9
          });
        }
      } else {
        return res.json({
          result: false,
          message: 'Create Player is not address Type.',
          GameID: 0,
          BetFee: 0,
          ExchangeAmount1: ExchangeAmount1 / 10 ** 9,
          ExchangeAmount2: ExchangeAmount2 / 10 ** 9
        });
      }
    }
  } catch (error) {
    console.log(error);
    return res.json({
      result: false,
      message: 'Your Request is not correct.',
      GameID: 0,
      BetFee: 0,
      ExchangeAmount1: ExchangeAmount1 / 10 ** 9,
      ExchangeAmount2: ExchangeAmount2 / 10 ** 9
    });
  }
});

router.post('/CreateMPGameForNFT', async function (req, res) {
  try {
    let UserID_Creator = req.body.UserID_Creator;
    let UserID_Joiner = req.body.UserID_Joiner;
    let CreatePlayer = req.body.CreatePlayer;
    let JoinPlayer = req.body.JoinPlayer;
    let CreatorNFTs = req.body.CreatorNFTs;
    let JoinerNFTs = req.body.JoinerNFTs;

    let cIds = [];
    let cAddrs = [];
    let jIds = [];
    let jAddrs = [];
    CreatorNFTs.map(e => {
      cIds.push(e["tokenID"]);
      cAddrs.push(e["contract"]);
    });
    JoinerNFTs.map(e => {
      jIds.push(e["tokenID"]);
      jAddrs.push(e["contract"]);
    });

    // let isSport = TokenAddress == SkillLambda;

    var ExchangeAmount1 = 0;
    var ExchangeAmount2 = 0;
    var curBalBuf;
    if (
      CreatePlayer == null ||
      JoinPlayer == null ||
      UserID_Creator == null ||
      UserID_Joiner == null
    ) {
      return res.json({
        result: false,
        message: 'Requirement Parameters must not be null.',
        GameID: 0,
        BetFee: 0,
        ExchangeAmount1: ExchangeAmount1 / 10 ** 9,
        ExchangeAmount2: ExchangeAmount2 / 10 ** 9
      });
    } else {
      if (
        CreatePlayer.toString().toLowerCase().length == 42 &&
        CreatePlayer.toString().toLowerCase().substring(0, 2) == '0x'
      ) {
        if (
          JoinPlayer.toString().toLowerCase().length == 42 &&
          JoinPlayer.toString().toLowerCase().substring(0, 2) == '0x'
        ) {
          if (
            JoinPlayer.toString().toLowerCase() ==
            CreatePlayer.toString().toLowerCase()
          ) {
            return res.json({
              result: false,
              message: 'JoinPlayer is equal to Create Player.',
              GameID: 0,
              BetFee: 0,
              ExchangeAmount1: ExchangeAmount1 / 10 ** 9,
              ExchangeAmount2: ExchangeAmount2 / 10 ** 9
            });
          } else {

            let rakeFee = await metakeepRead('eskillz_fee', [], BetLambda);
            if (!rakeFee.status) {
              return res.json({
                result: false,
                message: rakeFee.msg,
                GameID: 0,
                BetFee: 0,
                ExchangeAmount1: ExchangeAmount1 / 10 ** 9,
                ExchangeAmount2: ExchangeAmount2 / 10 ** 9
              });
            }
            rakeFee = rakeFee.data;

            let returnVal = await fCreateMPGameForNFT(
              CreatePlayer,
              JoinPlayer,
              ExchangeAmount1,
              ExchangeAmount2,
              cIds,
              cAddrs
            );

            if (returnVal.GameID > 0) {
              let returnVal1 = await fJoinMPGameForNFT(
                JoinPlayer,
                returnVal,
                jIds,
                jAddrs
              );

              let curBal = await metakeepRead(
                'balanceOf',
                [JoinPlayer],
                SkillLambda
              );
              var docSnapSportBal = await getDoc(
                doc(
                  db,
                  'users',
                  `${UserID_Joiner}`,
                  'Private',
                  'WalletBalances'
                )
              );
              if (docSnapSportBal.exists()) {
                await updateDoc(
                  doc(
                    db,
                    'users',
                    `${UserID_Joiner}`,
                    'Private',
                    'WalletBalances'
                  ),
                  { CurrentSkill: Number(curBal.data / 10 ** 9) }
                );
              } else {
                await setDoc(
                  doc(
                    db,
                    'users',
                    `${UserID_Joiner}`,
                    'Private',
                    'WalletBalances'
                  ),
                  {
                    CurrentSkill: Number(curBal.data / 10 ** 9),
                    PendingSkill: 0
                  }
                );
              }

              let curBalC = await metakeepRead(
                'balanceOf',
                [CreatePlayer],
                SkillLambda
              );
              var docSnapSportBalC = await getDoc(
                doc(
                  db,
                  'users',
                  `${UserID_Creator}`,
                  'Private',
                  'WalletBalances'
                )
              );
              if (docSnapSportBalC.exists()) {
                await updateDoc(
                  doc(
                    db,
                    'users',
                    `${UserID_Creator}`,
                    'Private',
                    'WalletBalances'
                  ),
                  { CurrentSkill: Number(curBalC.data / 10 ** 9) }
                );
              } else {
                await setDoc(
                  doc(
                    db,
                    'users',
                    `${UserID_Creator}`,
                    'Private',
                    'WalletBalances'
                  ),
                  {
                    CurrentSkill: Number(curBalC.data / 10 ** 9),
                    PendingSkill: 0
                  }
                );
              }

              return res.send(returnVal1);
            }

            return res.send(returnVal);
          }
        } else {
          return res.json({
            result: false,
            message: 'Join Player is not address Type.',
            GameID: 0,
            BetFee: 0,
            ExchangeAmount1: ExchangeAmount1 / 10 ** 9,
            ExchangeAmount2: ExchangeAmount2 / 10 ** 9
          });
        }
      } else {
        return res.json({
          result: false,
          message: 'Create Player is not address Type.',
          GameID: 0,
          BetFee: 0,
          ExchangeAmount1: ExchangeAmount1 / 10 ** 9,
          ExchangeAmount2: ExchangeAmount2 / 10 ** 9
        });
      }
    }
  } catch (error) {
    console.log(error);
    return res.json({
      result: false,
      message: 'Your Request is not correct.',
      GameID: 0,
      BetFee: 0,
      ExchangeAmount1: ExchangeAmount1 / 10 ** 9,
      ExchangeAmount2: ExchangeAmount2 / 10 ** 9
    });
  }
});

const fSetMPGameResult = async (GameID, WinPlayer, ExchangeAmount, BetType, ReductionFee) => {
  try {
    let mpresult;
    if (BetType == 0) {
      mpresult = await metakeepInvoke(
        'SetMPGameResult',
        [WinPlayer, GameID.toString(), ReductionFee.toString()],
        BetLambda,
        'SetMPGameResult'
      );
    } else {
      mpresult = await metakeepInvoke(
        'SetMPGameResultByToken',
        [WinPlayer, GameID.toString(), ReductionFee.toString()],
        BetLambda,
        'SetMPGameResultByToken'
      );
    }

    await deleteDoc(doc(db, 'eskillzGameResult', GameID.toString()));
    return {
      result: true,
      message: mpresult.data.transactionHash,
      ExchangeAmount: ExchangeAmount / 10 ** 9
    };
  } catch (error) {
    console.log(error);
    return {
      result: false,
      message: 'Network is busy. Transaction failed.',
      ExchangeAmount: ExchangeAmount / 10 ** 9
    };
  }
};

router.post('/SetMPGameResult', async function (req, res) {
  try {
    let UserID = req.body.UserID;
    let GameID = Number(req.body.GameID);
    var ExchangeAmount = 0;
    var RakeFee = 5;
    var pendBalBuf = 0;
    let ReductionFee = req.body.ReductionFee;

    if (GameID == null || UserID == null || ReductionFee == null) {
      res.json({
        result: false,
        message: 'Requirement Parameters must not be null.',
        ExchangeAmount: ExchangeAmount / 10 ** 9
      });
      return;
    } else {
      let WinPlayer;
      const docSnap = await getDoc(
        doc(db, 'eskillzGameResult', GameID.toString())
      );
      if (docSnap.exists()) {
        WinPlayer = docSnap.data().winAddress;
        if (WinPlayer == null) {
          res.json({
            result: false,
            message:
              'There is no WinPlater on firebase. So transaction is failed.',
            ExchangeAmount: ExchangeAmount / 10 ** 9
          });
          return;
        }
        if (GameID > 0) {
          if (WinPlayer.toString().length == 42) {
            let betAmounts_ID = await metakeepRead(
              'gamebetting',
              [String(GameID), '0'],
              BetLambda
            );
            betAmounts_ID = betAmounts_ID.data;

            var dateTimeComp = new Date();
            var rowsComp = await knex('gameresult')
              .where('GameID', GameID)
              .where('UserID', UserID)
              .orderBy('CreatedTime', 'desc')
              .select('*');
            if (rowsComp.length) {
              if (dateTimeComp - rowsComp[0].CreatedTime < 60000) {
                res.send('MutiCalls');
                return;
              }
            }

            //getrakefee

            var rows_rakefee = await knex('chainparam').select('*');
            if (rows_rakefee.length) {
              RakeFee = Number(rows_rakefee[0].RakeFee);
              // console.log("rakefee->",Number(rows_rakefee[0].RakeFee));
            }
            //add mintMore
            var dateTime = new Date();
            var insertedID = await knex('gameresult').insert({
              UserID: UserID,
              GameID: GameID,
              Type: 1,
              CreatedTime: dateTime,
              ReCallNum: 0,
              WinPlayer: WinPlayer.toString(),
              Result: '0',
              Amounts: String(
                (Number(betAmounts_ID[1]) * (200 - RakeFee)) / 100
              )
            });
            //add pendingToken
            var docSnapBal = await getDoc(
              doc(db, 'users', `${UserID}`, 'Private', 'WalletBalances')
            );

            if (docSnapBal.exists()) {
              var PSExist = docSnapBal.data()['PendingSkill'];
              if (PSExist != null) {
                await updateDoc(
                  doc(db, 'users', `${UserID}`, 'Private', 'WalletBalances'),
                  {
                    PendingSkill:
                      Number(PSExist) +
                      (Number(betAmounts_ID[1]) * (200 - RakeFee)) /
                      100 /
                      10 ** 9
                  }
                );
                pendBalBuf = Number(PSExist);
              } else {
                await updateDoc(
                  doc(db, 'users', `${UserID}`, 'Private', 'WalletBalances'),
                  {
                    PendingSkill:
                      (Number(betAmounts_ID[1]) * (200 - RakeFee)) /
                      100 /
                      10 ** 9
                  }
                );
              }
            } else {
              await setDoc(
                doc(db, 'users', `${UserID}`, 'Private', 'WalletBalances'),
                {
                  CurrentSkill: 0,
                  PendingSkill:
                    (Number(betAmounts_ID[1]) * (200 - RakeFee)) / 100 / 10 ** 9
                }
              );
            }
            var rows = await knex('pendingtoken')
              .where('address', WinPlayer)
              .select('*');
            if (rows.length) {
              await knex('pendingtoken')
                .where('address', WinPlayer)
                .update({
                  balance: String(
                    Number(rows[0].balance) +
                    (Number(betAmounts_ID[1]) * (200 - RakeFee)) / 100
                  )
                });
            } else {
              await knex('pendingtoken').insert({
                address: WinPlayer,
                balance: String(
                  (Number(betAmounts_ID[1]) * (200 - RakeFee)) / 100
                )
              });
            }

            let returnVal = await fSetMPGameResult(
              GameID,
              WinPlayer,
              ExchangeAmount,
              Number(betAmounts_ID[3]),
              ReductionFee.toString()
            );
            if (returnVal.result == true) {
              await deleteGameResult(insertedID[0]);
              await removePendingBalance(
                UserID,
                WinPlayer,
                (Number(betAmounts_ID[1]) * (200 - RakeFee)) / 100
              );

              var docSnapBUF = await getDoc(
                doc(db, 'users', `${UserID}`, 'Private', 'WalletBalances')
              );
              if (docSnapBUF.exists()) {
                var PSExistBuf = docSnapBUF.data()['PendingSkill'];
                if (PSExistBuf != null) {
                  if (Number(PSExistBuf) != Number(pendBalBuf)) {
                    await updateDoc(
                      doc(
                        db,
                        'users',
                        `${UserID}`,
                        'Private',
                        'WalletBalances'
                      ),
                      { PendingSkill: pendBalBuf }
                    );
                  }
                }
              }

              let curBal = await metakeepRead(
                'balanceOf',
                [WinPlayer],
                SkillLambda
              );
              var docSnapSportBal = await getDoc(
                doc(db, 'users', `${UserID}`, 'Private', 'WalletBalances')
              );
              if (docSnapSportBal.exists()) {
                await updateDoc(
                  doc(db, 'users', `${UserID}`, 'Private', 'WalletBalances'),
                  { CurrentSkill: Number(curBal.data / 10 ** 9) }
                );
              } else {
                await setDoc(
                  doc(db, 'users', `${UserID}`, 'Private', 'WalletBalances'),
                  {
                    CurrentSkill: Number(curBal.data / 10 ** 9),
                    PendingSkill: 0
                  }
                );
              }
            }
            res.send(returnVal);
            return;
          } else {
            res.json({
              result: false,
              message: 'winAdress is not address Type.',
              ExchangeAmount: ExchangeAmount / 10 ** 9
            });
          }
        } else {
          res.json({
            result: false,
            message: 'GameID must bigger than zero.',
            ExchangeAmount: ExchangeAmount / 10 ** 9
          });
        }
      } else {
        res.json({
          result: false,
          message: 'Can not find GameID and winAddress on firebase.',
          ExchangeAmount: ExchangeAmount / 10 ** 9
        });
      }
      return;
    }
  } catch (error) {
    console.log(error);
    res.json({
      result: false,
      message: 'Your Request is not correct.',
      ExchangeAmount: ExchangeAmount / 10 ** 9
    });
    return;
  }
});

const fSetMPGameResultForNFT = async (GameID, WinPlayer, ExchangeAmount, BetType) => {
  try {
    let mpresult;
    mpresult = await metakeepInvoke(
      'SetMPGameResultForNFT',
      [WinPlayer, GameID.toString()],
      NFTBetLambda,
      'SetMPGameResultForNFT'
    );

    await deleteDoc(doc(db, 'eskillzGameResult', GameID.toString()));
    return {
      result: true,
      message: mpresult.data.transactionHash,
      ExchangeAmount: ExchangeAmount / 10 ** 9
    };
  } catch (error) {
    console.log(error);
    return {
      result: false,
      message: 'Network is busy. Transaction failed.',
      ExchangeAmount: ExchangeAmount / 10 ** 9
    };
  }
};

router.post('/SetMPGameResultForNFT', async function (req, res) {
  try {
    let UserID = req.body.UserID;
    let GameID = Number(req.body.GameID);
    var ExchangeAmount = 0;
    var RakeFee = 5;
    var pendBalBuf = 0;

    if (GameID == null || UserID == null) {
      res.json({
        result: false,
        message: 'Requirement Parameters must not be null.',
        ExchangeAmount: ExchangeAmount / 10 ** 9
      });
      return;
    } else {
      let WinPlayer;
      const docSnap = await getDoc(
        doc(db, 'eskillzGameResult', GameID.toString())
      );
      if (docSnap.exists()) {
        WinPlayer = docSnap.data().winAddress;
        if (WinPlayer == null) {
          res.json({
            result: false,
            message:
              'There is no WinPlater on firebase. So transaction is failed.',
            ExchangeAmount: ExchangeAmount / 10 ** 9
          });
          return;
        }
        if (GameID > 0) {
          if (WinPlayer.toString().length == 42) {
            let betAmounts_ID = await metakeepRead(
              'gamebetting',
              [String(GameID), '0'],
              BetLambda
            );
            betAmounts_ID = betAmounts_ID.data;

            var dateTimeComp = new Date();
            var rowsComp = await knex('gameresult')
              .where('GameID', GameID)
              .where('UserID', UserID)
              .orderBy('CreatedTime', 'desc')
              .select('*');
            if (rowsComp.length) {
              if (dateTimeComp - rowsComp[0].CreatedTime < 60000) {
                res.send('MutiCalls');
                return;
              }
            }

            //getrakefee

            var rows_rakefee = await knex('chainparam').select('*');
            if (rows_rakefee.length) {
              RakeFee = Number(rows_rakefee[0].RakeFee);
              // console.log("rakefee->",Number(rows_rakefee[0].RakeFee));
            }
            //add mintMore
            var dateTime = new Date();
            var insertedID = await knex('gameresult').insert({
              UserID: UserID,
              GameID: GameID,
              Type: 1,
              CreatedTime: dateTime,
              ReCallNum: 0,
              WinPlayer: WinPlayer.toString(),
              Result: '0',
              Amounts: String(
                (Number(betAmounts_ID[1]) * (200 - RakeFee)) / 100
              )
            });
            //add pendingToken
            var docSnapBal = await getDoc(
              doc(db, 'users', `${UserID}`, 'Private', 'WalletBalances')
            );

            if (docSnapBal.exists()) {
              var PSExist = docSnapBal.data()['PendingSkill'];
              if (PSExist != null) {
                await updateDoc(
                  doc(db, 'users', `${UserID}`, 'Private', 'WalletBalances'),
                  {
                    PendingSkill:
                      Number(PSExist) +
                      (Number(betAmounts_ID[1]) * (200 - RakeFee)) /
                      100 /
                      10 ** 9
                  }
                );
                pendBalBuf = Number(PSExist);
              } else {
                await updateDoc(
                  doc(db, 'users', `${UserID}`, 'Private', 'WalletBalances'),
                  {
                    PendingSkill:
                      (Number(betAmounts_ID[1]) * (200 - RakeFee)) /
                      100 /
                      10 ** 9
                  }
                );
              }
            } else {
              await setDoc(
                doc(db, 'users', `${UserID}`, 'Private', 'WalletBalances'),
                {
                  CurrentSkill: 0,
                  PendingSkill:
                    (Number(betAmounts_ID[1]) * (200 - RakeFee)) / 100 / 10 ** 9
                }
              );
            }
            var rows = await knex('pendingtoken')
              .where('address', WinPlayer)
              .select('*');
            if (rows.length) {
              await knex('pendingtoken')
                .where('address', WinPlayer)
                .update({
                  balance: String(
                    Number(rows[0].balance) +
                    (Number(betAmounts_ID[1]) * (200 - RakeFee)) / 100
                  )
                });
            } else {
              await knex('pendingtoken').insert({
                address: WinPlayer,
                balance: String(
                  (Number(betAmounts_ID[1]) * (200 - RakeFee)) / 100
                )
              });
            }

            let returnVal = await fSetMPGameResultForNFT(
              GameID,
              WinPlayer,
              ExchangeAmount,
              Number(betAmounts_ID[3])
            );
            if (returnVal.result == true) {
              await deleteGameResult(insertedID[0]);
              await removePendingBalance(
                UserID,
                WinPlayer,
                (Number(betAmounts_ID[1]) * (200 - RakeFee)) / 100
              );

              var docSnapBUF = await getDoc(
                doc(db, 'users', `${UserID}`, 'Private', 'WalletBalances')
              );
              if (docSnapBUF.exists()) {
                var PSExistBuf = docSnapBUF.data()['PendingSkill'];
                if (PSExistBuf != null) {
                  if (Number(PSExistBuf) != Number(pendBalBuf)) {
                    await updateDoc(
                      doc(
                        db,
                        'users',
                        `${UserID}`,
                        'Private',
                        'WalletBalances'
                      ),
                      { PendingSkill: pendBalBuf }
                    );
                  }
                }
              }

              let curBal = await metakeepRead(
                'balanceOf',
                [WinPlayer],
                SkillLambda
              );
              var docSnapSportBal = await getDoc(
                doc(db, 'users', `${UserID}`, 'Private', 'WalletBalances')
              );
              if (docSnapSportBal.exists()) {
                await updateDoc(
                  doc(db, 'users', `${UserID}`, 'Private', 'WalletBalances'),
                  { CurrentSkill: Number(curBal.data / 10 ** 9) }
                );
              } else {
                await setDoc(
                  doc(db, 'users', `${UserID}`, 'Private', 'WalletBalances'),
                  {
                    CurrentSkill: Number(curBal.data / 10 ** 9),
                    PendingSkill: 0
                  }
                );
              }
            }
            res.send(returnVal);
            return;
          } else {
            res.json({
              result: false,
              message: 'winAdress is not address Type.',
              ExchangeAmount: ExchangeAmount / 10 ** 9
            });
          }
        } else {
          res.json({
            result: false,
            message: 'GameID must bigger than zero.',
            ExchangeAmount: ExchangeAmount / 10 ** 9
          });
        }
      } else {
        res.json({
          result: false,
          message: 'Can not find GameID and winAddress on firebase.',
          ExchangeAmount: ExchangeAmount / 10 ** 9
        });
      }
      return;
    }
  } catch (error) {
    console.log(error);
    res.json({
      result: false,
      message: 'Your Request is not correct.',
      ExchangeAmount: ExchangeAmount / 10 ** 9
    });
    return;
  }
});

router.post('/SendSport', async function (req, res) {
  try {
    let UserID = req.body.UserID;
    let Account = req.body.Account;
    let ToAddress = req.body.ToAddress;
    let Amounts = Number(req.body.Amounts);
    if (
      Account == null ||
      ToAddress == null ||
      Amounts == null ||
      UserID == null
    ) {
      res.send('Account and ToAddress and Amounts must not be null.');
      return;
    } else {
      if (
        Account.toString().toLowerCase().length == 42 &&
        Account.toString().toLowerCase().substring(0, 2) == '0x'
      ) {
        try {
          let metakeepDev = await getDeveloperWallet();
          if (metakeepDev == '') {
            return {
              status: false,
              msg: 'Please check MetaKeep Wallet'
            };
          }

          let approveData = await metakeepInvoke(
            'approveFrom',
            [Account, metakeepDev, Amounts.toString()],
            SkillLambda,
            'ApproveFrom'
          );

          if (!approveData.status) {
            return res.send('Approve Failed.');
          }

          let sendSportData = await metakeepInvoke(
            'transferFrom',
            [Account, ToAddress, Amounts.toString()],
            SkillLambda,
            'Send Sport'
          );

          if (!sendSportData.status) {
            return res.send('Transaction failed.');
          }

          let curBal = await metakeepRead('balanceOf', [Account], SkillLambda);
          var docSnapSportBal = await getDoc(
            doc(db, 'users', `${UserID}`, 'Private', 'WalletBalances')
          );
          if (docSnapSportBal.exists()) {
            await updateDoc(
              doc(db, 'users', `${UserID}`, 'Private', 'WalletBalances'),
              { CurrentSkill: Number(curBal.data / 10 ** 9) }
            );
          } else {
            await setDoc(
              doc(db, 'users', `${UserID}`, 'Private', 'WalletBalances'),
              { CurrentSkill: Number(curBal.data / 10 ** 9), PendingSkill: 0 }
            );
          }

          return res.send(sendSportData.data.transactionHash);
        } catch {
          res.send('Network is Busy. Transaction failed.');
        }
      } else {
        res.send('Account is not address Type.');
      }
      return;
    }
  } catch (error) {
    res.send('Your Request is not correct.');
    return;
  }
});

router.post('/SendMatic', async function (req, res) {
  try {
    let UserID = req.body.UserID;
    let Account = req.body.Account;
    let ToAddress = req.body.ToAddress;
    let Amounts = Number(req.body.Amounts);
    if (
      Account == null ||
      ToAddress == null ||
      Amounts == null ||
      UserID == null
    ) {
      res.send('Account and ToAddress and Amounts must not be null.');
      return;
    } else {
      if (
        Account.toString().toLowerCase().length == 42 &&
        Account.toString().toLowerCase().substring(0, 2) == '0x'
      ) {
        try {
          let maticBal = await web3.eth.getBalance(Account);
          if (Number(maticBal) / 10 ** 18 - Amounts < 0.1) {
            res.send(
              'Remain Matic Balance of Eskillz Wallet must be bigger than 0.1 Matic.'
            );
            return;
          }
          var count = await web3.eth.getTransactionCount(Account, 'latest'); //get latest nonce
          // var tx = esgContract.methods.transfer(ToAddress, parseInt(Amounts).toString());
          var gas = 21000;
          var nonce = count;
          var gasPrice = 80000000000;
          var chainId = 80001;
          var keyBuf = await getKey(UserID);
          if (keyBuf == 0) {
            res.send(
              'There is no Private key on firebase. So transaction is failed.'
            );
            return;
          }
          var privateKeyVal = decrypt(keyBuf);
          var signedTx = await web3.eth.accounts.signTransaction(
            {
              to: ToAddress,
              value: web3.utils.toWei(String(Amounts), 'ether'),
              gas: gas * 2,
              gasPrice,
              nonce,
              chainId
            },
            privateKeyVal
          );
          var transactionReceipt = await web3.eth.sendSignedTransaction(
            signedTx.rawTransaction
          );
          const hash = transactionReceipt.transactionHash;

          res.send(String(hash));
          return;
        } catch (aaa) {
          console.log(aaa);
          res.send('Network is Busy. Transaction failed.');
        }
        return;
      } else {
        res.send('Account is not address Type.');
        return;
      }
      return;
    }
  } catch (error) {
    res.send('Your Request is not correct.');
    return;
  }
});

router.post('/UpdateTokenUri', async function (req, res) {
  try {
    let UserID = req.body.UserID;
    let Account = req.body.Account;
    let TokenID = req.body.TokenID;
    let TokenURI = req.body.TokenURI;

    if (
      Account == null ||
      TokenID == null ||
      TokenURI == null ||
      UserID == null
    ) {
      res.send('Account and TokenID and TokenURI must not be null.');
      return;
    } else {
      if (
        Account.toString().toLowerCase().length == 42 &&
        Account.toString().toLowerCase().substring(0, 2) == '0x'
      ) {
        try {
          let nftdata = await metakeepInvoke(
            'updateTokenUri',
            [Account, TokenID, TokenURI],
            NFTLambda,
            'UpdateTokenURI FOR CUE'
          );
          if (nftdata.status) {
            res.send(String(nftdata.data.transactionHash));
          } else {
            res.send('Failed');
          }
          return;
        } catch {
          res.send(
            "Network is Busy or owner of TokenID don't equal with Account. Transaction failed."
          );
        }
      } else {
        res.send('Account is not address Type.');
      }
      return;
    }
  } catch (error) {
    res.send('Your Request is not correct.');
    return;
  }
});

router.post('/CreateDefaultToken', async function (req, res) {
  try {
    let UserID = req.body.UserID;
    let Account = req.body.Account;
    if (Account == null || UserID == null) {
      res.send('Account must not be null.');
      return;
    } else {
      if (
        Account.toString().toLowerCase().length == 42 &&
        Account.toString().toLowerCase().substring(0, 2) == '0x'
      ) {
        try {
          let nftdata = await metakeepInvoke(
            'createDefaultToken',
            [Account],
            NFTLambda,
            'CreateDefaultToken'
          );
          if (nftdata.status) {
            res.send(nftdata.data.transactionHash);
          } else {
            res.send('Failed');
          }
          return;
        } catch {
          res.send('Network is Busy. Transaction failed.');
        }
      } else {
        res.send('Account is not address Type.');
      }
      return;
    }
  } catch (error) {
    res.send('Your Request is not correct.');
    return;
  }
});


router.post('/SellNFT', async function (req, res) {
  try {
    let UserID = req.body.UserID;
    let Account = req.body.Account;
    let tokenId = req.body.tokenId;
    let price = req.body.price;
    let nftContract = req.body.nftContract;
    let nftType = req.body.nftType;
    if (
      Account == null ||
      tokenId == null ||
      price == null ||
      nftContract == null ||
      nftType == null ||
      UserID == null
    ) {
      res.send('Paramters must not be null.');
      return;
    } else {
      var keyBuf = await getKey(UserID);
      if (keyBuf == 0) {
        res.json({
          status: false,
          msg: 'There is no Private key on firebase. So transaction is failed.'
        });
        return;
      }
      var privateKeyVal = decrypt(keyBuf);


      var count = await web3.eth.getTransactionCount(Account, "latest"); //get latest nonce
      var nonce = count;
      var gasPrice = 80000000000;
      var chainId = 80001;

      // Approve
      let nftcontractData;
      if (req.body.nfttype == 'ERC721') {
        nftcontractData = new web3.eth.Contract(VersusX721Info.abi, nftContract);
      } else {
        nftcontractData = new web3.eth.Contract(VersusX1155Info.abi, nftContract);
      }

      let txApprove = nftcontractData.methods.setApprovalForAll(process.env.VERSUSX_MARKET_ADDRESS, true);
      let dataApprove = txApprove.encodeABI();
      let gasApprove = await txApprove.estimateGas({
        from: Account,
        to: nftContract,
        data: dataApprove,
        nonce,
      });

      let signedTxApprove = await web3.eth.accounts.signTransaction(
        {
          to: nftContract,
          data: dataApprove,
          gas: gasApprove * 2,
          gasPrice,
          nonce,
        },
        privateKeyVal
      );
      await web3.eth.sendSignedTransaction(signedTxApprove.rawTransaction);

      // Send
      nonce = await web3.eth.getTransactionCount(Account, "latest");
      let sendprice = ethers.utils.parseUnits(price.toString(), 'ether');
      let tx = MarketContract.methods.listItemOnSale(tokenId + "", nftType == "ERC721" ? "0" : "1", nftContract, sendprice.toString());
      let data = tx.encodeABI();
      let gas = await tx.estimateGas({
        from: Account,
        to: process.env.VERSUSX_MARKET_ADDRESS,
        data,
        value: ethers.utils.parseUnits('0.0025', 'ether').toString(),
        nonce,
      });

      let signedTx = await web3.eth.accounts.signTransaction(
        {
          to: process.env.VERSUSX_MARKET_ADDRESS,
          data,
          gas: gas * 2,
          gasPrice,
          nonce,
          value: ethers.utils.parseUnits('0.0025', 'ether').toString(),
        },
        privateKeyVal
      );
      let transactionReceipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
      const hash = transactionReceipt.hash;
      res.json({
        status: true,
        msg: "success",
        data: String(hash)
      });
      return;
    }
  } catch (error) {
    console.log(error);
    res.send({
      status: false,
      msg: 'Something went wrong'
    });
    return;
  }
});

router.post('/RemoveNFT', async function (req, res) {
  try {
    let UserID = req.body.UserID;
    let Account = req.body.Account;
    let Type = req.body.Type;
    let tokenID = req.body.tokenID;
    let id = req.body.id;
    let nftContract = req.body.nftContract;
    if (
      Account == null ||
      tokenID == null ||
      id == null ||
      Type == null ||
      UserID == null
    ) {
      res.send('Paramters must not be null.');
      return;
    } else {
      if (
        Account.toString().toLowerCase().length == 42 &&
        Account.toString().toLowerCase().substring(0, 2) == '0x'
      ) {
        try {
          const count = await provider.getTransactionCount(Account, 'latest'); //get latest nonce
          var nonce = count;
          var gasPrice = 8000000000;
          var chainId = 80001;

          //Transaction object
          let transaction;
          transaction = {
            from: Account,
            to: nftContract,
            nonce,
            chainId,
            gasPrice,
            data: etherInterfaceNFT.encodeFunctionData('deleteNFT', [
              id,
              tokenID
            ])
          };
          //Estimate gas limit
          const estimatedGas = await provider.estimateGas(transaction);
          transaction['gasLimit'] = estimatedGas;
          //Sign & Send transaction

          var keyBuf = await getKey(UserID);
          if (keyBuf == 0) {
            res.send(
              'There is no Private key on firebase. So transaction is failed.'
            );
            return;
          }
          var privateKeyVal = decrypt(keyBuf);
          const wallet = new ethers.Wallet(privateKeyVal, provider);
          const signedTx = await wallet.signTransaction(transaction);
          const transactionReceipt = await provider.sendTransaction(signedTx);
          await transactionReceipt.wait();
          const hash = transactionReceipt.hash;
          res.send(String(hash));
          return;
        } catch {
          res.send('Network is Busy. Transaction failed.');
        }
      } else {
        res.send('Account is not address Type.');
      }
      return;
    }
  } catch (error) {
    res.send('Your Request is not correct.');
    return;
  }
});

router.post('/BuyNFT', async function (req, res) {
  try {
    let UserID = req.body.UserID;
    let Account = req.body.Account;
    let itemId = req.body.itemId;
    let price = req.body.price;
    let nftContract = req.body.nftContract;
    let nftType = req.body.nftType;
    if (
      Account == null ||
      itemId == null ||
      price == null ||
      nftContract == null ||
      nftType == null ||
      UserID == null
    ) {
      res.send('Paramters must not be null.');
      return;
    } else {
      var keyBuf = await getKey(UserID);
      if (keyBuf == 0) {
        res.json({
          status: false,
          msg: 'There is no Private key on firebase. So transaction is failed.'
        });
        return;
      }
      var privateKeyVal = decrypt(keyBuf);

      var count = await web3.eth.getTransactionCount(Account, "latest"); //get latest nonce
      var nonce = count;
      var gasPrice = 80000000000;
      let sendprice = price;//ethers.utils.parseUnits(price.toString(), 'ether');
      let tx = MarketContract.methods.sellMarketItem(itemId + "", nftType == "ERC721" ? "0" : "1", nftContract);
      let data = tx.encodeABI();
      let gas = await tx.estimateGas({
        from: Account,
        to: process.env.VERSUSX_MARKET_ADDRESS,
        data,
        value: sendprice.toString(),
        nonce,
      });

      let signedTx = await web3.eth.accounts.signTransaction(
        {
          to: process.env.VERSUSX_MARKET_ADDRESS,
          data,
          gas: gas * 2,
          gasPrice,
          nonce,
          value: sendprice.toString(),
        },
        privateKeyVal
      );
      let transactionReceipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
      const hash = transactionReceipt.hash;
      res.json({
        status: true,
        msg: "success",
        data: String(hash)
      });
      return;
    }
  } catch (error) {
    console.log(error);
    res.send({
      status: false,
      msg: 'Something went wrong'
    });
    return;
  }
});

router.post('/CancellNFT', async function (req, res) {
  try {
    let UserID = req.body.UserID;
    let Account = req.body.Account;
    let itemId = req.body.itemId;
    if (Account == null || itemId == null || UserID == null) {
      res.send('Paramters must not be null.');
      return;
    } else {
      var keyBuf = await getKey(UserID);
      if (keyBuf == 0) {
        res.json({
          status: false,
          msg: 'There is no Private key on firebase. So transaction is failed.'
        });
        return;
      }
      var privateKeyVal = decrypt(keyBuf);

      var count = await web3.eth.getTransactionCount(Account, "latest"); //get latest nonce
      var nonce = count;
      var gasPrice = 80000000000;
      let tx = MarketContract.methods.listItemCancelOnSale(itemId + "");
      let gas = await tx.estimateGas({ from: Account });
      let data = tx.encodeABI();

      let signedTx = await web3.eth.accounts.signTransaction(
        {
          to: process.env.VERSUSX_MARKET_ADDRESS,
          data,
          gas: gas * 2,
          gasPrice,
          nonce,
        },
        privateKeyVal
      );
      let transactionReceipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
      const hash = transactionReceipt.hash;
      res.json({
        status: true,
        msg: "success",
        data: String(hash)
      });
      return;
    }
  } catch (error) {
    console.log(error);
    res.send({
      status: false,
      msg: 'Something went wrong'
    });
    return;
  }
});

router.post('/CreateNFT', async function (req, res) {
  try {
    let walletAddress = req.body.walletAddress;
    let nftCollection = req.body.collection;
    let nftType = req.body.type;
    let nftName = req.body.name;
    if (walletAddress == null || nftCollection == null || nftType == null || nftName == null) {
      return res.json({
        status: false,
        msg: 'Paramters must not be null.',
        data: []
      });
    }

    // get image url
    let nftImageInfo = await getDoc(doc(db, "Nfts", nftCollection, nftType, nftName));
    if (!nftImageInfo.exists()) {
      return res.json({
        status: false,
        msg: "NFT Image not found.",
        data: []
      });
    }
    let nftImageData = nftImageInfo.data();
    const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`

    let JSONBody = {
      image_url: nftImageData["image_url"],
      description: nftImageData["description"],
      name: nftName,
      type: nftType,
      ...nftImageData["attributes"]
    }
    let tokenURL = await axios
      .post(url, JSONBody, {
        headers: {
          pinata_api_key: process.env.PINATA_API_KEY,
          pinata_secret_api_key: process.env.PINATA_SECRET_API_KEY,
        },
      })
      .then(function (response) {
        return 'https://eskillzpool.mypinata.cloud/ipfs/' + response.data.IpfsHash;
      })
      .catch(function (error) {
        console.log(error)
        return "";
      })
    console.log("==== Token URL ====");
    console.log(tokenURL);
    console.log("==== Token URL ====");

    if (tokenURL == "") {
      return res.json({
        status: false,
        msg: "Token URL is empty.",
        data: []
      });
    }

    // Get Collection Address
    let cAddr = await axios
      .post(process.env.ADMIN_URL + "/getCollectionInfo", {
        name: nftCollection
      })
      .then(function (response) {
        return response.data.data.collection_address;
      })
      .catch(function (error) {
        console.log(error)
        return "";
      });
    console.log("==== Collection Address ====");
    console.log(cAddr);
    console.log("==== Collection Address ====");

    if (cAddr == "") {
      return res.json({
        status: false,
        msg: "Collection not found.",
        data: []
      });
    }

    let nftContract = new web3.eth.Contract(VersusX721Info.abi, cAddr);

    var count = await web3.eth.getTransactionCount(process.env.TREASURY_WALLET_ADDRESS, "latest"); //get latest nonce
    var nonce = count;
    var gasPrice = 80000000000;
    var chainId = 80001;

    let tx = nftContract.methods.createTokenToUser(walletAddress, tokenURL);
    let gas = await tx.estimateGas({ from: process.env.TREASURY_WALLET_ADDRESS });
    let data = tx.encodeABI();
    let signedTx = await web3.eth.accounts.signTransaction(
      {
        to: cAddr,
        data,
        gas: gas * 2,
        gasPrice,
        nonce,
        chainId
      },
      process.env.MATIC_WALLET_PRIVATEKEY
    );
    let transactionReceipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

    let nftListData = await axios.get(`https://polygon-mumbai.g.alchemy.com/nft/v2/${process.env.ALCHEMY_KEY}/getNFTs?owner=${walletAddress}&contractAddresses[]=${cAddr}&withMetadata=true&pageSize=100`);
    let nftList = nftListData.data.ownedNfts;

    const items = await Promise.all(nftList.map(async nftItem => {
      return {
        id: ethers.BigNumber.from(nftItem["id"]["tokenId"]).toNumber().toString(),
        balance: nftItem["balance"],
        address: nftItem["contract"]["address"],
        thumbnail: nftItem["metadata"]["image_url"],
        title: nftItem["title"],
        description: nftItem["description"],
        metadata: nftItem["metadata"],
        isOwned: true
      };
    }))
    return res.json({
      status: true,
      msg: "success",
      count: items.length,
      page: 1,
      data: items
    });

  } catch (error) {
    console.log(error);
    return res.json({
      status: false,
      msg: 'Something went wrong',
      data: []
    });
  }
});

router.post('/CreateTournament', async function (req, res) {
  try {
    let Name = req.body.Name;
    let MinNumOfPlayers = req.body.MinNumOfPlayers;
    let MaxNumOfPlayers = req.body.MaxNumOfPlayers;
    let EntryFee = req.body.EntryFee;
    let StartDate = req.body.StartDate;
    let Prize1 = req.body.Prize1;
    let Prize2 = req.body.Prize2;
    let Prize3 = req.body.Prize3;
    let PrizeAmount = req.body.PrizeAmount;
    let Creator = req.body.Creator;
    let UserID = req.body.UserID;

    if (
      Creator == null ||
      UserID == null ||
      Name == null ||
      MinNumOfPlayers == null ||
      MaxNumOfPlayers == null ||
      EntryFee == null ||
      StartDate == null ||
      Prize1 == null ||
      Prize2 == null ||
      Prize3 == null
    ) {
      res.json({
        result: false,
        message: 'Requirement Parameters must not be null.'
      });
      return;
    } else {
      let tournamentData = await metakeepInvoke(
        'createTournament',
        [
          Creator,
          Name,
          MinNumOfPlayers,
          MaxNumOfPlayers,
          EntryFee,
          StartDate,
          Prize1,
          Prize2,
          Prize3,
          PrizeAmount
        ],
        TournamentLambda,
        'Create Tournament'
      );
      let eventData = tournamentData.data.events[0];
      console.log(eventData);
      if (tournamentData.status) {
        res.json({
          result: true,
          message: tournamentData.data.transactionHash,
          id: eventData["args"]["id"]
        });
      } else {
        res.json({
          result: false,
          message: 'Failed'
        });
      }
      return;
    }
  } catch (error) {
    res.json({
      result: false,
      message: 'Your Request is not correct.'
    });
    return;
  }
});

router.post('/EnterLobby', async function (req, res) {
  try {
    let TournamentID = req.body.TournamentID;
    let Player = req.body.Player;
    let UserID = req.body.UserID;

    if (
      TournamentID == null ||
      Player == null ||
      UserID == null
    ) {
      res.json({
        result: false,
        message: 'Requirement Parameters must not be null.'
      });
      return;
    } else {
      let tournamentData = await metakeepInvoke(
        'enterLobby',
        [TournamentID, Player],
        TournamentLambda,
        'Enter Lobby'
      );

      if (tournamentData.status) {
        res.json({
          result: true,
          message: tournamentData.data.transactionHash
        });
      } else {
        res.json({
          result: false,
          message: tournamentData.msg
        });
      }
      return;
    }
  } catch (error) {
    res.json({
      result: false,
      message: 'Your Request is not correct.'
    });
    return;
  }
});

router.post('/JoinTournamentMatch', async function (req, res) {
  try {
    let TournamentID = req.body.TournamentID;
    let Amount = req.body.Amount;
    let Player = req.body.Player;
    let UserID = req.body.UserID;

    if (
      TournamentID == null ||
      Player == null ||
      Amount == null ||
      UserID == null
    ) {
      res.json({
        result: false,
        message: 'Requirement Parameters must not be null.'
      });
      return;
    } else {
      let approveData = await metakeepInvoke(
        'approveFrom',
        [Player, TournamentLambda, Amount + ""],
        SkillLambda,
        'Approve'
      );
      if (approveData.status) {
        let tournamentData = await metakeepInvoke(
          'playGame',
          [TournamentID, Player, Amount + ""],
          TournamentLambda,
          'Play Game'
        );

        if (tournamentData.status) {
          res.json({
            result: true,
            message: tournamentData.data.transactionHash
          });
        } else {
          res.json({
            result: false,
            message: tournamentData.msg
          });
        }
      } else {
        res.json({
          result: false,
          message: 'Failed'
        });
      }
      return;
    }
  } catch (error) {
    res.json({
      result: false,
      message: 'Your Request is not correct.'
    });
    return;
  }
});

router.post('/AnnouncementTournament', async function (req, res) {
  try {
    let TournamentID = req.body.TournamentID;
    let Winner1 = req.body.Winner1;
    let Winner2 = req.body.Winner2;
    let Winner3 = req.body.Winner3;
    let Creator = req.body.Creator;
    let UserID = req.body.UserID;

    if (
      TournamentID == null ||
      Creator == null ||
      Winner1 == null ||
      Winner2 == null ||
      Winner3 == null ||
      UserID == null
    ) {
      res.json({
        result: false,
        message: 'Requirement Parameters must not be null.'
      });
      return;
    } else {
      let tournamentData = await metakeepInvoke(
        'announceWinner',
        [TournamentID, Winner1, Winner2, Winner3],
        TournamentLambda,
        'Announce Winner'
      );
      if (tournamentData.status) {
        res.json({
          result: true,
          message: tournamentData.data.transactionHash
        });
      } else {
        res.json({
          result: false,
          message: 'Failed'
        });
      }
      return;
    }
  } catch (error) {
    res.json({
      result: false,
      message: 'Your Request is not correct.'
    });
    return;
  }
});

router.post('/TerminateTournament', async function (req, res) {
  try {
    let TournamentID = req.body.TournamentID;
    let Status = 2;
    let Creator = req.body.Creator;
    let UserID = req.body.UserID;

    if (
      TournamentID == null ||
      Creator == null ||
      Status == null ||
      UserID == null
    ) {
      res.json({
        result: false,
        message: 'Requirement Parameters must not be null.'
      });
      return;
    } else {
      let tournamentData = await metakeepInvoke(
        'terminate',
        [Creator, TournamentID, Status.toString()],
        TournamentLambda,
        'Terminate'
      );
      if (tournamentData.status) {
        res.json({
          result: true,
          message: tournamentData.data.transactionHash
        });
      } else {
        res.json({
          result: false,
          message: 'Failed'
        });
      }
      return;
    }
  } catch (error) {
    res.json({
      result: false,
      message: 'Your Request is not correct.'
    });
    return;
  }
});

router.post('/updateCurrentSkill', async function (req, res) {
  try {
    let UserID = req.body.UserID;
    let Account = req.body.Account;
    if (Account == null || UserID == null) {
      res.send('Account and UserID must not be null.');
      return;
    } else {
      let curBal = await metakeepRead('balanceOf', [Account], SkillLambda);

      var docSnapSportBal = await getDoc(
        doc(db, 'users', `${UserID}`, 'Private', 'WalletBalances')
      );
      if (docSnapSportBal.exists()) {
        await updateDoc(
          doc(db, 'users', `${UserID}`, 'Private', 'WalletBalances'),
          { CurrentSkill: Number(curBal.data / 10 ** 9) }
        );
      } else {
        await setDoc(
          doc(db, 'users', `${UserID}`, 'Private', 'WalletBalances'),
          { CurrentSkill: Number(curBal.data / 10 ** 9), PendingSkill: 0 }
        );
      }

      res.send('Success');
      return;
    }
  } catch {
    res.send('failed');
    return;
  }
});

router.post('/balances', async function (req, res) {
  const axios = require('axios');

  // Wallet address
  // const address = "0xd8da6bf26964af9d7eed9e03e53415d37aa96045";

  // Alchemy URL --> Replace with your API key at the end
  // https://polygon-mumbai.g.alchemy.com/v2/BtlFktvXgjFEzOnUfNnWZ412bfFISYts
  // https://eth-goerli.g.alchemy.com/v2/FNiiCNMvmJn6u8YjoGM7OeEnLBxDz_p_
  const baseURL =
    'https://polygon-mumbai.g.alchemy.com/v2/BtlFktvXgjFEzOnUfNnWZ412bfFISYts';

  // Data for making the request to query token balances
  const data = JSON.stringify({
    jsonrpc: '2.0',
    method: 'alchemy_getTokenBalances',
    headers: {
      'Content-Type': 'application/json'
    },
    params: [`${req.body.address}`, [MaticAddress, SkillLambda]],
    id: 80001
  });

  // config object for making a request with axios
  const config = {
    method: 'post',
    url: baseURL,
    headers: {
      'Content-Type': 'application/json'
    },
    data: data
  };

  // Make the request and print the formatted response:
  let maticBal = await getMaticBalance(req.body.address);
  let result = await axios(config)
    .then((response) => {
      return response.data["result"]["tokenBalances"].map(e => {
        if (e["contractAddress"] == MaticAddress) {
          e["tokenBalance"] = maticBal;
          e["tokenName"] = "MATIC";
        } else if (e["contractAddress"] == SkillLambda) {
          e["tokenBalance"] = parseInt(e["tokenBalance"], 16);
          e["tokenBalance"] /= 10 ** 9;
          e["tokenName"] = "VSX";
        } else {
          e["tokenBalance"] = parseInt(e["tokenBalance"], 16);
        }
        return e;
      })
    })
    .catch((error) => console.log('error', error));

  return res.json(result);
});

async function getSkillAmount(TokenAddress, amount) {
  try {
    let reserveData = await metakeepRead(
      'getReserves',
      [TokenAddress, SkillLambda],
      GetPriceLambda
    );
    let result = Math.floor(Number(amount) / Number(reserveData.data[0]) * Number(reserveData.data[1]));
    return result;
  } catch {
    return 0;
  }
}

async function sendTokenToTreasury(Player, UserID, TokenAddress, Amount) {
  try {
    let privateKey = await getKey(UserID);
    var privateKeyVal = decrypt(privateKey);
    var count = await web3.eth.getTransactionCount(Player, 'latest'); //get latest nonce
    var nonce = count;
    var gasPrice = 80000000000;
    var chainId = 80001;
    let signedTx;
    if (TokenAddress != MaticAddress) {
      let tokenContract = new web3.eth.Contract(MToken, TokenAddress, { from: signer.address });
      let tx = tokenContract.methods.transfer(TreasuryWallet, Amount + "");
      let gas = await tx.estimateGas({ from: Player });
      signedTx = await web3.eth.accounts.signTransaction(
        {
          to: TokenAddress,
          data: tx.encodeABI(),
          gas: gas * 2,
          gasPrice,
          nonce,
          chainId
        },
        privateKeyVal
      );
    } else {
      signedTx = await web3.eth.accounts.signTransaction(
        {
          from: Player,
          to: TreasuryWallet,
          chainId,
          value: Amount + "",
          gas: web3.utils.toHex(5000000),
          gasPrice,
          nonce,
        },
        privateKeyVal
      );
    }
    let transactionReceipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

router.post('/getSkill', async function (req, res) {
  try {
    let Account = req.body.Account;
    if (Account == null) {
      res.send('Account and UserID must not be null.');
      return;
    } else {
      let curBal = await metakeepRead('balanceOf', [Account], SkillLambda);
      res.send(curBal);
      return;
    }
  } catch {
    res.send('failed');
    return;
  }
});

router.post('/getVSXBalance', async function (req, res) {
  try {
    let Account = req.body.Account;
    if (Account == null) {
      res.send('Account and UserID must not be null.');
      return;
    } else {
      let curBal = await metakeepRead('balanceOf', [Account], SkillLambda);
      curBal.data = Number(curBal.data) / 10 ** 9;
      res.send(curBal);
      return;
    }
  } catch {
    res.send('failed');
    return;
  }
});

router.post('/allCueItems', async function (req, res) {
  try {
    let resValSport = await marketCueContract.methods.fetchAllItems().call();
    return res.json(resValSport);
  } catch (err) {
    console.log(err);
    res.send('failed');
    return;
  }
});

// async function profileInfo(){
//   let result = await admin.auth().listUsers();

//   for(let i = 0; i < result.users.length; i++){
//     let e = result.users[i];
//     let userInfoDoc = await getDoc(doc(db, "users", e.uid, "Profile","ProfileData"));
//     if(userInfoDoc.exists()){
//       let walletAddr = userInfoDoc.data()["eSkillzWalletAddress"];
//       console.log(walletAddr);
//       // let curBal = await metakeepRead('balanceOf', [walletAddr], SkillLambda);
//       // console.log(curBal);
//     } 
//   }
// }
// profileInfo();

// router.post('/setSkill', async function (req, res) {
//   try {
    
//     // res.send(resValSport);
//     // let mintData = await metakeepInvoke(
//     //   'mintSportToUser',
//     //   [resValSport, req.body.Account],
//     //   SkillLambda,
//     //   'Mint Sport To User'
//     // );
//     // res.send(mintData);



//     // let walletInfo = [];
//     // await Promise.all(req.body.WalletAmount.map(async (e)=>{
//     //   // try{
//     //   // let resValSport = await sportContract1.methods.balanceOf(e).call();
//     //   // console.log(e, resValSport);
//     //   // if(resValSport != 0){
//     //   //   walletInfo.push({
//     //   //     address: e,
//     //   //     amount: resValSport
//     //   //   });
//     //     let mintData = await metakeepInvoke(
//     //       'mintSportToUser',
//     //       [e.amount, e.address],
//     //       SkillLambda,
//     //       'Mint Sport To User'
//     //     );

//     //     // }}catch{

//     //   // }

//     //   // let userInfoDoc = await getDoc(doc(db, "users", e, "Profile","ProfileData"));
//     //   // if(userInfoDoc.exists()){
//     //   //   let walletAddr = userInfoDoc.data()["eSkillzWalletAddress"];
//     //   //   try{
//     //   //     if(walletAddr){
//     //   //       walletInfo.push(walletAddr);


//     //   //     }
//     //   //   }catch(ee){
//     //   //     console.log(ee);
//     //   //     console.log(walletAddr);
//     //   //   }
//     //   // }
//     // }));

//     // res.send(walletInfo);
//     return ;
//   } catch(err) {
//     console.log(err);
//     res.send('failed');
//     return;
//   }
// });

router.post('/create/proxy', async function (req, res) {
  let metakeepDev = await getDeveloperWallet();
  if (metakeepDev == '') {
    return res.json({
      status: false,
      msg: 'Please check MetaKeep Wallet'
    });
  }
  try {
    let lambdaName = "ProxyMeta";
    let resJson = await axios.post(
      'https://api.metakeep.xyz/v2/app/lambda/create',
      {
        constructor: { args: [metakeepDev, lambdaName, MarketplaceLambda, getInitializationData(marketplaceContract.abi, lambdaName, metakeepDev),] },
        bytecode: proxyMetaContract.bytecode,
        abi: getMergedABI(marketplaceContract.abi, proxyMetaContract.abi),
      },
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'x-api-key': METAKEEP_API_KEY,
          'Idempotency-Key': 'Idempotency-Key' + Math.random().toString()
        }
      }
    );
    return res.json(resJson.data);
  } catch {
    return res.json({
      status: false,
      data: 'something went wrong'
    });
  }
});

router.post('/upgradeProxy', async function (req, res) {
  try {
    const resultJson = await metakeepInvoke(
      "upgradeTo",
      ["0x822ABFb964D8c2defd2Ed1aCDDf5954be6445d12"],
      "0x85cAD4Dc0775960621b7f18e412AD6b98f3996Bd",
      "Upgrade To CustomERC721UpgradeableV2"
    );

    return res.json(resultJson);
  } catch {
    return res.json({
      status: false,
      data: 'something went wrong'
    });
  }
});

router.post('/create/marketGetData', async function (req, res) {
  try {
    let result = await metakeepCreate(
      [MarketplaceLambda],
      'MarketGetDataLambda',
      marketGetDataContract.bytecode,
      marketGetDataContract.abi
    );
    if (result.status == false) {
      return res.send({
        status: false,
        msg: result.msg
      });
    }

    return res.json(result);
  } catch {
    return res.json({
      status: false,
      data: 'something went wrong'
    });
  }
});

router.post('/approveSkillToken', async function (req, res) {
  let approveData = await metakeepInvoke(
    'approveFrom',
    ["0x261ab5E7b2fc81FF04FdD19bF8D3f2b1bfcB5dAF", "0x8954AfA98594b838bda56FE4C12a09D7739D179b", '1000000000000000000000000000'],
    SkillLambda,
    'Approve'
  );
  return res.json(approveData);
});

function getMergedABI(implementationABI, proxyABI) {
  // Remove constructor from implementation ABI
  const abi = implementationABI.filter((item) => {
    return item.type !== "constructor";
  });
  const mergedABI = abi.concat(proxyABI);
  return mergedABI;
}

function getInitializationData(
  implementationABI,
  lambdaName,
  developerAddress
) {
  const web3 = new Web3();
  const initializeABI = implementationABI.find(
    (item) => item.name === "initialize"
  );
  const initializationParameters = [developerAddress, lambdaName];

  return web3.eth.abi.encodeFunctionCall(
    initializeABI,
    initializationParameters
  );
}

async function getPrivateKeyFromWallet(wallet) {
  let result = await getDocs(collectionGroup(db, "Profile"));
  let data = await (new Promise(resolve => {
    result.forEach(doc => {
      let docData = doc.data();
      if (docData["eSkillzWalletAddress"] == wallet) {
        var privateKeyVal = decrypt(docData["eSkillzKey"]);
        resolve(privateKeyVal);
      }
    })
    resolve("");
  }))
  return data;
}

async function recordDailyRakeFee() {
  try {
    const currentHour = moment().format("HH");
    console.log(currentHour);
    if (currentHour == "23") {
      let rakeAmount = await metakeepRead("balanceOf", [BetLambda], SkillLambda);
      let docSnapPrizeInfo = await getDoc(doc(db, 'eskillzGeneral', "PrizeSettings"));
      if (docSnapPrizeInfo.exists()) {
        let docPrizeInfo = docSnapPrizeInfo.data();
        // console.log(docPrizeInfo["address"], docPrizeInfo["percentage"]);
        if (Number(rakeAmount.data) > 0) {
          let yesterdayAmount = Number(rakeAmount.data) * Number(docPrizeInfo["percentage"]) / 100;
          // yesterdayAmount = 10 ** 9;

          if (yesterdayAmount > 0) {
            await metakeepInvoke('setFeeReceiver', [docPrizeInfo["address"]], BetLambda, "setFeeReceiver");
            let withdrawData = await metakeepInvoke('withdraw', [docPrizeInfo["address"], yesterdayAmount.toString()], BetLambda, "withdraw");
            if (!withdrawData.status) {
              console.log("withdrawing is failed");
              setTimeout(recordDailyRakeFee, 5000);
              return;
            }

            let strDate = moment().format("MM-DD-YYYY");
            await setDoc(
              doc(db, 'eskillzRakeHistory', strDate),
              {
                yesterdayAmount,
                rakeAmount: rakeAmount.data,
                percentage: docPrizeInfo["percentage"],
                prizeWallet: docPrizeInfo["address"],
                record_date: new Date().getTime()
              }
            );
            setTimeout(recordDailyRakeFee, 60 * 60 * 1000);
          } else {
            setTimeout(recordDailyRakeFee, 60 * 60 * 1000);
            return;
          }
        } else {
          setTimeout(recordDailyRakeFee, 60 * 60 * 1000);
        }
        return;
      } else {
        setTimeout(recordDailyRakeFee, 5000);
        return;
      }
    } else {
      setTimeout(recordDailyRakeFee, 60 * 60 * 1000);
      return;
    }
  } catch (err) {
    console.log(err);
    setTimeout(recordDailyRakeFee, 5000);
    return;
  }
}

// recordDailyRakeFee();

async function getPendingBalanceList() {
  let result = await getDocs(collectionGroup(db, "Private"));
  let data = await (new Promise(resolve => {
    let pendingList = [];
    result.forEach(doc => {
      let docData = doc.data();
      if (Number(docData["PendingSkill"] || "0") != 0) {
        pendingList.push({
          path: doc.ref.path.replace("/Private/WalletBalances", ""),
          amount: Number(docData["PendingSkill"])
        });
      }
    })
    resolve(pendingList);
  }))
  for (let i = 0; i < data.length; i++) {
    e = data[i];
    console.log("==== START ====");
    console.log(e);
    await setDoc(
      doc(db, 'users', `${e.path.split("/")[1]}`, 'Private', 'WalletBalances'),
      { PendingSkill: 0 }
    );
    console.log("==== END ====");
  }
}
// getPendingBalanceList();
module.exports = router;
