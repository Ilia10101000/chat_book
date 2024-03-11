import React, { ReactNode, useState } from "react";
import {
  Backdrop,
  Box,
  Fab,
  SpeedDial,
  SpeedDialAction,
  Stack,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { User } from "firebase/auth";
import LightModeIcon from "@mui/icons-material/LightMode";
import NightsStayIcon from "@mui/icons-material/NightsStay";
import { UserAvatar } from "./DrawerUserAvatar";
import { Link } from "react-router-dom";

function MobileDrawer({
  drawerInner,
  mode,
  signOut,
  toogleThemeMode,
  userInfo,
}: {
  drawerInner: ReactNode;
  mode: string;
  signOut: () => void;
  toogleThemeMode: () => void;
  userInfo: User;
}) {
  const [openSpeedDial, setOpenSpeedDial] = useState(false);
  const toogleOpenSpeedDial = () => {
    setOpenSpeedDial((value) => !value);
  };
  return (
    <Box
      sx={{
        display: { xs: "flex", sm: "none" },
        justifyContent: "center",
        backgroundColor: "background.paper",
        width: "100%",
        mt: "auto",
        flexShrink: 0,
      }}
    >
      <Stack
        direction="row"
        sx={{ paddingY: "4px", alignItems: "center" }}
        spacing={1.5}
      >
        <Fab sx={{ width: "43px", height: "43px" }}>
          <Link
            style={{ color: "inherit", textDecoration: "none" }}
            to={`u/${userInfo.uid}`}
          >
            <UserAvatar
              userName={userInfo.displayName}
              photoURL={userInfo.photoURL}
            />
          </Link>
        </Fab>
        <Stack direction="row" sx={{ paddingY: "4px" }} spacing={1.5}>
          {drawerInner}
        </Stack>
        <Box
          sx={{
            position: "relative",
            width: "40px",
            height: "40px",
            boxSizing: "border-box",
            borderRadius: "50%",
            // backgroundColor: "text.secondary",
          }}
        >
          <Backdrop open={openSpeedDial} />
          <SpeedDial
            sx={{
              position: "absolute",
              bottom: "0px",
              right: "-8px",
              transform: "translate(0%,0%)",
              "& .MuiSpeedDial-fab": {
                minHeight: "20px",
                width: "40px",
                height: "40px",
                backgroundColor: "text.secondary",
              },
            }}
            direction="up"
            open={openSpeedDial}
            onClick={toogleOpenSpeedDial}
            icon={<MoreVertIcon sx={{ fontSize: "18px" }} />}
            ariaLabel="SpeedDial toogle theme & signout"
          >
            <SpeedDialAction
              onClick={toogleThemeMode}
              icon={mode === "dark" ? <NightsStayIcon /> : <LightModeIcon />}
            />
            <SpeedDialAction onClick={signOut} icon={<LogoutIcon />} />
          </SpeedDial>
        </Box>
      </Stack>
    </Box>
  );
}

export { MobileDrawer };
