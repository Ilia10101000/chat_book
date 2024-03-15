import React, { ReactNode, useState } from "react";
import { Post } from "./Post";
import { ImageList, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { DocumentData } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

interface IOwnPosts {
  posts?: DocumentData[];
  ownerPostId?: string;
}

function CustomeImageList({ children }: { children: ReactNode }) {
  const theme = useTheme()
  const isXs = useMediaQuery(theme.breakpoints.only('xs'));
  return (
    <ImageList
      sx={{
        width: "100%",
        height: "100%",
      }}
      cols={isXs? 2 : 3}
      gap={9}
    >
      {children}
    </ImageList>
  );
}


function OwnPosts({ posts }: IOwnPosts) {

  const navigate = useNavigate();

  const handlePostClick = (ownerPostId: string, postId: string) => {
    navigate(`o/${ownerPostId}/p/${postId}`);
  };

  return (
    <CustomeImageList>
      {posts.map((post) => (
        <Post key={post.id} post={post} handleSelect={handlePostClick} />
      ))}
    </CustomeImageList>
  );
}

export { OwnPosts };
