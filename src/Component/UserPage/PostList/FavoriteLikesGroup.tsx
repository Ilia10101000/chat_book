import { doc } from "firebase/firestore";
import React from "react";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { db } from "../../../firebase/auth";
import { USERS_D } from "../../../firebase_storage_path_constants/firebase_storage_path_constants";
import {
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { UserAvatar } from "../../Drawer/DrawerUserAvatar";
import { Link } from "react-router-dom";

function FavoriteLikesGroupItem({
  userId,
  expanded,
}: {
  userId: string;
  expanded?: boolean;
}) {
  const [user, loading, error] = useDocumentData(
    doc(db, `${USERS_D}/${userId}`)
  );
  if (loading) {
    return <Avatar />;
  }
  if (expanded) {
    return (
      <Link
        style={{ textDecoration: "none", color: "inherit" }}
        to={`/u/${user.id}`}
      >
        <ListItemButton sx={{ p: 0 }}>
          <ListItem>
            <ListItemAvatar>
              <UserAvatar
                userName={user.displayName}
                photoURL={user.photoURL}
              />
            </ListItemAvatar>
            <ListItemText primaryTypographyProps={{ maxWidth: '260px', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden'}} primary={user.displayName} />
          </ListItem>
        </ListItemButton>
      </Link>
    );
  }
  return <UserAvatar userName={user.displayName} photoURL={user.photoURL} />;
}

export { FavoriteLikesGroupItem };
