import React from "react";
import { User } from "firebase/auth";
import { Paper } from "@mui/material";
import { DocumentData } from "firebase/firestore";

interface IMessageItem {
  doc: DocumentData;
  user: User;
}

function MessageItem({ doc, user }: IMessageItem) {
    
  const { timestamp, content, senderId,type } = doc;

  let hour = timestamp?.toDate().getHours();

  let minutes = timestamp?.toDate().getMinutes();
  minutes = minutes < 10 ? "0" + minutes : minutes;

  const createdAt = `${hour}:${minutes}`;

  if (type == 'text') {
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
        {content}
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
  else if (type == 'image') {
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
        <img style={{width:'100%'}} src={content} alt={content} />
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

}

export { MessageItem };
