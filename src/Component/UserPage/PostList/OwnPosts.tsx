import React, { useState } from "react";
import { Post } from "./Post";
import { ImageList } from "@mui/material";
import { DocumentData } from "firebase/firestore";
import { doc, deleteDoc } from "firebase/firestore";
import { db, ref, storage } from "../../../firebase/auth";
import { deleteObject } from "firebase/storage";
import {
  POSTS,
  USERS_D,
} from "../../../firebase_storage_path_constants/firebase_storage_path_constants";
import { PostModalWindow } from "./PostModalWindow";

interface IOwnPosts {
  posts: DocumentData[];
  userId: string;
}

function OwnPosts({ posts, userId }: IOwnPosts) {
  const [selectedPost, setSelectedPost] = useState(null);

  const deletePicture = async (imageId: string) => {
    try {
      await deleteDoc(doc(db, `${USERS_D}/${userId}/${POSTS}`, imageId));
      await deleteObject(ref(storage, `${POSTS}/${userId}/${imageId}`));
    } catch (error) {
      console.log(error.message);
    }
  };
  const handleCloseModal = () => {
    setSelectedPost(null);
  };

  const handleSelectPost = (post) => {
    setSelectedPost(post);
  };
  return (
    <>
      <ImageList
        sx={{
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(255,255,255,0.1)",
        }}
        cols={3}
        gap={9}
      >
        {posts.map((post) => (
          <Post key={post.id} post={post} handleSelect={handleSelectPost} />
        ))}
      </ImageList>
      <PostModalWindow
        open={selectedPost}
        post={selectedPost}
        closeModal={handleCloseModal}
        userId={userId}
      />
    </>
  );
}

export { OwnPosts };
