import React, { ReactNode, createContext, useContext, useEffect } from "react";
import {
  Badge,
  Box,
  IconButton,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useState } from "react";
import EmailIcon from "@mui/icons-material/Email";
import GroupIcon from "@mui/icons-material/Group";
import TuneIcon from "@mui/icons-material/Tune";
import AddToPhotosOutlinedIcon from "@mui/icons-material/AddToPhotosOutlined";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { auth, realTimeDB } from "../../firebase/auth";
import { signOut } from "firebase/auth";
import { serverTimestamp } from "firebase/database";
import { ref, set } from "firebase/database";
import { useTheme } from "../../theme";
import { AppDrawer } from "../Drawer/AppDrawer";
import { MessageListDrawer } from "../MessagesPage/MessageListDrawer";
import { FriendsListDrawer } from "../FriendsPage/riendsListDrawer";
import { PRESENT, RECEIVED_FRIENDS_REQUESTS, RECEIVED_NEW_MESSAGES, USERS_RT } from "../../firebase_storage_path_constants/firebase_storage_path_constants";
import { NewImageModalWindow } from "../UserPage/PostList/AddNewPost/NewImageModalWindow";
import { EditorNewPost } from "../UserPage/PostList/AddNewPost/EditorNewPost";
import { MobileDrawer } from "../Drawer/MobileDrawer";
import { useObjectVal } from "react-firebase-hooks/database";
import { useAuth } from "../../App";
import { useTranslation } from "react-i18next";

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
          boxSizing: "border-box",
          overflowX: "hidden",
          whiteSpace: "nowrap",
        }}
      >
        <ListItemIcon
          sx={{
            minWidth: 0,
            mr: 3,
            justifyContent: "center",
          }}
        >
          {icon}
        </ListItemIcon>
        <ListItemText
          sx={{
            display: { xs: "block", sm: "none", md: "block" },
            transition: (theme) =>
              theme.transitions.create("display", {
                easing: theme.transitions.easing.easeIn,
                duration: theme.transitions.duration.leavingScreen,
              }),
          }}
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
      return button;
    }
  });
};
const makeMobileDrawerInner = (drawerListItems: any): ReactNode => {
  return drawerListItems.map(({ mode, label, icon, ...modeAction }) => {
    let button = (
      <IconButton
        onClick={mode === "button" ? modeAction.handleClick : undefined}
        key={label}
      >
        {icon}
      </IconButton>
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
      return button;
    }
  });
};

const setIsUserOnline = async (userId: string, isOnline: boolean) => {
  try {
    set(ref(realTimeDB, `${USERS_RT}/${userId}/${PRESENT}`), {
      isOnline,
      lastVisit: serverTimestamp(),
    });
  } catch (error) {
    console.log(error.message);
  }
};

const HomeContext = createContext(null);

const useHomeContext = () => {
  return useContext(HomeContext);
};

function HomePage() {
  let user = useAuth();

  const [userEventsSnapshot, loading, error] = useObjectVal<{
    [RECEIVED_NEW_MESSAGES]:{[key:string]:boolean},
    [RECEIVED_FRIENDS_REQUESTS]:{[key:string]:boolean},
  }>(ref(realTimeDB, `${USERS_RT}/${user.uid}`));

  const location = useLocation();
  const navigate = useNavigate();
  const {t} = useTranslation()

  const [showMessageDrawer, setShowMessageDrawer] = useState(false);
  const [showFriendsDrawer, setShowFriendsDrawer] = useState(false);
  const [showAddNewPostModel, setShowAddNewPostModel] = useState(false);

  let { mode, toogleThemeMode } = useTheme();

  function toogleShowAddNewPostModel() {
    setShowAddNewPostModel((isOpen) => !isOpen);
  }
  function toogleMessageDrawerOpen() {
    setShowMessageDrawer((isOpen) => !isOpen);
  }
  function toogleFriendsDrawerOpen() {
    setShowFriendsDrawer((isOpen) => !isOpen);
  }

  const signOutApp = () => {
    signOut(auth);
  };

  useEffect(() => {
    setIsUserOnline(user.uid, true);
    window.addEventListener('beforeunload', () => setIsUserOnline(user.uid, false))
    return () => {
      setIsUserOnline(user.uid, false);
      window.removeEventListener("beforeunload", () =>
        setIsUserOnline(user.uid, false)
      );
    };
  }, []);
  useEffect(() => {
    if (location.pathname === "/") {
      navigate(`u/${user.uid}`, { replace: true });
    }
  }, [location.pathname]);

  const receivedMessagesChatIdList = userEventsSnapshot?.[RECEIVED_NEW_MESSAGES]
    ? Object.keys(userEventsSnapshot[RECEIVED_NEW_MESSAGES]).filter(
        (chatId) => userEventsSnapshot[RECEIVED_NEW_MESSAGES][chatId] === true
      )
    : null;
  const receivedNewFriendsRequests = userEventsSnapshot?.[RECEIVED_FRIENDS_REQUESTS]
    ? Object.keys(userEventsSnapshot[RECEIVED_FRIENDS_REQUESTS]).filter(
        (userId) => userEventsSnapshot[RECEIVED_FRIENDS_REQUESTS][userId] === true
      )
    : null;

  const drawerListItems = [
    {
      mode: "link",
      label: t("drawerInner.news"),
      icon: <NewspaperIcon />,
      href: "/news",
    },
    {
      mode: "button",
      label: t("drawerInner.post"),
      icon: <AddToPhotosOutlinedIcon />,
      handleClick: toogleShowAddNewPostModel,
    },
    {
      mode: "button",
      label: t("drawerInner.friends"),
      icon: receivedNewFriendsRequests ? (
        <Badge
          color="secondary"
          badgeContent={receivedNewFriendsRequests.length}
          max={10}
        >
          <GroupIcon />
        </Badge>
      ) : (
        <GroupIcon />
      ),
      handleClick: toogleFriendsDrawerOpen,
    },
    {
      mode: "button",
      label: t("drawerInner.messages"),
      icon: receivedMessagesChatIdList ? (
        <Badge
          color="secondary"
          badgeContent={receivedMessagesChatIdList.length}
          max={10}
        >
          <EmailIcon />
        </Badge>
      ) : (
        <EmailIcon />
      ),
      handleClick: toogleMessageDrawerOpen,
    },
    {
      mode: "link",
      label: t("drawerInner.settings"),
      icon: <TuneIcon />,
      href: "/settings",
    },
  ];

  const drawerInner = makeDrawerInner(drawerListItems);
  const mobileDrawerInner = makeMobileDrawerInner(drawerListItems);
  return (
    <HomeContext.Provider
      value={{
        toogleFriendsDrawerOpen,
        newReceivedMessages: userEventsSnapshot?.[RECEIVED_NEW_MESSAGES],
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          height: "100%",
          width: "100%",
          overflow: "hidden",
        }}
      >
        <AppDrawer
          logout={t("drawerInner.logout")}
          drawerInner={drawerInner}
          mode={mode}
          toogleThemeMode={toogleThemeMode}
          signOut={signOutApp}
          userInfo={user}
        />
        <MessageListDrawer
          open={showMessageDrawer}
          onClose={toogleMessageDrawerOpen}
          receivedNewMessages={receivedMessagesChatIdList}
        />
        <FriendsListDrawer
          open={showFriendsDrawer}
          onClose={toogleFriendsDrawerOpen}
          receivedNewFriendsRequsts={receivedNewFriendsRequests}
        />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            overflowY: "scroll",
            transition: (theme) =>
              theme.transitions.create("width", {
                easing: theme.transitions.easing.easeIn,
                duration: theme.transitions.duration.leavingScreen,
              }),
          }}
        >
          <NewImageModalWindow
            open={showAddNewPostModel}
            onClose={toogleShowAddNewPostModel}
          >
            <EditorNewPost />
          </NewImageModalWindow>
          <Outlet />
        </Box>
        <MobileDrawer
          signOut={signOutApp}
          mode={mode}
          toogleThemeMode={toogleThemeMode}
          drawerInner={mobileDrawerInner}
          userInfo={user}
        />
      </Box>
    </HomeContext.Provider>
  );
}

export { HomePage, useHomeContext };
