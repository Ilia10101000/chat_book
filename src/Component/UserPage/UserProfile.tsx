import React from "react";
import { Outlet, useParams } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
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
  TAGS_IN_THIRD_PARTY_POSTS
} from "../../firebase_storage_path_constants/firebase_storage_path_constants";
import { PostList } from "./PostList/PostList";
import { useAuth } from "../../App";

const UserProfile = () => {  
  const { userId } = useParams();

  const authUser = useAuth();

  const isOwnPage = authUser.uid === userId;

  const [user, loadingU, errorLoadingU] = useDocumentData(
    doc(db, USERS_D, userId)
  );
  const [posts, loadingP, errorLoadingP] = useCollectionData(
    query(
      collection(db, `${USERS_D}/${userId}/${POSTS}`),
      orderBy("timestamp", "desc")
    )
  );
  const [thirdPartyPostTags, loadingTPPT, errorLoadingTPPT] = useCollectionData(
    query(
      collection(db, `${USERS_D}/${userId}/${TAGS_IN_THIRD_PARTY_POSTS}`),
      orderBy("timestamp", "desc")
    )
  );
  const [friends, loadingF, errorLoadingF] = useCollectionData(
    collection(db, `${USERS_D}/${userId}/${FRIENDS_LIST}`)
  );

  if (loadingU || loadingP || loadingF || loadingTPPT) {
    return <CircularProgress sx={{position:'relative',top:'50%',left:'50%',transform:'translate(-50%,-50%)'}} />;
  }

  return (
    <>
      <Box
        sx={{
          backgroundColor: "customeBackground.main",
          mx: "auto",
          px: 1,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          width: "100%",
          maxWidth:'800px'
        }}
      >
        <PersonalDisplayData
          user={user}
          isOwnPage={isOwnPage}
          authUser={authUser}
          friendsList={friends}
          postsCount={posts.length}
        />
        <PostList
          user={user}
          postsList={posts}
          thirdPartyPostTags={thirdPartyPostTags}
        />
      </Box>
      <Outlet />
    </>
  );
};

export { UserProfile };
