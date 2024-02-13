import { authActions } from "../actions";
import { combineReducers } from "redux";

const inintialState = {
  uid: localStorage.getItem("@uid"),
  address: localStorage.getItem("address"),
  mail: localStorage.getItem("mail"),
  matic: localStorage.getItem("matic") || 0,
  skill: localStorage.getItem("skill") || 0,
};
const auth = (state = inintialState, action) => {
  switch (action.type) {
    case authActions.REGISTER: {
      return {
        ...state,
        uid: action.payload.uid,
        address: action.payload.address,
        mail: action.payload.mail,
        matic: action.payload.MaticBal || 0,
        skill: action.payload.SportBal || 0,
      };
    }
    case authActions.LOGIN: {
      return {
        ...state,
        uid: action.payload.uid,
        address: action.payload.address,
        mail: action.payload.mail,
        matic: action.payload.MaticBal || 0,
        skill: action.payload.SportBal || 0,
      };
    }
    case authActions.LOGOUT: {
      return {
        ...state,
        uid: null,
        address: null,
        mail: null,
        matic: 0,
        skill: 0
      };
    }
    
    case authActions.SET_BALANCE: {
      return {
        ...state,
        matic : action.payload.MaticBal,
        skill : action.payload.SportBal
      }
    }
    default:
      return state;
  }
};

const authReducer = combineReducers({
  auth,
});

export default authReducer;
