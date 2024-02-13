const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");
const { initializeApp } = require("firebase/app");
const { initializeFirestore, getFirestore, collection, query, limit, getDocs, doc, getDoc, addDoc, setDoc, updateDoc, deleteDoc, deleteField } = require('firebase/firestore');
const { getStorage, ref, getDownloadURL } = require('firebase/storage');
const firebaseConfig = require("../../config/config");
require('dotenv').config();
const moment = require("moment");

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const db = initializeFirestore(app, {
  experimentalAutoDetectLongPolling: true,
});

const knex = require('knex')({
  client: 'mysql',
  connection: {
    host: '127.0.0.1',
    port: 3306,
    user: 'versusxi_info',
    password: 'U+b!]UbcDU^*',
    database: 'versusxi_info'
  }
});

router.post("/test", async (req, res) => {
  const sundayOfWeek = moment().startOf("week").format("YYYY-MM-DD 00");
  const startOfMonth = moment().startOf("month").format("YYYY-MM-DD 00");
  const today = moment().format("YYYY-MM-DD HH");

  // let result = await admin.auth().listUsers();
  // let profileInfos = [];
  // let userList = result.users.map(e => e.uid);
  // for(let i = 0; i < result.users.length; i++){
  //   let e = result.users[i];
  // 0x46a040c53dd86f8e1a45e5a124ff146362d6947a
    let userInfoDoc = await getDoc(doc(db, "users", "LliN9K32nlMWQKJKTT3dO6AiPkm2", "Profile","ProfileData"));
    let userinfo;
    if(userInfoDoc.exists()){
      let walletAddr = userInfoDoc.data()["eSkillzWalletAddress"];
      userinfo = userInfoDoc.data();
      console.log(walletAddr);
      // let curBal = await metakeepRead('balanceOf', [walletAddr], SkillLambda);
      // console.log(curBal);
    } 
  // }

  return res.json({
    sundayOfWeek,
    today,
    test: sundayOfWeek == today,
    startOfMonth,
    now: moment().format("YYYY-MM-DD HH:mm:ss"),
    // userList,
    userinfo
  });
});

router.post("/get", async (req, res) => {
  let { type, board } = req.body;
  let dbName = "";
  if (type == "golf") {
    dbName = "EskillzTGolfLeaderBoards";
  } else {
    dbName = "EskillzPoolLeaderBoards";
  }

  let result = await admin.auth().listUsers();

  let scoreList = [];
  await Promise.all(result.users.map(async (e) => {
    let leaderboardDoc = await getDoc(doc(db, dbName, e.uid, "Leaderboards", board));
    if (leaderboardDoc.exists()) {
      let userInfoDoc = await getDoc(doc(db, "users", e.uid, "Profile", "ProfileData"));
      const storageRef = ref(storage, `users/${e.uid}.jpeg`);
      let url = await getDownloadURL(storageRef)
        .then((url) => url)
        .catch((error) => "");

      scoreList.push({
        uid: e.uid,
        avatar: url,
        name: userInfoDoc.data().userName,
        score: leaderboardDoc.data(),
      });
    }
  }));

  return res.json({
    result: scoreList
  });
});

router.post("/weekly", async (req, res) => {
  const { type, showType } = req.body;
  if (type == undefined || showType == undefined) {
    return res.json({
      success: false,
      msg: "please check request.",
    });
  }

  const startDayOfWeek = moment().startOf('week').format("YYYY-MM-DD");
  var rows = await knex('tbl_leaderboards_weekly')
    .where('score_date', startDayOfWeek)
    .where('type', type)
    .select('*');

  let _rows = [];
  await Promise.all(rows.map(async (obj) => {
    let e = JSON.parse(obj.score_data);
    if (!e[showType] || e[showType] == 0 || e[showType] == 1000) {
      return obj;
    }
    e.uid = obj.uid;
    let userInfoDoc = await getDoc(doc(db, "users", obj.uid, "Profile", "ProfileData"));
    e.username = userInfoDoc.data().userName;
    _rows.push(e);
    return obj;
  }));
  if (showType === "ComboPoolMaxCombo") {
    _rows = _rows.sort((a, b) => {
      if (b[showType] == a[showType]) {
        return a["ComboPoolShortestTime"] - b["ComboPoolShortestTime"];
      } else {
        return b[showType] - a[showType];
      }
    });
  } else if (showType === "ColorPoolMax") {
    _rows = _rows.sort((a, b) => {
      if (b[showType] == a[showType]) {
        return a["ColorPoolShortestTime"] - b["ColorPoolShortestTime"];
      } else {
        return b[showType] - a[showType];
      }
    });
  } else if (showType === "SpeedPoolTotalPots") {
    _rows = _rows.sort((a, b) => {
      if (b[showType] == a[showType]) {
        return a["SpeedPoolShortestTime"] - b["SpeedPoolShortestTime"];
      } else {
        return b[showType] - a[showType];
      }
    });
  } else if (showType === "Par3Closest") {
    _rows = _rows.sort((a, b) => a[showType] - b[showType]);
  } else {
    _rows = _rows.sort((a, b) => b[showType] - a[showType]);
  }

  return res.json({
    success: true,
    data: _rows,
  });
});

router.post("/monthly", async (req, res) => {
  const { type, showType } = req.body;
  if (type == undefined || showType == undefined) {
    return res.json({
      success: false,
      msg: "please check request.",
    });
  }

  const startDayOfWeek = moment().startOf('month').format("YYYY-MM-DD");
  var rows = await knex('tbl_leaderboards_monthly')
    .where('score_date', startDayOfWeek)
    .where('type', type)
    .select('*');

  let _rows = [];
  await Promise.all(rows.map(async (obj) => {
    let e = JSON.parse(obj.score_data);
    if (!e[showType] || e[showType] == 0 || e[showType] == 1000) {
      return obj;
    }
    e.uid = obj.uid;
    let userInfoDoc = await getDoc(doc(db, "users", obj.uid, "Profile", "ProfileData"));
    e.username = userInfoDoc.data().userName;
    _rows.push(e);
    return obj;
  }));
  if (showType === "ComboPoolMaxCombo") {
    _rows = _rows.sort((a, b) => {
      if (b[showType] == a[showType]) {
        return a["ComboPoolShortestTime"] - b["ComboPoolShortestTime"];
      } else {
        return b[showType] - a[showType];
      }
    });
  } else if (showType === "ColorPoolMax") {
    _rows = _rows.sort((a, b) => {
      if (b[showType] == a[showType]) {
        return a["ColorPoolShortestTime"] - b["ColorPoolShortestTime"];
      } else {
        return b[showType] - a[showType];
      }
    });
  } else if (showType === "SpeedPoolTotalPots") {
    _rows = _rows.sort((a, b) => {
      if (b[showType] == a[showType]) {
        return a["SpeedPoolShortestTime"] - b["SpeedPoolShortestTime"];
      } else {
        return b[showType] - a[showType];
      }
    });
  } else if (showType === "Par3Closest") {
    _rows = _rows.sort((a, b) => a[showType] - b[showType]);
  } else {
    _rows = _rows.sort((a, b) => b[showType] - a[showType]);
  }

  return res.json({
    success: true,
    data: _rows,
  });
});

async function storeWeeklyData() {
  try {
    const sundayOfWeek = moment().startOf('week').format("YYYY-MM-DD 00");
    const today = moment().format("YYYY-MM-DD HH");
    if (today == sundayOfWeek) {
      await _storeWeeklyData("pool");
      await _storeWeeklyData("golf");

      await _clearWeeklyData("pool");
      await _clearWeeklyData("golf");
    }

    setTimeout(storeWeeklyData, 60 * 60 * 1000);
  } catch (error) {
    setTimeout(storeWeeklyData, 5000);
  }
}

const _storeWeeklyData = async (type) => {
  let dbName = "EskillzPoolLeaderBoards";
  if (type == "golf") {
    dbName = "EskillzTGolfLeaderBoards";
  }
  let result = await admin.auth().listUsers();

  await Promise.all(result.users.map(async (e) => {
    const startDayOfWeek = moment().startOf('week').format("YYYY-MM-DD");

    const docData = await getDoc(doc(db, dbName, e.uid, "Leaderboards", "WeeklyLeaderboard"));
    if (docData.exists()) {
      var rows = await knex('tbl_leaderboards_weekly')
        .where('score_date', startDayOfWeek)
        .where('uid', e.uid)
        .where('type', type)
        .select('*');
      if (rows.length) {
        await knex('tbl_leaderboards_weekly')
          .where('score_date', startDayOfWeek)
          .where('uid', e.uid)
          .where('type', type)
          .update({
            score_data: JSON.stringify(docData.data()),
          });
      } else {
        await knex('tbl_leaderboards_weekly').insert({
          uid: e.uid,
          type: type,
          score_data: JSON.stringify(docData.data()),
          score_date: startDayOfWeek
        });
      }
    }
  }));
};

const _clearWeeklyData = async (type) => {
  let dbName = "EskillzPoolLeaderBoards";
  if (type == "golf") {
    dbName = "EskillzTGolfLeaderBoards";
  }
  let result = await admin.auth().listUsers();

  await Promise.all(result.users.map(async (e) => {
    try {
      await deleteDoc(doc(db, dbName, e.uid, "Leaderboards", "WeeklyLeaderboard"));
    } catch (err) {
      console.log(err);
    }
  }));
}

async function storeMonthlyData() {
  try {
    const startDayOfMonth = moment().startOf('month').format("YYYY-MM-DD 00");
    const today = moment().format("YYYY-MM-DD HH");
    if (today == startDayOfMonth) {
      await _storeMonthlyData("pool");
      await _storeMonthlyData("golf");

      await _clearMonthlyData("pool");
      await _clearMonthlyData("golf");
    }

    setTimeout(storeMonthlyData, 60 * 60 * 1000);
  } catch (error) {
    setTimeout(storeMonthlyData, 5000);
  }
}

const _storeMonthlyData = async (type) => {
  let dbName = "EskillzPoolLeaderBoards";
  if (type == "golf") {
    dbName = "EskillzTGolfLeaderBoards";
  }
  let result = await admin.auth().listUsers();

  await Promise.all(result.users.map(async (e) => {
    const startDayOfWeek = moment().startOf('month').format("YYYY-MM-DD");

    const docData = await getDoc(doc(db, dbName, e.uid, "Leaderboards", "MonthlyLeaderboard"));
    if (docData.exists()) {
      var rows = await knex('tbl_leaderboards_monthly')
        .where('score_date', startDayOfWeek)
        .where('uid', e.uid)
        .where('type', type)
        .select('*');
      if (rows.length) {
        await knex('tbl_leaderboards_monthly')
          .where('score_date', startDayOfWeek)
          .where('uid', e.uid)
          .where('type', type)
          .update({
            score_data: JSON.stringify(docData.data()),
          });
      } else {
        await knex('tbl_leaderboards_monthly').insert({
          uid: e.uid,
          type: type,
          score_data: JSON.stringify(docData.data()),
          score_date: startDayOfWeek
        });
      }
    }
  }));
};

const _clearMonthlyData = async (type) => {
  let dbName = "EskillzPoolLeaderBoards";
  if (type == "golf") {
    dbName = "EskillzTGolfLeaderBoards";
  }
  let result = await admin.auth().listUsers();

  await Promise.all(result.users.map(async (e) => {
    try {
      await deleteDoc(doc(db, dbName, e.uid, "Leaderboards", "MonthlyLeaderboard"));
    } catch (err) {
      console.log(err);
    }
  }));
}

storeWeeklyData();
storeMonthlyData();
module.exports = router;