import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import * as fuseActions from "../../store/actions";
import auth from "./auth-helper";

// eslint-disable-next-line react/prop-types
const PrivateRoute = ({ children }) => {
  const dispatch = useDispatch();
  const { uid } = useSelector(({ authReducer }) => authReducer.auth);
  useEffect(() => {
    if (!auth.isLogined()) {
      dispatch(
        fuseActions.showMessage({
          message: "you dont have access to that page",
          variant: "error",
        })
      );
    }
  }, [uid]);
  return auth.isLogined() ? children : <Navigate to="/" />;
};

export default PrivateRoute;
