import React, { useState, ReactNode, useEffect } from "react";
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
import { collection, query, where, limit, getDocs } from "firebase/firestore";
import { db } from "../../firebase/auth";
import { MessageListItemLink } from "./MessageListItemLink";
import DrawerAppHeader from "../Drawer/DrawerAppHeader";
import {
  USERS_D,
  EXISTING_CHATS,
} from "../../firebase_storage_path_constants/firebase_storage_path_constants";
import { useDebounce } from "use-debounce";
import { useNavigate } from "react-router-dom";
import { User } from "firebase/auth";
import { UserCard } from "../FriendsPage/UserCard.tsx";

interface IUser {
  searchQuery: string;
  displayName: string;
  email: string;
  photoURL: string;
  id: string;
}

function MessageListDrawer({ open, onClose }) {
  const authUser = useAuth();

  const [existingChatsList, loadingECL, errorECL] = useCollectionData(
    collection(db, `${USERS_D}/${authUser.uid}/${EXISTING_CHATS}`)
  );

  let result: React.ReactNode | null;

  if (loadingECL) {
    result = <CircularProgress sx={{mx:'auto'}} />;

  } else if (!existingChatsList?.length) {
    result = <div style={{textAlign:'center'}}>No existing chats...</div>;
  } else {
    result = existingChatsList?.map(({ companion, chatId }, index) => (
      <MessageListItemLink
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
