import React from "react";
import { Typography,Box,Link } from "@mui/material";

const PatchNote = (props) => {
  return (
    <Box sx={{padding: "1rem"}}>
      <div style={{background: "url(imgs/download-golf-bg.png)", backgroundSize: "cover", width: "100%", aspectRatio: "1 / 1.16", border: "2px solid #00BDFF", borderRadius: "12px", marginBottom: "0.5rem"}}></div>
      <Typography
        variant="h5"
        fontFamily={"Klapt"}
        fontWeight={"bold"}
        color="white"
        textAlign={"center"}
      >
        V1.120 HOTFIX
      </Typography>
      <Typography
        variant="h6"
        fontSize={"14px"}
        fontFamily={"Poppins"}
        color="white"
        textAlign={"center"}
        marginBottom={"1.5rem"}
      >
        October 1, 2023
      </Typography>
      <div>
        <Typography
          variant="h6"
          fontSize="14px"
          fontFamily={"Poppins"}
          color="white"
          marginBottom={"1rem"}
        >
          Master the basics in practice mode and tutorials. Some controls take a minute to learn but a lifetime to master. Find what works best for you, and keep pushing. 
        </Typography>
        <Link
          variant="h6"
          fontSize="14px"
          fontFamily={"Poppins"}
          color="#00BDFF"
          href="/patch-notes/1"
        >
          Read More
        </Link>
      </div>
    </Box>
  );
};
export default PatchNote;
