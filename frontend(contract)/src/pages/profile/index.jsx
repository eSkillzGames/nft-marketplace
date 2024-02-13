import {
  Avatar,
  Button,
  FormControl,
  Grid,
  Paper,
  TextField,
  Typography,
  Dialog,
  IconButton,
  Box,
  InputAdornment,
} from "@mui/material";
import convert from "image-file-resize";
import axios from "axios";
import React from "react";
import { useState, useEffect } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { auth, db, firebase, storage, storageRef } from "../../utils/firebase";
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Visibility, Close, Twitter, YouTube, LocalConvenienceStoreOutlined } from "@mui/icons-material";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useDispatch, useSelector } from "react-redux";
import { fuseActions, layoutActions, authActions } from "../../store/actions";
import d_avatar from "../../assets/image/davatar.png";
// import CreateIcon from '@mui/icons-material/Create';
// import Create from "@mui/icons-material/Create";
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { alpha, styled } from "@mui/material/styles";
// import { SocialIcon } from 'react-social-icons';
import SvgIcon from "@mui/material/SvgIcon";
import VersusCard from "../../components/VersusCard";
import VersusCardContent from "../../components/VersusCardContent";
import VersusCardHeader from "../../components/VersusCardHeader";
import VersusButton from "../../components/VersusButton";
import VersusTextarea from "../../components/VersusTextarea";
import VersusInput from "../../components/VersusInput";

const CustomTextField = styled((props) => (
  <TextField
    InputProps={{ disableUnderline: true, readOnly: props.readOnly || false }}
    {...props}
  />
))(({ theme }) => ({
  width: "100%",
  "& .MuiInputLabel-root": {
    color: "white",
    "&.Mui-focused": {
      color: "white",
    },
  },
  "& .MuiFilledInput-root": {
    border: "1px solid #00748d",
    overflow: "hidden",
    borderRadius: 4,
    color: "white",
    fontSize: "20px",
    backgroundColor: "#00748d",
    transition: theme.transitions.create([
      "border-color",
      "background-color",
      "box-shadow",
    ]),
    "&:hover": {
      backgroundColor: "#00748d",
    },
    "&.Mui-focused": {
      backgroundColor: "#00748d",
    },
    "& .MuiInputBase-input": {
      paddingTop: "18px",
    },
    "& .MuiInputBase-inputMultiline": {
      paddingTop: "0px",
    },
  },
  "& .MuiFormHelperText-root": {
    color: "white",
  },
}));

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    padding: 0,
  },
  "& .MuiPaper-elevation": {
    margin: 0,
  },
}));

const Profile = () => {
  // const classes = useStyles();

  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const [userName, setUserName] = useState("");
  const [level, setLevel] = useState(0);
  const dispatch = useDispatch();
  const { uid, address, mail } = useSelector(
    ({ authReducer }) => authReducer.auth
  );
  const [value, setValue] = useState("2000-01-01");
  const [file, setFile] = useState("");
  const [avatarBuffer, setAvatarBuffer] = useState("");
  const [updated, setUpdated] = useState(0);
  const { avatar } = useSelector(({ layoutReducer }) => layoutReducer.layout);
  const [isMe, setIsMe] = useState(false);
  const [userBio, setUserBio] = useState("");
    const [userStats, setUserStats] = useState("");
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

  const [isloading, setisloading] = useState(true);

  const [isShowPreview, setIsShowPreview] = useState(false);

  const [size, setSize] = useState([0, 0]);

  useEffect(() => {
    if (params.get("uid") == null || params.get("uid") == uid) {
      setIsMe(true);
      getData(uid);
    } else {
      setIsMe(false);
      getData(params.get("uid"));
    }
  }, [mail, updated, params.get("uid")]);

  const getData = async (userid) => {
    if (userid != uid) {
      await storageRef
        .child(`users/${userid}.jpeg`)
        .getDownloadURL()
        .then((url) => {
          setUserAvatar(url);
        })
        .catch((error) => {
          setUserAvatar("");
        });
    }
    
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

          setUserStats(doc.data().stats_coming_soon || "0");
          setUserBio(doc.data().bio || "");
        } else {
          setUserName("");
        }
        setisloading(false);
      })
      .catch((error) => {
        setUserName("");
      });

      var docPlayerStatesRef = db
        .collection("users")
        .doc(`${userid}`)
        .collection("Profile")
        .doc("PlayerStats");
      docPlayerStatesRef.get().then((doc) => {
        setLevel(doc.data().PlayerLevel || 0);
      }).catch((error) => {
        setLevel(0);
      });
  };

  const handleSave = async () => {
    var msgVal = "Social ";
    var nameCount = 0;
    var birthCount = 0;
    var fileCount = 0;
    var sumCount = 0;
    if (userName.length < 3) {
      dispatch(
        fuseActions.showMessage({
          message: "userName must be 3 character at least",
          variant: "error",
        })
      );
      return 0;
    }
    var docRef = db
      .collection("users")
      .doc(`${uid}`)
      .collection("Profile")
      .doc("ProfileData");
    var doc = await docRef.get();
    if (doc.exists) {
      if (doc.data().userName != userName) {
        nameCount = 1;
      }
      if (doc.data().birthDay != value) {
        birthCount = 1;
      }
    } else {
      birthCount = 1;
      nameCount = 1;
    }
    if (avatar != avatarBuffer && file) {
      console.log("avatar", avatar);
      console.log("avatarBuffer", avatarBuffer);
      console.log("file", file);
      fileCount = 1;
    }
    if (fileCount > 0) {
      var uploadTask = storageRef.child(`users/${uid}.jpeg`).put(file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          var progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          if (progress == 100) {
            sumCount += 1;
            dispatch(layoutActions.setAvatar(avatarBuffer));
            // if(msgVal.length>0){

            msgVal += " and Avatar";
            // }
            // else{
            //   msgVal +="Avatar";

            // }
            if (sumCount == nameCount + birthCount + fileCount) {
              dispatch(
                fuseActions.showMessage({
                  message: "You have successfully updated " + msgVal + ".",
                  variant: "success",
                  timer: 5000,
                })
              );
            }
          }
        },
        (error) => {},
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            console.log("File available at", downloadURL);
          });
        }
      );
    }
    var docRef = db
      .collection("users")
      .doc(`${uid}`)
      .collection("Profile")
      .doc("ProfileData");

    if (nameCount > 0) {
      // if(msgVal.length>0){

      msgVal += " and UserName";
      // }
      // else{
      //   msgVal +="UserName";

      // }
    }
    if (birthCount > 0) {
      // if(msgVal.length>0){

      msgVal += " and BirthDay";
      // }
      // else{
      //   msgVal +="BirthDay";

      // }
    }
    if (nameCount + birthCount > 0) {
      sumCount += nameCount + birthCount;
      await docRef.update({
        userName: userName,
        birthDay: value,
        social: userSocial,
        bio: userBio,
        stats_coming_soon: userStats,
      });
      setUpdated(1 - updated);
      if (sumCount == nameCount + birthCount + fileCount) {
        dispatch(
          fuseActions.showMessage({
            message: "You have successfully updated " + msgVal + ".",
            variant: "success",
            timer: 5000,
          })
        );
      }
    } else {
      await docRef.update({
        social: userSocial,
        bio: userBio,
        stats_coming_soon: userStats,
      });
      dispatch(
        fuseActions.showMessage({
          message: "You have successfully updated " + msgVal + ".",
          variant: "success",
          timer: 5000,
        })
      );
    }
  };

  async function handleChange(event) {
    if (event.target.files.length > 0) {
      var _URL = window.URL || window.webkitURL;
      var img = new Image();
      var objectUrl = _URL.createObjectURL(event.target.files[0]);
      img.src = objectUrl;
      var width_buf, height_buf;
      img.onload = async function () {
        width_buf = this.width;
        height_buf = this.height;
        let imgBuf;
        if (width_buf > height_buf) {
          if (width_buf > 512) {
            imgBuf = await convert({
              file: event.target.files[0],
              width: 512,
              height: (512 * height_buf) / width_buf,
              type: "jpeg",
            });

            setFile(imgBuf);
          } else {
            setFile(event.target.files[0]);
          }
        } else {
          if (height_buf > 512) {
            imgBuf = await convert({
              file: event.target.files[0],
              width: (512 * width_buf) / height_buf,
              height: 512,
              type: "jpeg",
            });
            setFile(imgBuf);
          } else {
            setFile(event.target.files[0]);
          }
        }
      };
      setAvatarBuffer(objectUrl);
    }
  }

  React.useEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  },[]);

  return (
    <>
      <VersusCard title={"PROFILE"}>
        <VersusCardHeader showToken={true}>
          <Box>
            <Typography>PROFILE</Typography>
          </Box>
        </VersusCardHeader>
        <VersusCardContent style={{paddingTop:"3rem", paddingBottom:"3rem", paddingRight: size[0] >576?"4rem" :"1rem", paddingLeft:size[0]>576?"4rem":"1rem",}}>
          <Grid container>
            <Grid item md={5} sm={12} xs={12} style={{marginBottom:"2rem"}}>
              <Box display={"flex"}>
                <div>
                  <input
                    hidden
                    id="select-file"
                    accept="image/*"
                    multiple
                    type="file"
                    onChange={handleChange}
                  />
                  <label htmlFor="select-file">
                    <div
                      style={{
                        backgroundImage: ` url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='100' ry='100' stroke='%2300BDFFFF' stroke-width='25' stroke-dasharray='30%2c5' stroke-dashoffset='0' stroke-linecap='butt'/%3e%3c/svg%3e")`,
                        borderRadius: "50%",
                        padding: "16px",
                      }}
                    >
                      <Avatar
                        src={
                          avatarBuffer
                            ? avatarBuffer
                            : avatar
                            ? avatar
                            : d_avatar
                        }
                        sx={{
                          width: "80px",
                          height: "80px",
                          cursor: "pointer",
                        }}
                      >
                        M
                      </Avatar>
                    </div>
                  </label>
                </div>
                <div style={{ marginLeft: "1.5rem", flexGrow:"1" }}>
                  <Grid container marginBottom={"0.5rem"} alignItems={"center"}>
                    <Grid item md={6} sm={6} xs={6}>
                      <Typography variant="body1" fontWeight="bold" color="white">
                        Username
                      </Typography>
                    </Grid>
                    <Grid item md={6} sm={6} xs={6}>
                      <Typography
                        variant="body2"
                        color="white"
                      >
                        {userName}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid container alignItems={"center"}>
                    <Grid item md={6} sm={6} xs={6}>
                      <Typography variant="body1" fontWeight="bold" color="white">
                        Level
                      </Typography>
                    </Grid>
                    <Grid item md={6} sm={6} xs={6 }>
                      <Typography
                        variant="body2"
                        color="white"
                      >
                        {level}
                      </Typography>
                    </Grid>
                  </Grid>
                  <VersusButton
                    style={{ marginTop: "1.5rem" }}
                    label="VERIFY"
                    onClick={() => {}}
                  />
                </div>
              </Box>
            </Grid>
            <Grid item md={2}></Grid>
            <Grid item md={5} sm={12} xs={12} style={{marginBottom:"2rem", height:"auto"}}>
              <VersusTextarea
                value={userBio}
                onChange={(event) => {
                  setUserBio(event.target.value);
                }}
              />
            </Grid>
          </Grid>
          <Grid container>
            <Grid item md={5} sm={12} xs={12} style={{marginBottom:"2rem"}}>
              <Typography variant="subtitle1" color="white" fontWeight="bold" mb={1}>
                Personal Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item md={12} sm={12} xs={12}>
                  <VersusInput
                    style={{ width: "100%" }}
                    placeholder="Username"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                  />
                </Grid>
                <Grid item md={12} sm={12} xs={12}>
                  <VersusInput
                    style={{ width: "100%" }}
                    placeholder="WalletAddress"
                    value={address}
                    readOnly
                  />
                </Grid>
                <Grid item md={12} sm={12} xs={12}>
                  <VersusInput
                    type={"date"}
                    value={value}
                    onChange={(e) => {
                      setValue(e.target.value);
                    }}
                    defaultValue={"2000-01-01"}
                    style={{ width: "100%" }}
                    placeholder="Birthday"
                  />
                </Grid>
                <Grid item md={12} sm={12} xs={12}>
                  <VersusInput
                    style={{ width: "100%" }}
                    placeholder="Email"
                    value={mail}
                    readOnly
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item md={2} sm={2}></Grid>
            <Grid item md={5} sm={12} xs={12} style={{marginBottom:"2rem"}}>
              <Typography variant="subtitle1" color="white" fontWeight="bold" mb={1}>
                Socials
              </Typography>
              <Grid container spacing={2}>
                <Grid item sm={6} xs={8}>
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
                    onChange={(e) => {
                      let tempData = { ...userSocial };
                      tempData["Twitter"] = e.target.value;
                      setUserSocial(tempData);
                    }}
                  />
                </Grid>
                <Grid item sm={6} xs={8}>
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
                    onChange={(e) => {
                      let tempData = { ...userSocial };
                      tempData["Facebook"] = e.target.value;
                      setUserSocial(tempData);
                    }}
                  />
                </Grid>
                <Grid item sm={6} xs={8}>
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
                    onChange={(e) => {
                      let tempData = { ...userSocial };
                      tempData["YouTube"] = e.target.value;
                      setUserSocial(tempData);
                    }}
                  />
                </Grid>
                <Grid item sm={6} xs={8}>
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
                    onChange={(e) => {
                      let tempData = { ...userSocial };
                      tempData["TikTok"] = e.target.value;
                      setUserSocial(tempData);
                    }}
                  />
                </Grid>
                <Grid item sm={6} xs={8}>
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
                    onChange={(e) => {
                      let tempData = { ...userSocial };
                      tempData["Twitch"] = e.target.value;
                      setUserSocial(tempData);
                    }}
                  />
                </Grid>
                <Grid item sm={6} xs={8}>
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
                    onChange={(e) => {
                      let tempData = { ...userSocial };
                      tempData["DiscordID"] = e.target.value;
                      setUserSocial(tempData);
                    }}
                  />
                </Grid>
                <Grid item sm={6} xs={8}>
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
                    onChange={(e) => {
                      let tempData = { ...userSocial };
                      tempData["Instagram"] = e.target.value;
                      setUserSocial(tempData);
                    }}
                  />
                </Grid>
                <Grid item sm={6} xs={8}>
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
                    onChange={(e) => {
                      let tempData = { ...userSocial };
                      tempData["Opensea"] = e.target.value;
                      setUserSocial(tempData);
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Box mt={2} display={"flex"} justifyContent={"end"}>
            <VersusButton
              label="SAVE"
              style={{cursor:"pointer"}}
              onClick={() => {
                handleSave();
              }}
            />
          </Box>
        </VersusCardContent>
      </VersusCard>
    </>
  );

};

export default Profile;
