import React, { ReactNode } from "react";
import {
  Box,
  Button,
  Divider,
  Fab,
  List,
  styled,
  Typography,
  Drawer,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import NightsStayIcon from "@mui/icons-material/NightsStay";

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

  const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
  }));

  return (
    <Drawer
      open={open}
      onClose={onClose}
      variant="temporary"
      sx={{
        display: { xs: "block", sm: "none" },
      }}
    >
      <DrawerHeader>
        <Typography variant="h6" sx={{ mx: "auto" }}>
          <b>Chat Book</b>
        </Typography>
      </DrawerHeader>
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
