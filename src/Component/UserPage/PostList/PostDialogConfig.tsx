import React, { useState } from "react";
import {
  Dialog,
  IconButton,
  List,
  ListItem,
    ListItemButton,
  Button
} from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

function PostDialogConfig() {
  const [showDialog, setShowDialog] = useState(false);

  const handleClose = () => {
    setShowDialog(false);
  };
  const handleOpen = () => {
    setShowDialog(true);
  };
  return (
    <>
      <IconButton onClick={handleOpen}>
        <MoreHorizIcon />
      </IconButton>
      <Dialog open={showDialog} onClose={handleClose}>
        <List sx={{ p: 0 }}>
          <ListItem sx={{ p: 0, }}>
            <ListItemButton sx={{ color: "#ff0000" }}>
              Remove post
            </ListItemButton>
          </ListItem>
          <ListItem sx={{ p: 0, }}>
            <ListItemButton>Hide comments</ListItemButton>
          </ListItem>
        </List>
      </Dialog>
    </>
  );
}

export { PostDialogConfig };
