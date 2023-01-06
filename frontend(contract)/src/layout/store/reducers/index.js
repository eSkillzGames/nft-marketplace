import { combineReducers } from "redux";
// import register from "./register.reducer";
// import user from "./user.reducer";
import { layout } from "./layout.reducers";
const layoutReducer = combineReducers({
  layout,
});

export default layoutReducer;
