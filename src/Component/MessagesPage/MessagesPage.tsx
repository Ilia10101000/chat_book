import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  collection,
  limit,
  query,
  where,
  addDoc,
  setDoc,
  updateDoc,
  doc,
  orderBy,
} from "firebase/firestore";
import {
  useCollectionData,
} from "react-firebase-hooks/firestore";
import { MessageFooter } from "./MessageFooter";
import { MessageList } from "./MessageList";
import CircularProgress from "@mui/material/CircularProgress";
import { useAuth } from "../../hooks/useAuth";
import { db } from "../../firebase/auth";
import { serverTimestamp } from "firebase/firestore";

function MessagesPage() {
  const { chatId } = useParams();
  const authUser = useAuth();

  const [messages, loading, error] = useCollectionData(
    query(
      collection(db, "chats"),
      orderBy('timestamp')
    )
  );

  console.log(messages)

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </div>
    );
  }
  if (error) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        Some error occured! try again
      </div>
    );
  }
  const sendMessage = async (message: string) => {
    await addDoc(collection(db, `chats/${chatId}/messages`), {
      senderId: authUser.uid,
      text: message,
      timestamp: serverTimestamp(),
      isReaded: false
    });
    await updateDoc(doc(db, `chats/${chatId}`), {
      lastMessage: message,
    });
  };

  return (
    <div>
      <MessageList
        messages={messages}
        isEmpty={messages.length === 0}
        user={authUser}
      />
      <MessageFooter sendMessage={sendMessage} />
    </div>
  );
}

export { MessagesPage };



/*

{
  user1:{
    name:string,
    uid:string,
    existingChats:[]
  }
}




{
  chats:[]
}



{
user2:{
  name:string,
  uid:string,
  existingChats:[]
}
}




*/