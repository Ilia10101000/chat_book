import React from "react";
import {
  Box,
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemButton,
} from "@mui/material";
import User from "../../../img/default-user.svg";
import { Link } from "react-router-dom";

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
          <Avatar
            alt={displayName}
            src={photoURL || User}
            sx={{ width: 56, height: 56 }}
          />
        </ListItemAvatar>
        <ListItemText
          secondaryTypographyProps={{
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
