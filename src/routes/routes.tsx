import React from "react";
import { Route, Navigate } from "react-router-dom";
import { HomePage } from "../Component/HomePage/Home";
import { SigninPage } from "../Component/SigninPage/SigninPage";
import { LoginPage } from "../Component/LoginPage/LoginPage";
import { Settings } from "../Component/SettingsPage/Settings";
// import { MessagesPage } from "./Component/MessagesPage/MessagesPage";
import MessagesPage from "../Component/Tempopary/Message";
import { FriendsList } from "../Component/Tempopary/FriendsList";


export const unAuthorizedRoutes = [
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


export const authorizedRoutes = [
  {
    path: "/",
    element: <HomePage />,
    children: [
      {
        path: "messages/:reciever",
        element: <MessagesPage />,
      },
      {
        path: 'settings',
        element:<Settings/>
      },
      {
        path: 'friends',
        element:<FriendsList/>
      }
    ],
  },
  {
    path: "*",
    element: <Navigate to={"/"} replace />,
  },
];

export const renderRoutes = (routes: any) => {
  return routes.map(({children,...otherProps}) => {
    if (children) {
      return (
        <Route key={otherProps.path} {...otherProps}>{renderRoutes(children)}</Route>
      )
    } else {
      return (
        <Route key={otherProps.path} {...otherProps} />
      )
    }
  })
}