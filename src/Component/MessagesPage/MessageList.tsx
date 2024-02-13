import React, {useEffect, useRef, ReactNode} from "react";
import { Paper, Box } from "@mui/material";
import { User } from "firebase/auth";
import { MessageItem } from "./MessageItem";

interface IMessageList {
  isEmpty: boolean;
  messages:any;
  user: User;
}

export function MessageList({ messages, user, isEmpty }: IMessageList) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    containerRef.current.scrollTop = containerRef.current.scrollHeight;
  });

  let result: ReactNode;
  if (messages.length !== 0) {
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
