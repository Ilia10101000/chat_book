import React,{ReactNode} from "react";
import {
  Box,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useContext, useState } from "react";
import EmailIcon from "@mui/icons-material/Email";
import GroupIcon from "@mui/icons-material/Group";
import TuneIcon from "@mui/icons-material/Tune";
import { Link, Outlet } from "react-router-dom";
import { auth } from "../../firebase/auth";
import { signOut } from "firebase/auth";
import { ModeToogleContext } from "../../theme";
import { useAuth } from "../../hooks/useAuth";
import { MobileDrawer } from "./MobileDrawer";
import { DesktopDrawer } from "./DesktopDrawer";
import { MobileAppBar } from "./AppBar";
import { MessageListDrawer } from "./MessageListDrawer";

const makeDrawerInner = (drawerListItems: any ) : ReactNode => {
  return drawerListItems.map(({ mode, label, icon, ...modeAction }) => {
    if (mode === "link") {
      return (
        <Link
          key={label}
          to={modeAction.href}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <ListItemButton
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
                mr: 3,
                justifyContent: "center",
              }}
            >
              {icon}
            </ListItemIcon>
            <ListItemText primary={label} />
          </ListItemButton>
        </Link>
      );
    }
    if (mode === "button") {
      return (
        <ListItemButton
          onClick={modeAction.handleClick}
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
              mr: 3,
              justifyContent: "center",
            }}
          >
            {icon}
          </ListItemIcon>
          <ListItemText primary={label} />
        </ListItemButton>
      );
    }
  });
};

const drawerWidth = 200;

function HomePage() {
  let user = useAuth();
  
  const [isOpenMobileDrawer, setIsOpenMobileDrawer] = useState(false);
  const [showMessageDrawer, setShowMessageDrawer] = useState(false)
  
  let [mode, toogleThemeMode] = useContext(ModeToogleContext)

  const toogleDrawerOpen = () => {
    setIsOpenMobileDrawer((isOpen) => !isOpen);
  };
  const toogleMessageDrawerOpen = () => {
    setShowMessageDrawer((isOpen) => !isOpen);
  };

  const signOutApp = () => {
    signOut(auth);
  }

  const drawerListItems = [
    { mode: "link", label: "Friends", icon: <GroupIcon />, href: "/friends" },
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
      <DesktopDrawer
        width={drawerWidth}
        drawerInner={drawerInner}
        mode={mode}
        toogleThemeMode={toogleThemeMode}
        signOut={signOutApp}
        userInfo={user.displayName || user.email}
      />
      <MobileDrawer
        open={isOpenMobileDrawer}
        onClose={toogleDrawerOpen}
        drawerInner={drawerInner}
        mode={mode}
        toogleThemeMode={toogleThemeMode}
        signOut={signOutApp}
        userInfo={user.displayName || user.email}
      />
      <MessageListDrawer
        open={showMessageDrawer}
        onClose={toogleMessageDrawerOpen}
        width={drawerWidth}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}

export {HomePage}