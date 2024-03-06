import React, { useState } from "react";
import { PersonalsMarkedTags } from "./PersonalsMarkedTags";
import { DocumentData, deleteDoc } from "firebase/firestore";
import { db } from "../../../firebase/auth";
import {
  setDoc,
  doc,
} from "firebase/firestore";
import {
  POSTS,
  USERS_D,
  MARKED_PERSONS,
} from "../../../firebase_storage_path_constants/firebase_storage_path_constants";
import { SearchUsersDialog } from "./SearchUsersDialog";

interface IImageContainer {
  post: DocumentData;
  userId: string;
  isOwner: boolean;
}

interface INewCords {
  x: string;
  y: string;
};

const generateUniqueFileName = (userId: string) => {
  return `${Date.now()}-${userId}-${Math.floor(Math.random() * 10000) + 1}`;
};

function ImageContainer({ post, userId, isOwner }: IImageContainer) {

  const [showMarkedTags, setShowMarkedTags] = useState(false);
  const [newTagCords, setNewTagCords] = useState<INewCords>(null);

  const toogleMarksVisible = () => {
    setShowMarkedTags((value) => !value);
  };

    const clearTagCords = () => {
        setNewTagCords(null);
    }

    
  const setPersonalTagCoords = async (e: any) => {
    const image = e.target;
    let imageWidth = image.offsetWidth;
    let imageHeight = image.offsetHeight;

    let relativeX = (e.nativeEvent.offsetX / imageWidth).toPrecision(3);
    let relativeY = (e.nativeEvent.offsetY / imageHeight).toPrecision(3);

    setNewTagCords({ x: relativeX, y: relativeY });
  };

  const submitUserTag = async (userData: { type: string; name?: string; id?: string }) => {
    
    const tagId = generateUniqueFileName(userId);
      try {
        await setDoc(
          doc(
            db,
            `${USERS_D}/${userId}/${POSTS}/${post.id}/${MARKED_PERSONS}`,
            tagId
          ),
          {id:tagId, ...newTagCords, ...userData }
        );
      } catch (error) {
        console.log(error.message);
      } finally {
        clearTagCords();
      }
  };
  
  const deletePersonalTag = async (tagId: string) => {
    try {
      await deleteDoc(
        doc(
          db,
          `${USERS_D}/${userId}/${POSTS}/${post.id}/${MARKED_PERSONS}`,
          tagId
        )
      );
    } catch (error) {
      console.log(error.message)
    }
  }
  return (
    <div style={{ position: "relative", width: "100%", padding: "0px" }}>
      <img
        onClick={isOwner && showMarkedTags ? setPersonalTagCoords : null}
        src={post?.imageURL}
        style={{
          width: "100%",
          ...(isOwner && showMarkedTags && { cursor: "pointer" }),
        }}
        alt={post?.id}
      />
      <PersonalsMarkedTags
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
          handleSubmit={submitUserTag}
          closeModal={clearTagCords}
        />
      )}
    </div>
  );
}

export { ImageContainer };
