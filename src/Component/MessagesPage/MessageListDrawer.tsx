import React from "react";
import {
  List,
  Drawer,
  CircularProgress,
} from "@mui/material";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { collection} from "firebase/firestore";
import { db } from "../../firebase/auth";
import { MessageListItemLink } from "./MessageListItemLink";
import {
  USERS_D,
  EXISTING_CHATS,
} from "../../firebase_storage_path_constants/firebase_storage_path_constants";
import { useAuth } from "../../App";

function MessageListDrawer({ open, onClose, receivedNewMessages }) {
  const authUser = useAuth();

  const [existingChatsList, loadingECL, errorECL] = useCollectionData(
    collection(db, `${USERS_D}/${authUser.uid}/${EXISTING_CHATS}`)
  );

  let result: React.ReactNode | null;

  if (loadingECL) {
    result = <CircularProgress sx={{ mx: "auto" }} />;
  } else if (!existingChatsList?.length) {
    result = <div style={{ textAlign: "center" }}>No existing chats...</div>;
  } else {
    result = existingChatsList?.map(({ companion, chatId }, index) => (
      <MessageListItemLink
        isHasNewMessage={receivedNewMessages?.some(id => id === chatId)}
        key={index}
        companion={companion}
        chatId={chatId}
        onClose={onClose}
      />
    ));
  }

  return (
    <Drawer
      open={open}
      onClose={onClose}
      variant="temporary"
      sx={{
        backgroundColor: "background.paper",
        width: "250px",
        "& .MuiDrawer-paper": {
          width: "250px",
        },
      }}
    >
      <List>{result}</List>
    </Drawer>
  );
}

export { MessageListDrawer };
