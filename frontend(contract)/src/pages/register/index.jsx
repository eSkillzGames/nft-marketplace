import { VisibilityOutlined, VisibilityOffOutlined } from "@material-ui/icons";
import {
  Box,
  Button,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  Paper,
  Typography,
} from "@mui/material";
import convert from "image-file-resize";
import VersusInput from "../../components/VersusInput";
import VersusButton from "../../components/VersusButton";
import VersusLoading from "../../components/VersusLoading";

import axios from "axios";
import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db, firebase, storage, storageRef } from "../../utils/firebase";
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useDispatch } from "react-redux";
import { fuseActions, authActions } from "../../store/actions";
import d_avatar from "../../assets/image/davatar.png";
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
  const [value, setValue] = useState("2000-01-01");
  const [file, setFile] = useState("");
  const [imgNameUpload, setImgNameUpload] = useState("");
  const [avatar, setAvatar] = useState("");
  const [verifyCode, setVerifyCode] = useState("");
  const [btnDisabled, setBtnDisabled] = useState(false);
  const [confirmBtnDisabled, setConfirmBtnDisabled] = useState(0);
  const isValidEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

  const [size, setSize] = useState([0, 0]);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email.match(isValidEmail)) {
      dispatch(
        fuseActions.showMessage({
          message: "Email is invalid",
          variant: "error",
        })
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
    setLoading(true);
    let registeredCheck = await fetchSignInMethodsForEmail(auth, email);
    setLoading(false);

    if (registeredCheck.length) {
      dispatch(
        fuseActions.showMessage({
          message: "You can not register. Cause of you are registered already.",
          variant: "error",
          timer: 5000,
        })
      );
      return 0;
    }

    setBtnDisabled(true);
    dispatch(
      fuseActions.showMessage({
        message:
          "Thanks for registering.  Please check your email to get verify code for authorise your account.",
        variant: "success",
        timer: 5000,
      })
    );
    setLoading(true);
    const res = await axios.post("/api/user/sendVerifyCode", {
      email,
      password,
      userName,
    });
    setLoading(false);

    console.log("result", res.data);
  };

  const endLoading = () => {
    setLoading(false);
  }

  const handleCheckVerifyCode = async () => {
    setLoading(true);
    const res = await axios.post("/api/user/checkVerifyCode", {
      email,
      verifyCode,
    });
    console.log("result", res.data);
    if (res.data == 2) {
      setConfirmBtnDisabled(1);
      dispatch(
        authActions.register(
          navigate,
          email,
          password,
          userName,
          value.toString(),
          file,
          storageRef,
          firebase,
          endLoading
        )
      );
    } else if (res.data == 1) {
      setLoading(false);
      dispatch(
        fuseActions.showMessage({
          message: "Verify Code was sent to you 2 days ago.",
          variant: "error",
        })
      );
    } else {
      setLoading(false);
      dispatch(
        fuseActions.showMessage({
          message: "Verify Code is not correct.",
          variant: "error",
        })
      );
    }
  };

  const handleClickShowPassword = () => {
    setShow(!show);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  function handleChange(event) {
    if (event.target.files.length > 0) {
      var _URL = window.URL || window.webkitURL;
      var img = new Image();
      var objectUrl = _URL.createObjectURL(event.target.files[0]);
      img.src = objectUrl;
      var width_buf, height_buf;
      img.onload = async function () {
        width_buf = this.width;
        height_buf = this.height;
        let imgBuf;
        if (width_buf > height_buf) {
          if (width_buf > 512) {
            imgBuf = await convert({
              file: event.target.files[0],
              width: 512,
              height: (512 * height_buf) / width_buf,
              type: "jpeg",
            });

            setFile(imgBuf);
          } else {
            setFile(event.target.files[0]);
          }
        } else {
          if (height_buf > 512) {
            imgBuf = await convert({
              file: event.target.files[0],
              width: (512 * width_buf) / height_buf,
              height: 512,
              type: "jpeg",
            });
            setFile(imgBuf);
          } else {
            setFile(event.target.files[0]);
          }
        }
      };
      setAvatar(objectUrl);
    }
  }

  React.useEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  },[]);

  return btnDisabled ? (
    <Box
      sx={{
        background: "url('/imgs/login/bg-login.png')",
      }}
      alignItems={"center"}
      justifyContent={"center"}
      display={"flex"}
    >
      <Paper
        sx={{
          p: 5,
          mt: 6,
          mb: 6,
          width: "40rem",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <FormControl sx={{ m: 1, width: "30ch" }} variant="outlined">
          <Box sx={{color: "#1976d2", fontWeight: "bold", marginBottom: "0.5rem"}}>
            Verify Code
          </Box>
          <Box>
            <VersusInput
              placeholder="Verify Code"
              variant="outlined"
              value={verifyCode}
              onChange={(e) => setVerifyCode(e.target.value)}
            />
          </Box>
        </FormControl>

        <Button
          variant="contained"
          disabled={confirmBtnDisabled}
          onClick={() => handleCheckVerifyCode()}
          sx={{ my: 2 }}
        >
          Confirm
        </Button>
        <Button
          onClick={() => {
            setBtnDisabled(false);
          }}
          sx={{ my: 2 }}
        >
          Go to Register
        </Button>
      </Paper>
    </Box>
  ) : (
    !loading ?
    <div>
      <Box sx={{ height: size[0] > 576 ? "70px" : "32px" }}></Box>
      <div
        style={{margin: size[0] > 768 ? "0 12rem" : "0 24px"}}
      >
        <Box
          alignItems={"center"}
          justifyContent={"center"}
          display={"flex"}
          width={"100%"}
        >
          <Box
            display={"flex"}
            justifyContent={"center"}
            alignContent={"center"}
            textAlign={"center"}
            width={"100%"}
            position={"relative"}
          >
            {/* <img src="/imgs/login/login-panel.png" style={{ height: "60vh" }} /> */}
            <div
              style={{
                padding: "2rem 3.5rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#2aa8db20",
                margin: "10px",
                outlineOffset: "10px",
                outline: "2px solid #2aa8db",
                width:"100%"
              }}
            >
              <div style={{width:"100%"}}>
                <div style={{marginBottom:"1.5rem"}}>
                  <img src="/imgs/versusx-logo.png" style={{width: "15rem"}} />
                </div>
                <div>
                  <Typography variant="h6" fontWeight={"bold"} color="white" my={1}>
                    Sign up
                  </Typography>
                </div>
                <div>
                  <Grid container spacing={4}>
                    <Grid item md={6} sm={12} xs={12}>
                      <div style={{ textAlign: "left"}}>
                        <Typography
                          variant="body1"
                          color="white"
                          mb={0.5}
                        >
                          Email
                        </Typography>
                        <FormControl
                          sx={{ width: "100%"}}
                          variant="outlined"
                        >
                          <VersusInput
                            placeholder="Enter your email"
                            variant="outlined"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                        </FormControl>
                      </div>
                      <div style={{ textAlign: "left", marginTop:"0.5rem" }}>
                        <Typography
                          variant="body1"
                          color="white"
                          mb={0.5}
                        >
                          Username
                        </Typography>
                        <FormControl sx={{ width: "100%" }} variant="outlined">
                          <VersusInput
                            placeholder="Enter your username"
                            variant="outlined"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                          />
                        </FormControl>
                      </div>
                      <div style={{ textAlign: "left", marginTop:"0.5rem" }}>
                        <Typography
                          variant="body1"
                          color="white"
                          mb={0.5}
                        >
                          Birthday
                        </Typography>
                        <FormControl sx={{ width: "100%" }} variant="outlined">
                          <VersusInput
                            type="date"
                            value={value}
                            onChange={(e) => {
                              setValue(e.target.value);
                            }}
                            defaultValue={"2000-01-01"}
                          />
                        </FormControl>
                      </div>
                    </Grid>
                    <Grid item md={6} sm={12} xs={12}>
                      <div style={{ textAlign: "left" }}>
                        <Typography
                          variant="body1"
                          color="white"
                          mb={0.5}
                        >
                          Password
                        </Typography>
                        <FormControl sx={{ width: "100%" }} variant="outlined">
                          <VersusInput
                            placeholder="Enter your password"
                            type={show ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPass(e.target.value)}
                            endAdornment={
                              <InputAdornment position="end">
                                <IconButton
                                  aria-label="toggle password visibility"
                                  onClick={handleClickShowPassword}
                                  onMouseDown={handleMouseDownPassword}
                                  sx={{ color: "white" }}
                                >
                                  {show ? (
                                    <VisibilityOffOutlined />
                                  ) : (
                                    <VisibilityOutlined />
                                  )}
                                </IconButton>
                              </InputAdornment>
                            }
                          />
                        </FormControl>
                      </div>
                      <div style={{ textAlign: "left", marginTop:"0.5rem" }}>
                        <Typography
                          variant="body1"
                          color="white"
                          mb={0.5}
                        >
                          Confirm Password
                        </Typography>
                        <FormControl sx={{ width: "100%" }} variant="outlined">
                          <VersusInput
                            placeholder="Confirm your password"
                            type={show ? "text" : "password"}
                            value={confirm}
                            onChange={(e) => setConfirm(e.target.value)}
                            endAdornment={
                              <InputAdornment position="end">
                                <IconButton
                                  aria-label="toggle password visibility"
                                  onClick={handleClickShowPassword}
                                  onMouseDown={handleMouseDownPassword}
                                  sx={{ color: "white" }}
                                >
                                  {show ? (
                                    <VisibilityOffOutlined />
                                  ) : (
                                    <VisibilityOutlined />
                                  )}
                                </IconButton>
                              </InputAdornment>
                            }
                          />
                        </FormControl>
                      </div>
                    </Grid>
                  </Grid>
                </div>
                <div style={{ marginTop: "32px" }}>
                  <VersusButton
                    label={"CREATE ACCOUNT"}
                    style={{ width: "100%", cursor: "pointer" }}
                    onClick={() => handleRegister()}
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    color="white"
                    mt={1}
                  >
                    Already have an account?
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    color="#00bdff"
                    mt={1}
                    ml={1}
                    onClick={() => navigate("/")}
                    style={{cursor:"pointer"}}
                  >
                    Login in
                  </Typography>
                </div>
              </div>
            </div>
          </Box>
        </Box>
      </div>
      <Box sx={{ height: size[0] > 576 ? "70px" : "32px" }}></Box>
    </div>
    :
    <VersusLoading />
  );
};

export default Register;
