import * as layoutActions from "../actions";
const inintialState = {
  avatar:""
};
export const layout = (state = inintialState, action) => {
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
