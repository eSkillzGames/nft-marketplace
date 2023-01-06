import { combineReducers } from "redux";
// import register from "./register.reducer";
// import user from "./user.reducer";
import { auth } from "./login.reducers";
const authReducer = combineReducers({
  auth,
});

export default authReducer;
