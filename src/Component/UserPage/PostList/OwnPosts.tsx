import React, { useState } from "react";
import { Post } from "./Post";
import { ImageList } from "@mui/material";
import { DocumentData } from "firebase/firestore";
import { PostModalWindow } from "./PostModalWindow";
import { useNavigate } from "react-router-dom";

type IUser = {
  id: string;
  photoURL: string;
  email: string;
  displayName: string;
};
interface IOwnPosts {
  posts: DocumentData[];
  user: IUser;
}

function OwnPosts({ posts, user }: IOwnPosts) {

  const navigate = useNavigate();

  const handlePostClick = (postId: string) => {
    navigate(`post/${postId}`)
  }

  return (
    <>
      <ImageList
        sx={{
          width: "100%",
          height: "100%",
        }}
        cols={3}
        gap={9}
      >
        {posts.map((post) => (
          <Post key={post.id} post={post} handleSelect={handlePostClick} />
        ))}
      </ImageList>
    </>
  );
}

export { OwnPosts };
