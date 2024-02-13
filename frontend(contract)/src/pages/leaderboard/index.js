import React from "react";
import { Button, makeStyles } from "@material-ui/core";
import Switch, { SwitchProps } from "@mui/material/Switch";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import styles from "./style";
import { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { leaderBoardActions } from "./../../store/actions";

import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Row, Col } from "react-bootstrap";
import Avatar from "@mui/material/Avatar";
import { styled } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import MuiToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

import moment from "moment";

import { auth, db, firebase, storage, storageRef } from "../../utils/firebase";

import { useNavigate, useLocation } from "react-router-dom";

import { Visibility, VisibilityOff } from "@material-ui/icons";

import { Grid } from "@mui/material";

// For Table
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import { FieldPath } from "firebase/firestore";

const golfShowType = [
  { label: "Target Golf", value: "TargetTopScore" },
  { label: "Decreasing Holes", value: "DecreasingHolesTopScore" },
  { label: "Yard Wide", value: "YardWideTopScore" },
  { label: "Par3 Closest The Pin", value: "Par3Closest" },
  { label: "Par3 Hole In One", value: "Par3HolesTotal" },
];

const poolShowType = [
  { label: "Perfect Potter", value: "PerfectPottermax" },
  { label: "Speed Pool", value: "SpeedPoolTotalPots" },
  { label: "Color Pool", value: "ColorPoolMax" },
  { label: "Combo Pool", value: "ComboPoolMaxCombo" },
  { label: "Arcade Wins", value: "SPGamesWon" },
  { label: "PvP Wins", value: "PvPGamesWon" },
  // { label: 'PvAI Wins', value: 'PvAIGamesWon'},
];

const useStyles = makeStyles(styles);

const ToggleButton = styled(MuiToggleButton)(
  ({ selectedColor, defaultColor }) => ({
    "&.MuiToggleButton-root": {
      color: "white",
      backgroundColor: defaultColor,
      textTransform: "capitalize",
    },
    "&.Mui-selected, &.Mui-selected:hover": {
      color: "white",
      backgroundColor: selectedColor,
    },
  })
);

const BootstrapInput = styled(InputBase)(({ theme }) => ({
  "label + &": {
    marginTop: theme.spacing(3),
  },
  "& .MuiInputBase-input": {
    borderRadius: 4,
    position: "relative",
    backgroundColor: "#00748d",
    border: "1px solid #00748d",
    color: "white",
    fontSize: 16,
    padding: "10px 26px 10px 12px",
    transition: theme.transitions.create(["border-color", "box-shadow"]),
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
    "&:focus": {
      borderRadius: 4,
      borderColor: "#009bb9",
      boxShadow: "0 0 0 0.2rem rgba(0,123,255,.25)",
    },
  },
  "& .MuiSelect-icon": {
    color: "white",
  },
}));

let poolLeaderboard = {
  AllTimeLeaderboard: [],
  MonthlyLeaderboard: [],
  WeeklyLeaderboard: [],
};
let golfLeaderboard = {
  AllTimeLeaderboard: [],
  MonthlyLeaderboard: [],
  WeeklyLeaderboard: [],
};

function LeaderBoardPage() {
  const navigate = useNavigate();
  const classes = useStyles();
  const [leaderBoardType, setLeaderBoardType] = React.useState("pool");

  const [showType, setShowType] = React.useState("PerfectPottermax");
  const [showTypeList, setShowTypeList] = React.useState(poolShowType);
  const dispatch = useDispatch();
  const { leaderboardData, scoreData, loading } = useSelector(
    ({ leaderboardReducer }) => leaderboardReducer.getLeaderboard
  );
  const [userListBoard, setUserListBoard] = React.useState([]);
  const [golfUserList, setGolfUserList] = React.useState([]);
  const [poolUserList, setPoolUserList] = React.useState([]);

  const [filterType, setFilterType] = React.useState("overall");
  const [isLoading, setLoading] = React.useState(true);

  const handleChangeFilter = (event, newAlignment) => {
    if (newAlignment) {
      setFilterType(newAlignment);
    }
  };

  useEffect(() => {
    db.collectionGroup("Leaderboards").onSnapshot(async (doc) => {
      let docChanges = doc.docChanges();
      setLoading(true);
      await Promise.all(
        docChanges.map(async (e) => {
          // console.log("==============================");
          // console.log(e.doc.id);

          // console.log(e.doc.data());
          let path = e.doc.ref.path;
          let indexSlash = path.indexOf("/");
          let userId = path.substring(
            indexSlash + 1,
            path.indexOf("/", indexSlash + 1)
          );
          let collectionName = path.substring(0, indexSlash);
          // console.log(userId);
          // console.log(collectionName);
          // console.log("==============================");

          let userInfoDoc = await db
            .collection("users")
            .doc(userId)
            .collection("Profile")
            .doc("ProfileData")
            .get();
          let userInfoDocData = userInfoDoc.data();
          if (userInfoDocData) {
            await storageRef
              .child(`users/${userId}.jpeg`)
              .getDownloadURL()
              .then((url) => {
                userInfoDocData.avatar = url;
              })
              .catch((error) => {
                userInfoDocData.avatar = "";
              });
          }

          if (collectionName == "EskillzPoolLeaderBoards") {
            let userIndex = poolLeaderboard[e.doc.id].findIndex(
              (e) => e.uid == userId
            );
            if (userIndex >= 0) {
              poolLeaderboard[e.doc.id][userIndex] = {
                uid: userId,
                avatar: userInfoDocData.avatar,
                name: userInfoDocData.userName,
                score: e.doc.data(),
              };
            } else {
              poolLeaderboard[e.doc.id].push({
                uid: userId,
                avatar: userInfoDocData.avatar,
                name: userInfoDocData.userName,
                score: e.doc.data(),
              });
            }
          } else {
            let userIndex = golfLeaderboard[e.doc.id].findIndex(
              (e) => e.uid == userId
            );
            if (userIndex >= 0) {
              golfLeaderboard[e.doc.id][userIndex] = {
                uid: userId,
                avatar: userInfoDocData.avatar,
                name: userInfoDocData.userName,
                score: e.doc.data(),
              };
            } else {
              golfLeaderboard[e.doc.id].push({
                uid: userId,
                avatar: userInfoDocData.avatar,
                name: userInfoDocData.userName,
                score: e.doc.data(),
              });
            }
          }
        })
      );
      // console.log(poolLeaderboard);
      // console.log(golfLeaderboard);
      setLoading(false);
    });
  }, []);

  const handleShowTypeChange = (event) => {
    setShowType(event.target.value);
    handleSort(event.target.value);
  };

  useEffect(() => {
    if (filterType == "weekly") {
      dispatch(leaderBoardActions.getWeekly(leaderBoardType, showType));
    } else if (filterType == "monthly") {
      dispatch(leaderBoardActions.getMonthly(leaderBoardType, showType));
    } else {
      dispatch(leaderBoardActions.getAll());
    }
  }, [showType]);

  // For Table
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(20);

  useEffect(() => {
    let docName = "";
    if (filterType == "overall") {
      docName = "AllTimeLeaderboard";
      dispatch(leaderBoardActions.getAll());
    } else if (filterType == "weekly") {
      docName = "WeeklyLeaderboard";
      dispatch(leaderBoardActions.getWeekly(leaderBoardType, showType));
    } else if (filterType == "monthly") {
      docName = "MonthlyLeaderboard";
      dispatch(leaderBoardActions.getMonthly(leaderBoardType, showType));
    }
    handleSort(showType);
  }, [filterType]);

  useEffect(() => {
    if (leaderBoardType == "golf") {
      setShowType("TargetTopScore");
      setShowTypeList(golfShowType);
      handleSort("TargetTopScore");
    } else {
      setShowType("PerfectPottermax");
      setShowTypeList(poolShowType);
      handleSort("PerfectPottermax");
    }
  }, [leaderBoardType]);

  // useEffect(()=>{
  //   handleSort(showType);
  // }, [golfUserList]);

  // useEffect(()=>{
  //   handleSort(showType);
  // }, [poolUserList]);

  // useEffect(()=>{
  //   if(leaderBoardType=="golf"){
  //     setGolfUserList(scoreData);
  //   }else if(leaderBoardType=="pool"){
  //     setPoolUserList(scoreData);
  //   }
  // }, [scoreData]);

  useEffect(() => {
    // setLoading(loading);
    if (isLoading == false) {
      handleSort(showType);
    }
  }, [isLoading]);

  // useEffect(()=>{
  //   handleSort(showType);
  // }, [filterType]);

  const handleSort = (v) => {
    let _rows = [];
    let docName = "";
    if (filterType == "overall") {
      docName = "AllTimeLeaderboard";
    } else if (filterType == "weekly") {
      docName = "WeeklyLeaderboard";
    } else if (filterType == "monthly") {
      docName = "MonthlyLeaderboard";
    }

    if (leaderBoardType == "golf") {
      golfLeaderboard[docName].map((e) => {
        if (!e["score"][v] || e["score"][v] == 0 || e["score"][v] == 1000) {
          return e;
        }
        _rows.push(e);
        return e;
      });
    } else {
      poolLeaderboard[docName].map((e) => {
        if (!e["score"][v] || e["score"][v] == 0 || e["score"][v] == 1000) {
          return e;
        }
        _rows.push(e);
        return e;
      });
    }
    console.log("sort", _rows);
    if (v === "ComboPoolMaxCombo") {
      _rows = _rows.sort((a, b) => {
        if (b["score"][v] == a["score"][v]) {
          return (
            a["score"]["ComboPoolShortestTime"] -
            b["score"]["ComboPoolShortestTime"]
          );
        } else {
          return b["score"][v] - a["score"][v];
        }
      });
    } else if (v === "ColorPoolMax") {
      _rows = _rows.sort((a, b) => {
        if (b["score"][v] == a["score"][v]) {
          return (
            a["score"]["ColorPoolShortestTime"] -
            b["score"]["ColorPoolShortestTime"]
          );
        } else {
          return b["score"][v] - a["score"][v];
        }
      });
    } else if (v === "SpeedPoolTotalPots") {
      _rows = _rows.sort((a, b) => {
        if (b["score"][v] == a["score"][v]) {
          return (
            a["score"]["SpeedPoolShortestTime"] -
            b["score"]["SpeedPoolShortestTime"]
          );
        } else {
          return b["score"][v] - a["score"][v];
        }
      });
    } else if (v === "Par3Closest") {
      _rows = _rows.sort((a, b) => a["score"][v] - b["score"][v]);
    } else {
      _rows = _rows.sort((a, b) => b["score"][v] - a["score"][v]);
    }
    setUserListBoard(_rows);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <>
      <div
        className={classes.buttons}
        style={{ justifyContent: "center", marginTop: "24px" }}
      >
        <div
          className="seperator"
          style={{ width: "32px", flexShrink: "0%" }}
        ></div>
        <Button
          className={`${classes.btn} ${
            leaderBoardType === "pool" ? classes.selected_btn : ""
          }`}
          onClick={() => {
            setLeaderBoardType("pool");
          }}
        >
          {"POOL"}
        </Button>
        <div
          className="seperator"
          style={{ width: "32px", flexShrink: "0%" }}
        ></div>
        <Button
          className={`${classes.btn} ${
            leaderBoardType === "golf" ? classes.selected_btn : ""
          }`}
          onClick={() => {
            setLeaderBoardType("golf");
          }}
        >
          {"TARGET GOLF"}
        </Button>
      </div>
      <div className={classes.hero}>
        <Row
          className={classes.row}
          style={{
            marginBottom: "15px",
            padding: "0px 25px",
          }}
        >
          <Col md="6" className={classes.mobile_center}>
            <ToggleButtonGroup
              value={filterType}
              exclusive
              onChange={handleChangeFilter}
            >
              <ToggleButton
                value="weekly"
                defaultColor="#00748d"
                selectedColor="#009bb9"
              >
                Weekly
              </ToggleButton>
              <ToggleButton
                value="monthly"
                defaultColor="#00748d"
                selectedColor="#009bb9"
              >
                Monthly
              </ToggleButton>
              <ToggleButton
                value="overall"
                defaultColor="#00748d"
                selectedColor="#009bb9"
              >
                Overall
              </ToggleButton>
            </ToggleButtonGroup>
          </Col>
          <Col md="6" className={classes.mobile_center}>
            <FormControl sx={{ minWidth: 218 }} className={classes.showtype}>
              <Select
                value={showType}
                onChange={handleShowTypeChange}
                displayEmpty
                className={classes.select}
                input={<BootstrapInput />}
              >
                {showTypeList.map((e, index) => (
                  <MenuItem value={e.value} key={index}>{e.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Col>
        </Row>
        {leaderboardData && (
          <Row style={{ width: "100%" }}>
            <Col md="6"></Col>
            <Col md="6">
              <table style={{ color: "white", width: "100%" }}>
                <tr>
                  <th>
                    {filterType == "weekly" && "Last Week"}
                    {filterType == "monthly" && "Last Month"}
                  </th>
                  <th>Player</th>
                  <th>
                    {showType == "Par3Closest"
                      ? "Distance"
                      : leaderBoardType == "golf" ||
                        showType == "PerfectPottermax" ||
                        showType == "ComboPoolMaxCombo" ||
                        showType == "ColorPoolMax" ||
                        showType == "SpeedPoolTotalPots"
                      ? "Score"
                      : "Wins"}
                  </th>
                  {(showType == "ComboPoolMaxCombo" ||
                    showType == "ColorPoolMax" ||
                    showType == "SpeedPoolTotalPots") && <th>Time</th>}
                </tr>
                {leaderboardData.map((e, i) => {
                  if (i > 2) return;
                  return (
                    <tr key={i}>
                      <td>
                        {i == 0 && "1st Place"}
                        {i == 1 && "2nd Place"}
                        {i == 2 && "3rd Place"}
                      </td>
                      <td>{e.username}</td>
                      <td>
                        {Number.isInteger(e[showType])
                          ? e[showType]
                          : Number(e[showType]).toFixed(2)}
                      </td>
                      {/* <td>{e[showType]}</td> */}
                      {showType == "ComboPoolMaxCombo" && (
                        <td>
                          {Number.isInteger(e["ComboPoolShortestTime"])
                            ? e["ComboPoolShortestTime"]
                            : e["ComboPoolShortestTime"].toFixed(2)}
                        </td>
                      )}
                      {showType == "ColorPoolMax" && (
                        <td>
                          {Number.isInteger(e["ColorPoolShortestTime"])
                            ? e["ColorPoolShortestTime"]
                            : e["ColorPoolShortestTime"].toFixed(2)}
                        </td>
                      )}
                      {showType == "SpeedPoolTotalPots" && (
                        <td>
                          {Number.isInteger(e["SpeedPoolShortestTime"])
                            ? e["SpeedPoolShortestTime"]
                            : e["SpeedPoolShortestTime"].toFixed(2)}
                        </td>
                      )}
                    </tr>
                  );
                })}
              </table>
            </Col>
          </Row>
        )}

        <Row
          className={classes.row}
          style={{
            marginBottom: "5px",
          }}
        >
          <Col md="12">
            <div className={classes.leaderboard_item}>
              <div class="top-shape reverse"></div>
              <div class="bottom-shape reverse"></div>
              <div class="content">
                <Grid container>
                  <Grid item xs={8}>
                    <span>Rank</span>
                    <span>
                      <Visibility
                        style={{ marginRight: "10px", marginLeft: "15px" }}
                      />
                      Player
                    </span>
                  </Grid>
                  <Grid
                    item
                    xs={4}
                    style={{
                      textAlign: "right",
                    }}
                  >
                    <span>
                      {showType == "Par3Closest"
                        ? "Distance"
                        : leaderBoardType == "golf" ||
                          showType == "PerfectPottermax" ||
                          showType == "ComboPoolMaxCombo" ||
                          showType == "ColorPoolMax" ||
                          showType == "SpeedPoolTotalPots"
                        ? "Score"
                        : "Wins"}
                    </span>
                    {(showType == "ComboPoolMaxCombo" ||
                      showType == "ColorPoolMax" ||
                      showType == "SpeedPoolTotalPots") && (
                      <span style={{ marginLeft: "10px" }}>Time</span>
                    )}
                  </Grid>
                </Grid>
              </div>
            </div>
          </Col>
        </Row>
        {isLoading == false && (
          <>
            <Row className={classes.row}>
              <Col md="12">
                {userListBoard
                  // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    return (
                      <Row className={classes.row} key={index}>
                        <Col md="12">
                          <div className={classes.leaderboard_item}>
                            <div class="top-shape"></div>
                            <div class="bottom-shape"></div>
                            <div class="content">
                              <Grid item container>
                                <Grid
                                  item
                                  xs={8}
                                  style={{ display: "flex", paddingTop: "5px" }}
                                >
                                  <div
                                    style={{ width: "50px", marginLeft: "5px" }}
                                  >
                                    {index + 1}
                                  </div>
                                  <div className="info">
                                    <Avatar
                                      sx={{ width: "24px", height: "24px", cursor: "pointer" }}
                                      src={row["avatar"]}
                                      onClick={() => {
                                        navigate({
                                          pathname: "/profile",
                                          search: `?uid=${row["uid"]}`,
                                        });
                                      }}
                                    />
                                    <span>{row["name"]}</span>
                                  </div>
                                </Grid>
                                <Grid
                                  item
                                  xs={4}
                                  style={{
                                    textAlign: "right",
                                    paddingTop: "5px",
                                  }}
                                >
                                  <span>
                                    {Number.isInteger(row["score"][showType])
                                      ? row["score"][showType]
                                      : Number(row["score"][showType]).toFixed(
                                          2
                                        )}
                                  </span>
                                  {showType == "ComboPoolMaxCombo" && (
                                    <span style={{ marginLeft: "10px" }}>
                                      {Number.isInteger(
                                        row["score"]["ComboPoolShortestTime"]
                                      )
                                        ? row["score"]["ComboPoolShortestTime"]
                                        : row["score"][
                                            "ComboPoolShortestTime"
                                          ].toFixed(2)}
                                    </span>
                                  )}
                                  {showType == "ColorPoolMax" && (
                                    <span style={{ marginLeft: "10px" }}>
                                      {Number.isInteger(
                                        row["score"]["ColorPoolShortestTime"]
                                      )
                                        ? row["score"]["ColorPoolShortestTime"]
                                        : row["score"][
                                            "ColorPoolShortestTime"
                                          ].toFixed(2)}
                                    </span>
                                  )}
                                  {showType == "SpeedPoolTotalPots" && (
                                    <span style={{ marginLeft: "10px" }}>
                                      {Number.isInteger(
                                        row["score"]["SpeedPoolShortestTime"]
                                      )
                                        ? row["score"]["SpeedPoolShortestTime"]
                                        : row["score"][
                                            "SpeedPoolShortestTime"
                                          ].toFixed(2)}
                                    </span>
                                  )}
                                </Grid>
                              </Grid>
                            </div>
                          </div>
                        </Col>
                      </Row>
                    );
                  })}
              </Col>
              {userListBoard.length == 0 && (
                <Col md="12">
                  <Row className={classes.row}>
                    <Col md="12">
                      <div className={classes.leaderboard_item}>
                        <div class="top-shape"></div>
                        <div class="bottom-shape"></div>
                        <div class="content" style={{ textAlign: "center" }}>
                          No Data
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Col>
              )}
            </Row>
          </>
        )}

        {isLoading && (
          <Row className={classes.row}>
            <Col md="12">
              <div className={classes.leaderboard_item}>
                <div class="top-shape"></div>
                <div class="bottom-shape"></div>
                <div class="content" style={{ textAlign: "center" }}>
                  <CircularProgress
                    color="inherit"
                    style={{
                      width: "30px",
                      height: "30px",
                    }}
                  />
                </div>
              </div>
            </Col>
          </Row>
        )}
      </div>
    </>
  );
}

export default LeaderBoardPage;
