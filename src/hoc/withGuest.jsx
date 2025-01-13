import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export const withGuest = (WrappedComponent) => {
  return (props) => {
    const { auth } = useContext(AuthContext);

    if (auth.isAuthenticated) {
      console.log(auth);
      return <Navigate to="/dashboard" />;
    }

    return <WrappedComponent {...props} />;
  };
};
