import { Button, FormControl, InputLabel, OutlinedInput, Paper } from '@mui/material'
import React from 'react'
import { useState } from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { auth, db, firebase } from "../../utils/firebase";
import * as loginActions from "../register/store/actions"
const Forgot = () => {
    const [email,setEmail] = useState("");
const navigaete = useNavigate();
const dispatch = useDispatch();

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
            <InputLabel htmlFor="outlined-adornment-password">Email</InputLabel>
            <OutlinedInput
              label="Email"
              // placeholder="email"
  
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            
          </FormControl>
          <Button variant="contained" onClick={() => dispatch(loginActions.reset(email,auth))} >
            send
          </Button>
          <Button onClick={() => navigaete("/")} sx={{my:2}}>
            go to login
          </Button>
        </Paper></div>
  )
}

export default Forgot