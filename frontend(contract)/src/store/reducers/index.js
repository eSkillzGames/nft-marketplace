import { combineReducers } from "redux";

import fuse from "./fuse";
import authReducer from "../../pages/register/store/reducers";
import homeReducer from "../../pages/home/store/reducers";
import layoutReducer from "../../layout/store/reducers";
import leaderboardReducer from "../../pages/leaderboard/store/reducers";
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
