import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { HomePage } from "../Component/HomePage/Home";
import { SigninPage } from "../Component/SigninPage/SigninPage";
import { LoginPage } from "../Component/LoginPage/LoginPage";
// import { MessagesPage } from "./Component/MessagesPage/MessagesPage";
import MessagesPage from "../Component/Tempopary/Message";


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
