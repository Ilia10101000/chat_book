import React, { useEffect, useRef, ReactNode } from "react";
import { Paper, Box } from "@mui/material";
import { User } from "firebase/auth";
import { MessageItem } from "./MessageItem";
import { deleteDoc, doc } from "firebase/firestore";
import { db, ref, storage } from "../../firebase/auth";
import { CHATS_D, CHATS_S, MESSAGES } from "../../firebase_storage_path_constants/firebase_storage_path_constants";
import { deleteObject } from "firebase/storage";

interface IMessageList {
  chatId: string;
  isEmpty: boolean;
  messages: any;
  user: User;
}

export function MessageList({ messages, user, isEmpty, chatId }: IMessageList) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    containerRef.current.scrollTop = containerRef.current.scrollHeight;
  });

  const deleteMessage = async (message: { id: string; type:string,imageId?:string}) => {
    try {
      if (message.type === 'text') {
        await deleteDoc(doc(db, `${CHATS_D}/${chatId}/${MESSAGES}/${message.id}`));
      } else if (message.type === 'image') {
        await deleteObject(ref(storage,`${CHATS_S}/${chatId}/${message.imageId}`))
        await deleteDoc(doc(db, `${CHATS_D}/${chatId}/${MESSAGES}/${message.id}`));
      }
    } catch (error) {
      console.log(error.message)
    }
  };

  let result: ReactNode;
  if (messages.length !== 0) {
    result = messages?.map((doc, index) => (
      <MessageItem
        key={index}
        doc={doc}
        user={user}
        deleteMessage={deleteMessage}
      />
    ));
  }
  if (isEmpty) {
    result = <div>Start chat</div>;
  }

  return (
    <Box
      ref={containerRef}
      sx={{
        boxSizing: "border-box",
        minWidth: "300px",
        maxWidth: "800px",
        width: "100%",
        mx: "auto",
        gap: "10px",
        height: "calc(100vh - 50px)",
        paddingBottom: "100px",
        display: "flex",
        overflowY: "auto",
        flexDirection: "column",
        background: "rgba(0,0,0,0.3)",
        p: 1,
        flexGrow: 5,
      }}
    >
      {result}
    </Box>
  );
}
