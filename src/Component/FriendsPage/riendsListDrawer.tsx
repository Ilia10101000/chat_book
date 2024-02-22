import React, { useState, ReactNode } from "react";
import {
  Box,
  Divider,
  List,
  Typography,
  Drawer,
  TextField,
  CircularProgress,
} from "@mui/material";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { CustomTabPanel } from "../CustomeElement/CustomeTabPanel";
import { useAuth } from "../../hooks/useAuth";
import { collection } from "firebase/firestore";
import { Friend } from "./Friend";
import { db } from "../../firebase/auth";
import { FriendsList } from "./FriendsList";
import { RequestList } from "./RequestList";
import DrawerAppHeader from "../Drawers/DrawerAppHeader";
import {USERS,RECEIVED_FRIENDS_REQUESTS,FRIENDS_LIST} from '../../firebase_storage_path_constants/firebase_storage_path_constants'

function FriendsListDrawer({ open, onClose, width }) {

  const user = useAuth();
  // const [value, setValue] = useState("");
  const [tabNumber, setTabNumber] = useState(0);
  const [friendsList, loadingFL, errorFL] = useCollectionData(
    collection(db, `${USERS}/${user.uid}/${FRIENDS_LIST}`)
  );
  const [receivedFriendsRequest, loadingRFR, errorRFR] = useCollectionData(
    collection(db, `${USERS}/${user.uid}/${RECEIVED_FRIENDS_REQUESTS}`)
  );

  let result: ReactNode;

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabNumber(newValue);
  };

  if (friendsList) {
    result = friendsList?.map(({ id, displayName,photoURL }, index) => (
      <Friend
        id={id}
        displayName={displayName}
        photoURL={photoURL}
      />
    ));
  }
  if (loadingFL || loadingRFR) {
    result = <CircularProgress />;
  }

  return (
    <Drawer
      open={open}
      onClose={onClose}
      variant="temporary"
      sx={{
        width: `${width + 50}px`,
        "& .MuiDrawer-paper": {
          width: `${width + 50}px`,
        },
      }}
    >
      <DrawerAppHeader>
        <Typography variant="h6" sx={{ mx: "auto" }}>
          <b>Friends</b>
        </Typography>
      </DrawerAppHeader>
      <Divider />
      <div style={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={tabNumber} onChange={handleChange}>
            <Tab label="Friends" />
            <Tab label="Request" />
          </Tabs>
        </Box>
        <CustomTabPanel value={tabNumber} index={0}>
          <FriendsList friendsList={friendsList} />
        </CustomTabPanel>
        <CustomTabPanel value={tabNumber} index={1}>
          <RequestList requestList={receivedFriendsRequest} onClose={onClose} />
        </CustomTabPanel>
      </div>
      {/* <Box sx={{ my: 3, textAlign: "center", whiteSpace: "collapse" }}>
        <TextField value={value} onChange={(e) => setValue(e.target.value)} />
      </Box>
      <List>{result}</List> */}
    </Drawer>
  );
}

export { FriendsListDrawer };
