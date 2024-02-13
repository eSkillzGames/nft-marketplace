import {
  Avatar,
  Grid,
  Typography,
  IconButton,
  Box,
  InputAdornment,
} from "@mui/material";
import React from "react";
import { useState, useEffect } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";
import { auth, db, firebase, storage, storageRef } from "../../utils/firebase";
import d_avatar from "../../assets/image/davatar.png";
import VersusCard from "../../components/VersusCard";
import VersusCardContent from "../../components/VersusCardContent";
import VersusButton from "../../components/VersusButton";
import VersusTextarea from "../../components/VersusTextarea";
import VersusInput from "../../components/VersusInput";

const ProfileView = () => {
  const navigate = useNavigate();
  const { pid } = useParams();

  const [userName, setUserName] = useState("");
  const [value, setValue] = useState("2000-01-01");
  const [userBio, setUserBio] = useState("");
  const [userSocial, setUserSocial] = useState({
    Twitter: "",
    YouTube: "",
    Twitch: "",
    Instagram: "",
    Facebook: "",
    TikTok: "",
    DiscordID: "",
    Opensea: "",
  });
  const [userAvatar, setUserAvatar] = useState("");

  useEffect(() => {
    getData(pid);
  }, [pid]);

  const getData = async (userid) => {
    await storageRef
      .child(`users/${userid}.jpeg`)
      .getDownloadURL()
      .then((url) => {
        setUserAvatar(url);
      })
      .catch((error) => {
        setUserAvatar("");
      });

    var docRef = db
      .collection("users")
      .doc(`${userid}`)
      .collection("Profile")
      .doc("ProfileData");
    docRef
      .get()
      .then((doc) => {
        if (doc.exists) {
          setUserName(doc.data().userName);
          setValue(doc.data().birthDay);
          if (doc.data().social) {
            setUserSocial(doc.data().social);
          } else {
            setUserSocial({
              Twitter: "",
              YouTube: "",
              Twitch: "",
              Instagram: "",
              Facebook: "",
              TikTok: "",
              DiscordID: "",
              Opensea: "",
            });
          }

          setUserBio(doc.data().bio || "");
        } else {
          setUserName("");
        }
      })
      .catch((error) => {
        setUserName("");
      });
  };

  return (
    <>
      <VersusCard title={"PROFILE VIEW"}>
        <VersusCardContent>
          <Grid container>
            <Grid item sm={6}>
              <Box display={"flex"}>
                <div>
                  <div
                    style={{
                      backgroundImage: ` url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='100' ry='100' stroke='%2300BDFFFF' stroke-width='25' stroke-dasharray='30%2c5' stroke-dashoffset='0' stroke-linecap='butt'/%3e%3c/svg%3e")`,
                      borderRadius: "50%",
                      padding: "16px",
                    }}
                  >
                    <Avatar
                      src={userAvatar ? userAvatar : d_avatar}
                      sx={{
                        width: "80px",
                        height: "80px",
                        cursor: "pointer",
                      }}
                    ></Avatar>
                  </div>
                </div>
                <div style={{ marginLeft: "16px", marginTop: "16px" }}>
                  <Typography variant="body1" fontWeight="bold" color="white">
                    Username
                  </Typography>
                  <Typography variant="body1" fontWeight="bold" color="white">
                    Level
                  </Typography>
                  <Typography variant="body1" fontWeight="bold" color="white">
                    Birthday
                  </Typography>
                </div>
                <div style={{ marginLeft: "16px", marginTop: "16px" }}>
                  <Typography
                    variant="body2"
                    color="white"
                    sx={{ marginTop: "2px", textWrap: "nowrap" }}
                  >
                    {userName}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="white"
                    sx={{ marginTop: "4px" }}
                  >
                    25
                  </Typography>
                  <Typography
                    variant="body2"
                    color="white"
                    sx={{ marginTop: "5px" }}
                  >
                    {value}
                  </Typography>
                </div>
              </Box>
            </Grid>
            <Grid item sm={6}>
              <VersusTextarea value={userBio} readOnly={true} />
            </Grid>
          </Grid>
          <Grid container mt={5}>
            <Grid item sm={12}>
              <Typography variant="h6" color="white" fontWeight="bold" mb={1}>
                Socials
              </Typography>
              <Grid container spacing={1}>
                <Grid item sm={6}>
                  <VersusInput
                    style={{ width: "100%" }}
                    placeholder="Twitter"
                    value={userSocial["Twitter"]}
                    startAdornment={
                      <InputAdornment position="start">
                        <IconButton>
                          <img src="/imgs/twitter-icon.png" />
                        </IconButton>
                      </InputAdornment>
                    }
                    onClick={() => {
                      window.open(
                        userSocial["Twitter"],
                        "_blank",
                        "noopener,noreferrer"
                      );
                    }}
                    readOnly={true}
                  />
                </Grid>
                <Grid item sm={6}>
                  <VersusInput
                    style={{ width: "100%" }}
                    placeholder="Facebook"
                    value={userSocial["Facebook"]}
                    startAdornment={
                      <InputAdornment position="start">
                        <IconButton>
                          <img src="/imgs/facebook-icon.png" />
                        </IconButton>
                      </InputAdornment>
                    }
                    readOnly={true}
                    onClick={() => {
                      window.open(
                        userSocial["Facebook"],
                        "_blank",
                        "noopener,noreferrer"
                      );
                    }}
                  />
                </Grid>
                <Grid item sm={6}>
                  <VersusInput
                    style={{ width: "100%" }}
                    placeholder="Youtube"
                    value={userSocial["YouTube"]}
                    startAdornment={
                      <InputAdornment position="start">
                        <IconButton>
                          <img src="/imgs/youtube-icon.png" />
                        </IconButton>
                      </InputAdornment>
                    }
                    readOnly={true}
                    onClick={() => {
                      window.open(
                        userSocial["YouTube"],
                        "_blank",
                        "noopener,noreferrer"
                      );
                    }}
                  />
                </Grid>
                <Grid item sm={6}>
                  <VersusInput
                    style={{ width: "100%" }}
                    placeholder="Tiktok"
                    value={userSocial["TikTok"]}
                    startAdornment={
                      <InputAdornment position="start">
                        <IconButton>
                          <img src="/imgs/tiktok-icon.png" />
                        </IconButton>
                      </InputAdornment>
                    }
                    readOnly={true}
                    onClick={() => {
                      window.open(
                        userSocial["TikTok"],
                        "_blank",
                        "noopener,noreferrer"
                      );
                    }}
                  />
                </Grid>
                <Grid item sm={6}>
                  <VersusInput
                    style={{ width: "100%" }}
                    placeholder="Twitch"
                    value={userSocial["Twitch"]}
                    startAdornment={
                      <InputAdornment position="start">
                        <IconButton>
                          <img src="/imgs/twitch-round-line-icon.png" />
                        </IconButton>
                      </InputAdornment>
                    }
                    readOnly={true}
                    onClick={() => {
                      window.open(
                        userSocial["Twitch"],
                        "_blank",
                        "noopener,noreferrer"
                      );
                    }}
                  />
                </Grid>
                <Grid item sm={6}>
                  <VersusInput
                    style={{ width: "100%" }}
                    placeholder="Discord"
                    value={userSocial["DiscordID"]}
                    startAdornment={
                      <InputAdornment position="start">
                        <IconButton>
                          <img src="/imgs/discord-color-icon.png" />
                        </IconButton>
                      </InputAdornment>
                    }
                    readOnly={true}
                  />
                </Grid>
                <Grid item sm={6}>
                  <VersusInput
                    style={{ width: "100%" }}
                    placeholder="Instagram"
                    value={userSocial["Instagram"]}
                    startAdornment={
                      <InputAdornment position="start">
                        <IconButton>
                          <img src="/imgs/instagram-icon.png" />
                        </IconButton>
                      </InputAdornment>
                    }
                    readOnly={true}
                    onClick={() => {
                      window.open(
                        userSocial["Instagram"],
                        "_blank",
                        "noopener,noreferrer"
                      );
                    }}
                  />
                </Grid>
                <Grid item sm={6}>
                  <VersusInput
                    style={{ width: "100%" }}
                    placeholder="Opensea"
                    value={userSocial["Opensea"]}
                    startAdornment={
                      <InputAdornment position="start">
                        <IconButton>
                          <img src="/imgs/opensea_logo_icon.png" />
                        </IconButton>
                      </InputAdornment>
                    }
                    readOnly={true}
                    onClick={() => {
                      window.open(
                        userSocial["Opensea"],
                        "_blank",
                        "noopener,noreferrer"
                      );
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Box mt={2} display={"flex"} justifyContent={"end"}>
            <VersusButton
              label="BACK"
              onClick={() => {
                navigate(-1);
              }}
            />
          </Box>
        </VersusCardContent>
      </VersusCard>
    </>
  );
};

export default ProfileView;
