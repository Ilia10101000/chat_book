import React from "react";
import { Route, Navigate, useLocation, useParams } from "react-router-dom";
import { HomePage } from "../Component/HomePage/Home";
import { LoginPage } from "../Component/LoginPage/LoginPage";
import { Settings } from "../Component/SettingsPage/Settings";
import { MessagesPage } from "../Component/MessagesPage/MessagesPage";
import { UserProfile } from "../Component/UserPage/UserProfile";
import { Signin } from "../Component/SigninPage/Signin";
import { SigninInfo } from "../Component/SigninPage/SigninInfo";
import { MiddlewareCheckComponent } from "../Component/MessagesPage/MiddlewareCheckMessage";
import { PostModalWindow } from "../Component/UserPage/PostList/PostModalWindow";
import { NewsPage } from "../Component/NewsPage/NewsPage";

export const unAuthorizedRoutes = [
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/signin/*",
    element: <Signin />,
    children: [
      {
        path: ":requiredInfo",
        element: <SigninInfo />,
      },
    ],
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
        element: <MiddlewareCheckComponent />,
      },
      {
        path: "c/:chatId",
        element: <MessagesPage />,
      },
      {
        path: "u/:userId",
        element: <UserProfile />,
        children: [
          {
            path: "o/:ownerPostId/p/:postId",
            element:<PostModalWindow/>
          }
        ]
      },
      {
        path: "news",
        element: <NewsPage />,
        children: [
          {
            path: "o/:ownerPostId/p/:postId",
            element:<PostModalWindow/>
          }
        ]
      },
      {
        path: "settings",
        element: <Settings />,
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to={"/"} replace />,
  },
];

export const renderRoutes = (routes: any) => {
  return routes.map(({ children, ...otherProps }) => {
    if (children) {
      return (
        <Route key={otherProps.path} {...otherProps}>
          {renderRoutes(children)}
        </Route>
      );
    } else {
      return <Route key={otherProps.path} {...otherProps} />;
    }
  });
};
