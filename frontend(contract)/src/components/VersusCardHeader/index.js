import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";

const VersusCardHeader = ({ children, showToken }) => {
  const { matic, skill } = useSelector(({ authReducer }) => authReducer.auth);
  const [maticBalance, setMaticBalance] = useState(0);
  const [skillBalance, setSkillBalance] = useState(0);

  useEffect(() => {
    if(matic) {
      setMaticBalance(matic);
    }
  }, [matic]);

  useEffect(() => {
    if(skill){
      setSkillBalance(skill);
    }
  }, [skill]);

  return (
    <Box
      sx={{
        background: "#28272D",
        borderTopLeftRadius: "16px",
        borderTopRightRadius: "16px",
        color: "white",
        padding: "1rem 1.25rem",
      }}
    >
      <Box display="flex" alignItems={"center"} justifyContent={"space-between"}>
        {children}
        {showToken && (
          <Box display="flex" alignItems={"center"} justifyContent={"center"}>
            <img src="/imgs/matic-token-icon.png"/>
            <Typography ml={1} variant="subtitle1">MATIC</Typography>
            <Typography ml={1} variant="subtitle1">{Number(maticBalance).toFixed(2)}</Typography>

            <img src="/imgs/S_CRYPTO-01.png" style={{marginLeft: "16px"}}/>
            <Typography ml={1} variant="subtitle1">SKILL</Typography>
            <Typography ml={1} variant="subtitle1">{Number(skillBalance).toFixed(2)}</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};
export default VersusCardHeader;
