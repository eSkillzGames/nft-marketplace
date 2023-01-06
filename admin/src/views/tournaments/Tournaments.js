import React, { useEffect, useState } from 'react'
import { CCard, CCardBody, CCol, CCardHeader, CRow, CButton, CFormRange,CFormLabel,CFormInput,CFormSelect} from '@coreui/react'
import {
  CChartDoughnut,
  CChartLine,
} from '@coreui/react-chartjs'
import { CTimePicker , CDatePicker} from '@coreui/react-pro';
import { initializeApp } from "firebase/app";

import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, getDocs ,doc, getDoc, addDoc,setDoc,updateDoc,deleteField} from 'firebase/firestore';
import { getDatabase } from "firebase/database";

//
import dayjs, { Dayjs } from 'dayjs';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { id } from 'ethers/lib/utils';


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
const myStyles = `
    alignItems : 'center';    
    paddingBottom: '15px';
`;

const Tournaments = () => {
  
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  const [stateChange, setStateChange] = useState(0);
  const [keys, setKeys] = useState([]);
  const [tournamentData, setTournamentData] = useState([]);
  const [dataType, setDataType] = useState([]);
  const [dataName, setDataName] = useState([]);
  const [selIn, setSelIn] = useState([null]);

  const [addName, setAddName] = useState("");
  const [addType, setAddType] = useState(0);
  const [addData, setAddData] = useState();

  //const analytics = getAnalytics(app);
  // const database = getDatabase(app);
  //console.log(db);

  useEffect(async () => {
    init()
  }, [])

  // var toType = function(obj) {
  //   return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
  // }
  async function init() {
    var docSnap = await getDoc(doc(db, "eskillzpool", "Tournament"));
    var keysBuf = Object.keys(docSnap.data()).sort();
    setKeys(keysBuf);
    // var vals = Object.values(docSnap.data());
    var items = [];
    var types = [];
    var seles = [];
    var names = [];
    seles = selIn;
    for (var i = 0; i < keysBuf.length; i++) {
      if(typeof docSnap.data()[keysBuf[i]] == 'object'){
        items[keysBuf[i]] = dayjs(docSnap.data()[keysBuf[i]].seconds*1000).toISOString().substring(0,19);
        types[keysBuf[i]] = 2;
      }
      else{
        items[keysBuf[i]] = docSnap.data()[keysBuf[i]];
        if(typeof docSnap.data()[keysBuf[i]] == 'string'){

          types[keysBuf[i]] = 0;
        }
        else{
          types[keysBuf[i]] = 1;

        }
        
      }
      if(seles[keysBuf[i]] == null) {
        seles[keysBuf[i]] = 0;
      }
      names[keysBuf[i]] = keysBuf[i];
      
    }
    setTournamentData(items)
    setDataType(types)
    setSelIn(seles)
    setDataName(names)    
  }

  function updateState(key, data){
    var items = [];
    items = tournamentData;
    if(dataType[key] == 1){
      if(Number(data) > 0 ){

        items[key] = data;
        setTournamentData(items);
        setStateChange(1-stateChange);
      }
    }
    else{

      items[key] = data;
      setTournamentData(items);
      setStateChange(1-stateChange);
    }
  }
  function updateName(key, data){
    var names = [];
    names = dataName;
    
    names[key] = data;
    setDataName(names);
    setStateChange(1-stateChange);
    
  }

  function selIndex(key){
    var seles = [];
    seles = selIn;
    if(selIn[key] == 1){
      init();
    }
    seles[key] = 1 - seles[key];
    setSelIn[seles];
    setStateChange(1-stateChange);
    
  }
  async function saveData(key){
    if(dataType[key] == 0){
      await updateDoc(doc(db, "eskillzpool", "Tournament"), {[`${key}`] : tournamentData[key]});
    }
    else if (dataType[key] == 1){
      await updateDoc(doc(db, "eskillzpool", "Tournament"), {[`${key}`] : Number(tournamentData[key])});
      
    }
    else{
      await updateDoc(doc(db, "eskillzpool", "Tournament"), {[`${key}`] :  new Date(tournamentData[key])});

    }
    init();
    setStateChange(1-stateChange);
  }

  async function updateData(key){
    await updateDoc(doc(db, "eskillzpool", "Tournament"), {[`${key}`] : deleteField()});
    if(dataType[key] == 0){
      await updateDoc(doc(db, "eskillzpool", "Tournament"), {[`${dataName[key]}`] : tournamentData[key]});
    }
    else if (dataType[key] == 1){
      await updateDoc(doc(db, "eskillzpool", "Tournament"), {[`${dataName[key]}`] : Number(tournamentData[key])});
      
    }
    else{
      await updateDoc(doc(db, "eskillzpool", "Tournament"), {[`${dataName[key]}`] :  new Date(tournamentData[key])});

    }
    var seles = [];
    seles = selIn;    
    seles[key] = 1 - seles[key];
    setSelIn[seles];   
    init();
    setStateChange(1-stateChange);
  }

  async function deleteData(key){
    await updateDoc(doc(db, "eskillzpool", "Tournament"), {[`${key}`] : deleteField()});
    init();
    setStateChange(1-stateChange);
  }

  async function addDataF(){
    console.log(addName);
    console.log(addData);
    if(addType == 0){
      await updateDoc(doc(db, "eskillzpool", "Tournament"), {[`${addName}`] : addData});
    }
    else if (addType == 1){
      await updateDoc(doc(db, "eskillzpool", "Tournament"), {[`${addName}`] : Number(addData)});
      
    }
    else{
      await updateDoc(doc(db, "eskillzpool", "Tournament"), {[`${addName}`] :  new Date(addData)});

    }
    setAddData(""); 
    setAddName(""); 
    init();
    setStateChange(1-stateChange);
  }
  return (
    <>
      <CCard className="mb-4">
        <CCardHeader>Tournament</CCardHeader>
        <CCardBody> 
        { 
          stateChange > 0 ? keys.map((key) =>(              
            <CRow class = {myStyles}>
              <CCol xs={2}>  
                <CFormInput type="text" size="sm" id="winpercent0" 
                    value = {dataName[key]}
                    disabled = { 1- selIn[key]} 
                    onChange={(event) => {updateName(key, event.target.value)}}
                />           
              </CCol> 
              {dataType[key] == 2 ? 
               
                <CCol xs={3}>  
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker
                    renderInput={(props) => <TextField {...props} />}
                    value={tournamentData[key]}
                    onChange={(newValue) => {
                      updateState(key, newValue)
                      
                    }}
                  />
                </LocalizationProvider>       
              </CCol>               
                :
                <CCol xs={3}>  
                  <CFormInput type="text" size="sm" id="winpercent0" placeholder = {tournamentData[key]}
                      value = {tournamentData[key]} 
                      onChange={(event) => {updateState(key, event.target.value);}}
                  />           
              </CCol>             
               }            
              <CCol xs={1}>   
                <CButton disabled = {selIn[key]}  onClick={() => {saveData(key)}}>Set</CButton>
              </CCol> 
              <CCol xs={1}>   
                <CButton onClick={() =>{selIndex(key);}}>{selIn[key] == 0 ? 'Edit' : 'Cancel'}</CButton>
              </CCol> 
              <CCol xs={1}>   
                <CButton disabled = {1 - selIn[key]} onClick={() => {updateData(key)}}>Update</CButton>
              </CCol>
              <CCol xs={1}>   
                <CButton disabled = {1 - selIn[key]} onClick={() => {deleteData(key)}}>Delete</CButton>
              </CCol> 
            </CRow>                  
          ))
          :
          keys.map((key,index) =>(              
            <CRow class = {myStyles}>
              <CCol xs={2}>  
                <CFormInput type="text" size="sm" id="winpercent0" 
                    value = {dataName[key]}
                    disabled = { 1- selIn[key]} 
                    onChange={(event) => {updateName(key, event.target.value)}}
                />           
              </CCol> 
              {dataType[key] == 2 ? 
               
                <CCol xs={3}>  
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker
                    renderInput={(props) => <TextField {...props} />}
                    value={tournamentData[key]}
                    onChange={(newValue) => {
                      updateState(key, newValue)
                      
                    }}
                  />
                </LocalizationProvider>       
              </CCol>               
                :
                <CCol xs={3}>  
                  <CFormInput type="text" size="sm" id="winpercent0" placeholder = {tournamentData[key]}
                      value = {tournamentData[key]} 
                      onChange={(event) => {updateState(key, event.target.value);}}
                  />           
              </CCol>             
               }            
              <CCol xs={1}>   
                <CButton disabled = {selIn[key]}  onClick={() => {saveData(key)}}>Set</CButton>
              </CCol> 
              <CCol xs={1}>   
                <CButton onClick={() =>{selIndex(key);}}>{selIn[key] == 0 ? 'Edit' : 'Cancel'}</CButton>
              </CCol> 
              <CCol xs={1}>   
                <CButton disabled = {1 - selIn[key]} onClick={() => {updateData(key)}}>Update</CButton>
              </CCol> 
              <CCol xs={1}>   
                <CButton disabled = {1 - selIn[key]} onClick={() => {deleteData(key)}}>Delete</CButton>
              </CCol> 
            </CRow>  
            ))
        } 
        </CCardBody>
      </CCard>   
      <CCard className="mb-4">
        <CCardHeader>Add Field</CCardHeader>
        <CCardBody> 
        
          <CRow>
            <CCol xs={2}>            
              <CFormLabel htmlFor="exampleFormControlInput1">Field Name</CFormLabel>
            </CCol>            
            <CCol xs={2}>            
              <CFormLabel htmlFor="exampleFormControlInput1">Field Type</CFormLabel>
            </CCol>            
            <CCol xs={3}>            
              <CFormLabel htmlFor="exampleFormControlInput1">Field Data</CFormLabel>
            </CCol>            
                      
          </CRow> 
            <CRow>
              <CCol xs={2}>  
                <CFormInput type="text" size="sm" id="winpercent0" 
                    value = {addName}
                    onChange={(event) => {setAddName(event.target.value)}}
                />           
              </CCol>
              <CCol xs={2}>            
                <CFormSelect size="sm" className="mb-3" aria-label="Small select example" onChange={(event) => {setAddType(event.target.value); setAddData("");}}>
                  <option value="0">String</option>          
                  <option value="1">Number</option>
                  <option value="2">DateTime</option>
                </CFormSelect>
              </CCol> 
              {addType == 2 ? 
               
                <CCol xs={3}>  
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker
                    renderInput={(props) => <TextField {...props} />}
                    value={addData}
                    onChange={(newValue) => {
                      setAddData(newValue)
                      
                    }}
                  />
                </LocalizationProvider>       
              </CCol>               
                :
                addType == 1 ? 
                
                <CCol xs={3}>  
                  <CFormInput type="text" size="sm" id="winpercent0" 
                      value = {addData} 
                      onChange={(event) => {Number(event.target.value) > 0 ? setAddData(event.target.value) : ''}}
                  />           
                </CCol>             
                :
                <CCol xs={3}>  
                  <CFormInput type="text" size="sm" id="winpercent0" 
                      value = {addData} 
                      onChange={(event) => {setAddData(event.target.value);}}
                  />           
                </CCol>             
               }            
              <CCol xs={1}>   
                <CButton onClick={() => {addDataF()}}>Add</CButton>
              </CCol>
            </CRow>  
        </CCardBody>
      </CCard>    
      
    </>
  )
}

export default Tournaments
