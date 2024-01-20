import React, { createContext } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { AuthStateHook } from "react-firebase-hooks/auth";
import { auth } from "./firebase/auth";
import { Routes, Route, Navigate } from "react-router-dom";
import { HomePage } from "./Component/HomePage/Home";
import { SigninPage } from "./Component/SigninPage/SigninPage";
import { LoginPage } from "./Component/LoginPage/LoginPage";
// import { MessagesPage } from "./Component/MessagesPage/MessagesPage";
import MessagesPage from "./Component/Tempopary/Message";
import { ErrorPage } from "./Component/Error/Error";

const unAuthorizedRoutes = [
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/signin",
    element: <SigninPage />,
  },
  {
    path: "*",
    element: <Navigate to={"/login"} replace />,
  },
];
const authorizedRoutes = [
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/message",
    element: <MessagesPage />,
  },
  {
    path: "*",
    element: <Navigate to={"/"} replace />,
  },
];

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
      <div className="lds-roller">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    );
  }

  return (
    <UserContext.Provider value={[user,loading,error]}>
      <Routes>
        {routes}
        <Route path={"*"} element={<ErrorPage />} />
      </Routes>
    </UserContext.Provider>
  );
};

export { App, UserContext };
