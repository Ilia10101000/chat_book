import React from "react";
import {
  Box,
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemButton,
} from "@mui/material";
import { UserAvatar } from "../../Drawer/DrawerUserAvatar";

interface IUserFindItem {
  photoURL: string | null;
  handleClick: (id:string) => void;
  displayName: string;
  id: string;
}

const Friend = ({ id, photoURL, displayName, handleClick }: IUserFindItem) => {
  return (
    <ListItemButton sx={{p:0}} onClick={() => handleClick(id)}>
      <ListItem>
        <ListItemAvatar sx={{ mr: 2 }}>
          <UserAvatar userName={displayName} photoURL={photoURL} />
        </ListItemAvatar>
        <ListItemText
          primaryTypographyProps={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
          primary={displayName}
        />
      </ListItem>
    </ListItemButton>
  );
};

export { Friend };
