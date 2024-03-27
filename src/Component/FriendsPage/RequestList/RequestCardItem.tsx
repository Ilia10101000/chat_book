import React from "react";
import { Avatar } from "@mui/material";
import {
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { UserAvatar } from "../../Drawer/DrawerUserAvatar";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { doc } from "firebase/firestore";
import { db } from "../../../firebase/auth";
import { USERS_D } from "../../../firebase_storage_path_constants/firebase_storage_path_constants";
import { UserRequestSkeleton } from "../../CustomeElement/UserItemListSkeleton";

function RequestCardItem({ userId, onClose, handleRequest, icon }) {
  const [user, loadingU, errorU] = useDocumentData(
    doc(db, `${USERS_D}/${userId}`)
  );

  const navigate = useNavigate();

  const handleViewUserProfile = () => {
    onClose();
    navigate(`u/${userId}`, { replace: true });
  };

  if (loadingU) {
    return <UserRequestSkeleton/>;
  }
  return (
    <ListItem sx={{ p: 0 }}>
      <ListItemAvatar>
        <IconButton onClick={handleViewUserProfile}>
          <UserAvatar userName={user?.displayName} photoURL={user?.photoURL} />
        </IconButton>
      </ListItemAvatar>
      <ListItemText
        primaryTypographyProps={{
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
        primary={user?.displayName}
      />
      <IconButton onClick={() => handleRequest(userId)}>{icon}</IconButton>
    </ListItem>
  );
}

export { RequestCardItem };
