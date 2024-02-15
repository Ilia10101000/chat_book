import React, { ReactNode } from "react";
import {
  Box,
  Button,
  Divider,
  Fab,
  List,
  Typography,
  Drawer,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import NightsStayIcon from "@mui/icons-material/NightsStay";
import DrawerAppHeader from "./DrawerAppHeader";

interface IMobileDrawer {
  open: boolean;
  onClose: () => void;
  drawerInner: ReactNode;
  mode: string;
  toogleThemeMode: () => void;
  signOut: () => void;
  userInfo: string;
}

function MobileDrawer({
  open,
  onClose,
  drawerInner,
  mode,
  toogleThemeMode,
  signOut,
  userInfo,
}: IMobileDrawer) {

  return (
    <Drawer
      open={open}
      onClose={onClose}
      variant="temporary"
      sx={{
        display: { xs: "block", sm: "none" },
      }}
    >
      <DrawerAppHeader>
        <Typography variant="h6" sx={{ mx: "auto" }}>
          <b>Chat Book</b>
        </Typography>
      </DrawerAppHeader>
      <Divider />
      <Box sx={{ my: 3, textAlign: "center", whiteSpace: "collapse" }}>
        {userInfo}
      </Box>
      <List>{drawerInner}</List>
      <Button onClick={toogleThemeMode} sx={{ mx: "auto" }}>
        {mode === "light" ? (
          <NightsStayIcon fontSize="large" />
        ) : (
          <WbSunnyIcon fontSize="large" />
        )}
      </Button>
      <Fab
        onClick={signOut}
        sx={{ mx: "auto", mt: "auto", mb: 2 }}
        color="secondary"
        size="small"
      >
        <LogoutIcon />
      </Fab>
    </Drawer>
  );
}

export { MobileDrawer };
