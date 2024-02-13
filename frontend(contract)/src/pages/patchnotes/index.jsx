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

const PatchNotes = () => {
  return (
    <>
      <Box component="div" textAlign={"center"} sx={{ marginTop: "3rem" }}>
        <Typography
          variant="h4"
          fontFamily={"Klapt"}
          fontWeight={"bold"}
          color="white"
        >
          PATCH NOTES
        </Typography>
        <img
          src="/imgs/page_title_line.png"
          style={{ marginTop: "16px", marginBottom: "32px" }}
          width={"40%"}
        />
      </Box>
      <Box sx={{maxWidth: "900px", margin: "2rem auto"}}>
        <Grid container>
          <Grid item sm={4}>
            <PatchNote />
          </Grid>
          <Grid item sm={4}>
            <PatchNote />
          </Grid>
          <Grid item sm={4}>
            <PatchNote />
          </Grid>
          <Grid item sm={4}>
            <PatchNote />
          </Grid>
          <Grid item sm={4}>
            <PatchNote />
          </Grid>
          <Grid item sm={4}>
            <PatchNote />
          </Grid>
        </Grid>
      </Box>
      <Box sx={{textAlign: "center", marginBottom: "3rem"}}>
        <VersusButton
          label="VIEW MORE"
          style={{cursor:"pointer", width: "120px", margin: "0 auto"}}
          onClick={() => {
          }}
        />
      </Box>
    </>
  );
};

export default PatchNotes;
