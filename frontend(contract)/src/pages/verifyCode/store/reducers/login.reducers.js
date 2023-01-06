import * as loginActions from "../actions";
const inintialState = {
  uid: localStorage.getItem("@uid"),
  address: localStorage.getItem("address"),
  mail: localStorage.getItem("mail"),
};
export const auth = (state = inintialState, action) => {
  switch (action.type) {
    case loginActions.REGISTER: {
      return {
        ...state,
        uid: action.payload.uid,
        address: action.payload.address,
        mail : action.payload.mail,
      };
    }
    case loginActions.LOGIN: {
      return {
        ...state,
        uid: action.payload.uid,
        address: action.payload.address,
        mail : action.payload.mail,
      };
    }
    case loginActions.LOGOUT: {
      return {
        ...state,
        uid: null,
        address: null,
        mail : null,
      };
    }

    default:
      return state;
  }
};
