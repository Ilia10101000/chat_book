import React from "react";
import { RequestCardItem } from "./RequestCardItem";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import { deleteDoc, doc, setDoc } from "firebase/firestore";
import { db } from "../../../firebase/auth";
import {
  FRIENDS_LIST,
  RECEIVED_FRIENDS_REQUESTS,
  SENT_FRIENDS_REQUESTS,
  USERS_D,
} from "../../../firebase_storage_path_constants/firebase_storage_path_constants";

function ReceivedRequestList({ requestList, onClose, authUser }) {

  const submitFriendsRequest = async (userId: string) => {
    try {
      await deleteDoc(
        doc(
          db,
          `${USERS_D}/${authUser.id}/${RECEIVED_FRIENDS_REQUESTS}`,
          userId
        )
      );
      await deleteDoc(
        doc(db, `${USERS_D}/${userId}/${SENT_FRIENDS_REQUESTS}`, authUser.id)
      );
      await setDoc(
        doc(db, `${USERS_D}/${authUser.id}/${FRIENDS_LIST}`, userId),
        { id: userId }
      );
      await setDoc(
        doc(db, `${USERS_D}/${userId}/${FRIENDS_LIST}`, authUser.id),
        {id:authUser.uid}
      );
    } catch (error) {
      console.log(error.message);
    }
  };
  let res = requestList?.map((user: { id: string }) => (
      <RequestCardItem
        key={user.id}
        onClose={onClose}
        handleRequest={submitFriendsRequest}
        icon={<PersonAddAlt1Icon fontSize="small" />}
        userId={user.id}
      />

  ));
  return <>{res}</>;
}

export { ReceivedRequestList };
