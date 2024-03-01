import React, { ReactNode } from "react";
import {
  Divider,
  Fab,
  List,
  Typography,
  Drawer,
  useMediaQuery,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useTheme } from "@mui/material/styles";
import DrawerAppHeader from "./DrawerAppHeader";
import { ThemeSwitch } from "../CustomeElement/SwitchTheme";
import { UserAvatar } from "./DrawerUserAvatar";
import { User } from "firebase/auth";
import { Link } from "react-router-dom";

interface IAppDrawer {
  open: boolean;
  onClose: () => void;
  width: number;
  drawerInner: ReactNode;
  mode: string;
  toogleThemeMode: () => void;
  signOut: () => void;
  userInfo: User;
}

function AppDrawer({
  open,
  onClose,
  width,
  drawerInner,
  mode,
  toogleThemeMode,
  signOut,
  userInfo,
}: IAppDrawer) {
  
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.only("xs"));

  return (
    <>
    <Drawer
      variant={isXs ? "temporary" : "permanent"}
      open={isXs?open:true}
      onClose={isXs?onClose:undefined}
      sx={{
        width: isXs ? null : `${width}px`,
        "& .MuiDrawer-paper": {
          width: `${width}px`,
        },
      }}
    >
        <DrawerAppHeader>
          <Typography variant="h6" sx={{ mx: "auto" }}>
            <b>Chat Book</b>
          </Typography>
        </DrawerAppHeader>
        <Divider />
        <Fab sx={{ mx: "auto", my: 3 }}>
          <Link
            style={{ color: "inherit", textDecoration: "none" }}
            to={`/user/${userInfo.uid}`}
          >
            <UserAvatar
              style={{ width: "50px", height: "50px" }}
              photoURL={userInfo.photoURL}
              userName={userInfo.displayName || userInfo.email}
            />
          </Link>
        </Fab>
        <List>{drawerInner}</List>
        <ThemeSwitch
          sx={{ mx: "auto" }}
          checked={mode === "dark"}
          onChange={toogleThemeMode}
        />
        <Fab
          onClick={signOut}
          sx={{ mx: "auto", mt: "auto", mb: 2 }}
          color="secondary"
          variant="extended"
          size="small"
        >
          <LogoutIcon sx={{ mr: 1 }} />
          <Typography sx={{ display: { xs: "none",sm:'block' } }} variant="body2">
            Log out
          </Typography>
        </Fab>
      </Drawer>
    </>
  );
}

export { AppDrawer };
