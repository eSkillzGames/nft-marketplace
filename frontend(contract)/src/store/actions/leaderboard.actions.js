import axios from "axios";
export const GET_WEEKLY = "GET_WEEKLY";
export const GET_MONTHLY = "GET_MONTHLY";
export const GET_ALL = "GET_ALL";
export const GET_LEADERBOARD = "GET_LEADERBOARD";
export const LOADING = "LOADING";

export const getWeekly = (type, showType) =>async (dispatch) => {
  const response1 = await axios.post(
    "/api/leaderboard/weekly",
    { type, showType }
  );
  
  dispatch({
    type: GET_WEEKLY,
    payload: { data: response1.data},
  });
}

export const getMonthly = (type, showType) =>async (dispatch) => {
  const response1 = await axios.post(
    "/api/leaderboard/monthly",
    { type, showType }
  );
  
  dispatch({
    type: GET_MONTHLY,
    payload: { data: response1.data},
  });
}

export const getAll = () =>async (dispatch) => {
    
  dispatch({
    type: GET_ALL,
    payload: { data: null},
  });
}

export const getLeaderboard = (type, board) =>async (dispatch) => {
  dispatch({
    type: LOADING,
  });
  const response1 = await axios.post(
    "/api/leaderboard/get",
    { type, board }
  );
  dispatch({
    type: GET_LEADERBOARD,
    payload: response1.data.result,
  });
}
