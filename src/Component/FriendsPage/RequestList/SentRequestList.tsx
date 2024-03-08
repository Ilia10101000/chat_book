import React from "react";
import { RequestCardItem } from "./RequestCardItem";
import DoNotDisturbAltIcon from "@mui/icons-material/DoNotDisturbAlt";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../../../firebase/auth";
import {
  RECEIVED_FRIENDS_REQUESTS,
  SENT_FRIENDS_REQUESTS,
  USERS_D,
} from "../../../firebase_storage_path_constants/firebase_storage_path_constants";

function SentRequestList({ requestList, onClose, authUser }) {

  const cancelRequest = async (userId:string) => {
    try {
      await deleteDoc(
        doc(db, `${USERS_D}/${authUser.id}/${SENT_FRIENDS_REQUESTS}`, userId)
      );
      await deleteDoc(
        doc(
          db,
          `${USERS_D}/${userId}/${RECEIVED_FRIENDS_REQUESTS}`,
          authUser.id
        )
      );
    } catch (error) {
      console.log(error.message);
    }
  };
  let res = requestList?.map((user: { id: string }) => (
    <RequestCardItem
      key={user.id}
      onClose={onClose}
      handleRequest={cancelRequest}
      icon={<DoNotDisturbAltIcon fontSize="small" />}
      userId={user.id}
    />
  ));
  return <>{res}</>;
}

export { SentRequestList };
