import React from "react";
import {Box, Typography} from "@mui/material";

const VersusLoading = (props) => {
  return (
  <Box width={"100%"} height={"50rem"} style={{zIndex:101, background:"#000", position:"relative"}}>
      <Box
        sx={{
          color: "white",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img src="/imgs/loading.gif" alt="loading" style={{width:"15rem"}}/>
        <Typography variant="subtitle1" fontWeight="bold" color="white" style={{textShadow: "0px 0px 22.229999542236328px #00BDFF, 0px 0px 44.459999084472656px #00BDFF, 0px 0px 155.61000061035156px #00BDFF, 0px 0px 311.2200012207031px #00BDFF, 0px 0px 533.52001953125px #00BDFF, 0px 0px 933.6599731445312px #00BDFF"}}>
          LOADING...
        </Typography>
    </Box>
  </Box>
  );
};
export default VersusLoading;
