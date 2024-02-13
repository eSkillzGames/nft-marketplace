import React from "react";
import { Box, Typography } from "@mui/material";

const VersusCardContent = ({children, style}) => {
  return (
    <Box
      sx={{
        color: "white",
        padding: "7px",
        border: "1px solid #0697c2",
      }}
    >
      <Box
        sx={{
          color: "white",
          padding: "16px 24px",
          background: "#2AA8DB33",
          ...style
        }}
      >
        {children}
      </Box>
    </Box>
  );
};
export default VersusCardContent;
