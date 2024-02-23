import React from "react";
import { RequestCardItem } from "./RequestCardItem";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import { deleteDoc, doc, setDoc } from "firebase/firestore";
import { db } from "../../../firebase/auth";
import {
  FRIENDS_LIST,
  RECEIVED_FRIENDS_REQUESTS,
  SENT_FRIENDS_REQUESTS,
  USERS,
} from "../../../firebase_storage_path_constants/firebase_storage_path_constants";

function ReceivedRequestList({ requestList, onClose, authUser }) {

  const submitRequest = async (friendUserData) => {
    try {
      await deleteDoc(
        doc(
          db,
          `${USERS}/${authUser.id}/${RECEIVED_FRIENDS_REQUESTS}`,
          friendUserData.id
        )
      );
      await deleteDoc(
        doc(
          db,
          `${USERS}/${friendUserData.id}/${SENT_FRIENDS_REQUESTS}`,
          authUser.id
        )
      );
      await setDoc(
        doc(db, `${USERS}/${authUser.id}/${FRIENDS_LIST}`, friendUserData.id),
        friendUserData
      );
      await setDoc(
        doc(db, `${USERS}/${friendUserData.id}/${FRIENDS_LIST}`, authUser.id),
        authUser
      );
    } catch (error) {
      console.log(error.message);
    }
  };
  let res = requestList?.map((user, index) => (
    <RequestCardItem
      key={index}
      onClose={onClose}
      handleRequest={submitRequest}
      icon={<PersonAddAlt1Icon fontSize="small" />}
      friendUser={user}
    />
  ));
  return <>{res}</>;
}

export { ReceivedRequestList };
