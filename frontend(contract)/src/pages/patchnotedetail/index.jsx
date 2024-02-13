import {
  Grid,
  Typography,
  Box
} from "@mui/material";
import React from "react";
import { useState, useEffect } from "react";
import { db, } from "../../utils/firebase";
import VersusCard from "../../components/VersusCard";
import PatchNote from "../../components/PatchNote";
import VersusButton from "../../components/VersusButton";

const PatchNoteDetail = () => {
  return (
    <>
      <Box component="div" textAlign={"center"} sx={{ marginTop: "3rem" }}>
        <Typography
          variant="h4"
          fontFamily={"Klapt"}
          fontWeight={"bold"}
          color="white"
          textTransform={"uppercase"}
        >
          v1.120 hotfix
        </Typography>
        <img
          src="/imgs/page_title_line.png"
          style={{ marginTop: "16px", marginBottom: "32px" }}
          width={"40%"}
        />
        <Typography
          variant="h6"
          fontFamily={"Klapt"}
          fontWeight={"bold"}
          color="white"
          textTransform={"uppercase"}
        >
          October 1, 2023
        </Typography>
      </Box>
      <Box sx={{maxWidth: "900px", margin: "2rem auto"}}>
      </Box>
    </>
  );
};

export default PatchNoteDetail;
