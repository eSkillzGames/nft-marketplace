const express = require('express')
const session = require('express-session')
const moment = require('moment')
const path = require('path')
const fs = require('fs')
const cors = require('cors')
const Web3 = require('web3')
const { Console } = require('console')
const md5 = require('md5')
const { verify } = require('crypto')
const app = express()
const nodemailer = require('nodemailer')
// const tokenPriceABI = require('./ABIs/GetTokenPrice.json')
const tokenPriceABI = require('./ABIs/GetPrice_m.json').abi
// const marketCueABI = require('./src/ABIs/Marketplace.json');
const marketCueABI = require('./ABIs/Marketplace_m1.json').abi
// const marketCardABI = require('./src/ABIs/Marketplace_CARD.json');
const marketCardABI = require('./ABIs/Marketplace_m1.json').abi
const { CONNREFUSED } = require('dns')
const admin = require('firebase-admin')
const credentials = require('./serviceAccountKey.json')

admin.initializeApp({
  credential: admin.credential.cert(credentials),
})
const auth = admin.auth()
require('dotenv').config()

const myLogger = new Console({
  stdout: fs.createWriteStream('log.txt'),
  stderr: fs.createWriteStream('log.txt'),
})
const knex = require('knex')({
  client: 'mysql',
  connection: {
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: '',
    database: 'eskillza_db',
    // user: 'versusxa_admin',
    // password: 'F7p_vJ1XE]Tw',
    // database: 'versusxa_admin'
  },
})
const options = {
  reconnect: {
    auto: true,
    delay: 5000, // ms
    maxAttempts: 5,
    onTimeout: false,
  },
  keepAlive: true,
  timeout: 20000,
  headers: [{ name: 'Access-Control-Allow-Origin', value: '*' }],
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
    ciphers: 'SSLv3',
  },
})

var web3 = new Web3(new Web3.providers.HttpProvider('https://matic-mumbai.chainstacklabs.com/', options))
const baseURL = 'https://eskillzadmin.net'

function convertTimestampToString(timestamp, flag = false) {
  if (flag == false) {
    return new Date(timestamp).toISOString().replace(/T/, ' ').replace(/\..+/, '').replace(/ /g, '_').replace(/:/g, '_').replace(/-/g, '_')
  } else {
    return new Date(timestamp).toISOString().replace(/T/, ' ').replace(/\..+/, '')
  }
}

function hexToBn(hex) {
  if (hex.length % 2) {
    hex = '0' + hex
  }

  var highbyte = parseInt(hex.slice(0, 2), 16)
  var bn = BigInt('0x' + hex)

  if (0x80 & highbyte) {
    // bn = ~bn; WRONG in JS (would work in other languages)

    // manually perform two's compliment (flip bits, add one)
    // (because JS binary operators are incorrect for negatives)
    bn =
      BigInt(
        '0b' +
          bn
            .toString(2)
            .split('')
            .map(function (i) {
              return '0' === i ? 1 : 0
            })
            .join(''),
      ) + BigInt(1)
    // add the sign character to output string (bytes are unaffected)
    bn = -bn
  }

  return bn
}

app.use(cors())
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
  }),
)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/logout', function (req, res) {
  req.session.user = null
  res.redirect(baseURL + '/#/login')
})

app.use(express.static(path.join(__dirname, '/build')))

app.post('/checkSession', function (req, res) {
//   res.send('2')
//   return
  if (!req.session.user) {
    res.send('0')
    return
  }

  if (req.session.user.verifyCode && req.session.user.verifyCode != '') {
    res.send('2')
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

app.post('/login', async function (req, res) {
  // Capture the input fields
  let username = req.body.username
  let password = md5(req.body.password)
  let email = req.body.email

  // Ensure the input fields exists and are not empty
  if (username && password) {
    var rows = await knex('tbl_users').where('username', username).where('password', password).select('*')

    if (rows.length) {
      req.session.user = {
        username: username,
        password: password,
        email: email,
      }

      var code = md5(username + password + email + new Date().toISOString())

      await knex('tbl_users').where('username', username).where('password', password).update({
        verify_code: code,
      })

      const mailData = {
        from: process.env.MAIL_FROM_ADDRESS,
        to: email,
        subject: 'ESKILLZ admin panel verify code',
        text: 'This is your verify code!',
        html: '<b>This is your verify code! </b><br/>\
                    <h1>' + code + '</h1><br/>\
                    Thanks!',
      }

      transporter.sendMail(mailData, function (err, info) {
        if (err) myLogger.log(err)
        else myLogger.log(info)
      })

      res.redirect(baseURL + '/#/verifycode')
      // return res.json({
      //     status: true,
      //     msg: "Success"
      // });
    } else {
      res.redirect(baseURL + '/#/login')
      // return res.json({
      //     status: false,
      //     msg: "Username or Password is invalid."
      // });
    }
  } else {
    res.redirect(baseURL + '/#/login')
    // return res.json({
    //     status: false,
    //     msg: "Username or Password is invalid."
    // });
  }
})

app.get('/getmintgraph', async function (req, res) {
  var type = req.query.type
  var nftType = req.query.nftType
  var today = convertTimestampToString(new Date().getTime(), true).split(' ')[0]
  var monthsago

  if (type == 'week') {
    monthsago = convertTimestampToString(new Date().getTime() - 86400 * 7000, true).split(' ')[0]
  } else if (type == 'month') {
    monthsago = convertTimestampToString(new Date().getTime() - 86400 * 30000, true).split(' ')[0]
  } else if (type == '3month') {
    monthsago = convertTimestampToString(new Date().getTime() - 86400 * 90000, true).split(' ')[0]
  } else if (type == 'year') {
    monthsago = convertTimestampToString(new Date().getTime() - 86400 * 365000, true).split(' ')[0]

    var tmp = monthsago.split('-')

    monthsago = tmp[0] + '-' + tmp[1] + '-01'
  }

  var data = {}
  var mints = []
  var rows = await knex('tbl_mint')
    .where('type', nftType)
    .where('swapAt', '>=', monthsago + ' 00:00:00')
    .groupBy(knex.raw('DATE(swapAt)'))
    .select(knex.raw('count(swapAt) as MINT'))
    .select(knex.raw('DATE(swapAt) as SWAPAT'))
  for (var i = 0; i < rows.length; i++) {
    mints[rows[i].SWAPAT.getTime()] = rows[i].MINT
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

app.get('/getTotalMint', async function (req, res) {
  var type = req.query.type
  var nftType = req.query.nftType
  var today = convertTimestampToString(new Date().getTime(), true).split(' ')[0]
  var monthsago

  if (type == 'week') {
    monthsago = convertTimestampToString(new Date().getTime() - 86400 * 7000, true).split(' ')[0]
  } else if (type == 'month') {
    monthsago = convertTimestampToString(new Date().getTime() - 86400 * 30000, true).split(' ')[0]
  } else if (type == '3month') {
    monthsago = convertTimestampToString(new Date().getTime() - 86400 * 90000, true).split(' ')[0]
  } else if (type == 'year') {
    monthsago = convertTimestampToString(new Date().getTime() - 86400 * 365000, true).split(' ')[0]

    var tmp = monthsago.split('-')

    monthsago = tmp[0] + '-' + tmp[1] + '-01'
  }

  var data = {}
  var rowsTotal = await knex('tbl_mint').where('type', nftType).select('*')
  var rows = await knex('tbl_mint')
    .where('type', nftType)
    .where('swapAt', '>=', monthsago + ' 00:00:00')
    .select('*')

  data.from = monthsago
  data.to = today
  data.total = rowsTotal.length
  data.selCount = rows.length
  res.send(data)
})

app.get('/getUsergraph', async function (req, res) {
  var type = req.query.type
  var today = moment().format('YYYY-MM-DD') //convertTimestampToString(new Date().getTime(), true).split(' ')[0]
  var monthsago

  if (type == 'week') {
    // monthsago = convertTimestampToString(new Date().getTime() - 86400 * 7000, true).split(' ')[0]
    monthsago = moment().subtract(7, 'd').format('YYYY-MM-DD')
  } else if (type == 'month') {
    // monthsago = convertTimestampToString(new Date().getTime() - 86400 * 30000, true).split(' ')[0]
    monthsago = moment().subtract(1, 'months').format('YYYY-MM-DD')
  } else if (type == '3month') {
    // monthsago = convertTimestampToString(new Date().getTime() - 86400 * 90000, true).split(' ')[0]
    monthsago = moment().subtract(3, 'months').format('YYYY-MM-DD')
  } else if (type == 'year') {
    // monthsago = convertTimestampToString(new Date().getTime() - 86400 * 365000, true).split(' ')[0]

    // var tmp = monthsago.split('-')

    // monthsago = tmp[0] + '-' + tmp[1] + '-01'
    monthsago = moment().subtract(1, 'years').format('YYYY-MM-DD')
  }
  console.log(today, monthsago)

  var data = {}
  var mints = {}
  var rows = await knex('tbl_auth_users')
    .where('createTime', '>=', monthsago + ' 00:00:00')
    .groupBy(knex.raw('DATE(createTime)'))
    .select(knex.raw('count(createTime) as MINT'))
    .select(knex.raw('DATE(createTime) as CRE'))
  for (var i = 0; i < rows.length; i++) {
    let unix = moment(rows[i].CRE).format('YYYY-MM-DD')
    mints[unix] = rows[i].MINT
  }

  console.log(mints)
  data.from = monthsago
  data.to = today
  data.labels = []
  data.user = []

  var tmpMint = []

  for (var date = moment(monthsago + ' 00:00:00').unix(); date <= moment(today + ' 00:00:00').unix(); date += 86400) {
    var tmp = moment.unix(date).format('YYYY-MM-DD') //convertTimestampToString(date, true).split(' ')[0]

    if (type == 'year') {
      var tmpMonth = tmp.split('-')[0] + '-' + tmp.split('-')[1]

      if (!tmpMint[tmpMonth]) tmpMint[tmpMonth] = 0

      tmpMint[tmpMonth] += mints[tmp] ? mints[tmp] : 0
    } else {
      data.labels.push(tmp)
      data.user.push(mints[tmp] ? mints[tmp] : 0)
    }
  }
  console.log(data.user)

  for (var key in tmpMint) {
    data.labels.push(key)
    data.user.push(tmpMint[key])
  }

  res.send(data)
})

app.get('/getTotalUsers', async function (req, res) {
  var type = req.query.type
  var today = convertTimestampToString(new Date().getTime(), true).split(' ')[0]
  console.log(today)
  var monthsago

  if (type == 'week') {
    monthsago = convertTimestampToString(new Date().getTime() - 86400 * 7000, true).split(' ')[0]
  } else if (type == 'month') {
    monthsago = convertTimestampToString(new Date().getTime() - 86400 * 30000, true).split(' ')[0]
  } else if (type == '3month') {
    monthsago = convertTimestampToString(new Date().getTime() - 86400 * 90000, true).split(' ')[0]
  } else if (type == 'year') {
    monthsago = convertTimestampToString(new Date().getTime() - 86400 * 365000, true).split(' ')[0]

    var tmp = monthsago.split('-')

    monthsago = tmp[0] + '-' + tmp[1] + '-01'
  }

  var data = {}
  var rowsTotal = await knex('tbl_auth_users').select('*')
  var rows = await knex('tbl_auth_users')
    .where('createTime', '>=', monthsago + ' 00:00:00')
    .select('*')

  data.from = monthsago
  data.to = today
  data.total = rowsTotal.length
  data.selCount = rows.length
  res.send(data)
})

app.get('/getearngraph', async function (req, res) {
  var type = req.query.type
  var earnType = req.query.earnType
  var amountType = req.query.amountType
  var today = convertTimestampToString(new Date().getTime(), true).split(' ')[0]
  var monthsago

  if (type == 'week') {
    monthsago = convertTimestampToString(new Date().getTime() - 86400 * 7000, true).split(' ')[0]
  } else if (type == 'month') {
    monthsago = convertTimestampToString(new Date().getTime() - 86400 * 30000, true).split(' ')[0]
  } else if (type == '3month') {
    monthsago = convertTimestampToString(new Date().getTime() - 86400 * 90000, true).split(' ')[0]
  } else if (type == 'year') {
    monthsago = convertTimestampToString(new Date().getTime() - 86400 * 365000, true).split(' ')[0]

    var tmp = monthsago.split('-')

    monthsago = tmp[0] + '-' + tmp[1] + '-01'
  }

  var data = {}
  var earns = []
  var rows = await knex('tbl_earns')
    .where('type', earnType)
    .where('amountType', amountType)
    .where('swapAt', '>=', monthsago + ' 00:00:00')
    .groupBy(knex.raw('DATE(swapAt)'))
    .select(knex.raw('sum(amount) as EARN'))
    .select(knex.raw('DATE(swapAt) as SWAPAT'))

  for (var i = 0; i < rows.length; i++) {
    earns[rows[i].SWAPAT.getTime()] = rows[i].EARN
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

app.get('/getmarketearngraph', async function (req, res) {
  var type = req.query.type
  var nftType = req.query.nftType
  var today = convertTimestampToString(new Date().getTime(), true).split(' ')[0]
  var monthsago

  if (type == 'week') {
    monthsago = convertTimestampToString(Number(new Date().getTime()) - 86400 * 7000, true).split(' ')[0]
  } else if (type == 'month') {
    monthsago = convertTimestampToString(new Date().getTime() - 86400 * 30000, true).split(' ')[0]
  } else if (type == '3month') {
    monthsago = convertTimestampToString(new Date().getTime() - 86400 * 90000, true).split(' ')[0]
  } else if (type == 'year') {
    monthsago = convertTimestampToString(new Date().getTime() - 86400 * 365000, true).split(' ')[0]

    var tmp = monthsago.split('-')

    monthsago = tmp[0] + '-' + tmp[1] + '-01'
  }

  var data = {}
  var earns = []
  var fees = []
  var rows = await knex('tbl_market_matic_earn').where('type', nftType).where('Date', '>=', monthsago).select(knex.raw('FeeAmounts as FEE')).select(knex.raw('EarnAmounts as EARN')).select(knex.raw('DATE(Date) as DATE'))

  for (var i = 0; i < rows.length; i++) {
    earns[rows[i].DATE.getTime()] = rows[i].EARN
    fees[rows[i].DATE.getTime()] = rows[i].FEE
  }
  data.from = monthsago
  data.to = today
  data.labels = []
  data.earn = []
  data.fee = []

  var tmpEarn = []
  var tmpFee = []

  for (var date = new Date(monthsago + 'T00:00:00.000Z').getTime(); date <= new Date(today + 'T00:00:00.000Z').getTime(); date += 86400000) {
    var tmp = convertTimestampToString(date, true).split(' ')[0]

    if (type == 'year') {
      var tmpMonth = tmp.split('-')[0] + '-' + tmp.split('-')[1]
      if (!tmpEarn[tmpMonth]) tmpEarn[tmpMonth] = 0
      if (!tmpFee[tmpMonth]) tmpFee[tmpMonth] = 0
      tmpEarn[tmpMonth] += earns[date] ? earns[date] : 0
      tmpFee[tmpMonth] += fees[date] ? fees[date] : 0
    } else {
      data.labels.push(tmp)
      data.earn.push(earns[date] ? earns[date] : 0)
      data.fee.push(fees[date] ? fees[date] : 0)
    }
  }

  for (var key in tmpEarn) {
    data.labels.push(key)
    data.earn.push(tmpEarn[key])
    data.fee.push(tmpFee[key])
  }

  res.send(data)
})

app.get('/getSelectMarketEarn', async function (req, res) {
  var type = req.query.type
  var earnType = req.query.earnType
  var amountType = req.query.amountType
  var monthsago

  if (type == 'week') {
    monthsago = convertTimestampToString(new Date().getTime() - 86400 * 7000, true).split(' ')[0]
  } else if (type == 'month') {
    monthsago = convertTimestampToString(new Date().getTime() - 86400 * 30000, true).split(' ')[0]
  } else if (type == '3month') {
    monthsago = convertTimestampToString(new Date().getTime() - 86400 * 90000, true).split(' ')[0]
  } else if (type == 'year') {
    monthsago = convertTimestampToString(new Date().getTime() - 86400 * 365000, true).split(' ')[0]

    var tmp = monthsago.split('-')

    monthsago = tmp[0] + '-' + tmp[1] + '-01'
  }

  var data = {}
  var rows = await knex('tbl_market_matic_earn').where('Type', earnType).where('Date', '>=', monthsago).select(knex.raw('FeeAmounts as FEE')).select(knex.raw('EarnAmounts as EARN'))
  var rowsTotal = await knex('tbl_market_matic_earn').where('Type', earnType).select(knex.raw('FeeAmounts as FEE')).select(knex.raw('EarnAmounts as EARN'))

  var total = 0
  var sel = 0

  for (var i = 0; i < rows.length; i++) {
    if (amountType == 'FEE') {
      sel += rows[i].FEE
    } else {
      sel += rows[i].EARN
    }
  }

  for (var i = 0; i < rowsTotal.length; i++) {
    if (amountType == 'FEE') {
      total += rowsTotal[i].FEE
    } else {
      total += rowsTotal[i].EARN
    }
  }

  data.total = total
  data.sel = sel
  res.send(data)
})

app.get('/getSelectEarn', async function (req, res) {
  var type = req.query.type
  var earnType = req.query.earnType
  var amountType = req.query.amountType
  var monthsago

  if (type == 'week') {
    monthsago = convertTimestampToString(new Date().getTime() - 86400 * 7000, true).split(' ')[0]
  } else if (type == 'month') {
    monthsago = convertTimestampToString(new Date().getTime() - 86400 * 30000, true).split(' ')[0]
  } else if (type == '3month') {
    monthsago = convertTimestampToString(new Date().getTime() - 86400 * 90000, true).split(' ')[0]
  } else if (type == 'year') {
    monthsago = convertTimestampToString(new Date().getTime() - 86400 * 365000, true).split(' ')[0]

    var tmp = monthsago.split('-')

    monthsago = tmp[0] + '-' + tmp[1] + '-01'
  }

  var data = {}
  var rows = await knex('tbl_earns')
    .where('type', earnType)
    .where('amountType', amountType)
    .where('swapAt', '>=', monthsago + ' 00:00:00')
    .select(knex.raw('amountUSD as USD'))
    .select(knex.raw('amount as AMOUNT'))

  var tokenbal = 0
  var usdbal = 0

  for (var i = 0; i < rows.length; i++) {
    usdbal += rows[i].USD
    tokenbal += rows[i].AMOUNT
  }

  data.token = tokenbal
  data.usd = usdbal
  res.send(data)
})

app.get('/getTotalEarn', async function (req, res) {
  var sportbal = 0
  var esgbal = 0
  var sportUsdbal = 0
  var esgUsdbal = 0
  var data = {}
  var rows = await knex('tbl_earns').where('amountType', 'SPORT').select(knex.raw('amountUSD as USD')).select(knex.raw('amount as AMOUNT'))

  for (var i = 0; i < rows.length; i++) {
    sportUsdbal += rows[i].USD
    sportbal += rows[i].AMOUNT
  }
  var rows1 = await knex('tbl_earns').where('amountType', 'ESGFEE').select(knex.raw('amountUSD as USD')).select(knex.raw('amount as AMOUNT'))

  for (var i = 0; i < rows1.length; i++) {
    esgUsdbal += rows1[i].USD
    esgbal += rows1[i].AMOUNT
  }
  data.sportUsd = sportUsdbal
  data.sport = sportbal
  data.esgUsd = esgUsdbal
  data.esg = esgbal
  res.send(data)
})

app.get('/getSportMintgraph', async function (req, res) {
  var type = req.query.type
  var amountType = req.query.amountType
  var today = convertTimestampToString(new Date().getTime(), true).split(' ')[0]
  var monthsago

  if (type == 'week') {
    monthsago = convertTimestampToString(new Date().getTime() - 86400 * 7000, true).split(' ')[0]
  } else if (type == 'month') {
    monthsago = convertTimestampToString(new Date().getTime() - 86400 * 30000, true).split(' ')[0]
  } else if (type == '3month') {
    monthsago = convertTimestampToString(new Date().getTime() - 86400 * 90000, true).split(' ')[0]
  } else if (type == 'year') {
    monthsago = convertTimestampToString(new Date().getTime() - 86400 * 365000, true).split(' ')[0]

    var tmp = monthsago.split('-')

    monthsago = tmp[0] + '-' + tmp[1] + '-01'
  }

  var data = {}
  var mints = []
  var rows = await knex('tbl_erc20_mint')
    .where('amountType', amountType)
    .where('swapAt', '>=', monthsago + ' 00:00:00')
    .groupBy(knex.raw('DATE(swapAt)'))
    .select(knex.raw('sum(amount) as MINT'))
    .select(knex.raw('DATE(swapAt) as SWAPAT'))

  for (var i = 0; i < rows.length; i++) {
    mints[rows[i].SWAPAT.getTime()] = rows[i].MINT
  }

  data.from = monthsago
  data.to = today
  data.labels = []
  data.mint = []

  var tmpEarn = []
  for (var date = new Date(monthsago + ' 00:00:00').getTime(); date <= new Date(today + ' 00:00:00').getTime(); date += 86400000) {
    var tmp = convertTimestampToString(date, true).split(' ')[0]

    if (type == 'year') {
      var tmpMonth = tmp.split('-')[0] + '-' + tmp.split('-')[1]

      if (!tmpEarn[tmpMonth]) tmpEarn[tmpMonth] = 0

      tmpEarn[tmpMonth] += mints[date] ? mints[date] : 0
    } else {
      data.labels.push(tmp)
      data.mint.push(mints[date] ? mints[date] : 0)
    }
  }

  for (var key in tmpEarn) {
    data.labels.push(key)
    data.mint.push(tmpEarn[key])
  }

  res.send(data)
})

app.get('/getTotalMintSport', async function (req, res) {
  var type = req.query.type
  var amountType = req.query.amountType
  var monthsago

  if (type == 'week') {
    monthsago = convertTimestampToString(new Date().getTime() - 86400 * 7000, true).split(' ')[0]
  } else if (type == 'month') {
    monthsago = convertTimestampToString(new Date().getTime() - 86400 * 30000, true).split(' ')[0]
  } else if (type == '3month') {
    monthsago = convertTimestampToString(new Date().getTime() - 86400 * 90000, true).split(' ')[0]
  } else if (type == 'year') {
    monthsago = convertTimestampToString(new Date().getTime() - 86400 * 365000, true).split(' ')[0]

    var tmp = monthsago.split('-')

    monthsago = tmp[0] + '-' + tmp[1] + '-01'
  }

  var data = {}
  var rows = await knex('tbl_erc20_mint')
    .where('amountType', amountType)
    .where('swapAt', '>=', monthsago + ' 00:00:00')
    .select(knex.raw('amount as AMOUNT'))

  var token = 0
  var total = 0

  for (var i = 0; i < rows.length; i++) {
    token += rows[i].AMOUNT
  }

  var rowsTotal = await knex('tbl_erc20_mint').where('amountType', amountType).select(knex.raw('amount as AMOUNT'))
  for (var i = 0; i < rowsTotal.length; i++) {
    total += rowsTotal[i].AMOUNT
  }
  data.sel = token
  data.total = total
  res.send(data)
})

app.post('/addCollection', async function (req, res) {
  try {
    await knex('tbl_collections').insert({
      collection_name: req.body.name,
      collection_symbol: req.body.symbol,
      collection_address: req.body.address,
      collection_type: req.body.type,
      properties: req.body.properties,
      is_del: 0,
    })
    let result = await knex('tbl_collections').where('is_del', 0).select('*')
    return res.json({
      status: true,
      msg: 'success',
      data: result,
    })
  } catch (e) {
    console.log(e)
    return res.json({
      status: false,
      msg: 'something went wrong',
      data: [],
    })
  }
})

app.post('/saveCollection', async function (req, res) {
  try {
    await knex('tbl_collections').where('id', req.body.id).update({
      collection_name: req.body.collection_name,
      collection_symbol: req.body.collection_symbol,
      collection_address: req.body.collection_address,
      collection_type: req.body.collection_type,
      properties: req.body.properties,
      is_del: 0,
    })
    let result = await knex('tbl_collections').where('is_del', 0).select('*')
    return res.json({
      status: true,
      msg: 'success',
      data: result,
    })
  } catch (e) {
    console.log(e)
    return res.json({
      status: false,
      msg: 'something went wrong',
      data: [],
    })
  }
})

app.post('/getCollections', async function (req, res) {
  try {
    let result = await knex('tbl_collections').where('is_del', 0).select('*')
    return res.json({
      status: true,
      msg: 'success',
      data: result,
    })
  } catch (e) {
    console.log(e)

    return res.json({
      status: false,
      msg: 'something went wrong',
      data: [],
    })
  }
})

app.post('/deleteCollections', async function (req, res) {
  try {
    await knex('tbl_collections').where('id', req.body.id).update({
      is_del: 1,
    })
    let result = await knex('tbl_collections').where('is_del', 0).select('*')
    return res.json({
      status: true,
      msg: 'success',
      data: result,
    })
  } catch (e) {
    console.log(e)
    return res.json({
      status: false,
      msg: 'something went wrong',
      data: [],
    })
  }
})

app.post('/getCollectionInfoById', async function (req, res) {
  try {
    let result = await knex('tbl_collections').where('is_del', 0).where('id', req.body.id).select('*')
    if (result.length > 0) {
      return res.json({
        status: true,
        msg: 'success',
        data: result[0],
      })
    }
    return res.json({
      status: false,
      msg: 'empty',
      data: null,
    })
  } catch (e) {
    console.log(e)

    return res.json({
      status: false,
      msg: 'something went wrong',
      data: null,
    })
  }
})

app.post('/getCollectionInfo', async function (req, res) {
  try {
    let result = await knex('tbl_collections').where('is_del', 0).where('collection_name', req.body.name).select('*')
    if (result.length > 0) {
      return res.json({
        status: true,
        msg: 'success',
        data: result[0],
      })
    }
    return res.json({
      status: false,
      msg: 'empty',
      data: null,
    })
  } catch (e) {
    console.log(e)

    return res.json({
      status: false,
      msg: 'something went wrong',
      data: null,
    })
  }
})

app.post('/create_spgame', async function (req, res) {
  try {
    await knex('sp_games').insert({
      player_uid: req.body.UserID,
      player: req.body.CreatePlayer,
      game_id: req.body.GameID,
      type: 0,
      created_at: moment().format('YYYY-MM-DD HH:mm:ss'),
      wager: Number(req.body.BetAmounts) / 10 ** 9,
      token: req.body.TokenAddress,
    })

    return res.json({
      status: true,
    })
  } catch (e) {
    console.log(e)
    return res.json({
      status: false,
    })
  }
})

app.post('/create_mpgame', async function (req, res) {
  try {
    await knex('mp_games').insert({
      player_uid: req.body.UserID_Creator,
      player: req.body.CreatePlayer,
      joiner_uid: req.body.UserID_Joiner,
      joiner: req.body.JoinPlayer,
      game_id: req.body.GameID,
      type: 0,
      created_at: moment().format('YYYY-MM-DD HH:mm:ss'),
      wager: Number(req.body.BetAmounts) / 10 ** 9,
      token: req.body.TokenAddress,
    })

    return res.json({
      status: true,
    })
  } catch (e) {
    console.log(e)
    return res.json({
      status: false,
    })
  }
})

app.post('/spgames', async function (req, res) {
  var type = req.query.type
  var today = moment().format('YYYY-MM-DD')
  var monthsago

  if (type == 'week') {
    monthsago = moment().subtract(7, 'd').format('YYYY-MM-DD')
  } else if (type == 'month') {
    monthsago = moment().subtract(1, 'months').format('YYYY-MM-DD')
  } else if (type == '3month') {
    monthsago = moment().subtract(3, 'months').format('YYYY-MM-DD')
  } else if (type == 'year') {
    monthsago = moment().subtract(1, 'years').format('YYYY-MM-DD')
  }

  var data = {}
  var mints = {}
  var wagers = {}
  var rows = await knex('sp_games')
    .where('created_at', '>=', monthsago + ' 00:00:00')
    .groupBy(knex.raw('DATE(created_at)'))
    .select(knex.raw('SUM(wager) as WAGER'))
    .select(knex.raw('count(created_at) as CNT'))
    .select(knex.raw('DATE(created_at) as CRE'))
    
  for (var i = 0; i < rows.length; i++) {
    let unix = moment(rows[i].CRE).format('YYYY-MM-DD')
    mints[unix] = rows[i].CNT
    wagers[unix] = rows[i].WAGER
  }

  console.log(mints)
  data.from = monthsago
  data.to = today
  data.labels = []
  data.user = []
  data.wager = []
  
  var rowsTotal = await knex('sp_games').select('*')
  var rowsSelected = await knex('sp_games')
    .where('created_at', '>=', monthsago + ' 00:00:00')
    .select('*')

  data.total = rowsTotal.length
  data.selCount = rowsSelected.length

  var wagerTotal = await knex('sp_games').select(knex.raw('SUM(wager) as WAGER'))
  var wagerSelected = await knex('sp_games')
    .where('created_at', '>=', monthsago + ' 00:00:00')
    .select(knex.raw('SUM(wager) as WAGER'))

  data.totalWager = wagerTotal[0].WAGER
  data.selWager = wagerSelected[0].WAGER

  var tmpMint = []
  var tmpWager = []

  for (var date = moment(monthsago + ' 00:00:00').unix(); date <= moment(today + ' 00:00:00').unix(); date += 86400) {
    var tmp = moment.unix(date).format('YYYY-MM-DD')

    if (type == 'year') {
      var tmpMonth = tmp.split('-')[0] + '-' + tmp.split('-')[1]

      if (!tmpMint[tmpMonth]) tmpMint[tmpMonth] = 0

      tmpMint[tmpMonth] += mints[tmp] ? mints[tmp] : 0
      tmpWager[tmpMonth] += wagers[tmp] ? wagers[tmp] : 0
    } else {
      data.labels.push(tmp)
      data.user.push(mints[tmp] ? mints[tmp] : 0)
      data.wager.push(wagers[tmp] ? wagers[tmp] : 0)
    }
  }
  console.log(data.user)

  for (var key in tmpMint) {
    data.labels.push(key)
    data.user.push(tmpMint[key])
    data.wager.push(tmpWager[key])
  }

  res.send(data)
})

app.post('/mpgames', async function (req, res) {
  var type = req.query.type
  var today = moment().format('YYYY-MM-DD')
  var monthsago

  if (type == 'week') {
    monthsago = moment().subtract(7, 'd').format('YYYY-MM-DD')
  } else if (type == 'month') {
    monthsago = moment().subtract(1, 'months').format('YYYY-MM-DD')
  } else if (type == '3month') {
    monthsago = moment().subtract(3, 'months').format('YYYY-MM-DD')
  } else if (type == 'year') {
    monthsago = moment().subtract(1, 'years').format('YYYY-MM-DD')
  }

  var data = {}
  var mints = {}
  var wagers = {}
  var rows = await knex('mp_games')
    .where('created_at', '>=', monthsago + ' 00:00:00')
    .groupBy(knex.raw('DATE(created_at)'))
    .select(knex.raw('SUM(wager) as WAGER'))
    .select(knex.raw('count(created_at) as CNT'))
    .select(knex.raw('DATE(created_at) as CRE'))
  for (var i = 0; i < rows.length; i++) {
    let unix = moment(rows[i].CRE).format('YYYY-MM-DD')
    mints[unix] = rows[i].CNT
    wagers[unix] = rows[i].WAGER
  }

  console.log(mints)
  data.from = monthsago
  data.to = today
  data.labels = []
  data.user = []
  data.wager = []

  var rowsTotal = await knex('mp_games').select('*')
  var rowsSelected = await knex('mp_games')
    .where('created_at', '>=', monthsago + ' 00:00:00')
    .select('*')

  data.total = rowsTotal.length
  data.selCount = rowsSelected.length
  
  var wagerTotal = await knex('mp_games').select(knex.raw('SUM(wager) as WAGER'))
  var wagerSelected = await knex('mp_games')
    .where('created_at', '>=', monthsago + ' 00:00:00')
    .select(knex.raw('SUM(wager) as WAGER'))

  data.totalWager = wagerTotal[0].WAGER
  data.selWager = wagerSelected[0].WAGER

  var tmpMint = []
  var tmpWager = []

  for (var date = moment(monthsago + ' 00:00:00').unix(); date <= moment(today + ' 00:00:00').unix(); date += 86400) {
    var tmp = moment.unix(date).format('YYYY-MM-DD')

    if (type == 'year') {
      var tmpMonth = tmp.split('-')[0] + '-' + tmp.split('-')[1]

      if (!tmpMint[tmpMonth]) tmpMint[tmpMonth] = 0

      tmpMint[tmpMonth] += mints[tmp] ? mints[tmp] : 0
      tmpWager[tmpMonth] += wagers[tmp] ? wagers[tmp] : 0
    } else {
      data.labels.push(tmp)
      data.user.push(mints[tmp] ? mints[tmp] : 0)
      data.wager.push(wagers[tmp] ? wagers[tmp] : 0)
    }
  }
  console.log(data.user)

  for (var key in tmpMint) {
    data.labels.push(key)
    data.user.push(tmpMint[key])
    data.wager.push(tmpWager[key])
  }

  res.send(data)
})

app.listen(81, () => console.log('running 81'))

var FROMBLOCK = 29030000

const maticAddress = '0x9c3c9283d3e44854697cd22d3faa240cfb032889'
const usdtAddress = '0x3813e82e6f7098b9583FC0F33a962D02018B6803'
// const sportTokenAddress = "0x2caFAb766a586a09659a09E92e9f4005DF827512";
const sportTokenAddress = '0xec1E041B32898b8a33F5a7789226f9d64c7ed287'
const esgTokenAddress = '0x6637926e5c038c7ae3d3fd2c2d77c44e8be1ed28'
// const tokenPriceAddress = "0x6b186a04C801A3D717621b0B19D018375161bFF8";
const tokenPriceAddress = '0x29d9dc2174539e2cA077Fa70aC802158cc5D5F70'
// const CUENftAddress = "0xd7694bf6715dc2672c3c42558f09114e7a9fe6c3"
const CUENftAddress = '0x0Ae71D3fAe3200F12b6401a0FDb030a5Bed616b5'
// const CueMarketAddress = "0x74dcaf9948b2869900cda681585dd2b45aaa77bb"
const CueMarketAddress = '0xCb23906630411090085a2e7B1225ec5e433653B1'
// const CardNftAddress = "0x4daf37319a02ae027b3165fd625fd5cf22ea622d"
const CardNftAddress = '0xeFAba9B6b32c270652312FC7A76f7623C7c2aecC'
// const CardMarketAddress = "0x39ff109be68aee2dbba16d1acdddde957321303d"
const CardMarketAddress = '0xCb23906630411090085a2e7B1225ec5e433653B1'

var minABI = [
  // balanceOf
  {
    constant: true,
    inputs: [{ name: '_owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: 'balance', type: 'uint256' }],
    type: 'function',
  },
]
var sportContract = new web3.eth.Contract(minABI, sportTokenAddress)
var esgContract = new web3.eth.Contract(minABI, esgTokenAddress)
var cueMarketContract = new web3.eth.Contract(marketCueABI, CueMarketAddress)
var cardMarketContract = new web3.eth.Contract(marketCardABI, CardMarketAddress)
var tokenPriceContract = new web3.eth.Contract(tokenPriceABI, tokenPriceAddress)
var esgUSDPrice = 0
var sportUSDPrice = 0
var maticUSDPrice = 0

async function getUSDPrices() {
  var res

  res = await tokenPriceContract.methods.getPrice(sportTokenAddress).call()
  sportUSDPrice = (res[0] * res[2]) / res[1] / 10 ** 6

  res = await tokenPriceContract.methods.getPrice(esgTokenAddress).call()
  esgUSDPrice = (res[0] * res[2]) / res[1] / 10 ** 6

  maticUSDPrice = (10 ** 12 * res[2]) / res[1]
}

async function init() {
  try {
    myLogger.log(FROMBLOCK)
    await getUSDPrices()
    var TOBLOCK = await web3.eth.getBlockNumber()

    if (TOBLOCK > FROMBLOCK + 999) {
      TOBLOCK = FROMBLOCK + 999
    }
    //cue
    var rows_cue_mint = await web3.eth.getPastLogs({
      fromBlock: FROMBLOCK,
      toBlock: TOBLOCK,
      topics: ['0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef', '0x0000000000000000000000000000000000000000000000000000000000000000'],
      address: CUENftAddress,
    })

    var rows_inserted = await knex('tbl_mint').where('type', 'CUE').select(knex.raw('blockNumber as BLOCKNUM'))

    var latestBlockNum
    if (rows_inserted.length == 0) {
      latestBlockNum = 0
    } else {
      latestBlockNum = rows_inserted[rows_inserted.length - 1].BLOCKNUM
    }

    for (var i = 0; i < rows_cue_mint.length; i++) {
      if (latestBlockNum < rows_cue_mint[i].blockNumber) {
        var timestamp = (await web3.eth.getBlock(rows_cue_mint[i].blockNumber)).timestamp * 1000
        await knex('tbl_mint').insert({
          type: 'CUE',
          swapAt: convertTimestampToString(timestamp, true),
          transactionHash: rows_cue_mint[i].transactionHash,
          blockNumber: rows_cue_mint[i].blockNumber,
          blockHash: rows_cue_mint[i].blockHash,
          tokenID: Number(rows_cue_mint[i].topics[3]),
        })
      }
    }

    var rows_cue_del = await web3.eth.getPastLogs({
      fromBlock: FROMBLOCK,
      toBlock: TOBLOCK,
      topics: ['0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef', null, '0x0000000000000000000000000000000000000000000000000000000000000000'],
      address: CUENftAddress,
    })
    for (var i = 0; i < rows_cue_del.length; i++) {
      await knex('tbl_mint').del().where('type', 'CUE').where('tokenID', Number(rows_cue_del[i].topics[3]))
    }

    //card
    var rows_card_mint = await web3.eth.getPastLogs({
      fromBlock: FROMBLOCK,
      toBlock: TOBLOCK,
      topics: ['0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef', '0x0000000000000000000000000000000000000000000000000000000000000000'],
      address: CardNftAddress,
    })
    var rows_inserted1 = await knex('tbl_mint').where('type', 'CARD').select(knex.raw('blockNumber as BLOCKNUM'))

    var latestBlockNum1
    if (rows_inserted1.length == 0) {
      latestBlockNum1 = 0
    } else {
      latestBlockNum1 = rows_inserted1[rows_inserted1.length - 1].BLOCKNUM
    }

    for (var i = 0; i < rows_card_mint.length; i++) {
      if (latestBlockNum1 < rows_card_mint[i].blockNumber) {
        var timestamp = (await web3.eth.getBlock(rows_card_mint[i].blockNumber)).timestamp * 1000
        await knex('tbl_mint').insert({
          type: 'CARD',
          swapAt: convertTimestampToString(timestamp, true),
          transactionHash: rows_card_mint[i].transactionHash,
          blockNumber: rows_card_mint[i].blockNumber,
          blockHash: rows_card_mint[i].blockHash,
          tokenID: Number(rows_card_mint[i].topics[3]),
        })
      }
    }

    var rows_card_del = await web3.eth.getPastLogs({
      fromBlock: FROMBLOCK,
      toBlock: TOBLOCK,
      topics: ['0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef', null, '0x0000000000000000000000000000000000000000000000000000000000000000'],
      address: CardNftAddress,
    })
    for (var i = 0; i < rows_card_del.length; i++) {
      await knex('tbl_mint').del().where('type', 'CARD').where('tokenID', Number(rows_card_del[i].topics[3]))
    }

    //esg
    var rows_esg_earn = await web3.eth.getPastLogs({
      fromBlock: FROMBLOCK,
      toBlock: TOBLOCK,
      topics: ['0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef', null, '0x000000000000000000000000099b7b28AC913efbb3236946769AC6D3819329ab'],
      address: esgTokenAddress,
    })

    var rows_inserted2 = await knex('tbl_earns').select(knex.raw('blockNumber as BLOCKNUM'))

    var latestBlockNum2
    if (rows_inserted2.length == 0) {
      latestBlockNum2 = 0
    } else {
      latestBlockNum2 = rows_inserted2[rows_inserted2.length - 1].BLOCKNUM
    }

    for (var i = 0; i < rows_esg_earn.length; i++) {
      if (rows_esg_earn[i].topics[1] == '0x0000000000000000000000000000000000000000000000000000000000000000') continue
      var amount = Number.parseInt(hexToBn(rows_esg_earn[i].data.substr(2, 64))) / 10 ** 9
      var timestamp = (await web3.eth.getBlock(rows_esg_earn[i].blockNumber)).timestamp * 1000

      if (latestBlockNum2 < rows_esg_earn[i].blockNumber) {
        await knex('tbl_earns').insert({
          type: 'ESG',
          swapAt: convertTimestampToString(timestamp, true),
          amount: amount,
          amountUSD: amount * esgUSDPrice,
          amountType: 'ESGFEE',
          blockNumber: rows_esg_earn[i].blockNumber,
          transactionHash: rows_esg_earn[i].transactionHash,
        })
      }
    }

    var rows_esg_to_matic_earn = await web3.eth.getPastLogs({
      fromBlock: FROMBLOCK,
      toBlock: TOBLOCK,
      topics: ['0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef', null, '0x000000000000000000000000099b7b28AC913efbb3236946769AC6D3819329ab'],
      address: maticAddress,
    })

    for (var i = 0; i < rows_esg_to_matic_earn.length; i++) {
      if (rows_esg_to_matic_earn[i].topics[1] == '0x0000000000000000000000000000000000000000000000000000000000000000') continue
      var amount = Number.parseInt(hexToBn(rows_esg_to_matic_earn[i].data.substr(2, 64))) / 10 ** 18
      var timestamp = (await web3.eth.getBlock(rows_esg_to_matic_earn[i].blockNumber)).timestamp * 1000

      if (latestBlockNum2 < rows_esg_to_matic_earn[i].blockNumber) {
        await knex('tbl_earns').insert({
          type: 'ESG',
          swapAt: convertTimestampToString(timestamp, true),
          amount: amount,
          amountUSD: amount * maticUSDPrice,
          amountType: 'MATICFEE',
          blockNumber: rows_esg_to_matic_earn[i].blockNumber,
          transactionHash: rows_esg_to_matic_earn[i].transactionHash,
        })
      }
    }

    var rows_esg_to_usdt_earn = await web3.eth.getPastLogs({
      fromBlock: FROMBLOCK,
      toBlock: TOBLOCK,
      topics: ['0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef', null, '0x000000000000000000000000099b7b28AC913efbb3236946769AC6D3819329ab'],
      address: usdtAddress,
    })

    for (var i = 0; i < rows_esg_to_usdt_earn.length; i++) {
      if (rows_esg_to_usdt_earn[i].topics[1] == '0x0000000000000000000000000000000000000000000000000000000000000000') continue
      var amount = Number.parseInt(hexToBn(rows_esg_to_usdt_earn[i].data.substr(2, 64))) / 10 ** 6
      var timestamp = (await web3.eth.getBlock(rows_esg_to_usdt_earn[i].blockNumber)).timestamp * 1000

      if (latestBlockNum2 < rows_esg_to_usdt_earn[i].blockNumber) {
        await knex('tbl_earns').insert({
          type: 'ESG',
          swapAt: convertTimestampToString(timestamp, true),
          amount: amount,
          amountUSD: amount,
          amountType: 'USDTFEE',
          blockNumber: rows_esg_to_usdt_earn[i].blockNumber,
          transactionHash: rows_esg_to_usdt_earn[i].transactionHash,
        })
      }
    }

    //sport
    var rows_sport_earn = await web3.eth.getPastLogs({
      fromBlock: FROMBLOCK,
      toBlock: TOBLOCK,
      topics: ['0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef', '0x000000000000000000000000389B71DF19F0c7478a253Fc07dC32F62c9d8DDe0', '0x000000000000000000000000099b7b28AC913efbb3236946769AC6D3819329ab'],
      address: sportTokenAddress,
    })

    for (var i = 0; i < rows_sport_earn.length; i++) {
      //if (rows_sport_earn[i].topics[1] == '0x0000000000000000000000000000000000000000000000000000000000000000') continue
      var amount = Number.parseInt(hexToBn(rows_sport_earn[i].data.substr(2, 64))) / 10 ** 9
      var timestamp = (await web3.eth.getBlock(rows_sport_earn[i].blockNumber)).timestamp * 1000

      if (latestBlockNum2 < rows_sport_earn[i].blockNumber) {
        await knex('tbl_earns').insert({
          type: 'BET',
          swapAt: convertTimestampToString(timestamp, true),
          amount: amount,
          amountUSD: amount * sportUSDPrice,
          amountType: 'SPORT',
          blockNumber: rows_sport_earn[i].blockNumber,
          transactionHash: rows_sport_earn[i].transactionHash,
        })
      }
    }
    //sport mint
    var rows_inserted3 = await knex('tbl_erc20_mint').select(knex.raw('blockNumber as BLOCKNUM'))

    var latestBlockNum3
    if (rows_inserted3.length == 0) {
      latestBlockNum3 = 0
    } else {
      latestBlockNum3 = rows_inserted3[rows_inserted3.length - 1].BLOCKNUM
    }
    var rows_sport_mint = await web3.eth.getPastLogs({
      fromBlock: FROMBLOCK,
      toBlock: TOBLOCK,
      topics: ['0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef', '0x0000000000000000000000000000000000000000000000000000000000000000'],
      address: sportTokenAddress,
    })
    for (var i = 0; i < rows_sport_mint.length; i++) {
      var amount = Number.parseInt(hexToBn(rows_sport_mint[i].data.substr(2, 64))) / 10 ** 9
      var timestamp = (await web3.eth.getBlock(rows_sport_mint[i].blockNumber)).timestamp * 1000

      if (latestBlockNum3 < rows_sport_mint[i].blockNumber) {
        await knex('tbl_erc20_mint').insert({
          swapAt: convertTimestampToString(timestamp, true),
          amount: amount,
          amountType: 'SPORT',
          blockNumber: rows_sport_mint[i].blockNumber,
          transactionHash: rows_sport_mint[i].transactionHash,
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
    setTimeout(init, 60000)
  }
}

async function init_matic_earn() {
  try {
    var totalFeeMatic = await cueMarketContract.methods.totalEarnedFeeAmounts().call()
    var totalEarnOwnerMatic = await cueMarketContract.methods.totalEarnedAmounts().call()
    var totalFeeCardMatic = await cardMarketContract.methods.totalEarnedFeeAmounts().call()
    var totalEarnCardOwnerMatic = await cardMarketContract.methods.totalEarnedAmounts().call()
    var dateTime = new Date()
    var dateBuf = convertTimestampToString(dateTime.getTime(), true)
    var rows_cue = await knex('tbl_market_matic_earn').where('Type', 'CUE').where('Date', '<', dateBuf.slice(0, 10)).select('*')
    var rows_card = await knex('tbl_market_matic_earn').where('Type', 'CARD').where('Date', '<', dateBuf.slice(0, 10)).select('*')

    var cue_earn_sum = 0
    var cue_earn_fee_sum = 0
    var card_earn_sum = 0
    var card_earn_fee_sum = 0
    for (var i = 0; i < rows_cue.length; i++) {
      cue_earn_sum += rows_cue[i].EarnAmounts
      cue_earn_fee_sum += rows_cue[i].FeeAmounts
    }
    for (var i = 0; i < rows_card.length; i++) {
      card_earn_sum += rows_card[i].EarnAmounts
      card_earn_fee_sum += rows_card[i].FeeAmounts
    }

    var rows_cue_earn = await knex('tbl_market_matic_earn').where('Type', 'CUE').where('Date', dateBuf.slice(0, 10)).select('*')
    if (rows_cue_earn.length) {
      await knex('tbl_market_matic_earn')
        .where('Type', 'CUE')
        .where('Date', dateBuf.slice(0, 10))
        .update({
          FeeAmounts: totalFeeMatic / 10 ** 18 - cue_earn_fee_sum,
          EarnAmounts: totalEarnOwnerMatic / 10 ** 18 - cue_earn_sum,
        })
    } else {
      await knex('tbl_market_matic_earn').insert({
        Type: 'CUE',
        Date: dateBuf.slice(0, 10),
        FeeAmounts: totalFeeMatic / 10 ** 18 - cue_earn_fee_sum,
        EarnAmounts: totalEarnOwnerMatic / 10 ** 18 - cue_earn_sum,
      })
    }
    var rows_card_earn = await knex('tbl_market_matic_earn').where('Type', 'CARD').where('Date', dateBuf.slice(0, 10)).select('*')
    if (rows_card_earn.length) {
      await knex('tbl_market_matic_earn')
        .where('Type', 'CARD')
        .where('Date', dateBuf.slice(0, 10))
        .update({
          FeeAmounts: totalFeeCardMatic / 10 ** 18 - card_earn_fee_sum,
          EarnAmounts: totalEarnCardOwnerMatic / 10 ** 18 - card_earn_sum,
        })
    } else {
      await knex('tbl_market_matic_earn').insert({
        Type: 'CARD',
        Date: dateBuf.slice(0, 10),
        FeeAmounts: totalFeeCardMatic / 10 ** 18 - card_earn_fee_sum,
        EarnAmounts: totalEarnCardOwnerMatic / 10 ** 18 - card_earn_sum,
      })
    }
    setTimeout(init_matic_earn, 3600000)
  } catch (err) {
    myLogger.log(err)
    setTimeout(init_matic_earn, 3600000)
  }
}

const listAllUsers = async (nextPageToken) => {
  try {
    // var rows_inserted = await knex('tbl_auth_users')
    //     .select(knex.raw('createTime as CREATETIME'))
    //     .orderBy('createTime', 'desc');
    // var compTime = 0;
    // if(rows_inserted.length > 0 ){
    //     compTime = new Date(rows_inserted[0].CREATETIME).getTime();
    // }

    auth
      .listUsers(1000, nextPageToken)
      .then((listUsersResult) => {
        listUsersResult.users.forEach(async (userRecord) => {
          //if(compTime <= new Date(userRecord.metadata.creationTime).getTime()){
          var rows_check = await knex('tbl_auth_users').where('UserID', userRecord.uid).select('*')
          if (rows_check.length == 0) {
            await knex('tbl_auth_users').insert({
              UserID: userRecord.uid,
              Email: userRecord.email,
              createTime: convertTimestampToString(new Date(userRecord.metadata.creationTime).getTime(), true),
            })
          }
          //}
        })
        if (listUsersResult.pageToken) {
          listAllUsers(listUsersResult.pageToken)
        }
      })
      .catch((error) => {
        myLogger.log(error)
      })
    setTimeout(listAllUsers, 3600000)
  } catch (err) {
    myLogger.log(err)
    setTimeout(listAllUsers, 3600000)
  }
}

init()
init_matic_earn()
listAllUsers()
