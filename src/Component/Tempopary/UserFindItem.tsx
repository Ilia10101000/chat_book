import React from "react"
import { Box, Avatar } from "@mui/material";
import User from "../../img/default-user.svg";

interface IUserFindItem {
  img?: any,
  name:string
}

const UserFindItem = ({ img, name }: IUserFindItem) => {
  return (
    <Box
      sx={{
        display: "flex",
        border: "1px solid red",
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
    </Box>
  );
};

export {UserFindItem}