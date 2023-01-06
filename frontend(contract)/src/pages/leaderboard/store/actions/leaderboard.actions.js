import axios from "axios";
export const GET_USER_LIST = "GET_USER_LIST";

export const getUserList = () =>async (dispatch) => {
  const response1 = await axios.post(
    "/api/user/list",
    { }
  );
  
  dispatch({
    type: GET_USER_LIST,
    payload: { data: response1.data},
  });
}