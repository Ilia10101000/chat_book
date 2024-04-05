import React, { createContext, useContext } from "react";
import { ErrorPage } from "./Component/Error/Error";
import {
  unAuthorizedRoutes,
  authorizedRoutes,
  renderRoutes,
} from "./routes/routes";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase/auth";
import { Routes, Route } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import { User } from "firebase/auth";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const UserContext = createContext<User>(null);

const App = () => {
  const [user, loading] = useAuthState(auth);

  let availablePaths =
    user?.uid && !loading ? authorizedRoutes : unAuthorizedRoutes;

  if (loading) {
    return (
      <CircularProgress
        sx={{
          position: "absolute",

          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
        }}
        color="success"
      />
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <UserContext.Provider value={user}>
        <Routes>
          {renderRoutes(availablePaths)}
          <Route path={"*"} element={<ErrorPage />} />
        </Routes>
      </UserContext.Provider>
    </DndProvider>
  );
};

function useAuth() {
  return useContext(UserContext);
}

export { App, useAuth };
