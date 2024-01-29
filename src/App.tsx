import { ErrorPage } from "./Component/Error/Error";
import { unAuthorizedRoutes, authorizedRoutes, renderRoutes } from "./routes/routes";
import React, { createContext } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase/auth";
import { Routes, Route } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import { User } from "firebase/auth";



const UserContext = createContext<User>(null);

const App = () => {
  const [user, loading, error] = useAuthState(auth);

  let availablePaths = user ? authorizedRoutes : unAuthorizedRoutes;

  if (loading) {
    return <CircularProgress color="success" />;
  }

  return (
    <UserContext.Provider value={user}>
      <Routes>
        {renderRoutes(availablePaths)}
        <Route path={"*"} element={<ErrorPage />} />
      </Routes>
    </UserContext.Provider>
  );
};

export { App, UserContext };
