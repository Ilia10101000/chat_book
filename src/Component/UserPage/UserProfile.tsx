import React from "react";
import { Link, Outlet, useParams } from "react-router-dom";
import { Box } from "@mui/material";
import { useAuth } from "../../hooks/useAuth";
import { collection, doc, orderBy, query } from "firebase/firestore";
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
  const { userId } = useParams();

  const authUser = useAuth();

  const isOwnPage = authUser.uid === userId;

  const [user, loading, errorLoadingUser] = useDocumentData(
    doc(db, USERS_D, userId)
  );
  const [posts, loadingPosts, errorLoadingPosts] = useCollectionData(
    query(
      collection(db, `${USERS_D}/${userId}/${POSTS}`),
      orderBy("timestamp", "desc")
    )
  );
  const [friends, loadingFriends, errorLoadingFriends] = useCollectionData(
    collection(db, `${USERS_D}/${userId}/${FRIENDS_LIST}`)
  );

  if (loading || loadingPosts || loadingFriends) {
    return <div>Loading...</div>;
  }

  return (
    <>
    <Box
      sx={{
        backgroundColor: "rgba(0,0,0,0.2)",
        mx: "auto",
        px: 1,
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
        <PostList user={user} postsList={posts} />
      </Box>
      <Outlet/>
    </>
  );
};

export { UserProfile };
