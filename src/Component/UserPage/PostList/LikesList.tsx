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
  Skeleton,
  Avatar,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { setDoc, deleteDoc, doc } from "firebase/firestore";
import { FavoriteLikesGroupItem } from "./FavoriteLikesGroup";
import { UserAvatar } from "../../Drawer/DrawerUserAvatar";

function LikesList({ postId, userId, authUserId }) {
  const [likesList, loadingLL, errorLL] = useCollectionData(
    collection(db, `${USERS_D}/${userId}/${POSTS}/${postId}/${LIKES}`)
  );
  const [isExpandedLikesGroup, setisExpandedLikesGroup] = useState(false);

  if (loadingLL) {
    return (
        <Skeleton
          variant="circular"
          sx={{
            width: '41px',
            height: '41px',
          }}
        />
    );
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
    <Box
      sx={{
        display: "flex",
        gap: "10px",
        alignItems: "center",
        maxWidth: "100%",
      }}
    >
      <IconButton
        sx={{ pr: { xs: 0, sm: 1 } }}
        onClick={isSetLike ? removeLike : addLike}
      >
        {isSetLike ? (
          <FavoriteIcon
            sx={{ color: "red", fontSize: { xs: "25px", sm: "30px" } }}
          />
        ) : (
          <FavoriteBorderIcon
            sx={{
              fontSize: { xs: "25px", sm: "30px" },
            }}
          />
        )}
      </IconButton>
      {!!likesList.length && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
            maxWidth: "100%",
            overflowX: "hidden",
          }}
        >
          <AvatarGroup
            onClick={handleExpandLikesGroup}
            sx={{ ":hover": { cursor: "pointer" } }}
            max={3}
            spacing={"small"}
          >
            {likesList?.map((doc) => (
              <FavoriteLikesGroupItem
                key={doc.id}
                userId={doc.id}
                style={{ width: "22px", height: "22px" }}
              />
            ))}
          </AvatarGroup>
          <Typography
            sx={{
              textOverflow: "ellipsis",
              overflow: "hidden",
              whiteSpace: "nowrap",
            }}
            variant="caption"
          >
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
        </Box>
      )}
    </Box>
  );
}

export { LikesList };
