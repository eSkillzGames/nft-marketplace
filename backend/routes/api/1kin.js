const express = require('express');
const axios = require('axios');
const router = express.Router();
require('dotenv').config();

let JWT = "";
let CLIENT_UID = "";

async function loginAsClient() {
  try {
    let data = await axios.post(process.env.ONEKIN_API_URL + "/v1/clients/login", {
      "identifier": "lav@eskillz.io",
      "password": "2023VersusX@"
    });
    let result = data.data;
    JWT = result.jwt;
    CLIENT_UID = result.client.client_uid;
    console.log("==== 1Kin Login ====");
    console.log(JWT);
    console.log(CLIENT_UID);
    console.log("==== 1Kin Login ====");
  } catch (err) {
    console.log("==== 1Kin Login ====");
    console.log("FAILED");
    console.log("==== 1Kin Login ====");
  }
}

loginAsClient();

/*
{
      "id": 125,
      "title": "Golf Collectible",
      "short_description": "Bear",
      "cardMedia": "https://1kin-dashboard-bucket.s3.us-east-2.amazonaws.com/photo_2023-07-23_02-04-30_2668034_card_1x.jpg",
      "collectible_uid": "bc0ba74c34e985627b64",
}
 */
router.post('/myCollectibles', async function (req, res) {
  try {
    let data = await axios.get(process.env.ONEKIN_API_URL + "/v1/clients/myCollectibles", {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'onekin-api-key': process.env.ONEKIN_API_KEY,
        'Authorization': `Bearer ${JWT}`
      }
    });
    let result = data.data.collectibles;
    result = result.map((e) => {
      return {
        "id": e.id,
        "title": e.title,
        "short_description": e.short_description,
        "cardMedia": e.assets.cardMedia.defaultMedia.src1x,
        "collectible_uid": e.collectible_uid,
      }
    });
    return res.json(result);
  } catch (err) {
    console.log(err);
    res.json({
      status: false,
      statusCode: 400,
      msg: "Bad Request",
    });
    return;
  }
});

router.post('/claimCompleted', async function (req, res) {
  try {
    let data = await axios.post(process.env.ONEKIN_API_URL + "/v1/clients/claimCompleted", {
      "claimCode": "001",
      "collectibleId": req.body.collectibleId,
    }, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'onekin-api-key': process.env.ONEKIN_API_KEY,
        'Authorization': `Bearer ${JWT}`
      }
    });
    return res.json(data.data);
  } catch (err) {
    console.log(err);
    res.json({
      status: false,
      statusCode: 400,
      msg: "Bad Request",
    });
    return;
  }
});

module.exports = router;
