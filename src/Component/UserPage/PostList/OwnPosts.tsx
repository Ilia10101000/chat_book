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
  const [selectedPost, setSelectedPost] = useState(null);

  const deletePicture = async (imageId: string) => {
    try {
      await deleteDoc(doc(db, `${USERS_D}/${user.id}/${POSTS}`, imageId));
      await deleteObject(ref(storage, `${POSTS}/${user.id}/${imageId}`));
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
        user={user}
      />
    </>
  );
}

export { OwnPosts };
