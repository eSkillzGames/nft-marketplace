import * as Actions from "../../actions/fuse";

const initialState = {
  state: null,
  options: {
    address: ''
  },
};

const wallet = (state = initialState, action) => {
  switch (action.type) {
    case Actions.SHOW_WALLET_ADDRESS: {
      return {
        state: true,
        options: {
          ...initialState.options,
          ...action.options,
        },
      };
    }
    default: {
      return state;
    }
  }
};

export default wallet;
