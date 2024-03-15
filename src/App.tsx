import React, { createContext } from "react";
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

  let availablePaths = user ? authorizedRoutes : unAuthorizedRoutes;

  if (loading) {
    return (
      <CircularProgress
        sx={{ position: "absolute", top: "50%", left: "50%", transform:'translate(-50%,-50%)' }}
        color="success"
      />
    );
  }

  return (
    <UserContext.Provider value={user}>
      <DndProvider backend={HTML5Backend}>
        <Routes>
          {renderRoutes(availablePaths)}
          <Route path={"*"} element={<ErrorPage />} />
        </Routes>
      </DndProvider>
    </UserContext.Provider>
  );
};

export { App, UserContext };
