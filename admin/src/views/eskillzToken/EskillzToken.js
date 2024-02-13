import React from 'react'
import { CCard, CCardBody, CCol, CCardHeader, CRow, CButton, CFormRange, CContainer, CFormLabel ,CFormInput ,CFormTextarea, CFormSelect} from '@coreui/react'
import {
  CChartDoughnut,
  CChartLine,
} from '@coreui/react-chartjs'

import { ethers } from 'ethers'
const Web3 = require("web3");
import { useEffect, useState } from "react";
const EsgABI = require('../../ABIs/Esg.json');
const EsgAddress = "0x6637926e5c038c7ae3d3fd2c2d77c44e8be1ed28";
const ESGToken = () => {
  const random = (min, max) => Math.floor(Math.random() * (max - min + 1) + min)

  const progressExample = [
    { title: 'Total Earn', value: '$ 29.703', percent: 40, color: 'success' },
    { title: 'Total Mint', value: '$ 24.093', percent: 20, color: 'info' },
    { title: 'Bet Earn', value: '$ 78.706', percent: 60, color: 'warning' },
    { title: 'Tournaments Earn', value: '$ 22.123', percent: 80, color: 'danger' },
  ]
  const [taxFee, setTaxFee] = useState("");
  const [taxFeeReceiver, setTaxFeeReceiver] = useState("");
  const [taxOption, setTaxOption] = useState("1");
  const [shareExemptAddress, setShareExemptAddress] = useState("");
  const [shareExemptValue, setShareExemptValue] = useState(true);
  const [balance, setBalance] = useState("");
  const [address, setAdress] = useState("");

  async function setFee() {
    return;
    setTaxFee(parseInt(Number(taxFee) * 100)/100);
    try{
      const { ethereum } = window;
      if(ethereum){
        if(address.length>0){
          const chainIDBuffer = await ethereum.networkVersion;
          if(chainIDBuffer == 80001){
              const provider = new ethers.providers.Web3Provider(ethereum);
              const signer = provider.getSigner();
              var EsgContract = new ethers.Contract(EsgAddress, EsgABI, signer);                
              let isAuthorized = await EsgContract.isAuthorized(address);
              if(isAuthorized){
                await EsgContract.setFees(parseInt(Number(taxFee) * 100), 10000); 
              }
              else{
                window.alert("You were not authorized from owner of ESG Contract.");
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
    return;
    if(taxFeeReceiver.length==42 && taxFeeReceiver.substring(0,2) =="0x"){
      try{
        const { ethereum } = window;
        if(ethereum){
          if(address.length>0){
            const chainIDBuffer = await ethereum.networkVersion;
            if(chainIDBuffer == 80001){
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                var EsgContract = new ethers.Contract(EsgAddress, EsgABI, signer); 
                let isAuthorized = await EsgContract.isAuthorized(address);
                if(isAuthorized){
                  await EsgContract.setFeeReceivers(taxFeeReceiver);
                }
                else{
                  window.alert("You were not authorized from owner of ESG Contract.");
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

  async function SetOption() {
    return;
    try{
      const { ethereum } = window;
      if(ethereum){
        if(address.length>0){
          const chainIDBuffer = await ethereum.networkVersion;
          if(chainIDBuffer == 80001){
              const provider = new ethers.providers.Web3Provider(ethereum);
              const signer = provider.getSigner();
              var EsgContract = new ethers.Contract(EsgAddress, EsgABI, signer);                 
              let isAuthorized = await EsgContract.isAuthorized(address);
              if(isAuthorized){
                await EsgContract.setTaxOption(taxOption);
              }
              else{
                window.alert("You were not authorized from owner of ESG Contract.");
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

  async function SetShareExempt() {
    return;
    if(shareExemptAddress.length==42 && shareExemptAddress.substring(0,2) =="0x"){
      try{
        const { ethereum } = window;
        if(ethereum){
          if(address.length>0){
            const chainIDBuffer = await ethereum.networkVersion;
            if(chainIDBuffer == 80001){
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                var EsgContract = new ethers.Contract(EsgAddress, EsgABI, signer);                 
                let isOwner = await EsgContract.isOwner(address);
                if(isOwner){
                  await EsgContract.setShareExempt(shareExemptAddress, shareExemptValue);  
                }
                else{
                  window.alert("You are not owner of ESG Contract.");
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

  async function WithdrawToTreasury() {
    return;
    try{
      const { ethereum } = window;
      if(ethereum){
        if(address.length>0){
          const chainIDBuffer = await ethereum.networkVersion;
          if(chainIDBuffer == 80001){
              const provider = new ethers.providers.Web3Provider(ethereum);
              const signer = provider.getSigner();
              var EsgContract = new ethers.Contract(EsgAddress, EsgABI, signer);                 
              let isOwner = await EsgContract.isOwner(address);
              if(isOwner){
                await EsgContract.withdrawToTreasury();  
              }
              else{
                window.alert("You are not owner of ESG Contract.");
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
            // if (err.code === 4902) {
            //   await window.ethereum.request({
            //     method: 'wallet_addEthereumChain',
            //     params: [
            //       {
            //         chainName: 'Ropsten TestNet',
            //         chainId: web3.utils.toHex(chainId),
            //         nativeCurrency: { name: 'ETH', decimals: 18, symbol: 'ETH' },
            //         rpcUrls: ['https://ropsten.infura.io/v3/'],
            //       },
            //     ],
            //   });
            // }
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
    {/* <CContainer className="mb-4">        
        <CButton onClick={() => connectWallet()}>{address.length == 0 ? "Connect Wallet" : "DisConnect"} </CButton>
    </CContainer> */}
      <CCard className="mb-4">
        <CCardHeader>Tax Fee</CCardHeader>
        <CCardBody>   
          <CRow>
            <CCol xs={2}>            
              <CFormInput type="text" size="sm" id="fee" placeholder="8 or 7.55"
                value = {taxFee} 
                onChange={(event) => {Number(event.target.value) >= 0 && Number(event.target.value)<= 25 ? setTaxFee(event.target.value) : ''}}
              />
            </CCol>  
            <CCol xs={6}>   
              <CButton onClick={() => setFee()}>SetTaxFee</CButton>
            </CCol> 
          </CRow>                  
        </CCardBody>
      </CCard>  
      <CCard className="mb-4">
        <CCardHeader>Fee Receiver</CCardHeader>
        <CCardBody>   
          <CRow>
            <CCol xs={6}>            
              <CFormTextarea size="sm" id="feeReceiver" rows="1" placeholder="0x1234..."
                value = {taxFeeReceiver} 
                onChange={(event) => {setTaxFeeReceiver(event.target.value)}}
              />
            </CCol>  
            <CCol xs={6}>   
              <CButton onClick={() => SetFeeReceiver()}>SetTaxFeeReceiver </CButton>
            </CCol> 
          </CRow>                  
        </CCardBody>
      </CCard>     
      <CCard className="mb-4">
        <CCardHeader>Set Tax Token</CCardHeader>
        <CCardBody>   
          <CRow>
            <CCol xs={2}>            
              <CFormSelect size="sm" className="mb-3" aria-label="Small select example" onChange={(event) => {setTaxOption(event.target.value)}}>
                <option value="1">ESG</option>          
                <option value="2">ETH/MATIC</option>
                <option value="3">USDC</option>
              </CFormSelect>
            </CCol>  
            <CCol xs={4}>   
              <CButton onClick={() => SetOption()}>SetTaxOption </CButton>
            </CCol> 
          </CRow>                  
        </CCardBody>
      </CCard>      
      <CCard className="mb-4">
        <CCardHeader> Set ShareExempt</CCardHeader>
        <CCardBody>   
          <CRow>
            <CCol xs={2}>            
              <CFormLabel htmlFor="exampleFormControlInput1">Exempt Address:</CFormLabel>
            </CCol>
            <CCol xs={6}>            
              <CFormTextarea size="sm" id="shareExemptAddress" rows="1" placeholder="0x1234..."
                value = {shareExemptAddress} 
                onChange={(event) => {setShareExemptAddress(event.target.value)}}
              />
            </CCol>
            <CCol xs={2}>            
              <CFormSelect size="sm" className="mb-3" aria-label="Small select example" onChange={(event) => {event.target.value == "1" ? setShareExemptValue(true) : setShareExemptValue(false)}}>
                <option value="1">True</option>
                <option value="0">False</option>
              </CFormSelect>
            </CCol>  
            <CCol xs={2}>   
              <CButton onClick={() => SetShareExempt()}>SetShareExempt </CButton>
            </CCol> 
          </CRow>                  
        </CCardBody>
      </CCard>          
        
      <CCard className="mb-4">
        <CCardHeader>Click the WithdrawToTreasury Button to withdraw.</CCardHeader>
        <CCardBody>   
          <CRow>
            <CCol xs={4}>   
              <CButton onClick={() => WithdrawToTreasury()}>WithdrawToTreasury  </CButton>
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

export default ESGToken
