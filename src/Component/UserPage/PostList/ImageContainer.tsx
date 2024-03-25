import React, { useLayoutEffect, useRef, useState } from "react";
import { PersonalsMarkedTags } from "./PersonalsMarkedTags";
import { DocumentData, collection } from "firebase/firestore";
import { db } from "../../../firebase/auth";
import {
  POSTS,
  USERS_D,
  MARKED_PERSONS,
} from "../../../firebase_storage_path_constants/firebase_storage_path_constants";
import { SearchUsersDialog } from "./SearchUsersDialog";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { Box, Skeleton } from "@mui/material";
import {
  updateTagCords,
  addUserTag,
  deletePersonalTag,
} from "../../../firebase/utils/post_utils";

interface IImageContainer {
  post: DocumentData;
  userId: string;
  isOwner: boolean;
  authUserId: string;
  handleError: (message: string) => void;
}

interface INewCords {
  x: string;
  y: string;
}

function ImageContainer({
  post,
  userId,
  isOwner,
  authUserId,
  handleError,
}: IImageContainer) {
  const [showMarkedTags, setShowMarkedTags] = useState(false);
  const [newTagCords, setNewTagCords] = useState<INewCords>(null);
  const [isLoadedImage, setIsLoadedImage] = useState(false);
  const [markedPersons, loadingMP, errorMP] = useCollectionData(
    collection(
      db,
      `${USERS_D}/${userId}/${POSTS}/${post?.id}/${MARKED_PERSONS}`
    )
  );
  const [containerHeight, setContainerHeight] = useState(0);

  const toogleMarksVisible = () => {
    setShowMarkedTags((value) => !value);
  };

  const clearTagCords = () => {
    setNewTagCords(null);
  };

  const setPersonalTagCoords = async (e: any) => {
    const image = e.target;
    let imageWidth = image.offsetWidth;
    let imageHeight = image.offsetHeight;

    let relativeX = (e.nativeEvent.offsetX / imageWidth).toPrecision(3);
    let relativeY = (e.nativeEvent.offsetY / imageHeight).toPrecision(3);

    setNewTagCords({ x: relativeX, y: relativeY });
  };

  const handleAddUserTag = async (personId: string) => {
    try {
      if (markedPersons?.some((mark) => mark.personId === personId)) {
        let tagDoc = markedPersons?.find((mark) => mark.personId === personId);
        await updateTagCords(post.id, authUserId, tagDoc.id, newTagCords);
      } else {
        addUserTag(post.id, authUserId, personId, newTagCords);
      }
    } catch (error) {
      handleError(error.message);
    } finally {
      clearTagCords();
    }
  };

  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (containerRef.current) {
      setContainerHeight(containerRef.current.clientWidth);
    }
  }, []);

  return (
    <Box
      ref={containerRef}
      sx={{ position: "relative", width: "100%", padding: "0px"}}
    >
      <img
        onClick={isOwner && showMarkedTags ? setPersonalTagCoords : null}
        onLoad={() => setIsLoadedImage(true)}
        src={post?.imageURL}
        style={{
          display: isLoadedImage ? "block" : "none",
          width: "100%",
          borderRadius: "10px",
          ...(isOwner && showMarkedTags && { cursor: "pointer" }),
        }}
        alt={post?.id}
      />
      <Skeleton
        variant="rounded"
        sx={{
          display: isLoadedImage ? "none" : "block",
          width: `${containerHeight}px`,
          height: `${containerHeight}px`,
        }}
      />

      <PersonalsMarkedTags
        markedPersons={markedPersons}
        isShownTags={showMarkedTags}
        handleClick={toogleMarksVisible}
        userId={userId}
        postId={post?.id}
        isOwner={isOwner}
        removeTag={deletePersonalTag}
      />
      {!!newTagCords && (
        <SearchUsersDialog
          open={!!newTagCords}
          handleSubmit={handleAddUserTag}
          closeModal={clearTagCords}
        />
      )}
    </Box>
  );
}

export { ImageContainer };
