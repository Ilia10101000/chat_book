import React, { createContext } from "react";
import { useAuthState, AuthStateHook } from "react-firebase-hooks/auth";
import { auth } from "./firebase/auth";
import { Routes, Route } from "react-router-dom";;
import { ErrorPage } from "./Component/Error/Error";
import { unAuthorizedRoutes, authorizedRoutes } from "./routes/routes";



const UserContext: any = createContext<AuthStateHook | null>(null);

const App = () => {
  const [user, loading, error] = useAuthState(auth);

  let routes;
  if (!user) {
    routes = unAuthorizedRoutes.map((route) => (
      <Route key={route.path} path={route.path} element={route.element} />
    ));
  } else {
    routes = authorizedRoutes.map((route) => (
      <Route key={route.path} path={route.path} element={route.element} />
    ));
  }
  if (loading) {
    return (
      
    );
  }

  return (
    <UserContext.Provider value={user}>
      <Routes>
        {routes}
        <Route path={"*"} element={<ErrorPage />} />
      </Routes>
    </UserContext.Provider>
  );
};

export { App, UserContext };
