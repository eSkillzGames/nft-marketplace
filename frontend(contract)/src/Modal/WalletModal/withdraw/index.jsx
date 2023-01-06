import React from "react";
import {
  styled,
  InputBase,
  Grid,
  Button,
  ButtonBase,
  Typography,
  FormGroup,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import { ButtonGroup } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as homeActions from "../../../pages/home/store/actions";
import * as fuseActions from "../../../store/actions";
const { default: axios } = require("axios");
const StyledInputRoot = styled("div")(({ theme }) => ({
  backgroundColor: grey[900],
  padding: "0px 6px",
  width: "100%",
  borderRadius: 12,
}));

const StyledInput = styled(InputBase)(({ theme }) => ({
  backgroundColor: grey[900],
  width: "100%",
  padding: 6,
  color: "white",
}));
const StyledIconButton = styled(ButtonBase)(({ theme }) => ({
  // width:"20px",
  height: "20px",
  width: "40px",
  padding: "2px",
}));

const Withdraw = (props) => {
  const { selected, ...other } = props;
  const [amount, setAmount] = React.useState(null);
  const [toAddress, setToAddress] = React.useState("");
  const [maxBalance, setMaxBalance] = React.useState(0);
  const [confirmBtnDisable, setConfirmBtnDisable] = React.useState(0);
  const { address ,uid} = useSelector(({ authReducer }) => authReducer.auth);
  const { balance } = useSelector(({ homeReducer }) => homeReducer.home);
  const dispatch = useDispatch();
  useEffect(() => {
    if(balance.MaticBal !=null){
      init()
    }
  },[balance, selected])
  async function init() {
    try {    
      setAmount(0);        
      if(selected == 0){
        setMaxBalance(balance.MaticBal/10**18);
      }
      else if (selected == 1){
        setMaxBalance(balance.SportBal/10**9);
        
      }
      else{
        setMaxBalance(balance.EsgBal/10**9);

      }
      } catch (err) {
        
      }
    }

    async function withDraw_Coin() {
      
      try {
        if(address == toAddress){
          dispatch(
            fuseActions.showMessage({
              message: "Can not send to address that you log in this site.",
              variant: "error",
              timer:3000
            })
          );
          return;
        }
        else{
          if(toAddress.length == 42 && toAddress.toLowerCase().substr(0,2) == "0x"){
            if(amount > 0 ){

              if(selected == 0){
                const amountbuf = parseInt(Number(amount) * 10** 9) / 10 ** 9;
                
                console.log(address);
               
                const responseMaticBal = await axios.post(
                  "https://eskillzserver.net/api/v1/getMaticBalanceFromWallet",
                  { address: address}
                );
                
                console.log(responseMaticBal);
                setAmount("");
                if(Number(responseMaticBal.data)- amountbuf < 0.1){
                  dispatch(
                    fuseActions.showMessage({
                      message: "Remain Matic Balance of Eskillz Wallet must be bigger than 0.1 Matic.",
                      variant: "error",
                      timer:5000
                    })
                  );
                  return;
                }
                setConfirmBtnDisable(1);
                const response = await axios.post(
                  "https://eskillzserver.net/sendtransaction/v1/SendMatic",
                  { Account: address, ToAddress: toAddress, Amounts: amountbuf, UserID: uid}
                );
                console.log("response->", response.data);
                setConfirmBtnDisable(0);
                dispatch(homeActions.setBalance(address));                
                dispatch(
                  fuseActions.showMessage({
                    message: "Withdrawed " + amountbuf + " Matic successfuly.",
                    variant: "success",
                    timer:10000
                  })
                );   
                setToAddress("");
              }
              else if (selected == 1){
                const amountbuf = parseInt(amount * 10 ** 9);
                setAmount("");
                setConfirmBtnDisable(1);
                const response = await axios.post(
                  "https://eskillzserver.net/sendtransaction/v1/SendSport",
                  { Account: address, ToAddress: toAddress, Amounts: amountbuf, UserID: uid}
                );
                //console.log("response->", response.data);
                setConfirmBtnDisable(0);
                dispatch(homeActions.setBalance(address));
                dispatch(
                  fuseActions.showMessage({
                    message: "Withdrawed " + amountbuf / 10 ** 9 + " Sport successfuly.",
                    variant: "success",
                    timer:10000
                  })
                );  
                setToAddress(""); 
              }
              else{
                const amountbuf = parseInt(amount * 10 ** 9);
                setAmount("");
                setConfirmBtnDisable(1);
                const response = await axios.post(
                  "https://eskillzserver.net/sendtransaction/v1/SendEsg",
                  { Account: address, ToAddress: toAddress, Amounts: amountbuf, UserID: uid}
                );
                setConfirmBtnDisable(0);
                //console.log("response->", response.data);
           
                dispatch(homeActions.setBalance(address));
                dispatch(
                  fuseActions.showMessage({
                    message: "Withdrawed " + amountbuf / 10 ** 9  + " Esg successfuly.",
                    variant: "success",
                    timer:10000
                  })
                );  
                setToAddress("");  
              }
            }
            else{
              dispatch(
                fuseActions.showMessage({
                  message: "Send Amount must be bigger than zero.",
                  variant: "error",
                  timer:3000
                })
              );
            }
          }
          else{
            dispatch(
              fuseActions.showMessage({
                message: "WithDraw Address is not address type.",
                variant: "error",
                timer:3000
              })
            );
          }
        }
    } catch (err) {
      setConfirmBtnDisable(0);
      dispatch(
        fuseActions.showMessage({
          message: "Network is busy. So tranaction was failed.",
          variant: "error",
          timer:3000
        })
      );
    }
  }
  return (
    <div>
      <FormGroup>
        <Typography variant="caption">Withdraw Address</Typography>
        <StyledInputRoot>
          <StyledInput 
            placeholder="0x123..."
            variant="filled"
            value={toAddress}
            onChange={(event) => {
              event.preventDefault();
              setToAddress(event.target.value);
            }}
          />
        </StyledInputRoot>
      </FormGroup>
      <FormGroup sx={{ my: 4 }}>
        <Typography variant="caption">Withdraw Amount</Typography>
        <StyledInputRoot>
          <Grid container alignItems="center">
            <Grid item md>
              <StyledInput 
                placeholder="0"
                variant="filled"
                value={amount}
                onChange={(event) => {
                  event.preventDefault();
                  setAmount(
                    Number(event.target.value) >= 0 &&
                    Number(event.target.value) <= Number(maxBalance)
                    ? event.target.value.toString().length == 2 &&
                      event.target.value.toString()[0] == "0" &&
                      Number(event.target.value.toString()[1]) >= 0
                      ? event.target.value.toString()[1]
                      : Number(event.target.value) >= 0
                      ? event.target.value
                      : ""
                    : 0
                  );
                }}
              />
            </Grid>
            <Grid item>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <ButtonGroup>
                    <Button
                      variant="outlined"
                      sx={{
                        borderRadius: "16px 1px 1px 16px",
                        textTransform: "capitalize"
                      }}
                      onClick={() => setAmount(maxBalance/20)}
                    >
                      Min
                    </Button>
                    <Button variant="outlined" onClick={() => setAmount(maxBalance/4)}>25%</Button>
                    <Button variant="outlined" onClick={() => setAmount(maxBalance/2)}>50%</Button>
                    <Button
                      variant="outlined"
                      sx={{ borderRadius: "1px 16px 16px 1px", 
                        textTransform: "capitalize"
                      }}
                      onClick={() => setAmount(maxBalance)}
                    >
                      Max
                    </Button>
                  </ButtonGroup>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </StyledInputRoot>
      </FormGroup>
      <Grid container justifyContent="center">
        <Grid item md={6}>
          <Button
            variant="contained"
            disabled = {confirmBtnDisable}
            onClick={() => withDraw_Coin()}
            fullWidth
            sx={{ borderRadius: 8, mt: 4 , textTransform: "capitalize"}}
          >
            Confirm           
          </Button>
        </Grid>
      </Grid>
      {/* <Button
        fullWidth
        variant="contained"
        color="info"
        sx={{ borderRadius: 10, textTransform: "capitalize"}}
        onClick={() => withDraw_Coin()}
      >
        Confirm
      </Button> */}
    </div>
  );
};

export default Withdraw;
