import { combineReducers } from "redux";
import message from "./message.reducer";
import loading from "./loading.reducer";
import { admin } from "./admin.reducer";

const fuseReducers = combineReducers({
  message,
  loading,
  admin,
});

export default fuseReducers;
