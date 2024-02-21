import React from "react"
import { Box, Avatar, Paper } from "@mui/material";
import User from "../../img/default-user.svg";
import { Link } from "react-router-dom";

interface IUserFindItem {
  photoURL: string | null,
  displayName: string,
  id:string
}

const Friend = ({ id, photoURL, displayName }: IUserFindItem) => {
  return (
    <Link style={{textDecoration:'none'}} to={`/user/${id}`}>
    <Paper
      elevation={20}
      sx={{
        display: "flex",
        maxWidth: "250px",
        p: 2,
        alignItems: "center",
        borderRadius: "10px",
        gap: "10px",
        textDecoration:'none'
      }}
    >
      <Avatar alt="user-avatar" src={photoURL || User} />
      <Box>{displayName}</Box>
    </Paper>
    </Link>
  );
};

export {Friend}