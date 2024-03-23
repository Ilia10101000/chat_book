import React, { useState } from "react";
import {
  Dialog,
  IconButton,
  List,
  ListItem,
  ListItemButton,
} from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { useTranslation } from "react-i18next";

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
  const {t} = useTranslation()

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
              {t("userPage.deletePost")}
            </ListItemButton>
          </ListItem>
          <ListItem sx={{ p: 0 }}>
            <ListItemButton onClick={toogleVisibleComments}>
              {isShownComments
                ? t("imageModal.hideComment")
                : t("imageModal.showComment")}
            </ListItemButton>
          </ListItem>
        </List>
      </Dialog>
    </>
  );
}

export { PostDialogConfig };
