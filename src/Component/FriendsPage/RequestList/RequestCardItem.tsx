import React from "react";
import { Avatar } from "@mui/material";
import {
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";
import User from "../../../img/default-user.svg";
import { useNavigate } from "react-router-dom";

function RequestCardItem({ friendUser, onClose, handleRequest, icon }) {

    const navigate = useNavigate();

    const handleViewUserProfile = () => {
        onClose();
        navigate(`user/${friendUser.id}`)
    }
  return (
    <ListItem sx={{ p: 0 }}>
      <IconButton onClick={handleViewUserProfile} sx={{ p: 0, mr: 2 }}>
        <ListItemAvatar>
          <Avatar
            alt={friendUser.displayName}
            src={friendUser.photoURL || User}
            sx={{ width: 56, height: 56 }}
          />
        </ListItemAvatar>
      </IconButton>
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
        primary={friendUser.displayName}
      />
      <IconButton onClick={() => handleRequest(friendUser)}>{icon}</IconButton>
    </ListItem>
  );
}

export { RequestCardItem };
