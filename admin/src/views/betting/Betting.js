import React from 'react'
import { CCard, CCardBody, CCol, CCardHeader, CRow, CButton, CFormRange , CFormLabel ,CFormInput ,CFormTextarea, CContainer} from '@coreui/react'
import {
  CChartDoughnut,
  CChartLine,
} from '@coreui/react-chartjs'

import { ethers } from 'ethers'
const Web3 = require("web3");
import { useEffect, useState } from "react";
import { cibWindows } from '@coreui/icons';
const BetABI = require('../../ABIs/Bet.json');
const BetAddress = "0x389B71DF19F0c7478a253Fc07dC32F62c9d8DDe0";

const Betting = () => {
  const random = (min, max) => Math.floor(Math.random() * (max - min + 1) + min)

  const progressExample = [
    { title: 'Total Earn', value: '$ 29.703', percent: 40, color: 'success' },
    { title: 'Total Mint', value: '$ 24.093', percent: 20, color: 'info' },
    { title: 'Bet Earn', value: '$ 78.706', percent: 60, color: 'warning' },
    { title: 'Tournaments Earn', value: '$ 22.123', percent: 80, color: 'danger' },
  ]
  const [taxFee, setTaxFee] = useState("");
  const [taxFeeReceiver, setTaxFeeReceiver] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [balance, setBalance] = useState("");
  const [address, setAdress] = useState("");

  async function setFee() {
    setTaxFee(parseInt(Number(taxFee) * 100) / 100);
    try{
      const { ethereum } = window;
      if(ethereum){
        if(address.length>0){
          const chainIDBuffer = await ethereum.networkVersion;
          if(chainIDBuffer == 80001){
              const provider = new ethers.providers.Web3Provider(ethereum);
              const signer = provider.getSigner();
              var BetContract = new ethers.Contract(BetAddress, BetABI, signer); 
              let ownerAddress = await BetContract.owner();
              if(ownerAddress.toLowerCase() == address.toLowerCase()){
                await BetContract.setFee(parseInt(Number(taxFee) * 100));
              }
              else{
                window.alert("You are not owner of Betting Contract.");
              }                        
          } 
        }
        else{
          window.alert("You must Connect Wallet.");
        }
                
      }
      else{          
          window.alert("Install MetaMask.");
      }  
    }
    catch{
        return;
    }
  }

  async function SetFeeReceiver() {
    if(taxFeeReceiver.length==42 && taxFeeReceiver.substring(0,2) =="0x"){
      try{
        const { ethereum } = window;
        if(ethereum){
          if(address.length>0){
            const chainIDBuffer = await ethereum.networkVersion;
            if(chainIDBuffer == 80001){
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                var BetContract = new ethers.Contract(BetAddress, BetABI, signer);                   
                let ownerAddress = await BetContract.owner();
                if(ownerAddress.toLowerCase() == address.toLowerCase()){
                  await BetContract.setFeeReceiver(taxFeeReceiver);
                }
                else{
                  window.alert("You are not owner of Betting Contract.");
                }                      
            } 
          }
          else{
            window.alert("You must Connect Wallet.");
          }
                  
        }
        else{          
            window.alert("Install MetaMask.");
        }  
      }
      catch{
          return;
      }
    }
  }

  async function Withdraw() {
    setWithdrawAmount(parseInt(Number(withdrawAmount)));
    try{
      const { ethereum } = window;
      if(ethereum){
        if(address.length>0){
          const chainIDBuffer = await ethereum.networkVersion;
          if(chainIDBuffer == 80001){
              const provider = new ethers.providers.Web3Provider(ethereum);
              const signer = provider.getSigner();
              var BetContract = new ethers.Contract(BetAddress, BetABI, signer);               
              let ownerAddress = await BetContract.owner();
                if(ownerAddress.toLowerCase() == address.toLowerCase()){
                  await BetContract.withdraw(parseInt(Number(withdrawAmount)*1000000000));  
                }
                else{
                  window.alert("You are not owner of Betting Contract.");
                }                       
          } 
        }
        else{
          window.alert("You must Connect Wallet.");
        }     
      }
      else{          
          window.alert("Install MetaMask.");
      }  
    }
    catch{
        return;
    }

  }

  useEffect(() => {
    try{
      if(window.ethereum) {
        window.ethereum.on('chainChanged', () => {
          window.location.reload();
        })
        window.ethereum.on('accountsChanged', () => {
          window.location.reload();
        })
      }
      getCurrentWalletConnected(); 
    }
    catch{
      return;
    }
    
    
  }, []);

  async function getCurrentWalletConnected() {
    const chainId = 80001;
    try {
      if (window.ethereum) {
        
          const addressArray = await window.ethereum.request({
            method: "eth_accounts",
          });        
          var web3Window = new Web3(window.ethereum);
          if(addressArray.length > 0){
            
            if(window.ethereum.networkVersion == chainId){
              setAdress(addressArray[0]);
              web3Window.eth.getBalance(addressArray[0], (err, balanceOf) => {
                let balETH = ethers.utils.formatUnits(balanceOf, 'ether');        
                setBalance(String(balETH).substring(0, 6) + " ETH");
              }); 
            }            
          }         
        
      } 
    } catch (err) {
      return {
        address: ""        
      };
    }
  };
  
  async function connectWallet() {
    const chainId = 80001;
    
    try{
      if (window.ethereum) {
        var web3Window = new Web3(window.ethereum);    
        if (window.ethereum.networkVersion != chainId) {
          try {
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              //params: [{ chainId: web3.utils.toHex(chainId) }],
              params: [{ chainId: "0x"+chainId.toString(16) }],
            });
            if(address== ""){
              await window.ethereum.request({
                method: "wallet_requestPermissions",
                params: [{
                    eth_accounts: {}
                }]
              });
              const addressArray = await window.ethereum.request({method: "eth_accounts",});
              if(addressArray.length > 0){
                setAdress(addressArray[0]);
                web3Window.eth.getBalance(addressArray[0], (err, balanceOf) => {
                  let balETH = ethers.utils.formatUnits(balanceOf, 'ether');        
                  setBalance(String(balETH).substring(0, 6) + " ETH");
                });                                
              }
            }
            else{
              setAdress("");
              setBalance("");
            }
          } catch (err) {
              // This error code indicates that the chain has not been added to MetaMask.
            if (err.code === 4902) {
              await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [
                  {
                    chainName: 'Ropsten TestNet',
                    chainId: web3.utils.toHex(chainId),
                    nativeCurrency: { name: 'ETH', decimals: 18, symbol: 'ETH' },
                    rpcUrls: ['https://ropsten.infura.io/v3/'],
                  },
                ],
              });
            }
          }
        }
        else{
          if(address== ""){
            await window.ethereum.request({
              method: "wallet_requestPermissions",
              params: [{
                  eth_accounts: {}
              }]
            });
            const addressArray = await window.ethereum.request({method: "eth_accounts",});
            if(addressArray.length > 0){
              setAdress(addressArray[0]);
              web3Window.eth.getBalance(addressArray[0], (err, balanceOf) => {
                let balETH = ethers.utils.formatUnits(balanceOf, 'ether');        
                setBalance(String(balETH).substring(0, 6) + " ETH");
              });                             
            }
          }
          else{
            setAdress("");
            setBalance("");
          }
        }     
        
      }  
    }
    catch{
      return;
    }
      
  };
  
  return (
    <>   
    <CContainer className="mb-4">        
        <CButton onClick={() => connectWallet()}>{address.length == 0 ? "Connect Wallet" : "DisConnect"} </CButton>
    </CContainer>
    <CCard className="mb-4">
        <CCardHeader>Betting Fee</CCardHeader>
        <CCardBody>   
          <CRow>
            <CCol xs={2}>            
              <CFormInput type="text" size="sm" id="fee" placeholder="5.5"
                  value = {taxFee} 
                  onChange={(event) => {Number(event.target.value) >= 0 && Number(event.target.value)<= 25 ? setTaxFee(event.target.value) : ''}}
              />
            </CCol>  
            <CCol xs={6}>   
              <CButton onClick={() => setFee()}>SetFee</CButton>
            </CCol> 
          </CRow>                  
        </CCardBody>
      </CCard> 
      <CCard className="mb-4">
        <CCardHeader>Betting Fee Receiver</CCardHeader>
        <CCardBody>   
          <CRow>
            <CCol xs={6}>            
              <CFormTextarea size="sm" id="feeReceiver" rows="1" placeholder="0x1234..."
                value = {taxFeeReceiver} 
                onChange={(event) => {setTaxFeeReceiver(event.target.value)}}
              />
            </CCol>  
            <CCol xs={6}>   
              <CButton onClick={() => SetFeeReceiver()}>SetFeeReceiver </CButton>
            </CCol> 
          </CRow>                  
        </CCardBody>
      </CCard>  
      <CCard className="mb-4">
        <CCardHeader>withdraw Token that earned by SPGame.</CCardHeader>
        <CCardBody>   
          <CRow>
            <CCol xs={1}>            
              <CFormLabel htmlFor="exampleFormControlInput1">Amount:</CFormLabel>
            </CCol>
            <CCol xs={2}> 
              <CFormInput type="text" size="sm" id="fee" placeholder="8 or 7.55"
                  value = {withdrawAmount} 
                  onChange={(event) => {Number(event.target.value) >= 0 && Number(event.target.value)<= 25 ? setWithdrawAmount(event.target.value) : ''}}
              />
            </CCol>  
            <CCol xs={4}>   
              <CButton onClick={() => Withdraw()}>Withdraw </CButton>
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
      </CCard>
      <CRow>
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

export default Betting
