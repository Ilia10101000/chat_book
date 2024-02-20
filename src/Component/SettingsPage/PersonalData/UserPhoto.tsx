import React from 'react';
import { Badge, IconButton } from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

function UserPhoto({photoURL, handleClick}) {
  return (
    <Badge
      badgeContent={
        <IconButton onClick={handleClick} color="warning">
          <DeleteForeverIcon fontSize="small" />
        </IconButton>
      }
    >
      <img
        style={{
          width: "200px",
          height: "200px",
          borderRadius: "50%",
        }}
        src={photoURL}
        alt="avatar"
      />
    </Badge>
  );
}

export {UserPhoto}