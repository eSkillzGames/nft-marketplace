import {
  Avatar,
  Badge,
  Box,
  Button,
  Fab,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Paper,
  TextField,
} from "@mui/material";
import convert from 'image-file-resize';

//import IconButton from '@mui/material/IconButton';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import axios from "axios";
import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db, firebase ,storage, storageRef} from "../../utils/firebase";
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useDispatch } from "react-redux";
import * as fuseActions from "../../store/actions";
import * as loginActions from "./store/actions";
import d_avatar from "../../assets/image/davatar.png"
import { fetchSignInMethodsForEmail } from "firebase/auth";
// import CreateIcon from '@mui/icons-material/Create';
// import Create from "@mui/icons-material/Create";
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [sign, setSign] = useState(true);
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();
  const [value,setValue] = useState("2000-01-01");
  const [file, setFile] = useState("");
  const [imgNameUpload, setImgNameUpload] = useState("");
  const [avatar,setAvatar] = useState("");
  const [verifyCode, setVerifyCode] = useState("");
  const [btnDisabled, setBtnDisabled] = useState(0);
  const [confirmBtnDisabled, setConfirmBtnDisabled] = useState(0);
  const isValidEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
  const handleRegister = async () => {
    
    if(!email.match(isValidEmail)){      
      dispatch(
        fuseActions.showMessage({ message: "Email is invalid", variant: "error" })
      );
      return 0;
    }

    if (password !== confirm) {
      setConfirm("");
      setPass("");
      dispatch(
        fuseActions.showMessage({ message: "wrong password", variant: "error" })
      );
      return 0;
    }
    if (password.length < 6) {
      dispatch(
        fuseActions.showMessage({
          message: "password must be 6 character at least",
          variant: "error",
        })
      );
      return 0;
    }
    if (userName.length < 3) {
      dispatch(
        fuseActions.showMessage({
          message: "userName must be 3 character at least",
          variant: "error",
        })
      );
      return 0;
    }
    let registeredCheck = await fetchSignInMethodsForEmail(auth, email);
    if(registeredCheck.length){
      dispatch(
        fuseActions.showMessage({
          message: "You can not register. Cause of you are registered already.",
          variant: "error",
          timer:5000
        })
      );
      return 0;
    }

    setBtnDisabled(1);
    dispatch(
      fuseActions.showMessage({ message: "Thanks for registering.  Please check your email to get verify code for authorise your account.", variant: "success", timer : 5000 })
    );
    const res = await axios.post("/api/user/sendVerifyCode", { email, password, userName});    
    console.log("result", res.data);
  };

  const handleCheckVerifyCode = async () => {
       
    const res = await axios.post("/api/user/checkVerifyCode", { email, verifyCode });
    console.log("result", res.data);
    if(res.data == 2){
      setConfirmBtnDisabled(1);
      dispatch(loginActions.register(navigate, email, password,userName,value.toString(),file,storageRef,firebase));
    }
    else if (res.data == 1){
      dispatch(
        fuseActions.showMessage({
          message: "Verify Code was sent to you 2 days ago.",
          variant: "error",
        })
      );
    }
    else{
      dispatch(
        fuseActions.showMessage({
          message: "Verify Code is not correct.",
          variant: "error",
        })
      );
    }
  };
  const handleSignin = async () => {
    dispatch(loginActions.login(navigate, auth, email, password));
  };

  const handleClickShowPassword = () => {
    setShow(!show);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  function handleChange(event) {
      
      if(event.target.files.length>0){
        var _URL = window.URL || window.webkitURL;
        var img = new Image();
        var objectUrl = _URL.createObjectURL(event.target.files[0]);        
        img.src = objectUrl;
        var width_buf, height_buf;
        img.onload =  async function() {
          width_buf = this.width;
          height_buf = this.height;
          let imgBuf
          if(width_buf > height_buf){
    
            if(width_buf > 512){
              imgBuf = await convert({ 
                file: event.target.files[0],  
                width: 512,
                height: 512 * height_buf / width_buf, 
                type: 'jpeg'
              });
              
              setFile(imgBuf);
            }
            else{
              setFile(event.target.files[0]);
            }
          }
          else{
            if(height_buf > 512){
              imgBuf = await convert({ 
                file: event.target.files[0],  
                width: 512 * width_buf / height_buf,
                height: 512, 
                type: 'jpeg'
              });
              setFile(imgBuf);
            }
            else{
              setFile(event.target.files[0]);
    
            }
          }
    
        }
        setAvatar(objectUrl);
                         
      }
     
  } 

  return (
          
    btnDisabled ? 
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
      <Paper
        sx={{
          p: 5,
          mt: 8,
          width: "500px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >

        <FormControl sx={{ m: 1, width: "30ch" }} variant="outlined">
          <InputLabel htmlFor="outlined-adornment-password">Verify Code</InputLabel>
          <OutlinedInput
            label="Verify Code"
            // placeholder="email"

            variant="outlined"
            value={verifyCode}
            onChange={(e) => setVerifyCode(e.target.value)}
          />
          
        </FormControl>
          
       
        <Button
          variant="contained"
          disabled = {confirmBtnDisabled}
          onClick={() =>  handleCheckVerifyCode()}
          sx={{ my: 2 }}
        >
        Confirm
        </Button>
        <Button
          onClick={() => {
            setBtnDisabled(0);
          }}
          sx={{ my: 2 }}
        >
       go to Register
        </Button>
        
      </Paper>
    </div>
      : 
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Paper
          sx={{
            p: 5,
            mt: 8,
            width: "500px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >

        <FormControl sx={{ m: 1, width: "30ch" }} variant="outlined">
              {/* <Button variant="contained" component="label">
                Avatar
                <input hidden accept="image/*" multiple type="file" onChange={handleChange}/>
              </Button> */}
              {/* <span style={{margin : "5px 0px 0px 0px"}}>
                {imgNameUpload}
              </span> */}
              {/* <img id="output" width="50" /> */}

              <Grid container justifyContent="center">
                <Grid item>
                  <>

              <input hidden id="select-file" accept="image/*" multiple type="file" onChange={handleChange}/>
              <label htmlFor="select-file">

              <Avatar src={avatar ? avatar:d_avatar} sx={{width:"80px",height:"80px",cursor:'pointer'}} >M</Avatar>
              </label>
                  </>
                </Grid>
              </Grid>
              {/* <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                badgeContent={
                  // <SmallAvatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                  // <IconButton size="small">
                  <>
                    <CreateIcon/>
                  </>
                  // </IconButton>
                }
              >
              </Badge> */}
            </FormControl>
          <FormControl sx={{ m: 1, width: "30ch" }} variant="outlined">
            <InputLabel htmlFor="outlined-adornment-password">Email</InputLabel>
            <OutlinedInput
              label="Email"
              // placeholder="email"

              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            
          </FormControl>
          <FormControl sx={{ m: 1, width: "30ch" }} variant="outlined">
              <InputLabel htmlFor="outlined-adornment-password">UserName</InputLabel>
              <OutlinedInput
                label="UserName"
                // placeholder="email"

                variant="outlined"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
              
            </FormControl>
      

          <FormControl sx={{ m: 1, width: "30ch" }} variant="outlined">
            <InputLabel htmlFor="outlined-adornment-password">
              Password
            </InputLabel>
            <OutlinedInput
              id="outlined-adornment-password"
              type={show ? "text" : "password"}
              value={password}
              onChange={(e) => setPass(e.target.value)}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {show ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
            />
          </FormControl>
        
            <FormControl sx={{ m: 1, width: "30ch" }} variant="outlined">
              <InputLabel htmlFor="outlined-adornment-password">
                Confirm Password
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                type={show ? "text" : "password"}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {show ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Confirm Password"
              />
            </FormControl>
    
        <FormControl sx={{m:1,width:"30ch"}} >
              <TextField  label="Birthday"
                type="date"
                value={value}
                onChange={(e) =>{
                  setValue(e.target.value)
                } }
                defaultValue={"2000-01-01"}/>
            </FormControl>
  
          <Button
            variant="contained"
            disabled = {btnDisabled}
            onClick={() =>  handleRegister()}
            sx={{ my: 2 }}
          >
      Register
          </Button>
          <Button
            onClick={() => {
              navigate("/")
            }}
            sx={{ my: 2 }}
          >
        go to Login
          </Button>
          {/* <Button variant="text" onClick={() => dispatch(loginActions.logout())}>
            logout
          </Button> */}
          {/* <Fab variant="rounded" onClick={googleLogin}>
            G
          </Fab> */}
        </Paper>
      </div>
    
    
  );
};

export default Register;
