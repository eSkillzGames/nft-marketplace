// import firebase from "firebase";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import 'firebase/compat/storage'
// require('dotenv').config();
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_APIKEY,

  authDomain: process.env.REACT_APP_AUTHDOMAIN,

  databaseURL: process.env.REACT_APP_DATABASEURL,

  projectId: process.env.REACT_APP_PROJECTID,

  storageBucket: process.env.REACT_APP_STORAGEBUCKET,

  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGINGSENDERID,

  appId: process.env.REACT_APP_FIREBASE_APPID,

  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENTID,
};

const app = firebase.initializeApp(firebaseConfig);
var storage = firebase.storage();
var storageRef = storage.ref();
const auth = firebase.auth();
const db = firebase.firestore();

export { auth, db, firebase, storage, storageRef};
