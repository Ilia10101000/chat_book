import { doc } from "firebase/firestore";
import React, { useLayoutEffect, useRef, useState } from "react";
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
  const [heightSkeleton, setHeightSkeleton] = useState(0);

  const handleLoadImage = () => {
    setIsImageLoaded(true);
  };


  const containerRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (containerRef.current) {
      setHeightSkeleton(containerRef.current.clientWidth)
    }
  },[])

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
        {loadingU ? (
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
        ) : (
          <Box sx={{ display: "flex", alignSelf: "start" }}>
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
        )}
      </Box>
      <Box
        ref={containerRef}
        sx={{
          width: "100%",
          flexGrow: 1,
        }}
      >
        <Link
          style={{ display: isImageLoaded ? "block" : "none" }}
          to={`o/${ownerPostId}/p/${id}`}
        >
          <img
            src={imageURL}
            alt={id}
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "8px",
            }}
            onLoad={handleLoadImage}
          />
        </Link>
        <Skeleton
          variant="rounded"
          sx={{
            width: `${heightSkeleton}px`,
            height: `${heightSkeleton}px`,
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
