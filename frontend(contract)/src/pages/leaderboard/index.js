import React from "react";
import { Button, makeStyles } from "@material-ui/core";
import Switch, { SwitchProps } from '@mui/material/Switch';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import styles from "./style";
import { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import * as leaderBoardActions from "./store/actions"

import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import {Row, Col} from "react-bootstrap";

import { auth, db, firebase ,storage, storageRef} from "../../utils/firebase";


// For Table
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow} from '@mui/material';

const columns = [
  {
    id: 'img',
    label: 'Avatar',
    align: 'left',
  },
  {
    id: 'name',
    label: 'PlayerName',
    align: 'left',
  },
  {
    id: 'score',
    label: 'Score',
    align: 'left',
  },
];

const golfShowType = [
  { label: 'Target Golf', value: 'TargetTopScore'},
  { label: 'Decreasing Holes', value: 'DecreasingHolesTopScore'},
  { label: 'Yard Wide', value: 'YardWideTopScore'},
  { label: 'Par3 Closest The Pin', value: 'Par3Closest'},
  { label: 'Par3 Hole In One', value: 'Par3HolesTotal'},
];

const poolShowType = [
  { label: 'Perfect Potter', value: 'PerfectPottermax'},
  { label: 'Speed Pool', value: 'SpeedPoolShortestTime'},
  { label: 'Color Pool', value: 'ColorPoolShortestTime'},
  { label: 'Combo Pool', value: 'ComboPoolMaxCombo'},
  { label: 'Arcade Wins', value: 'SPGamesWon'},
  { label: 'Multiplayer Wins', value: 'PvPGamesWon'},
];

const useStyles = makeStyles(styles);

function LeaderBoardPage() {
  const classes = useStyles();
  const [leaderBoardType, setLeaderBoardType] = React.useState("golf");

  const [showType, setShowType] = React.useState('TargetTopScore');
  const [showTypeList, setShowTypeList] = React.useState(golfShowType);
  const dispatch = useDispatch();
  const { userList } = useSelector(({ leaderboardReducer }) => leaderboardReducer.getUserList);
  const [userListBoard, setUserListBoard] = React.useState([]);
  const [golfUserList, setGolfUserList] = React.useState([]);
  const [poolUserList, setPoolUserList] = React.useState([]);
  
  const handleShowTypeChange = (event) => {
    setShowType(event.target.value);
    handleSort(event.target.value);
  };

  // For Table
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(20);

  useEffect(()=>{
    dispatch(leaderBoardActions.getUserList());
  }, []);
  useEffect(()=>{
    if(userList.length == 0)return ;
    if(leaderBoardType=="golf"){
      setShowType("TargetTopScore");
      setShowTypeList(golfShowType);
      handleSort("TargetTopScore");
    }else{
      setShowType("PerfectPottermax");
      setShowTypeList(poolShowType);
      handleSort("PerfectPottermax");
    }
  }, [leaderBoardType]);

  useEffect(()=>{
    if(userList.length > 0){
      let collectionName = "EskillzTGolfLeaderBoards";
      if(leaderBoardType=="golf"){
        collectionName = "EskillzTGolfLeaderBoards";
      }else{
        collectionName = "EskillzPoolLeaderBoards";
      }
      let _golfUserList = [];
      let _poolUserList = [];
      userList.forEach(async (userItem, i) => {
        let userInfoDoc = await db.collection("users").doc(userItem.uid).collection("Profile").doc("ProfileData").get();
        let userInfoDocData = userInfoDoc.data();
        if(userInfoDocData){
          await storageRef.child(`users/${userItem.uid}.jpeg`).getDownloadURL()
            .then((url) => {
              userInfoDocData.avatar = url;
              userItem.userInfo = userInfoDocData;
            })
            .catch((error) => {
              userInfoDocData.avatar = "";
              userItem.userInfo = userInfoDocData;
            });
        }

        let leaderboardDoc = await db.collection("EskillzTGolfLeaderBoards").doc(userItem.uid).get();
        let leaderboardDocData = leaderboardDoc.data();
        if(leaderboardDocData){
          _golfUserList.push({
            avatar: userItem.userInfo.avatar,
            name: userItem.userInfo.userName,
            score: leaderboardDocData,
          });
        }

        let leaderboardPoolDoc = await db.collection("EskillzPoolLeaderBoards").doc(userItem.uid).get();
        let leaderboardPoolDocData = leaderboardPoolDoc.data();
        if(leaderboardPoolDocData){
          _poolUserList.push({
            avatar: userItem.userInfo.avatar,
            name: userItem.userInfo.userName,
            score: leaderboardPoolDocData,
          });
        }
        
        if(i == userList.length - 1){
          setGolfUserList(_golfUserList);
          setPoolUserList(_poolUserList);
        }
      });
    }
  }, [userList]);

  useEffect(()=>{
    if(leaderBoardType=="golf"){
      handleSort("TargetTopScore");
    }else{
      handleSort("PerfectPottermax");
    }
  }, [golfUserList]);
  
  useEffect(()=>{
    if(leaderBoardType=="golf"){
      handleSort("TargetTopScore");
    }else{
      handleSort("PerfectPottermax");
    }
  }, [poolUserList]);

  const handleSort = (v) => {
    let _rows = [];
    if(leaderBoardType=="golf"){
      golfUserList.map((e)=>{
        _rows.push(e);
        return e;
      });
    }else{
      poolUserList.map((e)=>{
        _rows.push(e);
        return e;
      });
    }
    console.log(_rows);
    if(v == "ComboPoolMaxCombo"){
      _rows = _rows.sort((a,b)=>b["score"][v]/b["score"]["ComboPoolShortestTime"] - a["score"][v]/a["score"]["ComboPoolShortestTime"]);
    }else{
      _rows = _rows.sort((a,b)=>b["score"][v] - a["score"][v]);
    }
    setUserListBoard(_rows);
  }

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
            leaderBoardType === "golf" ? classes.selected_btn : ""
          }`}
          onClick={() => {
            setLeaderBoardType("golf");
          }}
        >
          {"TARGET GOLF"}
        </Button>
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
          className="last-div"
          style={{ flexDirection: "column", display: "flex", marginLeft: "36px" }}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography color="common.white">Monthly</Typography>
            <Switch />
            <Typography color="common.white">Weekly</Typography>
          </Stack>
        </div>
      </div>
      <div className={classes.hero}>
        <Row className={classes.row}>
          <Col md="12">
            <FormControl sx={{ m: 1, minWidth: 200 }} className={classes.showtype}>
              <Select
                value={showType}
                onChange={handleShowTypeChange}
                displayEmpty
                inputProps={{ 'aria-label': 'Without label' }}
                className={classes.select}
              >
                {showTypeList.map((e, i) => (
                  <MenuItem value={e.value}>{e.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Col>
        </Row>
        <Row className={classes.row}>
          <Col md="12">
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      {columns.map((column) => (
                        <TableCell
                          key={column.id}
                          align={column.align}
                          style={{ minWidth: column.minWidth }}
                        >
                          {column.label}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {userListBoard
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row) => {
                        return (
                          <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                            {columns.map((column) => {
                              if(column.id === "img"){
                                return (
                                  <TableCell key={column.id} align={column.align}>
                                    <img src={row["avatar"]} width="30"></img>
                                  </TableCell>
                                );
                              }else if(column.id === "score"){
                                if(showType == "ComboPoolMaxCombo"){
                                  return (
                                    <TableCell key={column.id} align={column.align}>
                                      {row["score"][showType]} / {row["score"]["ComboPoolShortestTime"]}sec
                                    </TableCell>                             
                                  );
                                }else{
                                  return (
                                    <TableCell key={column.id} align={column.align}>
                                      {row["score"][showType]}
                                    </TableCell>                             
                                  );
                                }
                              }else{
                                return (
                                  <TableCell key={column.id} align={column.align}>
                                    {row["name"]}
                                  </TableCell>
                                );
                              }
                            })}
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={userListBoard.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                className={classes.tablePagination}
              />
            </Paper>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default LeaderBoardPage;
