import { combineReducers } from "redux";
import { getUserList } from "./leaderboard.reducers";
const leaderboardReducer = combineReducers({
  getUserList,
});

export default leaderboardReducer;
