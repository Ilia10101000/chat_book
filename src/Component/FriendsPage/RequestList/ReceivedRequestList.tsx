import React from "react";
import { RequestCardItem } from "./RequestCardItem";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import { acceptFriendRequest } from "../../UserPage/UserDataComponent/ContactButton";

function ReceivedRequestList({ requestList, onClose, authUser }) {

  const submitFriendsRequest = async (userId: string) => {
    try {
      acceptFriendRequest({ user1Id: authUser.id, user2Id: userId });
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
