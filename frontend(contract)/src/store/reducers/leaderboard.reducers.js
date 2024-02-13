import {leaderBoardActions} from "../actions";
import { combineReducers } from "redux";

const inintialState = {
  leaderboardData: null,
  loading: false,
  scoreData: []
};

const getLeaderboard = (state = inintialState, action) => {
  switch (action.type) {
    case leaderBoardActions.GET_WEEKLY: {
      return {
        ...state,
        leaderboardData: action.payload.data.data
      }
    }
    case leaderBoardActions.GET_MONTHLY: {
      return {
        ...state,
        leaderboardData: action.payload.data.data
      }
    }
    case leaderBoardActions.GET_ALL: {
      return {
        ...state,
        leaderboardData: null
      }
    }
    case leaderBoardActions.GET_LEADERBOARD: {
      return {
        ...state,
        scoreData: action.payload,
        loading: false
      }
    }
    case leaderBoardActions.LOADING: {
      return {
        ...state,
        loading: true
      }
    }
    default:
      return state;
  }
};

const leaderboardReducer = combineReducers({
  getLeaderboard,
});

export default leaderboardReducer;
