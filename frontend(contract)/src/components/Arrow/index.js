import React from "react";
import { Box } from "@mui/material";
import { useEffect, Component  } from "react";

const Arrow = (props) => {
    const isOpen = props.open;
    console.log(isOpen)
    return isOpen == 0 ? (
        <Box>
            <img src="/imgs/arrow-down.png" style={{width: "0.8rem"}}/>
        </Box>
    ) :(
        <Box>
            <img src="/imgs/arrow-down-up.png" style={{width: "0.8rem"}}/>
        </Box>
    );
}
export default Arrow;