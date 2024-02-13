import {
  Button,
  FormControl,
  OutlinedInput,
  Box,
  Typography,
} from "@mui/material";
import React from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { auth, db, firebase } from "../../utils/firebase";
import { authActions } from "../../store/actions";

import VersusInput from "../../components/VersusInput";
import VersusButton from "../../components/VersusButton";
import VersusLoading from "../../components/VersusLoading";

const Forgot = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [size, setSize] = useState([0, 0]);
  const [loading, setLoading] = useState(false);

  const endLoading = () => {
    setLoading(true)
  };

  const onSendEmail = () => {
    setLoading(true);
    dispatch(authActions.reset(email, auth, endLoading));
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
              <div>
                <div>
                  <img src="/imgs/versusx-logo.png" style={{width: "15rem"}} />
                </div>
                <div>
                  <Typography variant="h6" fontWeight={"bold"} color="white" my={1}>
                    Forgot password
                  </Typography>
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
                      variant="outlined"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </FormControl>
                </div>
                <div style={{ marginTop: "32px" }}>
                  <VersusButton
                    label={"CONFIRM"}
                    style={{ width: "100%" }}
                    onClick={() => onSendEmail()}
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
                    style={{cursor:"pointer"}}
                    onClick={() => navigate("/")}
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

export default Forgot;
