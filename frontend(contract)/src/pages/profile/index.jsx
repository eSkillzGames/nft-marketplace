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
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db, firebase ,storage, storageRef} from "../../utils/firebase";
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useDispatch, useSelector } from "react-redux";
import * as fuseActions from "../../store/actions";
import * as loginActions from "../register/store/actions";
import * as layoutActions from "../../layout/store/actions";
import d_avatar from "../../assets/image/davatar.png"
// import CreateIcon from '@mui/icons-material/Create';
// import Create from "@mui/icons-material/Create";
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

const Register = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState(""); 
  const dispatch = useDispatch();
  const { uid, address , mail } = useSelector(({ authReducer }) => authReducer.auth);
  const [value,setValue] = useState("2000-01-01");
  const [file, setFile] = useState("");
  const [avatarBuffer,setAvatarBuffer] = useState("");
  const [updated,setUpdated] = useState(0);
  const { avatar } = useSelector(({ layoutReducer }) => layoutReducer.layout);
  useEffect(() => {    
    getData();
  
}, [mail, updated]);
  const getData = async () => {
    var docRef = db.collection("users").doc(`${uid}`).collection("Profile").doc("ProfileData");
    docRef.get().then((doc) => {
        if (doc.exists) {
          setUserName(doc.data().userName);
          setValue(doc.data().birthDay);
        } else {
          setUserName("");
        }
    }).catch((error) => {
        setUserName("");
    });
  };

  const handleSave = async () => {
    var msgVal = "";
    var nameCount = 0;
    var birthCount = 0;
    var fileCount = 0;
    var sumCount = 0;
    if (userName.length < 3) {
      dispatch(
        fuseActions.showMessage({
          message: "userName must be 3 character at least",
          variant: "error",
        })
      );
      return 0;
    }
    var docRef = db.collection("users").doc(`${uid}`).collection("Profile").doc("ProfileData");
    var doc = await docRef.get();
    if (doc.exists) {
      if(doc.data().userName != userName){
        nameCount = 1;
      }
      if(doc.data().birthDay != value){
        birthCount = 1;
      }      
    } else {
      birthCount = 1;
      nameCount = 1;
    }
    if(avatar != avatarBuffer && file){
      console.log("avatar", avatar);
      console.log("avatarBuffer", avatarBuffer);
      console.log("file", file);
      fileCount = 1;
    }
    if(fileCount > 0){    
      var uploadTask = storageRef.child(`users/${uid}.jpeg`).put(file);
      uploadTask.on('state_changed', 
        (snapshot) => {        
          var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
          if(progress == 100){
            sumCount+=1;
            dispatch(layoutActions.setAvatar(avatarBuffer));
            if(msgVal.length>0){

              msgVal +=" and Avatar";
            }
            else{
              msgVal +="Avatar";

            }
            if(sumCount == nameCount + birthCount + fileCount){

              dispatch(
                fuseActions.showMessage({
                  message: "You have successfully updated " + msgVal + ".",
                  variant: "success",
                  timer:5000
                })
              );
            }
          }        
        }, 
        (error) => {        
        }, 
        () => {       
          uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            console.log('File available at', downloadURL);
          });
        }
      );
    }
    var docRef = db.collection("users").doc(`${uid}`).collection("Profile").doc("ProfileData");
    
    if(nameCount>0){
      if(msgVal.length>0){
        
        msgVal +=" and UserName";
      }
      else{
        msgVal +="UserName";

      }
    }
    if(birthCount>0){
      if(msgVal.length>0){
        
        msgVal +=" and BirthDay";
      }
      else{
        msgVal +="BirthDay";

      }
    }   
    if(nameCount + birthCount > 0){
      sumCount += nameCount + birthCount;
      await docRef.update({"userName" : userName, "birthDay" : value});    
      setUpdated(1-updated);
      if(sumCount == nameCount + birthCount + fileCount){

        dispatch(
          fuseActions.showMessage({
            message: "You have successfully updated " + msgVal + ".",
            variant: "success",
            timer:5000
          })
        );
      }
    }
  };
  
  async function handleChange(event) {
    
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
        setAvatarBuffer(objectUrl);
                         
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

            <Avatar src={avatarBuffer ? avatarBuffer : (avatar ? avatar  : d_avatar)} sx={{width:"80px",height:"80px",cursor:'pointer'}} >M</Avatar>
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
            variant="outlined"
            value={mail}
            readOnly
          />
          
        </FormControl>
        <FormControl sx={{ m: 1, width: "30ch" }} variant="outlined">
          <InputLabel htmlFor="outlined-adornment-password">Wallet Address</InputLabel>
          <OutlinedInput
            label="Wallet Address"
            variant="outlined"
            value={address}
            readOnly
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
          onClick={() =>  handleSave()}
          sx={{ my: 2 }}
        >
        Save
        </Button>
        <Button
          onClick={() => {
            window.history.back();
          }}
          sx={{ my: 2 }}
        >
       go to Back
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
