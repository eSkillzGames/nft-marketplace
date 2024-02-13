import {
  Typography,
  IconButton,
  InputAdornment,
  Box,
  FormControl
} from "@mui/material";
import axios from "axios";
import React from "react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fuseActions, authActions } from "../../store/actions";
import VersusCard from "../../components/VersusCard";
import VersusCardContent from "../../components/VersusCardContent";
import VersusCardHeader from "../../components/VersusCardHeader";
import VersusButton from "../../components/VersusButton";
import VersusInput from "../../components/VersusInput";
import VersusMenu from "../../components/VersusMenu";
import VersusLoading from '../../components/VersusLoading'
import VersusSlider from "../../components/VersusSlider";

// import Web3Modal from "web3modal";
// import WalletConnectProvider from "@walletconnect/web3-provider";
import { ethers, providers } from "ethers";


const Wallet = () => {
  const [title, setTitle] = useState("WALLET DEPOSIT");
  const { uid, address } = useSelector(({ authReducer }) => authReducer.auth);
  const { matic, skill } = useSelector(({ authReducer }) => authReducer.auth);
  const [curCrypto, setCurCrypto] = useState("MATIC");
  const [metaMaskAddress, setMetaMaskAddress] = useState("");
  const [withdrawAddress, setWithdrawAddress] = useState("");
  const [provider, setProvider] = useState(null);
  const [depositAmount, setDepositAmount] = useState(0);
  const [withDrawAmount, setWithDrawAmount] = useState(0);

  const dispatch = useDispatch();
  const [size, setSize] = useState([0, 0]);
  const [loadingViewOpen, setLoadingViewOpen] = useState(false);
  const state = useSelector(({ fuse }) => fuse.wallet.state);
  const options = useSelector(({ fuse }) => fuse.wallet.options);
  const [depositPercent, setDepositPercent] = useState(0);
  const [withDrawPercent, setWithDrawPercent] = useState(0);

  useEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  useEffect(() => {
    if (options.address != null || options.address != undefined) {
      setMetaMaskAddress(options.address);
      setWithdrawAddress(options.address);
    }
  }, [options]);

  useEffect(() => {
    console.log("slider testing", matic);
    if (withDrawPercent != 0) {
      var tempAmounnt = matic * withDrawPercent;
      setWithDrawAmount(tempAmounnt);
    }
  }, [withDrawPercent]);

  const depositCoin = async () => {
    try {
      if (Number(depositAmount) > 0) {
        let ethAmountBuf = parseInt(Number(depositAmount) * 10 ** 7) / 10 ** 7;
        setDepositAmount(0);
        var chainID = 80001;
        if (curCrypto == "MATIC") {
          if (window.ethereum) {
            await window.ethereum.request({
              method: "wallet_switchEthereumChain",
              params: [{ chainId: "0x" + chainID.toString(16) }],
            });
            const providerBuf = new ethers.providers.Web3Provider(
              window.ethereum
            );

            await providerBuf.send("eth_requestAccounts", []);

            const signer = providerBuf.getSigner();

            setLoadingViewOpen(true);
            try {
              const tx = await signer.sendTransaction({
                to: address,
                value: ethers.utils.parseEther(ethAmountBuf.toString()),
              });
              await tx.wait();
            }
            catch (e) {
              setLoadingViewOpen(false);
              dispatch(
                fuseActions.showMessage({
                  message: "Transaction was cancelled.",
                  variant: "error",
                  timer: 3000,
                })
              );
              return;
            }
            setLoadingViewOpen(false);
            dispatch(authActions.setBalance(address));
            dispatch(
              fuseActions.showMessage({
                message: "Deposited " + ethAmountBuf + "Matic successfuly.",
                variant: "success",
                timer: 10000,
              })
            );
          } else {
            provider.updateRpcUrl(80001);
            const ethersProvider = new ethers.providers.Web3Provider(provider);
            const network = await ethersProvider.getNetwork();
            const chainIdBuf = network.chainId;
            if (!(Number(chainIdBuf) === Number(chainID))) {
              await ethersProvider.provider.request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId: "0x" + chainID.toString(16) }],
              });
            }
            const signer = await ethersProvider.getSigner();
            await ethersProvider.send("eth_requestAccounts", []);

            setLoadingViewOpen(true);
            try {
              const tx = await signer.sendTransaction({
                to: address,
                value: ethers.utils.parseUnits(ethAmountBuf.toString(), "ether")
                  ._hex,
              });
              await tx.wait();
            }
            catch (e) {
              setLoadingViewOpen(false);
              dispatch(
                fuseActions.showMessage({
                  message: "Transaction was cancelled.",
                  variant: "error",
                  timer: 3000,
                })
              );
              return;
            }
            setLoadingViewOpen(false);
            dispatch(authActions.setBalance(address));
            dispatch(
              fuseActions.showMessage({
                message: "Deposited " + ethAmountBuf + "Matic successfuly.",
                variant: "success",
                timer: 10000,
              })
            );
          }
        }
        /*else if (curCrypto == "SKILL") {
          if (window.ethereum) {
            await window.ethereum.request({
              method: "wallet_switchEthereumChain",
              params: [{ chainId: "0x" + chainID.toString(16) }],
            });
            const addressArray = await window.ethereum.request({
              method: "eth_accounts",
            });
            if (addressArray.length == 0) {
              await window.ethereum.request({
                method: "wallet_requestPermissions",
                params: [
                  {
                    eth_accounts: {},
                  },
                ],
              });
            }
            const providerBuf = new ethers.providers.Web3Provider(
              window.ethereum
            );
            const signer = providerBuf.getSigner();
            var sportContract = new ethers.Contract(
              sportTokenAddress,
              sportJson.abi,
              signer
            );
            let nftTxn = await sportContract.transfer(
              address,
              String(ethAmountBuf * 10 ** 9)
            );
            await nftTxn.wait();
            dispatch(authActions.setBalance(address));
            dispatch(
              fuseActions.showMessage({
                message: "Deposited " + ethAmountBuf + "Skill successfuly.",
                variant: "success",
                timer: 10000,
              })
            );
          } else {
            provider.updateRpcUrl(80001);
            const ethersProvider = new ethers.providers.Web3Provider(provider);
            const network = await ethersProvider.getNetwork();
            const chainIdBuf = network.chainId;
            if (!(Number(chainIdBuf) === Number(chainID))) {
              await ethersProvider.provider.request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId: "0x" + chainID.toString(16) }],
              });
            }
            const signer = await ethersProvider.getSigner();
            var sportContract = new ethers.Contract(
              sportTokenAddress,
              sportJson.abi,
              signer
            );
            let nftTxn = await sportContract.transfer(
              address,
              String(ethAmountBuf * 10 ** 9)
            );
            await nftTxn.wait();
            dispatch(authActions.setBalance(address));
            dispatch(
              fuseActions.showMessage({
                message: "Deposited " + ethAmountBuf + "Skill successfuly.",
                variant: "success",
                timer: 10000,
              })
            );
          }
        }*/
      } else {
        dispatch(
          fuseActions.showMessage({
            message: "Top-up Amount must be bigger than zero.",
            variant: "error",
            timer: 3000,
          })
        );
      }
    } catch (err) {
      dispatch(
        fuseActions.showMessage({
          message: err,
          variant: "error",
          timer: 3000,
        })
      );
    }
  };

  const withdrawCoin = async () => {
    try {
      if (address == withdrawAddress) {
        dispatch(
          fuseActions.showMessage({
            message: "Can not send to address that you log in this site.",
            variant: "error",
            timer: 3000,
          })
        );
        return;
      } else {
        if (
          withdrawAddress.length == 42 &&
          withdrawAddress.toLowerCase().substr(0, 2) == "0x"
        ) {
          if (withDrawAmount > 0) {
            if (curCrypto == "MATIC") {
              const amountbuf = parseInt(Number(withDrawAmount) * 10 ** 9) / 10 ** 9;

              console.log(address);
              setLoadingViewOpen(true);
              const responseMaticBal = await axios.post(
                process.env.REACT_APP_API_URL +
                "/api/v1/getMaticBalanceFromWallet",
                { address: address }
              );

              setWithDrawAmount(0);
              if (Number(responseMaticBal.data) - amountbuf < 0.1) {
                setLoadingViewOpen(false);
                dispatch(
                  fuseActions.showMessage({
                    message:
                      "Remain Matic Balance of VERSUS-X Wallet must be bigger than 0.1 Matic.",
                    variant: "error",
                    timer: 5000,
                  })
                );
                return;
              }
              try {
                const response = await axios.post(
                  process.env.REACT_APP_API_URL + "/sendtransaction/v1/SendMatic",
                  {
                    Account: address,
                    ToAddress: withdrawAddress,
                    Amounts: amountbuf,
                    UserID: uid,
                  }
                );
                setLoadingViewOpen(false);
                console.log("send matic response", response);
                if (response.status == 200) {
                  dispatch(authActions.setBalance(address));
                  dispatch(
                    fuseActions.showMessage({
                      message: "Withdrawed " + amountbuf + " Matic successfuly.",
                      variant: "success",
                      timer: 10000,
                    })
                  );
                  setMetaMaskAddress("");
                }
                else {
                  dispatch(
                    fuseActions.showMessage({
                      message: response.data,
                      variant: "error",
                      timer: 5000,
                    })
                  );
                }
              }
              catch (e) {
                setLoadingViewOpen(false);
                dispatch(
                  fuseActions.showMessage({
                    message: "Transaction was cancelled.",
                    variant: "error",
                    timer: 5000,
                  })
                );
                return;
              }
            } else if (curCrypto == "SKILL") {
              const amountbuf = parseInt(withDrawAmount * 10 ** 9);
              withDrawAmount(0);
              const response = await axios.post(
                process.env.REACT_APP_API_URL + "/sendtransaction/v1/SendSport",
                {
                  Account: address,
                  ToAddress: withdrawAddress,
                  Amounts: amountbuf,
                  UserID: uid,
                }
              );
              //console.log("response->", response.data);
              dispatch(authActions.setBalance(address));
              dispatch(
                fuseActions.showMessage({
                  message:
                    "Withdrawed " + amountbuf / 10 ** 9 + " Sport successfuly.",
                  variant: "success",
                  timer: 10000,
                })
              );
              setMetaMaskAddress("");
            } else {
              const amountbuf = parseInt(withDrawAmount * 10 ** 9);
              withDrawAmount(0);
              const response = await axios.post(
                process.env.REACT_APP_API_URL + "/sendtransaction/v1/SendEsg",
                {
                  Account: address,
                  ToAddress: withdrawAddress,
                  Amounts: amountbuf,
                  UserID: uid,
                }
              );
              //console.log("response->", response.data);
              setLoadingViewOpen(false);
              dispatch(authActions.setBalance(address));
              dispatch(
                fuseActions.showMessage({
                  message:
                    "Withdrawed " + amountbuf / 10 ** 9 + " Esg successfuly.",
                  variant: "success",
                  timer: 10000,
                })
              );
              setMetaMaskAddress("");
            }
          } else {
            dispatch(
              fuseActions.showMessage({
                message: "Send Amount must be bigger than zero.",
                variant: "error",
                timer: 3000,
              })
            );
          }
        } else {
          dispatch(
            fuseActions.showMessage({
              message: "WithDraw Address is not address type.",
              variant: "error",
              timer: 3000,
            })
          );
        }
      }
    } catch (err) {
      dispatch(
        fuseActions.showMessage({
          message: "Network is busy. So tranaction was failed.",
          variant: "error",
          timer: 3000,
        })
      );
    }
  }

  return (
    !loadingViewOpen ?
      <>
        <VersusCard title={title}>
          <VersusCardHeader showToken={true}>
            <Box></Box>
          </VersusCardHeader>
          <VersusCardContent style={{ padding: "0px" }}>
            <Box display={"flex"} justifyContent={"space-between"}>
              <Box
                sx={{
                  border:
                    title == "WALLET DEPOSIT"
                      ? "1px solid #FFFFFF"
                      : "1px solid #00BDFF",
                  background:
                    title == "WALLET DEPOSIT" ? "#FFFFFF33" : "#25253080",
                  width: "50%",
                  color: title == "WALLET DEPOSIT" ? "white" : "#00BDFF",
                }}
                textAlign="center"
                py={1}
                onClick={() => {
                  setTitle("WALLET DEPOSIT");
                }}
              >
                <Typography variant="subtitle1" fontWeight="bold">
                  DEPOSIT
                </Typography>
              </Box>
              <Box
                sx={{
                  border:
                    title == "WALLET WITHDRAW"
                      ? "1px solid #FFFFFF"
                      : "1px solid #00BDFF",
                  background:
                    title == "WALLET WITHDRAW" ? "#FFFFFF33" : "#25253080",
                  width: "50%",
                  color: title == "WALLET WITHDRAW" ? "white" : "#00BDFF",
                }}
                textAlign="center"
                py={1}
                onClick={() => {
                  setTitle("WALLET WITHDRAW");
                }}
              >
                <Typography variant="subtitle1" fontWeight="bold">
                  WITHDRAW
                </Typography>
              </Box>
            </Box>
            {title == "WALLET DEPOSIT" &&
              <Box style={{ paddingTop: "3rem", paddingBottom: "3rem", paddingRight: size[0] > 576 ? "4rem" : "1rem", paddingLeft: size[0] > 576 ? "4rem" : "1rem", display: "flex", flexDirection: "column" }} alignItems={"center"}>
                <Box display="flex" alignItems={"center"} justifyContent={"center"}>
                  <img
                    src="/imgs/wallet-icon.png"
                    style={{ marginLeft: "4px", marginRight: "13px" }}
                  />
                  <VersusInput
                    style={{ width: size[0] > 576 ? "300px" : "100%" }}
                    placeholder="Wallet Address"
                    value={address}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton>
                          <img src="/imgs/copy-link-icon.png" />
                        </IconButton>
                      </InputAdornment>
                    }
                    readOnly={true}
                  />
                </Box>
                <Box
                  display="flex"
                  alignItems={"center"}
                  mt={1}
                  justifyContent={"center"}
                >
                  <img
                    // src={metaMaskAddress == "" ? "/imgs/metamask-grayscale-logo.png" : "imgs/metamask.png"}
                    src="imgs/wallet-deposit-icon.png"
                    style={{ marginRight: "17px", width: "20px", height: "20px" }}
                  />
                  <VersusInput
                    style={{ width: size[0] > 576 ? "300px" : "100%" }}
                    placeholder="Wallet Address"
                    value={metaMaskAddress}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton>
                          <img src="/imgs/copy-link-icon.png" />
                        </IconButton>
                      </InputAdornment>
                    }
                    readOnly={true}
                  />
                </Box>
                <Box
                  display="flex"
                  alignItems={"center"}
                  mt={1}
                  justifyContent={"center"}
                >
                  <img src="/imgs/banknote-icon.png" style={{ marginRight: "9px" }} />
                  <FormControl variant="outlined">
                    <VersusInput
                      style={{ width: size[0] > 576 ? "300px" : "100%" }}
                      placeholder="Amount"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      startAdornment={
                        <InputAdornment position="start">
                          <Box sx={{ borderRight: "1px solid #00BDFF" }}>
                            <VersusMenu
                              value={curCrypto}
                              items={[
                                {
                                  label: "MATIC",
                                  onClick: () => {
                                    setCurCrypto("MATIC");
                                  },
                                },
                                {
                                  label: "SKILL",
                                  onClick: () => {
                                    setCurCrypto("SKILL");
                                  },
                                },
                              ]}
                            />
                          </Box>
                        </InputAdornment>
                      }
                    />
                  </FormControl>
                </Box>
                <VersusSlider setValue={setDepositPercent} />
                <Box
                  display="flex"
                  alignItems={"center"}
                  mt={2}
                  justifyContent={"center"}
                >
                  <VersusButton
                    label="DEPOSIT"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      depositCoin();
                    }}
                  />
                </Box>
              </Box>}
            {title == "WALLET WITHDRAW" &&
              <Box style={{ paddingTop: "3rem", paddingBottom: "3rem", paddingRight: size[0] > 576 ? "4rem" : "1rem", paddingLeft: size[0] > 576 ? "4rem" : "1rem", display: "flex", flexDirection: "column" }} alignItems={"center"}>
                <Box display="flex" alignItems={"center"} justifyContent={"center"}>
                  <img
                    src="/imgs/wallet-icon.png"
                    style={{ marginLeft: "4px", marginRight: "13px" }}
                  />
                  <VersusInput
                    style={{ width: "300px" }}
                    placeholder="Wallet Address"
                    value={address}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton>
                          <img src="/imgs/copy-link-icon.png" />
                        </IconButton>
                      </InputAdornment>
                    }
                    readOnly={true}
                  />
                </Box>
                <Box
                  display="flex"
                  alignItems={"center"}
                  mt={1}
                  justifyContent={"center"}
                >
                  <img
                    src="/imgs/withdraw-money-icon.png"
                    style={{ marginRight: "8px" }}
                  />
                  <VersusInput
                    style={{ width: "300px" }}
                    placeholder="Withdraw Address"
                    value={withdrawAddress}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton>
                          <img src="/imgs/copy-link-icon.png" />
                        </IconButton>
                      </InputAdornment>
                    }
                    onChange={(e) => {
                      setWithdrawAddress(e.target.value);
                    }}
                  />
                </Box>
                <Box
                  display="flex"
                  alignItems={"center"}
                  mt={1}
                  justifyContent={"center"}
                >
                  <img src="/imgs/banknote-icon.png" style={{ marginRight: "9px" }} />
                  <VersusInput
                    style={{ width: "300px" }}
                    placeholder="Amount"
                    value={withDrawAmount}
                    onChange={(event) => {
                      event.preventDefault();
                      setWithDrawAmount(event.target.value);
                    }}
                    startAdornment={
                      <InputAdornment position="start">
                        <Box sx={{ borderRight: "1px solid #00BDFF" }}>
                          <VersusMenu
                            value={curCrypto}
                            items={[
                              {
                                label: "MATIC",
                                onClick: () => {
                                  setCurCrypto("MATIC");
                                },
                              },
                              {
                                label: "SKILL",
                                onClick: () => {
                                  setCurCrypto("SKILL");
                                },
                              },
                            ]}
                          />
                        </Box>
                      </InputAdornment>
                    }
                  />
                </Box>
                <VersusSlider setValue={setWithDrawPercent} />
                <Box
                  display="flex"
                  alignItems={"center"}
                  mt={2}
                  justifyContent={"center"}
                >
                  <VersusButton
                    label="WITHDRAW"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      withdrawCoin();
                    }}
                  />
                </Box>
              </Box>
            }
          </VersusCardContent>
        </VersusCard>
      </>
      :
      <VersusLoading />
  );
};

export default Wallet;
