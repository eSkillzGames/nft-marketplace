import React, { useEffect , useState} from "react";
import { Button } from "react-bootstrap";
import style from "../../pages/token/style.module.scss";
import { ethers } from 'ethers';
import { useRouter } from 'next/router';
import WalletConnectProvider from "@walletconnect/web3-provider";
const Web3 = require("web3");

const Header = ({getAddress}) => {
  const [address, setAdress] = React.useState("");
  const [netName, setNetName] = React.useState("");
  const [balance, setBalance] = useState("");
  const router = useRouter();
  const [screenSize, getDimension] = useState({
    dynamicWidth: 1100,
    dynamicHeight: 0
  });
  const setDimension = () => {
    getDimension({
      dynamicWidth: window.innerWidth-500,
      dynamicHeight: window.innerHeight
    })
  }
  getAddress(address)
  useEffect(() => {
    try{
      window.addEventListener('resize', setDimension);
      if(window.ethereum) {
        window.ethereum.on('chainChanged', () => {
          //router.reload();
          router.push('/token');
        })
        window.ethereum.on('accountsChanged', () => {
          //router.reload();
          router.push('/token');
        })
      }
      getCurrentWalletConnected();   
      // return(() => {
      //   window.removeEventListener('resize', setDimension);
      // })
    }
    catch{
      return;
    }
    
  }, [screenSize])
  async function getCurrentWalletConnected() {
    try {
      if (window.ethereum) {
        
          const addressArray = await window.ethereum.request({
            method: "eth_accounts",
          });
          var web3Window = new Web3(window.ethereum);
          const chainIDBuffer = await web3Window.eth.net.getId();
          if(addressArray.length > 0){
            setAdress(addressArray[0]);
            if(chainIDBuffer == 80001){
              setNetName("");  
              web3Window.eth.getBalance(addressArray[0], (err, balanceOf) => {
                let balETH = ethers.utils.formatUnits(balanceOf, 'ether');        
                setBalance(String(balETH).substring(0, 6) + " MATIC");
              });           
            }
            else{  
              setNetName("Wrong NET(DisConnect)");  
            }
          }         
        
      } 
      else{
        const prov = new WalletConnectProvider({
          infuraId: "acc8266b5baf41c5ad44a05fe4a49925",
          qrcodeModalOptions: {
            mobileLinks: ["metamask"],
          },
        });
        const addressMobile = await prov.enable();
        var web3Window = new Web3(prov);
        const chainIDBuffer = await web3Window.eth.net.getId();
        if(addressMobile.length > 0){
          setAdress(addressMobile[0]);
          if(chainIDBuffer == 80001){
            setNetName("");  
            web3Window.eth.getBalance(addressMobile[0], (err, balanceOf) => {
              let balETH = ethers.utils.formatUnits(balanceOf, 'ether');        
              setBalance(String(balETH).substring(0, 6) + " MATIC");
            });           
          }
          else{  
            setNetName("Wrong NET(DisConnect)");  
          }
        }     
      }
    } catch (err) {
      return {
        address: ""        
      };
    }
  };

  // async function addSPORTToken(){
  //   try{
  //     if (window.ethereum) {
  //       var web3Window = new Web3(window.ethereum);
  //       const chainIDBuffer = await web3Window.eth.net.getId(); 
  //       if(chainIDBuffer == 80001){
  //         const SportTokenAddress = '0x6D586a553563C84222bE782F13de3d720a30Cdc0';
  //         const SportTokenSymbol = 'SPORT';
  //         const SportTokenDecimals = 9;
  //         const tokenImage = '';          
  //         const wasAdded = await window.ethereum.request({
  //           method: 'wallet_watchAsset',
  //           params: {
  //             type: 'ERC20', // Initially only supports ERC20, but eventually more!
  //             options: {
  //               address: SportTokenAddress, // The address that the token is at.
  //               symbol: SportTokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
  //               decimals: SportTokenDecimals, // The number of decimals in the token
  //               image: tokenImage, // A string url of the token logo
  //             },
  //           },
  //         });  
                 
  //       }
  //       else{  
  //         window.alert("Wrong Network");
  //       }
  //     } 
  //     else{
  //       const prov = new WalletConnectProvider({
  //         infuraId: "acc8266b5baf41c5ad44a05fe4a49925",
  //         qrcodeModalOptions: {
  //           mobileLinks: ["metamask"],
  //         },
  //       });
  //       const addressMobile = await prov.enable();
  //      var web3Window = new Web3(prov);
  //       const chainIDBuffer = await web3Window.eth.net.getId(); 
  //       if(chainIDBuffer == 80001){
  //         const SportTokenAddress = '0x6D586a553563C84222bE782F13de3d720a30Cdc0';
  //         const SportTokenSymbol = 'SPORT';
  //         const SportTokenDecimals = 9;
  //         const tokenImage = '';          
  //         const wasAdded = await prov.request({
  //           method: 'wallet_watchAsset',
  //           params: {
  //             type: 'ERC20', // Initially only supports ERC20, but eventually more!
  //             options: {
  //               address: SportTokenAddress, // The address that the token is at.
  //               symbol: SportTokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
  //               decimals: SportTokenDecimals, // The number of decimals in the token
  //               image: tokenImage, // A string url of the token logo
  //             },
  //           },
  //         });     
  //       }
  //       else{  
  //         window.alert("Wrong Network");
  //       }        

  //     } 
  //   }
  //   catch{
  //     return;
  //   }
  // }

  // async function addESGToken(){
  //   try{
  //     if (window.ethereum) {
  //       var web3Window = new Web3(window.ethereum);
  //       const chainIDBuffer = await web3Window.eth.net.getId(); 
  //       if(chainIDBuffer == 80001){
  //         const EsgTokenAddress = '0xc44B158B2D55783e38F0Cf701657658D61b0C970';
  //         const EsgTokenSymbol = 'ESG';
  //         const EsgTokenDecimals = 9;
  //         const tokenImage = '';          
  //         const wasAdded = await window.ethereum.request({
  //           method: 'wallet_watchAsset',
  //           params: {
  //             type: 'ERC20', // Initially only supports ERC20, but eventually more!
  //             options: {
  //               address: EsgTokenAddress, // The address that the token is at.
  //               symbol: EsgTokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
  //               decimals: EsgTokenDecimals, // The number of decimals in the token
  //               image: tokenImage, // A string url of the token logo
  //             },
  //           },
  //         });            
  //       }
  //       else{  
  //         window.alert("Wrong Network");
  //       }
  //     }  
  //     else{
  //       const prov = new WalletConnectProvider({
  //         infuraId: "acc8266b5baf41c5ad44a05fe4a49925",
  //         qrcodeModalOptions: {
  //           mobileLinks: ["metamask"],
  //         },
  //       });
  //       const addressMobile = await prov.enable();
  //      var web3Window = new Web3(prov);
  //       const chainIDBuffer = await web3Window.eth.net.getId(); 
  //       if(chainIDBuffer == 80001){
  //         const EsgTokenAddress = '0xc44B158B2D55783e38F0Cf701657658D61b0C970';
  //         const EsgTokenSymbol = 'ESG';
  //         const EsgTokenDecimals = 9;
  //         const tokenImage = '';          
  //         const wasAdded = await prov.request({
  //           method: 'wallet_watchAsset',
  //           params: {
  //             type: 'ERC20', // Initially only supports ERC20, but eventually more!
  //             options: {
  //               address: EsgTokenAddress, // The address that the token is at.
  //               symbol: EsgTokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
  //               decimals: EsgTokenDecimals, // The number of decimals in the token
  //               image: tokenImage, // A string url of the token logo
  //             },
  //           },
  //         });            
  //       }
  //       else{  
  //         window.alert("Wrong Network");
  //       }        

  //     }
      
  //   }
  //   catch{
  //     return;
  //   }
  // }

  async function connect_Wallet() {
    const chainId = 80001;
    try{
      if (window.ethereum) {
        var web3Window = new Web3(window.ethereum);     
        if (window.ethereum.networkVersion != chainId) {
          
          try {
            
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: "0x"+chainId.toString(16)}],
            });
            if(address== ""){
              try {          
                await window.ethereum.request({
                  method: "wallet_requestPermissions",
                  params: [{
                      eth_accounts: {}
                  }]
                });
                const addressArray = await window.ethereum.request({method: "eth_accounts",});
                var web3Window = new Web3(window.ethereum);
                //setChainID(chainIDBuffer);
                if(addressArray.length > 0){
                  setAdress(addressArray[0]);
                  setNetName("");    
                  web3Window.eth.getBalance(addressArray[0], (err, balanceOf) => {
                    let balETH = ethers.utils.formatUnits(balanceOf, 'ether');        
                    setBalance(String(balETH).substring(0, 6) + " MATIC");
                  });   
                }        
              } catch (err) {
                return {
                  address: ""        
                };
              }
            }
            else{
              setAdress("");
              setNetName(""); 
            }
          } catch (err) {
              // This error code indicates that the chain has not been added to MetaMask.
            if (err.code === 4902) {
              await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [
                  {
                    chainName: 'Polygon Mumbai',
                    chainId: web3.utils.toHex(chainId),
                    nativeCurrency: { name: 'Matic', decimals: 18, symbol: 'Matic' },
                    rpcUrls: ['https://rpc-mumbai.maticvigil.com/'],
                  },
                ],
              });
            }
          }
        }
        else{
          if(address== ""){
            try {          
              await window.ethereum.request({
                method: "wallet_requestPermissions",
                params: [{
                    eth_accounts: {}
                }]
              });
              const addressArray = await window.ethereum.request({method: "eth_accounts",});
              var web3Window = new Web3(window.ethereum);
              //setChainID(chainIDBuffer);
              if(addressArray.length > 0){
                setAdress(addressArray[0]);
                setNetName("");    
                web3Window.eth.getBalance(addressArray[0], (err, balanceOf) => {
                  let balETH = ethers.utils.formatUnits(balanceOf, 'ether');        
                  setBalance(String(balETH).substring(0, 6) + " MATIC");
                });   
              }        
            } catch (err) {
              return {
                address: ""        
              };
            }
          }
          else{
            //window.ethereum.on('disconnect');
            //window.ethereum.removeListener('accountsChanged', addressArray);
            //window.ethereum.disable();
            // await window.ethereum.request({
            //   method: "eth_closeAccounts",
            //   params: [{eth_accounts: {}}]
            // });
            setAdress("");
            setNetName(""); 
          }   
        }     
        
      }  
      else{
        const prov = new WalletConnectProvider({
          infuraId: "acc8266b5baf41c5ad44a05fe4a49925",
          qrcodeModalOptions: {
            mobileLinks: ["metamask"],
          },
        });
        const addressMobile = await prov.enable();
        var web3Window = new Web3(prov);  
          var chainID_mobile = await web3Window.eth.net.getId();
        if (chainID_mobile != chainId) {
          try {           
            if(address== ""){
              await prov.request({
                method: 'wallet_switchEthereumChain',
                //params: [{ chainId: web3.utils.toHex(chainId) }],
                params: [{ chainId: "0x"+chainId.toString(16) }],
              });
              if(addressMobile.length > 0){
                setAdress(addressMobile[0]);
                setNetName("");
                web3Window.eth.getBalance(addressMobile[0], (err, balanceOf) => {
                  let balETH = ethers.utils.formatUnits(balanceOf, 'ether');        
                  setBalance(String(balETH).substring(0, 6) + " MATIC");
                }); 
                             
              }
            }
            else{

              setAdress("");
              setNetName("");
              
              //await provider.disconnect();
            }
          } catch (err) {
              // This error code indicates that the chain has not been added to MetaMask.
            if (err.code === 4902) {
              await prov.request({
                method: 'wallet_addEthereumChain',
                params: [
                  {
                    chainName: 'Polygon Mumbai',
                    chainId: web3.utils.toHex(chainId),
                    nativeCurrency: { name: 'Matic', decimals: 18, symbol: 'Matic' },
                    rpcUrls: ['https://rpc-mumbai.maticvigil.com/'],
                  },
                ],
              });
            }
          }
        }
        else{
          if(address== ""){
            
            if(addressMobile.length > 0){
              setAdress(addressMobile[0]);
              setNetName("");
              web3Window.eth.getBalance(addressMobile[0], (err, balanceOf) => {
                let balETH = ethers.utils.formatUnits(balanceOf, 'ether');        
                setBalance(String(balETH).substring(0, 6) + " MATIC");
              });                             
            }
          }
          else{

            setAdress("");
            setNetName("");
            
            //await provider.disconnect();
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
      <div className={style.logo}>
        <img src="/images/Logo1.png" alt="Logo" />
      </div>
      <div className={style.backDiv}>
        <Button style={{
            position: 'absolute',
            top: '20px',
            left: '50px',
            minWidth: 'auto',
            width: '40px',
            height: '40px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: 'white',
            borderRadius: '50%',
            fontFamily: 'monospace',
            fontSize: '20px',
            backgroundColor: 'transparent'
          }} onClick={() => router.push('/')}>
          {'<'}
        </Button>
      </div>
      <div className={style.buttonDiv + " d-flex justify-content-lg-between justify-content-md-between align-items-center"}>
        <div style={{position : "absolute", left: screenSize.dynamicWidth/2, top: "130px"}}>
          <p className={`${style.bg_dark_green} ${style.color_blue}`} style = {{fontSize : "25px"}}>Please make sure you are visiting <a href="https://www.eskillz.info" className={style.color_blue}>www.eskillz.info</a></p>
        </div>
        <div style = {{flexDirection : 'column', display : 'flex', position: 'absolute', right: '70px', top: '30px'}}>
              <span style={{color : 'white'}}>
                &nbsp;
                &nbsp;
                ADDRESS :
                &nbsp;
              {address.length> 0 ? (String(address).substring(0, 8) + "..." + String(address).substring(36)) : ("")}
              </span>
              <span style={{color : '#06f506'}}>
                &nbsp;
                &nbsp;
                MATIC BALANCE :
                &nbsp;
                {address.length> 0 ? balance : balance}            
              </span>            
        </div>
        {/* <Button style={{position: 'absolute', left: '70px', top: '80px'}} variant="outline-primary" className={`${style.color_blue} ${style.btn_outline_primary} rounded-pill`} onClick = {() =>{addESGToken();}}>
            ADD ESG TOKEN
        </Button>
        <Button style={{position: 'absolute', left: '270px', top: '80px'}} variant="outline-primary" className={`${style.color_blue} ${style.btn_outline_primary} rounded-pill`} onClick = {() =>{addSPORTToken();}}>
            ADD SPORT TOKEN
        </Button> */}
        <Button style={{position: 'absolute', right: '70px', top: '80px'}} variant="outline-primary" className={`${style.color_blue} ${style.btn_outline_primary} rounded-pill`} onClick = {() =>{connect_Wallet();}}>
            {netName == "" ? (address.length == 0 ? "CONNECT WALLET" : "DISCONNECT") : netName}
        </Button>
      </div>
    </>
  )
}

export default Header;