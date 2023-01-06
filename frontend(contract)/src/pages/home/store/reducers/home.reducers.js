import * as homeActions from "../actions";
const inintialState = {
  balance:0
};
export const home = (state = inintialState, action) => {
  switch (action.type) {
    case homeActions.SET_BALANCE: {
      return {
        ...state,
        balance:action.payload
      };
    }
   

    default:
      return state;
  }
};
