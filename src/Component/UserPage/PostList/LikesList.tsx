import React, { useState } from "react";
import { collection } from "firebase/firestore";
import { db } from "../../../firebase/auth";
import {
  POSTS,
  USERS_D,
  LIKES,
} from "../../../firebase_storage_path_constants/firebase_storage_path_constants";
import { useCollectionData } from "react-firebase-hooks/firestore";
import {
  AvatarGroup,
  Box,
  Dialog,
  IconButton,
  Typography,
  List,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { setDoc, deleteDoc, doc } from "firebase/firestore";
import { FavoriteLikesGroupItem } from "./FavoriteLikesGroup";

function LikesList({ postId, userId, authUserId }) {
  const [likesList, loadingLL, errorLL] = useCollectionData(
    collection(db, `${USERS_D}/${userId}/${POSTS}/${postId}/${LIKES}`)
  );
  const [isExpandedLikesGroup, setisExpandedLikesGroup] = useState(false);

  if (loadingLL) {
    return <div>Loading</div>;
  }

  const isSetLike = likesList?.some((doc) => doc.id === authUserId);

  const removeLike = async () => {
    try {
      await deleteDoc(
        doc(db, `${USERS_D}/${userId}/${POSTS}/${postId}/${LIKES}`, authUserId)
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  const addLike = async () => {
    try {
      await setDoc(
        doc(db, `${USERS_D}/${userId}/${POSTS}/${postId}/${LIKES}`, authUserId),
        { id: authUserId }
      );
    } catch (error) {
      console.log(error.message);
    }
  };
  const handleReduceLikesGroup = () => {
    setisExpandedLikesGroup(false);
  };
  const handleExpandLikesGroup = () => {
    setisExpandedLikesGroup(true);
  };
  return (
    <Box sx={{ display: "flex", gap: "10px", alignItems: "center" }}>
      <IconButton onClick={isSetLike ? removeLike : addLike}>
        {isSetLike ? (
          <FavoriteIcon sx={{ color: "red", fontSize: "30px" }} />
        ) : (
          <FavoriteBorderIcon
            sx={{
              fontSize: "30px",
            }}
          />
        )}
      </IconButton>
      {!!likesList.length && (
        <>
          <AvatarGroup
            onClick={handleExpandLikesGroup}
            sx={{ ":hover": { cursor: "pointer" } }}
            max={3}
            spacing={"small"}
          >
            {likesList?.map((doc) => (
              <FavoriteLikesGroupItem key={doc.id} userId={doc.id} />
            ))}
          </AvatarGroup>
          <Typography variant="caption">
            {likesList.length} people likes this post
          </Typography>
          <Dialog open={isExpandedLikesGroup} onClose={handleReduceLikesGroup}>
            <List
              sx={{
                maxHeight: "500px",
                overflowY: "scroll",
              }}
            >
              {likesList?.map((doc) => (
                <FavoriteLikesGroupItem
                  key={doc.id}
                  userId={doc.id}
                  expanded={true}
                />
              ))}
            </List>
          </Dialog>
        </>
      )}
    </Box>
  );
}

export { LikesList };
