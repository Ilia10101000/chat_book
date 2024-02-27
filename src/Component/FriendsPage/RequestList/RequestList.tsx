import React, { useState } from "react";
import { Tab, Tabs, Box } from "@mui/material";
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

  const [tabNumber, setTabNumber] = useState(0);
  
  const [receivedFriendsRequest, loadingRFR, errorRFR] = useCollectionData(
    collection(db, `${USERS_D}/${authUser.id}/${RECEIVED_FRIENDS_REQUESTS}`)
  );
  const [sentFriendsRequest, loadingSFR, errorSFR] = useCollectionData(
    collection(db, `${USERS_D}/${authUser.id}/${SENT_FRIENDS_REQUESTS}`)
  );
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabNumber(newValue);
  };
  return (
    <>
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Tabs variant="fullWidth" value={tabNumber} onChange={handleChange}>
          <Tab label="Received" />
          <Tab label="Sent" />
        </Tabs>
      </Box>
      <CustomTabPanel value={tabNumber} index={0}>
        <ReceivedRequestList
          authUser={authUser}
          requestList={receivedFriendsRequest}
          onClose={onClose}
        />
      </CustomTabPanel>
      <CustomTabPanel value={tabNumber} index={1}>
        <SentRequestList
          requestList={sentFriendsRequest}
          authUser={authUser}
          onClose={onClose}
        />
      </CustomTabPanel>
    </>
  );
}

export { RequestList };
