import React, { useContext, useState ,useEffect} from 'react';
import style from "../../pages/token/style.module.scss";
const Web3 = require("web3");
const distributeAddress = "0x025F0aeEE1D58Af5f51f8EAA27779Bf484eF5012";
import distributeeABI from '../../Distribute.json';
const TotalEarned = ({address, price}) => {
    const [amount, setAmount] = useState(0);
    useEffect(() => {
        init();
    }, []);
    async function init() {
        try {
                if (window.ethereum) {
                    
                    const addressArray = await window.ethereum.request({
                        method: "eth_accounts",
                    });
                    var web3 = new Web3(window.ethereum);
                    const chainIDBuffer = await web3.eth.net.getId();
                    if(addressArray.length > 0){
                        if(chainIDBuffer == 80001){
                        
                            var distributeContract = new web3.eth.Contract(distributeeABI,distributeAddress);
                            distributeContract.methods.distributedAmounts(addressArray[0]).call(function (err, res) {
                                setAmount(res/10**9);
                            });                  
                        }          
                    } 
                    
                    
                }   
            } catch (err) {
                return {
                address: ""        
                };
            }      
      
    }
    const copy = async () => {
        await navigator.clipboard.writeText(address);
        alert('Text copied');
      }
    return (
        <div className={`${style.total_earned} text-start`}>
            <p>Total Earned</p>
            <h3 className={`${style.color_white} mt-5`}>{amount}<span className={`h6 ${style.color_blue}`}> {" (  $ "+String(Number(amount)*Number(price))+ " )"}</span></h3>
            <div className="d-flex mt-5 mb-1">
                <p className={style.color_middle_green}>{address}</p>
                <div className="ms-2" style={{cursor: "pointer"}}><img src="/images/Copy.png" alt="copy" onClick={() => {copy();}}/></div>
            </div>
        </div>
    );
}

export default TotalEarned;