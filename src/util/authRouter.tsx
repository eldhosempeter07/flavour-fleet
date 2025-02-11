import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./context/authContext";

interface AuthRouteProps {
  element: React.ReactNode;
}

const AuthRouter: React.FC<AuthRouteProps> = ({ element }) => {
  const { user } = useContext(AuthContext) ?? {
    user: null,
    loading: true,
  };

  // if (!loading) {
  //   return (
  //     <>
  //       <LoadingScreen />
  //     </>
  //   );
  // }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{element}</>;
};

export default AuthRouter;
