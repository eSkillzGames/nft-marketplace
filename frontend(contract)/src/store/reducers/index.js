import { combineReducers } from "redux";

import fuse from "./fuse";
import authReducer from "./auth.reducers";
import homeReducer from "./home.reducers";
import layoutReducer from "./layout.reducers";
import leaderboardReducer from "./leaderboard.reducers";
const createReducer = (asyncReducers) =>
  combineReducers({
    fuse,
    authReducer,
    homeReducer,
    leaderboardReducer,
    layoutReducer,
    ...asyncReducers,
  });

export default createReducer;
