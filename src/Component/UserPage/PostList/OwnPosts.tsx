import React from "react";
import { Post } from "./Post";
import { ImageList } from "@mui/material";
import { DocumentData } from "firebase/firestore";

interface IOwnPosts {
  posts: DocumentData[];
}

function OwnPosts({ posts }: IOwnPosts) {
  return (
    <ImageList>
      {posts.map((post) => (
        <Post />
      ))}
    </ImageList>
  );
}

export { OwnPosts };
