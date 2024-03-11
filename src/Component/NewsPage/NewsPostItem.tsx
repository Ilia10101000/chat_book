import { doc } from "firebase/firestore";
import React, { useState } from "react";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { db } from "../../firebase/auth";
import { USERS_D } from "../../firebase_storage_path_constants/firebase_storage_path_constants";
import {
  Box,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Skeleton,
} from "@mui/material";
import { UserAvatar } from "../Drawer/DrawerUserAvatar";
import { LikesList } from "../UserPage/PostList/LikesList";
import { Link } from "react-router-dom";

function NewsPostItem({ imageURL, ownerPostId, showComments, id, authUserId }) {
  const [user, loadingU, errorU] = useDocumentData(
    doc(db, `${USERS_D}/${ownerPostId}`)
  );

  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const handleLoadImage = () => {
    setIsImageLoaded(true);
  };

  if (loadingU) {
    return (
      <ListItem
        sx={{
          mb: 2,
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          backgroundColor: "rgba(255,255,255,0.5)",
          borderRadius: "10px",
          width: "100%",
          height: { sx: "200px", sm: "400px", md: "700px" },
        }}
      >
        <Box sx={{ display: "flex", alignSelf: "start" }}>
          <ListItemAvatar>
            <Skeleton
              variant="circular"
              sx={{ width: "45px", height: "45px" }}
            />
          </ListItemAvatar>
          <ListItemText
            primary={<Skeleton variant="rounded" sx={{ width: "100px" }} />}
          />
        </Box>
        <Box sx={{ position: "relative", width: "100%", flexGrow: 1 }}>
          <Skeleton
            variant="rounded"
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              width: "100%",
              height: "100%",
            }}
          />
        </Box>
        <Box sx={{ alignSelf: "start" }}>
          <Skeleton variant="rounded" sx={{ width: "30px", height:'30px' }} />
        </Box>
      </ListItem>
    );
  }

  return (
    <ListItem
      sx={{
        mb: 2,
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        backgroundColor: "customeBackground.main",
        borderRadius: "10px",
        width: "100%",
        height: isImageLoaded
          ? null
          : { sx: "200px", sm: "400px", md: "700px" },
      }}
    >
      <Box sx={{ display: "flex", alignSelf: "start", width: "100%" }}>
        <ListItemAvatar>
          <Link
            style={{ textDecoration: "none", color: "inherit" }}
            to={`/u/${ownerPostId}`}
          >
            <UserAvatar
              photoURL={user?.photoURL}
              userName={user?.displayName}
            />
          </Link>
        </ListItemAvatar>
        <ListItemText
          primaryTypographyProps={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
          primary={user?.displayName}
        />
      </Box>
      <Box
        sx={{
          width: "100%",
          position: "relative",
          flexGrow: isImageLoaded ? null : 1,
        }}
      >
        <Link to={`o/${ownerPostId}/p/${id}`}>
          <img
            src={imageURL}
            alt={id}
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "8px",
              display: isImageLoaded ? "block" : "none",
            }}
            onLoad={handleLoadImage}
          />
        </Link>
        <Skeleton
          variant="rounded"
          sx={{
            width: "100%",
            height: "100%",
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: isImageLoaded ? "none" : "block",
          }}
        />
      </Box>
      <Box sx={{ alignSelf: "start" }}>
        <LikesList authUserId={authUserId} postId={id} userId={ownerPostId} />
      </Box>
    </ListItem>
  );
}

export { NewsPostItem };
