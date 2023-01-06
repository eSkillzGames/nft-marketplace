const { default: axios } = require("axios");
const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");
const { initializeApp } = require("firebase/app");
const md5 = require('md5');
const { getAuth, signInWithEmailAndPassword } = require("firebase/auth");
const firebaseConfig = require("../../config/config");
const { DateRangeOutlined, DateRange } = require("@material-ui/icons");
const nodemailer = require('nodemailer');
require('dotenv').config();
const knex = require('knex')({
  client: 'mysql',
  connection: {
      host : '127.0.0.1',
      port : 3306,
      // user : 'root',
      // password : '',
      // database : 'mailcheck'
  }
});


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

// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.MAIL_USERNAME,
//     pass: process.env.MAIL_PASSWORD,
//   }
// });

router.post("/signup", async (req, res) => {
  const user = {
    email: req.body.email,
    password: req.body.password,
    userName: req.body.userName,
    birthDay: req.body.value
  };
  try {
    const userResponse = await admin.auth().createUser({
      email: user.email,
      password: user.password,
      emailVerified: false,
      disabled: false,
    });
    const response = await axios.post(
      "https://eskillzserver.net/sendtransaction/v1/CreateEskillzAccount",
      { UserID: userResponse.uid , userName : user.userName, birthDay: user.birthDay}
    );


    res.json({ userResponse, address: response.data });
  } catch (error) {
    throw error;
    // const errorCode = error.code;
    // const errorMessage = error.message;
    // res.status(500).json({ error: errorMessage });
    // console.log("error==", errorMessage);
  }
  //   console.log("userres==", userResponse);
});

router.post("/sendVerifyCode", async (req, res) => {

     
  const email = req.body.email;
  const userName = req.body.userName;
  const password = req.body.password;
  var dateTime = new Date();
  try {
    var code = md5(userName + password + email + new Date().toISOString())
    
    var rows = await knex('tbl_users').where('mail', email).select('*')

    if (rows.length) {
      await knex('tbl_users').where('mail', email).update({    
          verifyCode: code,
          userName : userName,
          updated_at: dateTime
      });      
    }
    else{    
      await knex('tbl_users').insert({mail :email ,  
        verifyCode: code,
        userName : userName,
        updated_at: dateTime
      });   
    }
    const mailData = {
        from: process.env.MAIL_FROM_ADDRESS,
        to: email,
        subject: 'ESKILLZ Register Verify Code',
        text: 'This is your verify code!',
        html: '<b>This is your verify code! </b><br/>\
            <h1>' + code + '</h1><br/>\
            Thanks!'
    };
    transporter.sendMail(mailData, function (err, info) {
        if(err){
          res.json({result:err});
        }
        else{
          res.json({result:"success"});
        }
    });    
  } catch (error) {
    res.json({result:error});
    throw error;
  }  
});

router.post("/checkVerifyCode", async (req, res) => {
  const email = req.body.email;
  const verifyCode = req.body.verifyCode;

  var dateTime = new Date();
  try {
    var rows = await knex('tbl_users').where('mail', email).where('verifyCode', verifyCode).select('*');
    if (rows.length) {
      
      if((dateTime-rows[0].updated_at) <= 172800000 ){

        res.json(2);
      } 
      else{

        res.json(1);
      }
    }
    else{ 
      res.json(0);
    }    
  } catch (error) {
    res.json(0);
    throw error;
  }  
});

router.post("/signin", async (req, res) => {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  console.log("auth==", auth);
  signInWithEmailAndPassword(auth, req.body.email, req.body.password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      // ...
      console.log("user=", user);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    });
});

router.post("/list", async (req, res) => {
  const maxResults = 10; // optional arg.
  var array = [];
  var i = 0;
  var listUser = await global.adminAuth.listUsers(1000)
  .then((listUsersResult) => {
    res.json({
      status: 1,
      data: listUsersResult.users,
    });
    // if (listUsersResult.pageToken) {
    //   listAllUsers(listUsersResult.pageToken);
    // }
  })
  .catch((error) => {
    console.log('Error listing users:', error);
    res.json({
      status: 0,
      msg: "failed",
    });
  });
});

module.exports = router;
