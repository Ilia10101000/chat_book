import React from "react";
import { RequestCardItem } from "./RequestCardItem";
import DoNotDisturbAltIcon from "@mui/icons-material/DoNotDisturbAlt";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../../../firebase/auth";
import {
  RECEIVED_FRIENDS_REQUESTS,
  SENT_FRIENDS_REQUESTS,
  USERS,
} from "../../../firebase_storage_path_constants/firebase_storage_path_constants";

function SentRequestList({ requestList, onClose, authUser }) {

  const cancelRequest = async (friendUserData) => {
    try {
      await deleteDoc(
        doc(
          db,
          `${USERS}/${authUser.id}/${SENT_FRIENDS_REQUESTS}`,
          friendUserData.id
        )
      );
      await deleteDoc(
        doc(
          db,
          `${USERS}/${friendUserData.id}/${RECEIVED_FRIENDS_REQUESTS}`,
          authUser.id
        )
      );
    } catch (error) {
      console.log(error.message);
    }
  };
  let res = requestList?.map((user, index) => (
    <RequestCardItem
      key={index}
      onClose={onClose}
      handleRequest={cancelRequest}
      icon={<DoNotDisturbAltIcon fontSize="small" />}
      friendUser={user}
    />
  ));
  return <>{res}</>;
}

export { SentRequestList };
