import * as layoutActions from "../actions/layout.actions";
import { combineReducers } from "redux";

const inintialState = {
  avatar:""
};
const layout = (state = inintialState, action) => {
  switch (action.type) {
    case layoutActions.SET_AVATER: {
      return {
        ...state,
        avatar:action.payload
      };
    }
   

    default:
      return state;
  }
};

const layoutReducer = combineReducers({
  layout,
});

export default layoutReducer;