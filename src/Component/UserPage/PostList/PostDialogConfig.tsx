import React, { useState } from "react";
import {
  Dialog,
  IconButton,
  List,
  ListItem,
  ListItemButton,
} from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

interface IPostDialogConfig {
  isShownComments: boolean;
  handleShowComments: (value: boolean) => void;
  handleDeletePost: () => void;
}

function PostDialogConfig({
  isShownComments,
  handleShowComments,
  handleDeletePost,
}: IPostDialogConfig) {
  const [showDialog, setShowDialog] = useState(false);

  const handleClose = () => {
    setShowDialog(false);
  };
  const handleOpen = () => {
    setShowDialog(true);
  };

  const toogleVisibleComments = () => {
    handleShowComments(isShownComments ? false : true);
    handleClose();
  };
  return (
    <>
      <IconButton onClick={handleOpen}>
        <MoreHorizIcon />
      </IconButton>
      <Dialog open={showDialog} onClose={handleClose}>
        <List sx={{ p: 0 }}>
          <ListItem sx={{ p: 0 }}>
            <ListItemButton
              onClick={handleDeletePost}
              sx={{ color: "#ff0000" }}
            >
              Delete post
            </ListItemButton>
          </ListItem>
          <ListItem sx={{ p: 0 }}>
            <ListItemButton onClick={toogleVisibleComments}>
              {isShownComments ? "Hide" : "Show"} comments
            </ListItemButton>
          </ListItem>
        </List>
      </Dialog>
    </>
  );
}

export { PostDialogConfig };
