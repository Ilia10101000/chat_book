import React, {useEffect, useRef} from "react";
import { Paper, Box } from "@mui/material";
import { DocumentData } from "firebase/firestore";
import { MessageListSkeleton } from "./MessageListSkeleton";
import { User } from "firebase/auth";
import { MessageItem } from "./MessageItem";

interface IMessageList {
  messages: DocumentData[],
  loading: boolean,
  user:User
}

export function MessageList({messages, loading, user}:IMessageList) {

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    containerRef.current.scrollTop = containerRef.current.scrollHeight;
  })

 

  return (
    <div style={{
      width: '100%',
    height: '100%',
    overflow: 'hidden'
    }}>
    <Box
      ref={containerRef}
      sx={{
        boxSizing: 'content-box',
        minWidth: "300px",
        maxWidth: "600px",
        marginX: "auto",
        gap: "10px",
        height:'100vh',
        p: 5,
        paddingBottom: '100px',
        paddingLeft:'15px',
        display: "flex",
        overflowY:'scroll',
        flexDirection: "column",
        background: "rgba(0,0,0,0.5)",
        
      }}
    >
      {loading && <MessageListSkeleton/>}
      {messages?.map((doc) => <MessageItem doc={doc} user={user} />)}
    </Box>

    </div>
  );
}
