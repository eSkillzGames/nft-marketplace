import { combineReducers } from "redux";
import message from "./message.reducer";
import loading from "./loading.reducer";
import wallet from "./wallet.reducer";
import { admin } from "./admin.reducer";

const fuseReducers = combineReducers({
  message,
  wallet,
  loading,
  admin,
});

export default fuseReducers;
