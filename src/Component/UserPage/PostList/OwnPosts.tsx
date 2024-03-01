import React from "react";
import { Post } from "./Post";
import { ImageList } from "@mui/material";
import { DocumentData } from "firebase/firestore";


interface IOwnPosts {
  posts: DocumentData[];
}

function OwnPosts({ posts }: IOwnPosts) {

  return (
      <ImageList sx={{ width: '100%', height: "100%", border:'1px solid red' }} cols={3}>
        {posts.map((post) => (
          <Post
            key={post.id}
            id={post.id}
            text={post.text}
            imageURL={post.imageURL}
          />
        ))}
      </ImageList>
  );
}

export { OwnPosts };
