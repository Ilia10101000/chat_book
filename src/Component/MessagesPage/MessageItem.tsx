import React from "react";
import { User } from "firebase/auth";
import { Paper } from "@mui/material";
import { DocumentData } from "firebase/firestore";

interface IMessageItem {
  doc: DocumentData;
  user: User;
}

function MessageItem({ doc, user }: IMessageItem) {
    
  const { timestamp, text, senderId } = doc;

  let hour = timestamp?.toDate().getHours();

  let minutes = timestamp?.toDate().getMinutes();
  minutes = minutes < 10 ? "0" + minutes : minutes;

  const createdAt = `${hour}:${minutes}`;

  return (
    <Paper
      key={timestamp}
      elevation={20}
      sx={{
        p: 2,
        alignSelf: senderId == user.uid ? "flex-end" : "flex-start",
        maxWidth: "200px",
        overflowWrap: "break-word",
        position: "relative",
      }}
    >
      {text}
      <div
        style={{
          position: "absolute",
          bottom: "0px",
          right: "5px",
          fontSize: "11px",
          color: "grey",
          userSelect: "none",
        }}
      >
        {createdAt}
      </div>
    </Paper>
  );
}

export { MessageItem };
