import { homeActions } from "../../store/actions";
import { combineReducers } from "redux";

const inintialState = {
  balance: 0,
};
const home = (state = inintialState, action) => {
  switch (action.type) {
    case homeActions.SET_BALANCE: {
      return {
        ...state,
        balance: action.payload,
      };
    }

    default:
      return state;
  }
};

const homeReducer = combineReducers({
  home,
});

export default homeReducer;
