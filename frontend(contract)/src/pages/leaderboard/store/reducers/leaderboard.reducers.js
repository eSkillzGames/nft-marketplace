import * as leaderBoardActions from "../actions";
const inintialState = {
  userList:[]
};

export const getUserList = (state = inintialState, action) => {
  switch (action.type) {
    case leaderBoardActions.GET_USER_LIST: {
      return {
        ...state,
        userList: action.payload.data.data
      }
    }
    default:
      return state;
  }
};
