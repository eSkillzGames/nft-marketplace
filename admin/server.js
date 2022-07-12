const express = require('express');
const session = require('express-session');
const path = require('path');
const fs = require('fs')
const cors = require('cors')
const Web3 = require('web3')
const { Console } = require("console");
const md5 = require('md5');
const { verify } = require('crypto');
const app = express();
const nodemailer = require('nodemailer')
const tokenPriceABI = require('./ABIs/GetTokenPrice.json')

require('dotenv').config();

const myLogger = new Console({
  stdout: fs.createWriteStream("log.txt"),
  stderr: fs.createWriteStream("log.txt"),
});
const knex = require('knex')({
    client: 'mysql',
    connection: {
        host : '127.0.0.1',
        port : 3306,
        // user : 'root',
        // password : '',
        // database : 'db_eskills'
        user : process.env.DB_USER,
        password : process.env.DB_PASS,
        database : process.env.DB_NAME
    }
})
const options = {
    reconnect: {
        auto: true,
        delay: 5000, // ms
        maxAttempts: 5,
        onTimeout: false
    },
    keepAlive: true,
    timeout: 20000,
    headers: [{name: 'Access-Control-Allow-Origin', value: '*'}],
    withCredentials: false,
}
const transporter = nodemailer.createTransport({
    port: process.env.MAIL_PORT,
    host: process.env.MAIL_HOST,
    auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
    },
    secure: true,
    secureConnection: false,
    tls: {
        ciphers:'SSLv3'
    }
})

var web3 = new Web3(new Web3.providers.HttpProvider('https://matic-mumbai.chainstacklabs.com/', options))
const baseURL = ""

function convertTimestampToString(timestamp, flag = false) {
    if (flag == false) {
        return new Date(timestamp).toISOString().replace(/T/, ' ').replace(/\..+/, '').replace(/ /g, '_').replace(/:/g, '_').replace(/-/g, '_')
    } else {
        return new Date(timestamp).toISOString().replace(/T/, ' ').replace(/\..+/, '')
    }
}

function hexToBn(hex) {
    if (hex.length % 2) {
        hex = '0' + hex;
    }
  
    var highbyte = parseInt(hex.slice(0, 2), 16)
    var bn = BigInt('0x' + hex);
  
    if (0x80 & highbyte) {
        // bn = ~bn; WRONG in JS (would work in other languages)
    
        // manually perform two's compliment (flip bits, add one)
        // (because JS binary operators are incorrect for negatives)
        bn = BigInt('0b' + bn.toString(2).split('').map(function (i) {
            return '0' === i ? 1 : 0
        }).join('')) + BigInt(1);
        // add the sign character to output string (bytes are unaffected)
        bn = -bn;
    }
  
    return bn;
}

app.use(cors())
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/logout', function (req, res) {
    req.session.user = null
    res.redirect(baseURL + '/#/login')
})

app.use(express.static(path.join(__dirname, '/build')));

app.post('/checkSession', function (req, res) {
    // return res.send('2')

    if (!req.session.user) {
        res.send('0')
        return
    }

    if (req.session.user.verifyCode && req.session.user.verifyCode != '') {
        res.send("2")
    } else if (req.session.user.username && req.session.user.username != '') {
        res.send('1')
    } else {
        res.send('0')
    }
})

app.post('/verifycode', async function (req, res) {
    let verifyCode = req.body.verifyCode

    if (!req.session.user) {
        res.redirect(baseURL + '/#/login')
        return
    }

    if (verifyCode) {
        var rows = await knex('tbl_users').where('username', req.session.user.username).where('password', req.session.user.password).where('verify_code', verifyCode).select('*')

        if (rows.length) {
            req.session.user.verifyCode = rows[0].verify_code

            res.redirect(baseURL + '/#/dashboard')
        } else {
            res.redirect(baseURL + '/#/verifycode')
        }
    } else {
        res.redirect(baseURL + '/#/verifycode')
    }
})

app.post('/login', async function(req, res) {
	// Capture the input fields
	let username = req.body.username;
	let password = md5(req.body.password);
    let email = req.body.email;
	// Ensure the input fields exists and are not empty
	if (username && password) {
        var rows = await knex('tbl_users').where('username', username).where('password', password).select('*')

        if (rows.length) {
            req.session.user = {
                username: username,
                password: password,
                email: email
            }

            var code = md5(username + password + email + new Date().toISOString())

            await knex('tbl_users').where('username', username).where('password', password).update({
                verify_code: code
            })

            const mailData = {
                from: process.env.MAIL_FROM_ADDRESS,
                to: email,
                subject: 'ESKILLZ admin panel verify code',
                text: 'This is your verify code!',
                html: '<b>This is your verify code! </b><br/>\
                    <h1>' + code + '</h1><br/>\
                    Thanks!'
            };

            transporter.sendMail(mailData, function (err, info) {
                if(err)
                    myLogger.log(err)
                else
                    myLogger.log(info);
            });

            res.redirect(baseURL + '/#/verifycode')
        } else {
            res.redirect(baseURL + '/#/login')
        }
	} else {
		res.redirect(baseURL + '/#/login')
	}
});

app.get('/getmintgraph', async function (req, res) {
    var type = req.query.type
    var today = convertTimestampToString(new Date().getTime(), true).split(' ')[0]
    var monthsago
    
    if (type == 'week') {
        monthsago = convertTimestampToString(new Date().getTime() - 86400 * 7000, true).split(' ')[0]
    } else if (type == 'month') {
        monthsago = convertTimestampToString(new Date().getTime() - 86400 * 30000, true).split(' ')[0]
    } else if (type == 'year') {
        monthsago = convertTimestampToString(new Date().getTime() - 86400 * 365000, true).split(' ')[0]
        
        var tmp = monthsago.split('-')
        
        monthsago = tmp[0] + '-' + tmp[1] + '-01'
    }

    var data = {}
    var mints = []
    var rows = await knex('tbl_mint')
        .where('type', 'CUE')
        .where('swapAt', '>=', monthsago + ' 00:00:00')
        .groupBy(knex.raw('DATE(swapAt)'))
        .select(knex.raw('count(swapAt) as MINT'))
        .select(knex.raw('DATE(swapAt) as SWAPAT'))

    for (var i = 0; i < rows.length; i ++) {
        mints[new Date(rows[i].SWAPAT).getTime()] = rows[i].MINT
    }

    data.from = monthsago
    data.to = today
    data.labels = []
    data.mint = []

    var tmpMint = []

    for (var date = new Date(monthsago + ' 00:00:00').getTime(); date <= new Date(today + ' 00:00:00').getTime(); date += 86400000) {
        var tmp = convertTimestampToString(date, true).split(' ')[0]

        if (type == 'year') {
            var tmpMonth = tmp.split('-')[0] + '-' + tmp.split('-')[1]

            if (!tmpMint[tmpMonth]) tmpMint[tmpMonth] = 0

            tmpMint[tmpMonth] += mints[date] ? mints[date] : 0
        } else {
            data.labels.push(tmp)
            data.mint.push(mints[date] ? mints[date] : 0)
        }
    }

    for (var key in tmpMint) {
        data.labels.push(key)
        data.mint.push(tmpMint[key])
    }

    res.send(data)
})

app.get('/getearngraph', async function (req, res) {
    var type = req.query.type
    var today = convertTimestampToString(new Date().getTime(), true).split(' ')[0]
    var monthsago
    
    if (type == 'week') {
        monthsago = convertTimestampToString(new Date().getTime() - 86400 * 7000, true).split(' ')[0]
    } else if (type == 'month') {
        monthsago = convertTimestampToString(new Date().getTime() - 86400 * 30000, true).split(' ')[0]
    } else if (type == 'year') {
        monthsago = convertTimestampToString(new Date().getTime() - 86400 * 365000, true).split(' ')[0]
        
        var tmp = monthsago.split('-')
        
        monthsago = tmp[0] + '-' + tmp[1] + '-01'
    }

    var data = {}
    var earns = []
    var rows = await knex('tbl_earns')
        .where('type', 'CUE')
        .where('swapAt', '>=', monthsago + ' 00:00:00')
        .groupBy(knex.raw('DATE(swapAt)'))
        .select(knex.raw('sum(amountUSD) as EARN'))
        .select(knex.raw('DATE(swapAt) as SWAPAT'))

    for (var i = 0; i < rows.length; i ++) {
        earns[new Date(rows[i].SWAPAT).getTime()] = rows[i].EARN
    }

    data.from = monthsago
    data.to = today
    data.labels = []
    data.earn = []

    var tmpEarn = []

    for (var date = new Date(monthsago + ' 00:00:00').getTime(); date <= new Date(today + ' 00:00:00').getTime(); date += 86400000) {
        var tmp = convertTimestampToString(date, true).split(' ')[0]

        if (type == 'year') {
            var tmpMonth = tmp.split('-')[0] + '-' + tmp.split('-')[1]

            if (!tmpEarn[tmpMonth]) tmpEarn[tmpMonth] = 0

            tmpEarn[tmpMonth] += earns[date] ? earns[date] : 0
        } else {
            data.labels.push(tmp)
            data.earn.push(earns[date] ? earns[date] : 0)
        }
    }

    for (var key in tmpEarn) {
        data.labels.push(key)
        data.earn.push(tmpEarn[key])
    }

    res.send(data)
})

app.listen(80);

var FROMBLOCK = 27041584

const sportTokenAddress = "0x8B65efE0E27D090F6E46E0dFE93E73d3574E5d99";
const esgTokenAddress = "0x6637926e5c038c7ae3d3fd2c2d77c44e8be1ed28";
const tokenPriceAddress = "0x6b186a04C801A3D717621b0B19D018375161bFF8";
const CUENftAddress = "0xd7694bf6715dc2672c3c42558f09114e7a9fe6c3"

var minABI = [
    // balanceOf
    {
      "constant":true,
      "inputs":[{"name":"_owner","type":"address"}],
      "name":"balanceOf",
      "outputs":[{"name":"balance","type":"uint256"}],
      "type":"function"
    }
];
var sportContract = new web3.eth.Contract(minABI, sportTokenAddress);
var esgContract = new web3.eth.Contract(minABI, esgTokenAddress);
var tokenPriceContract = new web3.eth.Contract(tokenPriceABI,tokenPriceAddress);
var esgUSDPrice = 0
var sportUSDPrice = 0

async function getUSDPrices() {
    var res
    
    res = await tokenPriceContract.methods.getPrice(sportTokenAddress).call()
    sportUSDPrice = res[0] * res[2] / res[1] / 10**6

    res = await tokenPriceContract.methods.getPrice(esgTokenAddress).call()
    esgUSDPrice = res[0] * res[2] / res[1] / 10**6
}

async function init() {
    try {
        myLogger.log(FROMBLOCK)
        await getUSDPrices()
        var TOBLOCK = await web3.eth.getBlockNumber()

        if (TOBLOCK > FROMBLOCK + 999) {
            TOBLOCK = FROMBLOCK + 999
        }
       
        var rows = await web3.eth.getPastLogs({
            fromBlock: FROMBLOCK,
            toBlock: TOBLOCK,
            topics: [
                '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
                '0x0000000000000000000000000000000000000000000000000000000000000000'
            ],
            address: CUENftAddress
        })

        var rows_inserted = await knex('tbl_mint')
            .where('type', 'CUE')
            .select(knex.raw('blockNumber as BLOCKNUM'))
        
        var latestBlockNum;
        if(rows_inserted.length == 0 ){
            latestBlockNum = 0;
        }
        else{
            latestBlockNum = rows_inserted[rows_inserted.length-1].BLOCKNUM;
        }

        for (var i = 0; i < rows.length; i ++) {
            var timestamp = (await web3.eth.getBlock(rows[i].blockNumber)).timestamp * 1000
            
            if(latestBlockNum < rows[i].blockNumber){
                await knex('tbl_mint').insert({
                    type: 'CUE',
                    swapAt: convertTimestampToString(timestamp, true),
                    transactionHash: rows[i].transactionHash,
                    blockNumber: rows[i].blockNumber
                })
            }
        }

        var rows = await web3.eth.getPastLogs({
            fromBlock: FROMBLOCK,
            toBlock: TOBLOCK,
            topics: [
                '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
                null,
                '0x00000000000000000000000089c30f2af966ed9e733e5dcfc76ae984eaaf5373'
            ],
            address: esgTokenAddress
        })

        var rows_inserted2 = await knex('tbl_earns')
            .where('type', 'CUE')
            .select(knex.raw('blockNumber as BLOCKNUM'))

        var latestBlockNum2;
        if(rows_inserted2.length == 0 ){
            latestBlockNum2 = 0;
        }
        else{
            latestBlockNum2 = rows_inserted2[rows_inserted2.length-1].BLOCKNUM;
        }

        for (var i = 0; i < rows.length; i ++) {
            if (rows[i].topics[1] == '0x0000000000000000000000000000000000000000000000000000000000000000') continue
            var amount = Number.parseInt(hexToBn(rows[i].data.substr(2, 64))) / 10 ** 9
            var timestamp = (await web3.eth.getBlock(rows[i].blockNumber)).timestamp * 1000
            
            if(latestBlockNum2 < rows[i].blockNumber){
                await knex('tbl_earns').insert({
                    type: 'CUE',
                    swapAt: convertTimestampToString(timestamp, true),
                    amount: amount,
                    amountUSD: amount * esgUSDPrice,
                    amountType: 'ESG',
                    blockNumber: rows[i].blockNumber,
                    transactionHash: rows[i].transactionHash,
                })
            }
            
        }

        var rows = await web3.eth.getPastLogs({
            fromBlock: FROMBLOCK,
            toBlock: TOBLOCK,
            topics: [
                '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
                null,
                '0x00000000000000000000000089c30f2af966ed9e733e5dcfc76ae984eaaf5373'
            ],
            address: sportTokenAddress
        })

        for (var i = 0; i < rows.length; i ++) {
            if (rows[i].topics[1] == '0x0000000000000000000000000000000000000000000000000000000000000000') continue
            var amount = Number.parseInt(hexToBn(rows[i].data.substr(2, 64))) / 10 ** 9
            var timestamp = (await web3.eth.getBlock(rows[i].blockNumber)).timestamp * 1000
                       
            if(latestBlockNum2 < rows[i].blockNumber){
                await knex('tbl_earns').insert({
                    type: 'CUE',
                    swapAt: convertTimestampToString(timestamp, true),
                    amount: amount,
                    amountUSD: amount * sportUSDPrice,
                    amountType: 'SPORT',
                    blockNumber: rows[i].blockNumber,
                    transactionHash: rows[i].transactionHash,
                })
            }            
        }

        if (TOBLOCK - FROMBLOCK == 999) {
            setTimeout(init, 500)
        } else {
            setTimeout(init, 60000)
        }

        FROMBLOCK = TOBLOCK + 1
    } catch (err) {
        myLogger.log(err)
    }
}

init()