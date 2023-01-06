import { combineReducers } from "redux";
// import register from "./register.reducer";
// import user from "./user.reducer";
import { home } from "./home.reducers";
const homeReducer = combineReducers({
  home,
});

export default homeReducer;
