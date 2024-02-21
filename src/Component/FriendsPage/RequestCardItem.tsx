import React from "react";
import { Avatar, Box, ListItemButton, Button } from "@mui/material";
import {
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import User from "../../img/default-user.svg";
import { useNavigate } from "react-router-dom";

function RequestCardItem({ id, displayName, photoURL, onClose }) {

    const navigate = useNavigate();

    const handleViewUserProfile = () => {
        onClose();
        navigate(`user/${id}`)
    }
  return (
    <ListItem sx={{ p: 0 }}>
      <IconButton onClick={handleViewUserProfile} sx={{ p: 0, mr: 2 }}>
        <ListItemAvatar>
          <Avatar
            alt={displayName}
            src={photoURL || User}
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
        primary={displayName}
      />
      <IconButton>
        <PersonAddAlt1Icon fontSize="small" />
      </IconButton>
    </ListItem>
  );
}

export { RequestCardItem };
