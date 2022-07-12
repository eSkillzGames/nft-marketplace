import React, { useEffect, useState } from 'react'
import { CCard, CCardBody, CCol, CCardHeader, CRow, CButton, CFormRange,CFormLabel,CFormInput } from '@coreui/react'
import {
  CChartDoughnut,
  CChartLine,
} from '@coreui/react-chartjs'
import { initializeApp } from "firebase/app";

import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, getDocs ,doc, addDoc,setDoc,updateDoc} from 'firebase/firestore';
import { getDatabase } from "firebase/database";

const firebaseConfig = {

  apiKey: "AIzaSyCbHhwS7kjq3s-zidpdk0THPugYTyzSqhI",

  authDomain: "eskillz-pool.firebaseapp.com",

  databaseURL: "https://eskillz-pool-default-rtdb.firebaseio.com",

  projectId: "eskillz-pool",

  storageBucket: "eskillz-pool.appspot.com",

  messagingSenderId: "285834418480",

  appId: "1:285834418480:web:86863685fac50c99e950f5",

  measurementId: "G-7C45NW1VCC"

};

const Tournaments = () => {
  const random = (min, max) => Math.floor(Math.random() * (max - min + 1) + min)

  const progressExample = [
    { title: 'Total Earn', value: '$ 29.703', percent: 40, color: 'success' },
    { title: 'Total Mint', value: '$ 24.093', percent: 20, color: 'info' },
    { title: 'Bet Earn', value: '$ 78.706', percent: 60, color: 'warning' },
    { title: 'Tournaments Earn', value: '$ 22.123', percent: 80, color: 'danger' },
  ]
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  const [timer, setTimer] = useState(0);
  const [ballCount, setBallCount] = useState({});
  const [winPercentage, setWinPercentage] = useState({});
  const [winPercent0, setWinPercent0] = useState("");
  const [winPercent1, setWinPercent1] = useState("");
  const [winPercent2, setWinPercent2] = useState("");
  const [winPercent3, setWinPercent3] = useState("");
  const [ballCount0, setBallCount0] = useState("");
  const [ballCount1, setBallCount1] = useState("");
  const [ballCount2, setBallCount2] = useState("");
  const [ballCount3, setBallCount3] = useState("");
  const [timer0, setTimer0] = useState("");
  //const analytics = getAnalytics(app);
  // const database = getDatabase(app);
  //console.log(db);

  useEffect(async () => {
    init()
  }, [])

  async function init() {
    
    const subColRef = collection(db, "eskillzpool", "GameSettings", "ArcadeMode");
   
    const qSnap = await getDocs(subColRef)
    qSnap.docs.map(data_doc => {
      if(data_doc.id == "ColourPool"){
        setTimer(data_doc.data().Timer);
        setBallCount(data_doc.data().BallCount);
        setWinPercentage(data_doc.data().WinPercentage);        
      }
    });

    // await new Promise(resolve => setTimeout(resolve, 3000));

    //await setDoc(doc(db, "eskillzpool", "GameSettings", "ArcadeModeTest","test"), {Timer : 100});

    // try {
    //   const docRef = await addDoc(subColRef, {
    //     Combo: {Timer : 100}
    //   });    
    //   console.log("Document written with ID: ", docRef.id);
    // } catch (e) {
    //   console.error("Error adding document: ", e);
    // }    
  }

  async function setWinPercent(){
    await updateDoc(doc(db, "eskillzpool", "GameSettings", "ArcadeMode","ColourPool"), {WinPercentage : [Number(winPercent0) > 0 ? Number(winPercent0):winPercentage[0], Number(winPercent1) > 0 ? Number(winPercent1):winPercentage[1] , Number(winPercent2) > 0 ? Number(winPercent2):winPercentage[2],Number(winPercent3) > 0 ? Number(winPercent3):winPercentage[3]]});
    init();
    setWinPercent0("");
    setWinPercent1("");
    setWinPercent2("");
    setWinPercent3("");
  }

  async function setBallCounts(){
    await updateDoc(doc(db, "eskillzpool", "GameSettings", "ArcadeMode","ColourPool"), {BallCount : [Number(ballCount0) > 0 ? Number(ballCount0):ballCount[0], Number(ballCount1) > 0 ? Number(ballCount1):ballCount[1] , Number(ballCount2) > 0 ? Number(ballCount2):ballCount[2],Number(ballCount3) > 0 ? Number(ballCount3):ballCount[3]]});
    init();
    setBallCount0("");
    setBallCount1("");
    setBallCount2("");
    setBallCount3("");
    
  }

  async function setTimers(){
    await updateDoc(doc(db, "eskillzpool", "GameSettings", "ArcadeMode","ColourPool"), {Timer : Number(timer0)> 0 ? Number(timer0) : timer});
    init();
    setTimer0("");
  }

  return (
    <>
      <CCard className="mb-4">
        <CCardHeader>ColourPool / Timer</CCardHeader>
        <CCardBody>   
          <CRow>
            <CCol xs={1}>            
              <CFormLabel htmlFor="exampleFormControlInput1">Timer:</CFormLabel>
            </CCol>            
            <CCol xs={1}>            
              <CFormLabel htmlFor="exampleFormControlInput1">{timer} </CFormLabel>            
            </CCol>           
          </CRow>
          <CRow>
            <CCol xs={1}>            
              <CFormLabel htmlFor="exampleFormControlInput1">Timer:</CFormLabel>
            </CCol>  
            <CCol xs={1}>  
              <CFormInput type="text" size="sm" id="winpercent0" placeholder = {timer}
                  value = {timer0} 
                  onChange={(event) => {Number(event.target.value) >= 0 && Number(event.target.value)<= 1000 ? setTimer0(event.target.value) : ''}}
              />           
            </CCol>             
            <CCol xs={3}>   
              <CButton onClick={() => setTimers()}>Set Timer</CButton>
            </CCol> 
          </CRow>                  
        </CCardBody>
      </CCard> 
      <CCard className="mb-4">
        <CCardHeader>ColourPool / BallCount</CCardHeader>
        <CCardBody>   
          <CRow>
            {/* <CCol xs={1}>            
              <CFormLabel htmlFor="exampleFormControlInput1">Length:</CFormLabel>
            </CCol>
            <CCol xs={1}>            
              <CFormInput type="text" size="sm" id="fee" placeholder="5"
                  value = {ballCount.length} 
              />              
            </CCol>  */}
            <CCol xs={2}>            
              <CFormLabel htmlFor="exampleFormControlInput1">BallCount:</CFormLabel>
            </CCol>
            <CCol xs={1}>            
              <CFormLabel htmlFor="exampleFormControlInput1">{ballCount[0]} , </CFormLabel>            
            </CCol> 
            <CCol xs={1}>            
              <CFormLabel htmlFor="exampleFormControlInput1">{ballCount[1]} , </CFormLabel>              
            </CCol>
            <CCol xs={1}>            
              <CFormLabel htmlFor="exampleFormControlInput1">{ballCount[2]} , </CFormLabel>             
            </CCol> 
            <CCol xs={1}>            
              <CFormLabel htmlFor="exampleFormControlInput1">{ballCount[3]}</CFormLabel>              
            </CCol>           
          </CRow> 
          <CRow>
            {/* <CCol xs={1}>            
              <CFormLabel htmlFor="exampleFormControlInput1">Length:</CFormLabel>
            </CCol>
            <CCol xs={1}>            
              <CFormInput type="text" size="sm" id="fee" placeholder="5"
                  value = {winPercentage.length} 
              />              
            </CCol>  */}
            <CCol xs={2}>            
              <CFormLabel htmlFor="exampleFormControlInput1">BallCount :</CFormLabel>
            </CCol>
            <CCol xs={1}>  
              <CFormInput type="text" size="sm" id="winpercent0" placeholder = {ballCount[0]}
                  value = {ballCount0} 
                  onChange={(event) => {Number(event.target.value) >= 0 && Number(event.target.value)<= 1000 ? setBallCount0(event.target.value) : ''}}
              />           
            </CCol> 
            <CCol xs={1}>  
              <CFormInput type="text" size="sm" id="winpercent0" placeholder = {ballCount[1]}
                  value = {ballCount1} 
                  onChange={(event) => {Number(event.target.value) >= 0 && Number(event.target.value)<= 1000 ? setBallCount1(event.target.value) : ''}}
              />           
            </CCol>
            <CCol xs={1}>  
              <CFormInput type="text" size="sm" id="winpercent0" placeholder = {ballCount[2]}
                  value = {ballCount2} 
                  onChange={(event) => {Number(event.target.value) >= 0 && Number(event.target.value)<= 1000 ? setBallCount2(event.target.value) : ''}}
              />           
            </CCol>
            <CCol xs={1}>  
              <CFormInput type="text" size="sm" id="winpercent0" placeholder = {ballCount[3]}
                  value = {ballCount3} 
                  onChange={(event) => {Number(event.target.value) >= 0 && Number(event.target.value)<= 1000 ? setBallCount3(event.target.value) : ''}}
              />           
            </CCol>
            <CCol xs={3}>   
              <CButton onClick={() => setBallCounts()}>Set BallCount</CButton>
            </CCol> 
          </CRow>                   
        </CCardBody>
      </CCard> 
      <CCard className="mb-4">
        <CCardHeader>ColourPool / Win Percentage</CCardHeader>
        <CCardBody>   
          <CRow>
            {/* <CCol xs={1}>            
              <CFormLabel htmlFor="exampleFormControlInput1">Length:</CFormLabel>
            </CCol>
            <CCol xs={1}>            
              <CFormInput type="text" size="sm" id="fee" placeholder="5"
                  value = {winPercentage.length} 
              />              
            </CCol>  */}
            <CCol xs={3}>            
              <CFormLabel htmlFor="exampleFormControlInput1">Win Percentage :</CFormLabel>
            </CCol>
            <CCol xs={1}>            
              <CFormLabel htmlFor="exampleFormControlInput1">{winPercentage[0]} , </CFormLabel>              
            </CCol> 
            <CCol xs={1}>            
              <CFormLabel htmlFor="exampleFormControlInput1">{winPercentage[1]} , </CFormLabel>              
            </CCol> 
            <CCol xs={1}>            
              <CFormLabel htmlFor="exampleFormControlInput1">{winPercentage[2]} , </CFormLabel>              
            </CCol>  
            <CCol xs={1}>            
              <CFormLabel htmlFor="exampleFormControlInput1">{winPercentage[3]}</CFormLabel>              
            </CCol>             
          </CRow> 
          <CRow>
            {/* <CCol xs={1}>            
              <CFormLabel htmlFor="exampleFormControlInput1">Length:</CFormLabel>
            </CCol>
            <CCol xs={1}>            
              <CFormInput type="text" size="sm" id="fee" placeholder="5"
                  value = {winPercentage.length} 
              />              
            </CCol>  */}
            <CCol xs={3}>            
              <CFormLabel htmlFor="exampleFormControlInput1">Win Percentage :</CFormLabel>
            </CCol>
            <CCol xs={1}>  
              <CFormInput type="text" size="sm" id="winpercent0" placeholder = {winPercentage[0]}
                  value = {winPercent0} 
                  onChange={(event) => {Number(event.target.value) >= 0 && Number(event.target.value)<= 1000 ? setWinPercent0(event.target.value) : ''}}
              />           
            </CCol> 
            <CCol xs={1}>  
              <CFormInput type="text" size="sm" id="winpercent0" placeholder = {winPercentage[1]}
                  value = {winPercent1} 
                  onChange={(event) => {Number(event.target.value) >= 0 && Number(event.target.value)<= 1000 ? setWinPercent1(event.target.value) : ''}}
              />           
            </CCol>
            <CCol xs={1}>  
              <CFormInput type="text" size="sm" id="winpercent0" placeholder = {winPercentage[2]}
                  value = {winPercent2} 
                  onChange={(event) => {Number(event.target.value) >= 0 && Number(event.target.value)<= 1000 ? setWinPercent2(event.target.value) : ''}}
              />           
            </CCol>
            <CCol xs={1}>  
              <CFormInput type="text" size="sm" id="winpercent0" placeholder = {winPercentage[3]}
                  value = {winPercent3} 
                  onChange={(event) => {Number(event.target.value) >= 0 && Number(event.target.value)<= 1000 ? setWinPercent3(event.target.value) : ''}}
              />           
            </CCol>
            <CCol xs={3}>   
              <CButton onClick={() => setWinPercent()}>Set Win Percent</CButton>
            </CCol> 
          </CRow>                 
        </CCardBody>
      </CCard> 
      
      {/* <CCard className="mb-4">
        <CCardHeader>Monthly Earn</CCardHeader>
        <CCardBody>
          <CChartLine
            style={{ height: '300px', marginTop: '40px' }}
            data={{
              labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
              datasets: [
                {
                  label: 'Monthly Earn',
                  backgroundColor: 'rgba(151, 187, 205, 0.2)',
                  borderColor: 'rgba(151, 187, 205, 1)',
                  pointBackgroundColor: 'rgba(151, 187, 205, 1)',
                  pointBorderColor: '#fff',
                  data: [
                    random(0, 50),
                    random(0, 50),
                    random(0, 50),
                    random(0, 50),
                    random(0, 50),
                    random(0, 50),
                    random(0, 50),
                  ],
                },
              ],
            }}
            options={{
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: false,
                },
              },
              scales: {
                x: {
                  grid: {
                    drawOnChartArea: false,
                  },
                },
                y: {
                  ticks: {
                    beginAtZero: true,
                    maxTicksLimit: 5,
                    stepSize: Math.ceil(50 / 5),
                    max: 250,
                  },
                },
              },
              elements: {
                line: {
                  tension: 0.4,
                },
                point: {
                  radius: 0,
                  hitRadius: 10,
                  hoverRadius: 4,
                  hoverBorderWidth: 3,
                },
              },
            }}
          />
        </CCardBody>
      </CCard> */}
      {/* <CRow>
        <CCol xs={3}>
          <CCard className="mb-4">
            <CCardHeader>Total Earn</CCardHeader>
            <CCardBody>
              <CChartDoughnut
                data={{
                  labels: ['', 'Total Earn'],
                  datasets: [
                    {
                      backgroundColor: ['#FFFFFF', '#4ac18e'],
                      data: [40, 60],
                    },
                  ],
                }}
              />
              <CFormRange min="0" max="100" className="mt-4 green-range" defaultValue="60" />
              <CButton style={{ margin: '0px auto', display: 'block', background: '#4ac18e', border: '1px solid #4ac18e' }}>Save</CButton>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol xs={3}>
          <CCard className="mb-4">
            <CCardHeader>Total Mint</CCardHeader>
            <CCardBody>
              <CChartDoughnut
                data={{
                  labels: ['', 'Total Mint'],
                  datasets: [
                    {
                      backgroundColor: ['#FFFFFF', '#ffbb44'],
                      data: [30, 70],
                    },
                  ],
                }}
              />
              <CFormRange min="0" max="100" className="mt-4 yellow-range" defaultValue="70" />
              <CButton style={{ margin: '0px auto', display: 'block', background: '#ffbb44', border: '1px solid #ffbb44' }}>Save</CButton>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol xs={3}>
          <CCard className="mb-4">
            <CCardHeader>Betting Earn</CCardHeader>
            <CCardBody>
              <CChartDoughnut
                data={{
                  labels: ['', 'Total Mint'],
                  datasets: [
                    {
                      backgroundColor: ['#FFFFFF', '#8d6e63'],
                      data: [80, 20],
                    },
                  ],
                }}
              />
              <CFormRange min="0" max="100" className="mt-4 brown-range" defaultValue="20" />
              <CButton style={{ margin: '0px auto', display: 'block', background: '#8d6e63', border: '1px solid #8d6e63' }}>Save</CButton>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol xs={3}>
          <CCard className="mb-4">
            <CCardHeader>Tournaments Earn</CCardHeader>
            <CCardBody>
              <CChartDoughnut
                data={{
                  labels: ['', 'Tournaments Earn'],
                  datasets: [
                    {
                      backgroundColor: ['#FFFFFF', '#90a4ae'],
                      data: [90, 10],
                    },
                  ],
                }}
              />
              <CFormRange min="0" max="100" className="mt-4 gray-range" defaultValue="10" />
              <CButton style={{ margin: '0px auto', display: 'block', background: '#90a4ae', border: '1px solid #90a4ae' }}>Save</CButton>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow> */}
    </>
  )
}

export default Tournaments
