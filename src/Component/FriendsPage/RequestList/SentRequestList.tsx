import React from "react";
import { RequestCardItem } from "./RequestCardItem";
import DoNotDisturbAltIcon from "@mui/icons-material/DoNotDisturbAlt";
import { cancelFriendRequest } from "../../UserPage/UserDataComponent/ContactButton";

function SentRequestList({ requestList, onClose, authUser }) {

  const cancelRequest = async (userId:string) => {
    try {
      await cancelFriendRequest({ user1Id: authUser.id, user2Id:userId });
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
