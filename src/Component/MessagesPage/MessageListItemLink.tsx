import React from "react";
import { ListItemButton, Paper } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import User from "../../img/default-user.svg";
import Skeleton from "@mui/material/Skeleton";
import { Link } from "react-router-dom";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { doc } from "firebase/firestore";
import { db } from "../../firebase/auth";
import { ref } from "firebase/database";
import { realTimeDB } from "../../firebase/auth";
import { useObjectVal } from "react-firebase-hooks/database";
import Badge from "@mui/material/Badge";
import {
  USERS_D,
  CHATS_D,
  USERS_RT,
  PRESENT,
} from "../../firebase_storage_path_constants/firebase_storage_path_constants";

type IisOnlineSnapShot = {
  isOnline: boolean;
};

function MessageListItemLink({
  onClose,
  companion,
  chatId,
  isHasNewMessage,
}: {
  onClose: () => void;
  companion: string;
  chatId: string;
  isHasNewMessage:boolean;
}) {
  const [isOnlineSnapShot, loading, error] = useObjectVal<IisOnlineSnapShot>(
    ref(realTimeDB, `${USERS_RT}/${companion}/${PRESENT}`)
  );
  const [user, loadingURL] = useDocumentData(
    doc(db, `${USERS_D}/${companion}`)
  );
  const [lastMessage, loadingLM] = useDocumentData(
    doc(db, `${CHATS_D}/${chatId}`)
  );
  const isOnline = isOnlineSnapShot?.isOnline;

  if (loadingLM || loadingURL) {
    return (
      <ListItem>
        <ListItemAvatar sx={{ mr: 2 }}>
          <Skeleton
            animation="wave"
            variant="circular"
            width={56}
            height={56}
          />
        </ListItemAvatar>
        <ListItemText
          primary={
            <Skeleton
              sx={{ height: 10, mb: "10px" }}
              animation="wave"
              variant="rectangular"
            />
          }
          secondary={
            <Skeleton
              sx={{ height: 8 }}
              animation="wave"
              variant="rectangular"
            />
          }
        />
      </ListItem>
    );
  }
  return (
    <div>
      <Link
        to={`/c/${chatId}`}
        state={user}
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <ListItemButton onClick={onClose} sx={{ p: 0, ...(isHasNewMessage && {backgroundColor:'rgba(255,255,255,0.1)'}) }}>
          <ListItem>
            <ListItemAvatar sx={{ mr: 2 }}>
              <Badge
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                color="primary"
                overlap="circular"
                badgeContent=" "
                invisible={!isOnline}
              >
                <Avatar
                  alt={user?.displayName || user?.email}
                  src={user?.photoURL || User}
                  sx={{ width: 56, height: 56 }}
                />
              </Badge>
            </ListItemAvatar>
            <ListItemText
              secondaryTypographyProps={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
              primaryTypographyProps={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
              primary={user?.displayName || user?.email}
              secondary={lastMessage?.lastMessage?.message}
            />
          </ListItem>
        </ListItemButton>
      </Link>
    </div>
  );
}

export { MessageListItemLink };
