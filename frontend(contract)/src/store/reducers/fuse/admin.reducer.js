import * as Actions from "../../actions/fuse";

const initialState = {
  isAdmin: false,
};

export const admin = (state = initialState, action) => {
  switch (action.type) {
    case Actions.IS_ADMIN:
      return {
        ...state,
        isAdmin: action.payload ? true : false,
      };

    default:
      return state;
  }
};
