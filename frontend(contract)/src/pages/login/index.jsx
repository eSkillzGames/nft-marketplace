import { Visibility, VisibilityOff } from "@material-ui/icons";
import { Button, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, Paper, TextField ,Box, Link } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db, firebase } from "../../utils/firebase";
import { useDispatch } from "react-redux";
import * as fuseActions from "../../store/actions";
import * as loginActions from "../register/store/actions";
const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [userName, setUserName] = useState("");
    const [password, setPass] = useState("");
    const [confirm, setConfirm] = useState("");
    const [sign, setSign] = useState(true);
    const [show, setShow] = useState(false);
    const dispatch = useDispatch();
    const [value,setValue] = useState("2000-01-01");
  
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
      dispatch(loginActions.register(navigate, email, password,userName,value.toString()));
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
  
    return(
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
            <InputLabel htmlFor="outlined-adornment-password">Email</InputLabel>
            <OutlinedInput
              label="Email"
              // placeholder="email"
  
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            
          </FormControl>
          {/* {!sign && (<FormControl sx={{ m: 1, width: "30ch" }} variant="outlined">
              <InputLabel htmlFor="outlined-adornment-password">UserName</InputLabel>
              <OutlinedInput
                label="UserName"
                // placeholder="email"
  
                variant="outlined"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
              
            </FormControl>
          )} */}
  
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
          {/* {!sign && (
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
          )}
           {!sign && (<FormControl sx={{m:1,width:"30ch"}} >
              <TextField  label="Birthday"
                type="date"
                value={value}
                onChange={(e) =>{
                  setValue(e.target.value)
                } }
                defaultValue={"2000-01-01"}/>
            </FormControl>
          )} */}
          <Button
            variant="contained"
            onClick={() =>  handleSignin()}
            sx={{ my: 2 }}
          >
        Sign in 
          </Button>
          <Button
            onClick={() => {
              navigate("/register")
            }}
            sx={{ my: 2 }}
          >
           go to Register
          </Button>
          <Button onClick={() => navigate("/forgot")}  sx={{ my: 2 }}>
            Forgot Password
          </Button>
          <Box
            component="img"
            sx={{
              // width: "100%",
              // maxHeight: { xs: 233, md: 167 },
              maxWidth: { xs: 250, md: 250 },
            }}
            alt="ESKILLZ"
            src="/images/logo-new.png"
          />
          {/* <Link
            color='secondary'
            component="button"
            variant="body2"
            onClick={() => {
              window.open("https://app.appsonair.com/install/QjNptp");
            }}
          >
            Download eSkillz Pool for iOS
          </Link> */}
          
        </Paper>
      </div>
    )
}
export default Login;