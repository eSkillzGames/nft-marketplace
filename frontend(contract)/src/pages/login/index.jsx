import { VisibilityOutlined, VisibilityOffOutlined } from "@material-ui/icons";
import {
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  Box,
  Typography,
} from "@mui/material";
import VersusInput from "../../components/VersusInput";
import VersusButton from "../../components/VersusButton";
import VersusLoading from "../../components/VersusLoading";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db, firebase } from "../../utils/firebase";
import { useDispatch } from "react-redux";
import { fuseActions } from "../../store/actions";
import { authActions } from "../../store/actions";
import * as React from "react";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [sign, setSign] = useState(true);
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();
  const [value, setValue] = useState("2000-01-01");
  const [size, setSize] = useState([0, 0]);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
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
    dispatch(
      authActions.register(
        navigate,
        email,
        password,
        userName,
        value.toString()
      )
    );
  };

  const endLoading = () => {
    setLoading(false);
  }

  const handleSignin = async () => {
    dispatch(authActions.login(navigate, auth, email, password, endLoading));
  };

  const handleClickShowPassword = () => {
    setShow(!show);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  React.useEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  },[]);

  return (
    !loading?
    <div style={{ textAlign: "center", padding: "5rem 2rem" }}> 
      <div
        style={{maxWidth: "60rem", margin: "auto"}}
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
              <div>
                <div style={{marginBottom:"1.5rem"}}>
                  <img src="/imgs/versusx-logo.png" style={{width: "15rem"}} />
                </div>
                <div style={{ textAlign: "left", marginTop: "8px" }}>
                  <Typography
                    variant="body1"
                    color="white"
                    mb={0.5}
                  >
                    Email
                  </Typography>
                  <FormControl sx={{ width: "45ch" }} variant="outlined">
                    <VersusInput
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </FormControl>
                </div>
                <div style={{ textAlign: "left", marginTop: "16px" }}>
                  <Typography
                    variant="body1"
                    color="white"
                    mb={0.5}
                  >
                    Password
                  </Typography>
                  <FormControl sx={{ width: "45ch" }} variant="outlined">
                    <VersusInput
                      placeholder="Enter your password"
                      type={show ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPass(e.target.value)}
                      onKeyDown={(e) => {
                        console.log("Pressed Enter")
                        if (e.keyCode === 13) {
                          setLoading(true); 
                          handleSignin()
                        }
                      }}
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
                <div style={{ textAlign: "left" }}>
                  <Typography
                    variant="subtitle2"
                    color="white"
                    mt={1}
                    style={{cursor:"pointer"}}
                    onClick={() => navigate("/forgot")}
                  >
                    Forgot Password
                  </Typography>
                </div>
                <div style={{ position: "relative", marginTop: "32px" }}>
                  <VersusButton
                    label={"LOG IN"}
                    style={{ width: "45ch", cursor: "pointer" }}
                    onClick={() => { 
                      setLoading(true); 
                      handleSignin()
                    }
                    }
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: "8px"
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    color="white"
                  >
                    New to VersusX?
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    color="#00bdff"
                    ml={1}
                    onClick={() => navigate("/register")}
                    style={{cursor:"pointer"}}
                  >
                    Sign up
                  </Typography>
                </div>
              </div>
            </div>
          </Box>
        </Box>
      </div>
    </div>
    :
    <VersusLoading />
  );
};
export default Login;
