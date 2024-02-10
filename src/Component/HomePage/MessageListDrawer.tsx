import React from "react";
import { Box, Divider, List, styled, Typography, Drawer } from "@mui/material";

function MessageListDrawer({ open, onClose, width }) {
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
        width: `${width}px`,
        "& .MuiDrawer-paper": {
          width: `${width}px`,
        },
      }}
    >
      <DrawerHeader>
        <Typography variant="h6" sx={{ mx: "auto" }}>
          <b>Message</b>
        </Typography>
      </DrawerHeader>
      <Divider />
      <Box sx={{ my: 3, textAlign: "center", whiteSpace: "collapse" }}>
        4000$
      </Box>
      <List>7000$</List>
    </Drawer>
  );
}

export { MessageListDrawer };
