import React from "react";
import { Box, Typography } from "@mui/material";
import { useState } from "react";

const VersusCard = (props) => {
  const [size, setSize] = useState([0,0]);

  React.useEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  },[]);

  return (
    <Box component="div" p={size[0] > 576 ? 8 : 2}>
      {props.title && (
        <Box component="div" textAlign={"center"}>
          <Typography
            variant="h4"
            fontFamily={"Klapt"}
            fontWeight={"bold"}
            color="white"
          >
            {props.title}
          </Typography>
          <img
            src="/imgs/page_title_line.png"
            style={{ marginTop: "16px", marginBottom: "32px" }}
            width={"40%"}
          />
        </Box>
      )}

      {props.children}
    </Box>
  );
};
export default VersusCard;
