import React, { useDeferredValue, useState } from "react";
import {
  Box, Divider, List, styled, Typography, Drawer, TextField
} from "@mui/material";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useAuth } from "../../hooks/useAuth";
import { collection } from "firebase/firestore";
import { db } from "../../firebase/auth";
import { MessageListItemLink } from "./MessageListItemLink";

function MessageListDrawer({ open, onClose, width }) {

  const user = useAuth()

  const [messagesList, loading, error] = useCollectionData(collection(db, `users/${user.uid}/existingChats`));
  console.log(messagesList)
  
  let result = messagesList?.map(({ companion, chatId }, index) => (
    <MessageListItemLink key={index} companion={companion} chatId={chatId} />
  ));

  const [value, setValue] = useState('');

  const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
  }));
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
      <DrawerHeader>
        <Typography variant="h6" sx={{ mx: "auto" }}>
          <b>Message</b>
        </Typography>
      </DrawerHeader>
      <Divider />
      <Box sx={{ my: 3, textAlign: "center", whiteSpace: "collapse" }}>
        <TextField value={value} onChange={(e) => setValue(e.target.value)} />
      </Box>
      <List>{result}</List>
    </Drawer>
  );
}

export { MessageListDrawer };
