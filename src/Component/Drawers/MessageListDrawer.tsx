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
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useAuth } from "../../hooks/useAuth";
import { collection } from "firebase/firestore";
import { db } from "../../firebase/auth";
import { MessageListItemLink } from "./MessageListItemLink";
import DrawerAppHeader from "./DrawerAppHeader";

function MessageListDrawer({ open, onClose, width }) {
  const user = useAuth();

  const [messagesList, loading, error] = useCollectionData(
    collection(db, `users/${user.uid}/existingChats`)
  );

  let result: ReactNode;
  const [value, setValue] = useState("");

  if (messagesList) {
    result = messagesList?.map(({ companion, chatId }, index) => (
      <MessageListItemLink key={index} companion={companion} chatId={chatId} onClose={onClose} />
    ));
  }
  if (loading) {
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
          <b>Message</b>
        </Typography>
      </DrawerAppHeader>
      <Divider />
      <Box sx={{ my: 3, textAlign: "center", whiteSpace: "collapse" }}>
        <TextField value={value} onChange={(e) => setValue(e.target.value)} />
      </Box>
      <List>{result}</List>
    </Drawer>
  );
}

export { MessageListDrawer };
