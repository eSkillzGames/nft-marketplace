import {
  Grid,
  Typography,
  Box,
  Link
} from "@mui/material";
import React from "react";
import { useState, useEffect } from "react";
import { db, } from "../../utils/firebase";
import VersusCard from "../../components/VersusCard";
import VersusCardContent from "../../components/VersusCardContent";
import VersusButton from "../../components/VersusButton";

const Download = () => {
  const [pcDownloadLink, setPcDownloadLink] = useState("");

  useEffect(() => {
    getData();
  });

  const getData = async () => {
    var docRef = db
      .collection("VersionControl")
      .doc("HubVersion");

    docRef
      .get()
      .then((doc) => {
        if (doc.exists) {
          setPcDownloadLink(doc.data().LatestDownloadLink);
        } else {
          setPcDownloadLink("");
        }
      })
      .catch((error) => {
        setPcDownloadLink("");
      });
  };

  return (
    <>
    <div style={{maxWidth: "1100px", margin: "auto"}}>
      <VersusCard title={"WELCOME BETA TESTER"}>
        <VersusCardContent style={{padding: "0px"}}>
          <Grid container>
            <Grid item sm={8} style={{padding: "1rem"}}>
              <Typography
                variant="h5"
                fontFamily={"Klapt"}
                fontWeight={"bold"}
                color="white"
                style={{marginBottom: "2rem"}}
              >
                DOWNLOAD LATEST VERSION
              </Typography>
              <Grid container>
                <Grid item sm={12} md={4}>
                  <div>
                    <VersusButton
                      label="DESKTOP DOWNLOAD"
                      style={{cursor:"pointer", marginBottom: "10px"}}
                      onClick={() => {
                        if (pcDownloadLink != "")
                          window.open(pcDownloadLink, '_blank').focus();
                      }}
                    />
                    <VersusButton
                      label="ANDROID DOWNLOAD"
                      style={{marginBottom: "10px"}}
                      onClick={() => {
                      }}
                      disabled={true}
                    />
                    <VersusButton
                      label="IOS DOWNLOAD"
                      style={{marginBottom: "10px"}}
                      onClick={() => {
                      }}
                      disabled={true}
                    />
                  </div>
                </Grid>
                <Grid item sm={12} md={8}>
                  <div style={{padding: "0 2rem"}}>
                    <Typography
                      variant="h7"
                      fontFamily={"Poppins"}
                      color="white"
                    >The latest download includes both Golf and Pool.<br></br>The download is only available for Desktop Windows currently. iOS and Android will be coming soon.</Typography>
                  </div>
                </Grid>
              </Grid>
            </Grid>
            <Grid item sm={4}>
              <div style={{background: "url(imgs/download-golf-bg.png)", backgroundSize: "cover", width: "100%", height: "100%"}}></div>
            </Grid>
          </Grid>
        </VersusCardContent>
      </VersusCard>
      <Box component="div" textAlign={"center"}>
          <Typography
            variant="h4"
            fontFamily={"Klapt"}
            fontWeight={"bold"}
            color="white"
          >
            INSTRUCTIONS
          </Typography>
          <img
            src="/imgs/page_title_line.png"
            style={{ marginTop: "16px", marginBottom: "32px" }}
            width={"40%"}
          />
        </Box>
    </div>
    <Box sx={{padding: "1rem 3rem", marginBottom: "3rem", maxWidth: "1500px", margin: "auto"}}>
      <Grid container>
          <Grid item sm={4}>
            <Box sx={{
            color: "white",
            padding: "7px",
            border: "1px solid #0697c2",
            background: "rgba(42, 168, 219, 0.20)",
            margin: "1rem"
          }}>
            <img src="imgs/download-golf-bg.png" style={{width: "100%"}}></img>
            <div style={{padding: "1rem", minHeight: "11.5rem"}}>
              <Typography
                variant="h5"
                fontFamily={"Klapt"}
                fontWeight={"bold"}
                color="white"
                textTransform={"uppercase"}
                style={{marginBottom: "1rem"}}
              >
                1: download the game
              </Typography>
              <Typography
                  variant="h7"
                  fontFamily={"Poppins"}
                  color="white"
                >
                  The game is only available on Desktop Windows currently. IOS and Android will be coming soon.
                </Typography>
            </div>
          </Box>
          </Grid>
          <Grid item sm={4}>
            <Box sx={{
              color: "white",
              padding: "7px",
              border: "1px solid #0697c2",
              background: "rgba(42, 168, 219, 0.20)",
              margin: "1rem"
            }}>
              <img src="imgs/download-golf-bg.png" style={{width: "100%"}}></img>
              <div style={{padding: "1rem", minHeight: "11.5rem"}}>
                <Typography
                  variant="h5"
                  fontFamily={"Klapt"}
                  fontWeight={"bold"}
                  color="white"
                  textTransform={"uppercase"}
                  style={{marginBottom: "1rem"}}
                >
                  2: Click the login button
                </Typography>
                <Typography
                    variant="h7"
                    fontFamily={"Poppins"}
                    color="white"
                  >
                    The Login button is located at the top right of the home page.
                  </Typography>
              </div>
            </Box>
          </Grid>
          <Grid item sm={4}>
            <Box sx={{
              color: "white",
              padding: "7px",
              border: "1px solid #0697c2",
              background: "rgba(42, 168, 219, 0.20)",
              margin: "1rem"
            }}>
              <img src="imgs/download-golf-bg.png" style={{width: "100%"}}></img>
              <div style={{padding: "1rem", minHeight: "11.5rem"}}>
                <Typography
                  variant="h5"
                  fontFamily={"Klapt"}
                  fontWeight={"bold"}
                  color="white"
                  textTransform={"uppercase"}
                  style={{marginBottom: "1rem"}}
                >
                  3: click to sign up
                </Typography>
                <Typography
                    variant="h7"
                    fontFamily={"Poppins"}
                    color="white"
                  >
                    The Sign up button is located below the Login button
                  </Typography>
              </div>
            </Box>
          </Grid>
      </Grid>
    </Box>
    <Box sx={{textAlign: "center", maxWidth: "800px", margin: "1rem auto 3rem"}}>
        <Typography
          variant="h7"
          fontFamily={"Poppins"}
          color="white"
        >
          See the latest patch notes <Link sx={{color: "#00BDFF"}} href="/patch-notes">here</Link>.
        </Typography>
    </Box>
    <Box sx={{textAlign: "center", maxWidth: "800px", margin: "1rem auto 3rem"}}>
        <Typography
          variant="h7"
          fontFamily={"Poppins"}
          color="white"
        >
          Versus-X Arcade modes and PVP use a wagering game economy you will always need to wager some amount of $VSX to play the game.
          <br></br>
          <br></br>
          During early beta testing, there will always be bugs, issues and glitches. If you encounter any issues or anything that does not seem correct, please submit a bug report in the game and report it in the Discord server.
          <br></br>
          <br></br>
          Thanks for helping shape The Future of Sports Gaming.
          <br></br>
          The Versus-X Team.
        </Typography>
    </Box>
    </>
  );
};

export default Download;
