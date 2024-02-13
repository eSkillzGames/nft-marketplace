import { Typography, Box, Avatar } from "@mui/material";
import axios from "axios";
import React from "react";
import { useState, useEffect } from "react";
import VersusCard from "../../components/VersusCard";
import VersusCardContent from "../../components/VersusCardContent";
import VersusCardHeader from "../../components/VersusCardHeader";
import VersusButton from "../../components/VersusButton";
import VersusInput from "../../components/VersusInput";
import VersusMenu from "../../components/VersusMenu";
import VersusLoading from "../../components/VersusLoading";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { auth, db, firebase, storage, storageRef } from "../../utils/firebase";
import { useNavigate } from "react-router-dom";

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

const NewLeaderBoard = () => {
  const navigate = useNavigate();
  const [filterType, setFilterType] = useState("overall");
  const [showTypeLabel, setShowTypeLabel] = useState("Perfect Potter");
  const [showTypes, setShowTypes] = useState(poolShowType);
  const [showType, setShowType] = useState("PerfectPottermax");
  const [leaderBoardType, setLeaderBoardType] = useState("pool");
  const [userListBoard, setUserListBoard] = useState([]);
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchWord, setSearchWord] = useState("");

  useEffect(() => {
    setLoading(true);
    db.collectionGroup("Leaderboards").onSnapshot(async (doc) => {
      let docChanges = doc.docChanges();
      await Promise.all(
        docChanges.map(async (e) => {
          let path = e.doc.ref.path;
          let indexSlash = path.indexOf("/");
          let userId = path.substring(
            indexSlash + 1,
            path.indexOf("/", indexSlash + 1)
          );
          let collectionName = path.substring(0, indexSlash);

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
          } else {
            return;
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
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    // let docName = "";
    // if (filterType == "overall") {
    //   docName = "AllTimeLeaderboard";
    //   dispatch(leaderBoardActions.getAll());
    // } else if (filterType == "weekly") {
    //   docName = "WeeklyLeaderboard";
    //   dispatch(leaderBoardActions.getWeekly(leaderBoardType, showType));
    // } else if (filterType == "monthly") {
    //   docName = "MonthlyLeaderboard";
    //   dispatch(leaderBoardActions.getMonthly(leaderBoardType, showType));
    // }
    handleSort(showType);
  }, [filterType]);

  useEffect(() => {
    if (loading == false) {
      handleSort(showType);
    }
  }, [loading]);
  useEffect(() => {
    handleSort(showType);
  }, [leaderBoardType]);

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

  useEffect(() => {
    setSearchResult(userListBoard.filter(user => {
      if(!user.name) return false;
      return  user.name.includes(searchWord);
    }));
  }, [userListBoard, searchWord]);
  
  return (
    !loading ?
    <>
      <VersusCard title={"LEADERBOARDS"}>
        <VersusCardHeader showToken={false}>
          <Box display="flex" alignItems="center">
            <img src="/imgs/arrow-up.png" width="20px" />
            <VersusMenu
              style={{ marginLeft: "16px" }}
              value={leaderBoardType}
              items={[
                {
                  label: "pool",
                  onClick: () => {
                    setLeaderBoardType("pool");
                    setShowTypes(poolShowType);
                    setShowTypeLabel("Perfect Potter");
                    setShowType("PerfectPottermax");
                    // handleSort("PerfectPottermax");
                  },
                },
                {
                  label: "golf",
                  onClick: () => {
                    setLeaderBoardType("golf");
                    setShowTypes(golfShowType);
                    setShowTypeLabel("Target Golf");
                    setShowType("TargetTopScore");
                    // handleSort("TargetTopScore");
                  },
                },
              ]}
            />
          </Box>
          <Box
            display={"flex"}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <VersusMenu
              value={filterType}
              items={[
                {
                  label: "weekly",
                  onClick: () => {
                    setFilterType("weekly");
                  },
                },
                {
                  label: "monthly",
                  onClick: () => {
                    setFilterType("monthly");
                  },
                },
                {
                  label: "overall",
                  onClick: () => {
                    setFilterType("overall");
                  },
                },
              ]}
            />

            <VersusMenu
              style={{ marginLeft: "8px" }}
              value={showTypeLabel}
              items={showTypes.map((e) => {
                return {
                  label: e.label,
                  onClick: () => {
                    setShowTypeLabel(e.label);
                    setShowType(e.value);
                    handleSort(e.value);
                  },
                };
              })}
            />
          </Box>
        </VersusCardHeader>
        <VersusCardContent style={{ padding: "0px" }}>
          <table style={{ width: "100%" }}>
            <tr>
              <th width="100" style={{ textAlign: "center", padding: "8px" }}>
                <Typography variant="body1" fontWeight={"bold"}>
                  RANK
                </Typography>
              </th>
              <th>
                <Box display={"flex"} alignItems={"center"}>
                  <img src="/imgs/client.png" width={"24px"} />
                  <Typography variant="body1" fontWeight={"bold"} ml={1}>
                    PLAYER
                  </Typography>
                </Box>
              </th>
              {(showType == "ComboPoolMaxCombo" ||
                showType == "ColorPoolMax" ||
                showType == "SpeedPoolTotalPots") && (
                <th width="150" style={{ textAlign: "center" }}>
                  <Typography variant="body1" fontWeight={"bold"}>
                    TIME
                  </Typography>
                </th>
              )}
              <th width="150" style={{ textAlign: "center" }}>
                <Typography variant="body1" fontWeight={"bold"}>
                  {showType == "Par3Closest"
                    ? "DISTANCE"
                    : leaderBoardType == "golf" ||
                      showType == "PerfectPottermax" ||
                      showType == "ComboPoolMaxCombo" ||
                      showType == "ColorPoolMax" ||
                      showType == "SpeedPoolTotalPots"
                    ? "SCORE"
                    : "WINS"}
                </Typography>
              </th>
            </tr>
            {searchResult.map((row, index) => {
              return (
                <tr key={index}>
                  <td style={{ padding: "0px" }}>
                    <Box>
                      <Box
                        mb={1}
                        bgcolor={"#000000cc"}
                        height={"56px"}
                        display={"flex"}
                        alignItems={"center"}
                        justifyContent={"center"}
                        position={"relative"}
                      >
                        {index == 0 && (
                          <img
                            src="/imgs/crown-icon.png"
                            width={"32px"}
                            style={{
                              position: "absolute",
                              left: "8px",
                              top: "12px",
                            }}
                          />
                        )}
                        <Typography
                          variant={index == 0 ? "subtitle1" : "body2"}
                          fontWeight={index == 0 ? "bold" : "normal"}
                        >
                          {index + 1}
                        </Typography>
                      </Box>
                    </Box>
                  </td>
                  <td style={{ padding: "0px" }}>
                    <Box>
                      <Box
                        mb={1}
                        bgcolor={"#000000cc"}
                        display={"flex"}
                        alignItems={"center"}
                        height={"56px"}
                      >
                        <Avatar
                          sx={{
                            width: index == 0 ? "32px" : "24px",
                            height: index == 0 ? "32px" : "24px",
                            cursor: "pointer"
                          }}
                          src={
                            row["avatar"] ? row["avatar"] : "/imgs/client.png"
                          }
                          onClick={() => {
                            navigate({
                              pathname: "/profileview/" + row["uid"],
                              search: ``,
                            });
                          }}
                        />
                        <Typography
                          ml={1}
                          variant={index == 0 ? "subtitle1" : "body2"}
                          fontWeight={index == 0 ? "bold" : "normal"}
                        >
                          {row["name"]}
                        </Typography>
                      </Box>
                    </Box>
                  </td>
                  {showType == "ComboPoolMaxCombo" && (
                    <td style={{ padding: "0px" }}>
                      <Box>
                        <Box
                          mb={1}
                          bgcolor={"#000000cc"}
                          height={"56px"}
                          display={"flex"}
                          alignItems={"center"}
                          justifyContent={"center"}
                        >
                          <Typography
                            variant={index == 0 ? "subtitle1" : "body2"}
                            fontWeight={index == 0 ? "bold" : "normal"}
                          >
                            {Number.isInteger(
                              row["score"]["ComboPoolShortestTime"]
                            )
                              ? row["score"]["ComboPoolShortestTime"]
                              : row["score"]["ComboPoolShortestTime"].toFixed(
                                  2
                                )}
                          </Typography>
                        </Box>
                      </Box>
                    </td>
                  )}
                  {showType == "ColorPoolMax" && (
                    <td style={{ padding: "0px" }}>
                      <Box>
                        <Box
                          mb={1}
                          bgcolor={"#000000cc"}
                          height={"56px"}
                          display={"flex"}
                          alignItems={"center"}
                          justifyContent={"center"}
                        >
                          <Typography
                            variant={index == 0 ? "subtitle1" : "body2"}
                            fontWeight={index == 0 ? "bold" : "normal"}
                          >
                            {Number.isInteger(
                              row["score"]["ColorPoolShortestTime"]
                            )
                              ? row["score"]["ColorPoolShortestTime"]
                              : row["score"]["ColorPoolShortestTime"].toFixed(
                                  2
                                )}
                          </Typography>
                        </Box>
                      </Box>
                    </td>
                  )}
                  {showType == "SpeedPoolTotalPots" && (
                    <td style={{ padding: "0px" }}>
                      <Box>
                        <Box
                          mb={1}
                          bgcolor={"#000000cc"}
                          height={"56px"}
                          display={"flex"}
                          alignItems={"center"}
                          justifyContent={"center"}
                        >
                          <Typography
                            variant={index == 0 ? "subtitle1" : "body2"}
                            fontWeight={index == 0 ? "bold" : "normal"}
                          >
                            {Number.isInteger(
                              row["score"]["SpeedPoolShortestTime"]
                            )
                              ? row["score"]["SpeedPoolShortestTime"]
                              : row["score"]["SpeedPoolShortestTime"].toFixed(
                                  2
                                )}
                          </Typography>
                        </Box>
                      </Box>
                    </td>
                  )}
                  <td style={{ padding: "0px" }}>
                    <Box>
                      <Box
                        mb={1}
                        bgcolor={"#000000cc"}
                        height={"56px"}
                        display={"flex"}
                        alignItems={"center"}
                        justifyContent={"center"}
                      >
                        <Typography
                          variant={index == 0 ? "subtitle1" : "body2"}
                          fontWeight={index == 0 ? "bold" : "normal"}
                        >
                          {Number.isInteger(row["score"][showType])
                            ? row["score"][showType]
                            : Number(row["score"][showType]).toFixed(2)}
                        </Typography>
                      </Box>
                    </Box>
                  </td>
                </tr>
              );
            })}
          </table>

          <Box
            display={"flex"}
            alignItems={"center"}
            justifyContent={"space-between"}
            padding={"1rem"}
          >
            <Box>
              <VersusInput placeholder="Search..." onChange={(e) => {setSearchWord(e.target.value)}} value={searchWord} />
            </Box>
            <Box display={"flex"} alignItems={"center"} style={{fontSize:"1rem"}}>
              <VersusButton
                label={
                  <>
                    <ChevronLeft />
                    BACK
                  </>
                }
              />
              <VersusButton
                label={"1"}
                style={{ margin: "0 0.5rem" }}
                outline={true}
              />
              <VersusButton
                label={
                  <>
                    NEXT
                    <ChevronRight />
                  </>
                }
              />
            </Box>
          </Box>
        </VersusCardContent>
      </VersusCard>
    </>
    :
    <VersusLoading />
  );
};

export default NewLeaderBoard;
