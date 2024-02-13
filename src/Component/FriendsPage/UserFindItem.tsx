import React from "react"
import { Box, Avatar, Paper } from "@mui/material";
import User from "../../img/default-user.svg";
import { Link } from "react-router-dom";

interface IUserFindItem {
  img: string | null,
  name: string,
  id:string
}

const UserFindItem = ({ id, img, name }: IUserFindItem) => {
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
      <Avatar alt="user-avatar" src={img || User} />
      <Box>{name}</Box>
    </Paper>
    </Link>
  );
};

export {UserFindItem}