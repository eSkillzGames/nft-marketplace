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
  const [btnDisabled, setBtnDisabled] = useState(0);
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
    //setBtnDisabled(1);
    const res = await axios.post("/api/user/sendVerifyCode", { email, password, userName});
    // var verifyCode = "3ef0232803086d7fbce80ec2d88f84fd";
    // const res = await axios.post("/api/user/checkVerifyCode", { email, verifyCode });
    console.log("result", res.data);
    //dispatch(loginActions.register(navigate, email, password,userName,value.toString(),file,storageRef,firebase));
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
      setFile(event.target.files[0]);
      var _URL = window.URL || window.webkitURL;
      var file_buf;      
      if(event.target.files.length>0){
        file_buf = event.target.files[0];        
          var objectUrl = _URL.createObjectURL(file_buf);
          setAvatar(objectUrl);
                         
      }
     
  } 

  return (
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          
        </FormControl>
          
       
        <Button
          variant="contained"
          onClick={() =>  handleRegister()}
          sx={{ my: 2 }}
        >
        Confirm
        </Button>
        <Button
          onClick={() => {
            navigate("/register")
          }}
          sx={{ my: 2 }}
        >
       go to Register
        </Button>
        
      </Paper>
    </div>
  );
};

export default Register;
