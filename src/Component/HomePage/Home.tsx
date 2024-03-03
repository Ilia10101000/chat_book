import React, { ReactNode, useEffect } from "react";
import { Box, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { useState } from "react";
import EmailIcon from "@mui/icons-material/Email";
import GroupIcon from "@mui/icons-material/Group";
import TuneIcon from "@mui/icons-material/Tune";
import AddToPhotosOutlinedIcon from "@mui/icons-material/AddToPhotosOutlined";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import { Link, Outlet } from "react-router-dom";
import { auth, realTimeDB } from "../../firebase/auth";
import { signOut } from "firebase/auth";
import { serverTimestamp } from "firebase/firestore";
import { ref, set } from "firebase/database";
import { useTheme } from "../../theme";
import { useAuth } from "../../hooks/useAuth";
import { AppDrawer } from "../Drawer/AppDrawer";
import { MobileAppBar } from "./AppBar";
import { MessageListDrawer } from "../MessagesPage/MessageListDrawer";
import { FriendsListDrawer } from "../FriendsPage/riendsListDrawer";
import { USERS_RT } from "../../firebase_storage_path_constants/firebase_storage_path_constants";
import { NewPostModalWindow } from "../UserPage/PostList/AddNewPost/NewPostModalWindow";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const makeDrawerInner = (drawerListItems: any): ReactNode => {
  return drawerListItems.map(({ mode, label, icon, ...modeAction }) => {

    let button = (
      <ListItemButton
        onClick={mode === "button" ? modeAction.handleClick : undefined}
        key={label}
        sx={{
          minHeight: 48,
          justifyContent: "initial",
          px: 2.5,
        }}
      >
        <ListItemIcon
          sx={{
            minWidth: 0,
            mr:3,
            justifyContent: "center",
          }}
        >
          {icon}
        </ListItemIcon>
        <ListItemText
          sx={{ display: { xs: "block", sm: "none", md: "block" } }}
          primary={label}
        />
      </ListItemButton>
    );
    if (mode === "link") {
      return (
        <Link
          key={label}
          to={modeAction.href}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          {button}
        </Link>
      );
    }
    if (mode === "button") {
      return button
    }
  });
};

const setIsUserOnline = async (userId: string, isOnline: boolean) => {
  try {
    set(ref(realTimeDB, `${USERS_RT}/${userId}`), {
      isOnline,
      lastVisit: serverTimestamp(),
    });
  } catch (error) {
    console.log(error.message);
  }
};

function HomePage() {
  let user = useAuth();

  const [isOpenMobileDrawer, setIsOpenMobileDrawer] = useState(false);
  const [showMessageDrawer, setShowMessageDrawer] = useState(false);
  const [showFriendsDrawer, setShowFriendsDrawer] = useState(false);
  const [showAddNewPostModel, setShowAddNewPostModel] = useState(false);

  let [mode, toogleThemeMode] = useTheme();

  function toogleDrawerOpen()  {
    setIsOpenMobileDrawer((isOpen) => !isOpen);
  };
  function toogleShowAddNewPostModel() {
    setShowAddNewPostModel((isOpen) => !isOpen);
  };
  function toogleMessageDrawerOpen() {
    setShowMessageDrawer((isOpen) => !isOpen);
  };
  function toogleFriendsDrawerOpen() {
    setShowFriendsDrawer((isOpen) => !isOpen);
  };

  const signOutApp = () => {
    signOut(auth);
  };

  useEffect(() => {
    setIsUserOnline(user.uid, true);
    return () => {
      setIsUserOnline(user.uid, false);
    };
  }, []);

  const drawerListItems = [
    {
      mode: "button",
      label: "Main ",
      icon: <NewspaperIcon />,
      handleClick: toogleMessageDrawerOpen,
    },
    {
      mode: "button",
      label: "Add post",
      icon: <AddToPhotosOutlinedIcon />,
      handleClick: toogleShowAddNewPostModel,
    },
    {
      mode: "button",
      label: "Friends",
      icon: <GroupIcon />,
      handleClick: toogleFriendsDrawerOpen,
    },
    {
      mode: "button",
      label: "Message",
      icon: <EmailIcon />,
      handleClick: toogleMessageDrawerOpen,
    },
    { mode: "link", label: "Settings", icon: <TuneIcon />, href: "/settings" },
  ];

  const drawerInner = makeDrawerInner(drawerListItems);

  return (
    <Box sx={{ display: "flex" }}>
      <MobileAppBar toogleDrawerOpen={toogleDrawerOpen} />
      <AppDrawer
        open={isOpenMobileDrawer}
        onClose={toogleDrawerOpen}
        drawerInner={drawerInner}
        mode={mode}
        toogleThemeMode={toogleThemeMode}
        signOut={signOutApp}
        userInfo={user}
      />
      <MessageListDrawer
        open={showMessageDrawer}
        onClose={toogleMessageDrawerOpen}
      />
      <FriendsListDrawer
        open={showFriendsDrawer}
        onClose={toogleFriendsDrawerOpen}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
        }}
      >
        {showAddNewPostModel && (
          <DndProvider backend={HTML5Backend}>
            <NewPostModalWindow
              open={showAddNewPostModel}
              onClose={toogleShowAddNewPostModel}
            />
          </DndProvider>
        )}
        <Outlet />
      </Box>
    </Box>
  );
}

export { HomePage };
