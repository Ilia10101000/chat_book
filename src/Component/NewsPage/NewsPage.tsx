import React, { ReactNode, useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/auth";
import {
  FRIENDS_LIST,
  POSTS,
  USERS_D,
} from "../../firebase_storage_path_constants/firebase_storage_path_constants";
import { NewsPostItem } from "./NewsPostItem";
import { Box, Button, CircularProgress, List, Typography } from "@mui/material";
import { Link, Outlet, useNavigate } from "react-router-dom";

function NewsPage() {
  const navigate = useNavigate();
  const authUser = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [newsList, setNewsList] = useState([]);

  const fetchNewsList = async () => {
    setLoading(true);
    try {
      const friendsListSnapshot = await getDocs(
        collection(db, `${USERS_D}/${authUser.uid}/${FRIENDS_LIST}`)
      );
      if (!friendsListSnapshot.empty) {
        const friendsList = [];
        friendsListSnapshot.forEach((snap) => friendsList.push(snap.data()));
        const friendsPostsPromises = friendsList.map(
          async ({ id }) =>
            await getDocs(collection(db, `${USERS_D}/${id}/${POSTS}`))
        );
        const friendsPostsList = [];
        const postsSnap = await Promise.all(friendsPostsPromises);
        postsSnap.forEach((snap) => {
          if (!snap.empty) {
            snap.forEach((postSnap) => friendsPostsList.push(postSnap.data()));
          }
        });
        const sortedListByTime = friendsPostsList.sort(
          (a, b) => a.timestamp.seconds - b.timestamp.seconds
        );
        setNewsList(sortedListByTime);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNewsList();
  }, [authUser.uid]);

  const reloadPage = () => {
    navigate(0);
  }

  let res: ReactNode;
  if (loading) {
    res = <CircularProgress sx={{ position:'relative', top:'50%'}} />;
  } else if (error) {
    res = (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
          top: "50%",
        }}
      >
        <Typography variant="h5" sx={{ mb: 2, textAlign: "center" }}>
          Some error occured
        </Typography>
        <Button variant="contained" color="warning" onClick={reloadPage}>
          Try again
        </Button>
      </Box>
    );
  } else if (!loading && !newsList.length) {
    res = (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
          top: "50%",
        }}
      >
        <Typography variant="h6" sx={{ mb: 2,textAlign:'center' }}>
          Find and subscribe to your friends to watching their news
        </Typography>
        <Button variant="contained" color="success" onClick={reloadPage}>
          Find friends
        </Button>
      </Box>
    );
  } else {
    res = (
      <List sx={{width:'100%', maxWidth:'700px'}}>
        {newsList.map((news) => (
          <NewsPostItem key={news.id} authUserId={authUser.uid} {...news} />
        ))}
      </List>
    );

  }

  return (
    <>
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        height: "100vh",
          overflowY: "scroll",
      }}
    >
      {res}
      </Box>
      <Outlet />
    </>
  );
}

export { NewsPage };
