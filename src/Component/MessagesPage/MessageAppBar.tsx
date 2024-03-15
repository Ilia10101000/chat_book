import React from 'react';
import {
  AppBar,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Toolbar,
} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import { useObjectVal } from "react-firebase-hooks/database";
import { ref } from "firebase/database";
import { realTimeDB } from "../../firebase/auth";
import User from "../../img/default-user.svg";
import { Link } from 'react-router-dom';
import { USERS_RT } from '../../firebase_storage_path_constants/firebase_storage_path_constants';

type IisOnlineSnapShot = {
  isOnline: boolean;
};


function MessageAppBar({ companion }) {
  const [isOnlineSnapShot, loading, error] = useObjectVal<IisOnlineSnapShot>(
    ref(realTimeDB, `${USERS_RT}/${companion.id}`));
  
  const isOnline = isOnlineSnapShot?.isOnline;

  return (
    <AppBar position="relative">
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
            secondary={isOnline ? "online" : null}
          />
        </ListItem>
      </Toolbar>
    </AppBar>
  );
}

export {MessageAppBar}