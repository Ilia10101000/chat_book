import React, { useState } from "react";
import { PersonalsMarkedTags } from "./PersonalsMarkedTags";
import {
  DocumentData,
  collection,
  deleteDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../../firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import {
  POSTS,
  USERS_D,
  MARKED_PERSONS,
  TAGS_IN_THIRD_PARTY_POSTS,
} from "../../../firebase_storage_path_constants/firebase_storage_path_constants";
import { SearchUsersDialog } from "./SearchUsersDialog";
import { useCollectionData } from "react-firebase-hooks/firestore";

interface IImageContainer {
  post: DocumentData;
  userId: string;
  isOwner: boolean;
  authUserId: string;
}

interface INewCords {
  x: string;
  y: string;
}

const generateUniqueFileName = (userId: string) => {
  return `${Date.now()}-${userId}-${Math.floor(Math.random() * 10000) + 1}`;
};

function ImageContainer({
  post,
  userId,
  isOwner,
  authUserId,
}: IImageContainer) {
  const [showMarkedTags, setShowMarkedTags] = useState(false);
  const [newTagCords, setNewTagCords] = useState<INewCords>(null);
  const [markedPersons, loadingMP, errorMP] = useCollectionData(
    collection(db, `${USERS_D}/${userId}/${POSTS}/${post.id}/${MARKED_PERSONS}`)
  );

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

  const updateTagCords = async (
    tagId: string,
    cords: { x: string; y: string }
  ) => {
    try {
      const docRef = doc(
        db,
        `${USERS_D}/${userId}/${POSTS}/${post.id}/${MARKED_PERSONS}`,
        tagId
      );
      await updateDoc(docRef, {
        ...cords,
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  const addUserTag = async (personId: string) => {

    try {

      if (markedPersons?.some((mark) => mark.personId === personId)) {

        let tagDoc = markedPersons?.find((mark) => mark.personId === personId);
        await updateTagCords(tagDoc.id, newTagCords);

      } else {

        const tagId = generateUniqueFileName(personId);

        await setDoc(
          doc(
            db,
            `${USERS_D}/${userId}/${POSTS}/${post.id}/${MARKED_PERSONS}`,
            tagId
          ),
          { id: tagId, ...newTagCords, personId }
        );

        if (personId !== authUserId) {

          await setDoc(
            doc(
              db,
              `${USERS_D}/${personId}/${TAGS_IN_THIRD_PARTY_POSTS}`,
              tagId
            ),
            {
              id: tagId,
              ownerPostId: userId,
              postId: post.id,
              timestamp: serverTimestamp(),
            }
          );
        }
      }

    } catch (error) {

      console.log(error.message);

    } finally {

      clearTagCords();

    }
  };

  const deletePersonalTag = async (tagData: {
    id: string;
    personId?: string;
    type: string;
  }) => {
    try {
      await deleteDoc(
        doc(
          db,
          `${USERS_D}/${userId}/${POSTS}/${post.id}/${MARKED_PERSONS}`,
          tagData.id
        )
      );
      if (tagData.personId !== authUserId) {
        await deleteDoc(
          doc(
            db,
            `${USERS_D}/${tagData.personId}/${TAGS_IN_THIRD_PARTY_POSTS}`,
            tagData.id
          )
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };
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
          handleSubmit={addUserTag}
          closeModal={clearTagCords}
        />
      )}
    </div>
  );
}

export { ImageContainer };
