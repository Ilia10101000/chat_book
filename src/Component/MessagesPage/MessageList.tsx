import React, { useEffect, useRef, ReactNode, MutableRefObject } from "react";
import { Box } from "@mui/material";
import { User } from "firebase/auth";
import { MessageItem } from "./MessageItem";
import { DocumentData, doc } from "firebase/firestore";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { db } from "../../firebase/auth";
import { CHATS_D } from "../../firebase_storage_path_constants/firebase_storage_path_constants";
import { deleteMessage } from "../../firebase/utils/message_utils";

interface IMessageList {
  isEmpty: boolean;
  chatId: string;
  messages: DocumentData;
  user: User;
  setViewedMessage: (chatId:string) => void;
}


export function MessageList({
  messages,
  user,
  isEmpty,
  chatId,
  setViewedMessage,
}: IMessageList) {
  const [chatData, loadingCD, errorCD] = useDocumentData(
    doc(db, `${CHATS_D}/${chatId}`)
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const lastMMessageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    containerRef.current.scrollTop = containerRef.current.scrollHeight;
  });

  useEffect(() => {
    if (lastMMessageRef.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setViewedMessage(chatId);
              observer.unobserve(entry.target);
            }
          });
        },
        { root: null, rootMargin: "0px", threshold: 1 }
      );
      observer.observe(lastMMessageRef.current);

      return () => {
        if (lastMMessageRef.current) {
          observer.unobserve(lastMMessageRef.current);
        }
      };
    }
  }, [lastMMessageRef.current]);

  let result: ReactNode;
  if (messages.length !== 0) {
    result = messages?.map((doc) => (
      <MessageItem
        ref={
          (doc.id === chatData?.lastMessage?.messageId && doc.senderId !== user.uid) ? lastMMessageRef : null
        }
        key={doc.id}
        // @ts-ignore
        chatId={chatId}
        deleteMessage={deleteMessage}
        user={user}
        doc={doc}
        showViewedIcon={
          chatData?.lastMessage?.messageId === doc.id &&
          chatData?.lastMessage?.senderId === user.uid &&
          chatData?.lastMessage?.isReaded
        }
      />
    ));
  }
  if (isEmpty) {
    result = (
      <div style={{ textAlign: "center", marginTop: "10px" }}>Start chat</div>
    );
  }

  return (
    <Box
      ref={containerRef}
      sx={{
        boxSizing: "border-box",
        minWidth: "300px",
        maxWidth: "1000px",
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
