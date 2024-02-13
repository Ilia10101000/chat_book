import React, {useEffect, useRef, ReactNode} from "react";
import { Paper, Box } from "@mui/material";
import {
  collection,
  query,
  orderBy,
} from "firebase/firestore";
import { MessageListSkeleton } from "./MessageListSkeleton";
import { User } from "firebase/auth";
import { MessageItem } from "./MessageItem";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { db } from "../../firebase/auth";

interface IMessageList {
  isEmpty: boolean;
  id: string;
  user: User;
}

export function MessageList({ id = 'undefined', user, isEmpty }: IMessageList) {
  const containerRef = useRef<HTMLDivElement>(null);

  const [messages, loading, error] = useCollectionData(
    query(collection(db, `chats/${id}/messages`), orderBy("timestamp"))
  );

  useEffect(() => {
    containerRef.current.scrollTop = containerRef.current.scrollHeight;
  });

  let result: ReactNode;
  if (loading) {
    result = <MessageListSkeleton />;
  }
  if (messages?.length !== 0) {
  // if (messages) {
    result = messages?.map((doc, index) => (
      <MessageItem key={index} doc={doc} user={user} />
    ));
  }
  if (isEmpty) {
    result = <div>Start chat</div>
  }

  return (
    <Box
      ref={containerRef}
      sx={{
        boxSizing: "content-box",
        minWidth: "300px",
        maxWidth: "600px",
        mx: "auto",
        gap: "10px",
        height: "calc(100vh - 100px)",
        paddingBottom: "100px",
        display: "flex",
        overflowY: "auto",
        flexDirection: "column",
        background: "rgba(0,0,0,0.5)",
      }}
    >
      {result}
    </Box>
  );
}
