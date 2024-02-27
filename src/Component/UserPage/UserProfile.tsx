import React from "react";
import { useParams } from "react-router-dom";
import { Box, Divider } from "@mui/material";
import { useAuth } from "../../hooks/useAuth";
import { collection, doc } from "firebase/firestore";
import { db } from "../../firebase/auth";
import {
  useDocumentData,
  useCollectionData,
} from "react-firebase-hooks/firestore";
import { PersonalDisplayData } from "./UserDataComponent/PersonalDisplayData";
import {
  USERS_D,
  POSTS,
  FRIENDS_LIST,
} from "../../firebase_storage_path_constants/firebase_storage_path_constants";
import { PostList } from "./PostList/PostList";

const UserProfile = () => {
  const { id } = useParams();

  const authUser = useAuth();

  const isOwnPage = authUser.uid === id;

  const [user, loading, errorLoadingUser] = useDocumentData(
    doc(db, USERS_D, id)
  );
  const [posts, loadingPosts, errorLoadingPosts] = useCollectionData(
    collection(db, `${USERS_D}/${id}/${POSTS}`)
  );
  const [friends, loadingFriends, errorLoadingFriends] = useCollectionData(
    collection(db, `${USERS_D}/${id}/${FRIENDS_LIST}`)
  );

  if (loading || loadingPosts || loadingFriends) {
    return <div>Loading...</div>;
  }

  return (
    <Box
      sx={{
        backgroundColor: "rgba(0,0,0,0.2)",
        mx: "auto",
        px: 3,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        width: "600px",
      }}
    >
      <PersonalDisplayData
        user={user}
        isOwnPage={isOwnPage}
        authUser={authUser}
        friendsCount={friends.length}
        postsCount={posts.length}
      />
      <PostList postsList={posts} />
    </Box>
  );
};

export { UserProfile };
