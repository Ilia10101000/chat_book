import React from "react";
import {
  Box,
  Button,
  Divider,
  Fab,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  styled,
} from "@mui/material";
import Drawer from "@mui/material/Drawer";
import { useContext, useState } from "react";
import AppBar from "@mui/material/AppBar";
import EmailIcon from "@mui/icons-material/Email";
import MenuIcon from "@mui/icons-material/Menu";
import GroupIcon from "@mui/icons-material/Group";
import TuneIcon from "@mui/icons-material/Tune";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import NightsStayIcon from "@mui/icons-material/NightsStay";
import { Link, Outlet } from "react-router-dom";
import { auth } from "../../firebase/auth";
import { signOut } from "firebase/auth";
import { ModeToogleContext } from "../../theme";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAuth } from "../../hooks/useAuth";

const drawerListItems = [
  { label: "Friends", icon: <GroupIcon />, href: "/friends" },
  { label: "Message", icon: <EmailIcon />, href: "/message" },
  { label: "Settings", icon: <TuneIcon />, href: "/settings" },
];

const drawerInner = drawerListItems.map(({ label, icon, href }) => (
  <Link
    key={label}
    to={href}
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
));

const drawerWidth = 200;

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

function HomePage() {
  const [open, setOpen] = useState(false);

  let user = useAuth();
  let [mode, toogleThemeMode] = useContext(ModeToogleContext)

  const toogleDrawerOpen = () => {
    setOpen((isOpen) => !isOpen);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar position="fixed" sx={{ display: { xs: "block", sm: "none" } }}>
        <Toolbar>
          <IconButton
            color="inherit"
            onClick={toogleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              display: { xs: "block", sm: "none" },
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6">Custome Bar</Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          width: `${drawerWidth}px`,
          "& .MuiDrawer-paper": {
            width: `${drawerWidth}px`,
          },
        }}
      >
        <DrawerHeader>
          <Typography variant="h6" sx={{ mx: "auto" }}>
            <b>Chat Book</b>
          </Typography>
        </DrawerHeader>
        <Divider />
        <Box sx={{ my: 3, textAlign: "center", whiteSpace: "collapse" }}>
          {user.displayName || user.email}
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
          onClick={() => signOut(auth)}
          sx={{ mx: "auto", mt: "auto", mb: 2 }}
          color="secondary"
          variant="extended"
          size="small"
        >
          <LogoutIcon sx={{ mr: 1 }} />
          Log out
        </Fab>
      </Drawer>
      <Drawer
        open={open}
        onClose={toogleDrawerOpen}
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
          {user.displayName || user.email}
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
          onClick={() => signOut(auth)}
          sx={{ mx: "auto", mt: "auto", mb: 2 }}
          color="secondary"
          size="small"
        >
          <LogoutIcon />
        </Fab>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}

export {HomePage}