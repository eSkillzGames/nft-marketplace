import * as Actions from "../../actions/fuse";

const initialState = {
  state: null,
  options: {
    anchorOrigin: {
      vertical: "bottom",
      horizontal: "right",
    },
    autoHideDuration: 6000,
    message: "Hi",
    variant: null,
    timer: 3000
  },
};

const message = (state = initialState, action) => {
  switch (action.type) {
    case Actions.SHOW_MESSAGE: {
      return {
        state: true,
        options: {
          ...initialState.options,
          ...action.options,
        },
      };
    }
    case Actions.HIDE_MESSAGE: {
      return {
        ...state,
        state: null,
      };
    }
    default: {
      return state;
    }
  }
};

export default message;
