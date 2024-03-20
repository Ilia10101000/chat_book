import React, { useState } from 'react';
import {
  AppBar,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
  SpeedDial,
  SpeedDialAction,
  Toolbar,
} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import { useObjectVal } from "react-firebase-hooks/database";
import { ref } from "firebase/database";
import { realTimeDB } from "../../firebase/auth";
import User from "../../img/default-user.svg";
import { Link } from 'react-router-dom';
import { USERS_RT } from '../../firebase_storage_path_constants/firebase_storage_path_constants';
import { Delete, MoreVert } from '@mui/icons-material';

type IMessageAppBar = {
  companion: { [key: string]: string };
  isTyping: boolean;
  deleteChat:() => void;
};


function MessageAppBar({ companion, isTyping, deleteChat }: IMessageAppBar) {
  const [showConfirmDeleteChat, setShowConfirmDeleteChat] = useState(false);

  const [isOnlineSnapShot, loading, error] = useObjectVal<{
    isOnline: boolean;
  }>(ref(realTimeDB, `${USERS_RT}/${companion.id}`));

  const isOnline = isOnlineSnapShot?.isOnline;

  return (
    <AppBar
      sx={{
        "& .MuiToolbar-root": {
          minHeight: "61px",
        },
      }}
      position="relative"
    >
      <Toolbar>
        <ListItem sx={{ p: 0 }}>
          <ListItemAvatar sx={{ mr: 2 }}>
            <Link to={`/u/${companion.id}`}>
              <IconButton sx={{ p: 0 }}>
                <Avatar
                  alt={companion.displayName || companion.email}
                  src={companion.photoURL || User}
                  sx={{ width: 56, height: 56 }}
                />
              </IconButton>
            </Link>
          </ListItemAvatar>
          <ListItemText
            secondaryTypographyProps={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
            primary={companion.displayName || companion.email}
            secondary={isTyping ? "Typing..." : isOnline ? "online" : null}
          />
        </ListItem>
        <SpeedDial
          sx={{
            "& .MuiSpeedDial-fab": {
              minHeight: "20px",
              width: "35px",
              height: "35px",
            },
          }}
          icon={<MoreVert />}
          ariaLabel="delete-chat"
          direction="left"
        >
          <SpeedDialAction
            onClick={() => setShowConfirmDeleteChat(true)}
            tooltipTitle={"Delete chat"}
            icon={<Delete />}
          />
        </SpeedDial>
      </Toolbar>
      <Dialog open={showConfirmDeleteChat}>
        <DialogTitle>Delete chat?</DialogTitle>
        <DialogActions>
          <Button
            variant="contained"
            onClick={() => setShowConfirmDeleteChat(false)}
          >
            Cancel
          </Button>
          <Button onClick={deleteChat} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </AppBar>
  );
}

export {MessageAppBar}