import React from "react";
import {
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import AppBar from "@mui/material/AppBar";
import MenuIcon from "@mui/icons-material/Menu";

function MobileAppBar({ toogleDrawerOpen }) {
  return (
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
  );
}

export { MobileAppBar };
