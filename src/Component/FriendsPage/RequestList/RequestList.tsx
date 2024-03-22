import React, { useState } from "react";
import {
  Tab,
  Tabs,
  Box,
  Select,
  MenuItem,
  SelectChangeEvent,
  Badge,
} from "@mui/material";
import { CustomTabPanel } from "../../CustomeElement/CustomeTabPanel";
import { SentRequestList } from "./SentRequestList";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { ReceivedRequestList } from "./ReceivedRequestList";
import { collection } from "firebase/firestore";
import { db } from "../../../firebase/auth";
import {
  USERS_D,
  RECEIVED_FRIENDS_REQUESTS,
  SENT_FRIENDS_REQUESTS,
} from "../../../firebase_storage_path_constants/firebase_storage_path_constants";

function RequestList({ authUser, onClose }) {
  const [tabNumber, setTabNumber] = useState("1");

  const [receivedFriendsRequest, loadingRFR, errorRFR] = useCollectionData(
    collection(db, `${USERS_D}/${authUser.id}/${RECEIVED_FRIENDS_REQUESTS}`)
  );
  const [sentFriendsRequest, loadingSFR, errorSFR] = useCollectionData(
    collection(db, `${USERS_D}/${authUser.id}/${SENT_FRIENDS_REQUESTS}`)
  );

  const handleChange = (event: SelectChangeEvent) => {
    setTabNumber(event.target.value);
  };

  return (
    <>
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          display: "flex",
          justifyContent: "center",
          padding: "10px 0px",
        }}
      >
        <Select value={tabNumber} onChange={handleChange}>
          <MenuItem value={1}>Received</MenuItem>
          <MenuItem value={2}>Sent</MenuItem>
        </Select>
      </Box>
      <CustomTabPanel style={{ padding: "8px" }} value={+tabNumber} index={1}>
        <ReceivedRequestList
          authUser={authUser}
          requestList={receivedFriendsRequest}
          onClose={onClose}
        />
      </CustomTabPanel>
      <CustomTabPanel style={{ padding: "8px" }} value={+tabNumber} index={2}>
        <SentRequestList
          authUser={authUser}
          requestList={sentFriendsRequest}
          onClose={onClose}
        />
      </CustomTabPanel>
    </>
  );
}

export { RequestList };
