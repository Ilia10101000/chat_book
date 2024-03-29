import React, { ReactNode } from "react";
import {
  Divider,
  Fab,
  List,
  Typography,
  Drawer,
  Avatar
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import DrawerAppHeader from "./DrawerAppHeader";
import { ThemeSwitch } from "../CustomeElement/SwitchTheme";
import { UserAvatar } from "./DrawerUserAvatar";
import { User } from "firebase/auth";
import { Link } from "react-router-dom";
import BrandIcon from '../../img/pngwing.com.png'
import { SwitchLanguage } from "../CustomeElement/SwitchLanguage";

interface IAppDrawer {
  drawerInner: ReactNode;
  mode: string;
  toogleThemeMode: () => void;
  signOut: () => void;
  userInfo: User;
  logout:string;
}

function AppDrawer({
  drawerInner,
  mode,
  toogleThemeMode,
  signOut,
  userInfo,
  logout,
}: IAppDrawer) {
  return (
    <Drawer
      variant={"permanent"}
      sx={{
        display: { xs: "none", sm: "block" },
        width: { xs: "200px", sm: "65px", md: "200px" },
        "& .MuiDrawer-paper": {
          width: { xs: "200px", sm: "65px", md: "200px" },
          transition: (theme) =>
            theme.transitions.create("width", {
              easing: theme.transitions.easing.easeIn,
              duration: theme.transitions.duration.leavingScreen,
            }),
        },
      }}
    >
      <DrawerAppHeader>
        <Typography
          variant="h6"
          sx={{
            ml: { xs: 3, sm: 0, md: 3 },
            display: { xs: "block", sm: "none", md: "block" },
            whiteSpace: "nowrap",
          }}
        >
          <b>ChatBook</b>
        </Typography>
        <Avatar
          sx={{
            mx: { xs: "auto", sm: "auto", md: "none" },
            width: "60px",
            height: "60px",
            filter: mode === "dark" ? "invert(100%)" : "",
            userSelect: "none",
          }}
          src={BrandIcon}
        />
      </DrawerAppHeader>
      <Divider />
      <Fab
        sx={{
          mx: "auto",
          my: 3,
          width: { xs: "56px", sm: "50px", md: "56px" },
          height: { xs: "56px", sm: "50px", md: "56px" },
        }}
      >
        <Link
          style={{ color: "inherit", textDecoration: "none" }}
          to={`/u/${userInfo.uid}`}
        >
          <UserAvatar
            style={{
              width: { xs: "50px", sm: "45px", md: "50px" },
              height: { xs: "50px", sm: "45px", md: "50px" },
            }}
            photoURL={userInfo.photoURL}
            userName={userInfo.displayName}
          />
        </Link>
      </Fab>
      <List>{drawerInner}</List>
      <ThemeSwitch
        sx={{ mx: "auto", mt: 3 }}
        checked={mode === "dark"}
        onChange={toogleThemeMode}
      />
      <SwitchLanguage sx={{mx:'auto', mt:3}} />
      <Fab
        onClick={signOut}
        sx={{ mx: "auto", mt: "auto", mb: 2 }}
        color="secondary"
        variant="extended"
        size="small"
      >
        <LogoutIcon sx={{ mr: { xs: 0, sm: 0, md: 1 } }} />
        <Typography
          sx={{ display: { xs: "none", sm: "none", md: "block" } }}
          variant="body2"
        >
          {logout}
        </Typography>
      </Fab>
    </Drawer>
  );
}

export { AppDrawer };
