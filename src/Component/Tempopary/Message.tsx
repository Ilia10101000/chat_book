import React, { FormEvent, ReactNode, useContext, useEffect, useState } from "react";
import { collection, limit, orderBy, query, setDoc, where,doc } from "firebase/firestore";
import { useCollection, useCollectionData } from "react-firebase-hooks/firestore";
import { useParams } from "react-router-dom";
import { db } from "../../firebase/auth";
import { UserContext } from "../../App";
import { addDoc, serverTimestamp } from "firebase/firestore";
import { TextField } from "@mui/material";

function Message() {
  const authUser = useContext(UserContext);

  const { reciever } = useParams();

  const [chatData, loadingChatData, errorChatData] = useCollection(
    query(
      collection(db, "chats"),
      where(authUser.uid, "==", true),
      where(reciever, "==", true),
      limit(1)
    )
  );

  useEffect(() => {
    if (chatData?.empty) {
      addDoc(collection(db, 'chats'), {
        [authUser.uid]: true,
        reciever:true
      })
    }
  },[])

  const [messages, loadingMessages, errorMessages] = useCollectionData(
    collection(db, `chats/${chatData?.docs[0].id}/messages`)
  );
  console.log(chatData)
  console.log(messages);

  const [messageValue, setMessageValue] = useState<string>('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await addDoc(collection(db, `chats/${chatData?.docs[0].id}/messages`), {
      senderId: authUser.uid,
      text: messageValue,
      timestamp: serverTimestamp(),
    });
    setMessageValue('')
  };

  if (messages?.length === 0) {
    return (
      <>
        <div>Write a message</div>
        <form onSubmit={handleSubmit}>
          <TextField
            value={messageValue}
            onChange={(e) => setMessageValue(e.target.value)}
          />
        </form>
      </>
    );
  }
  return (
    <>
      {messages?.map((message) => (
        <div>{message.text}</div>
      ))}
      <form onSubmit={(e) => handleSubmit(e)}>
        <TextField
          value={messageValue}
          onChange={(e) => setMessageValue(e.target.value)}
        />
      </form>
    </>
  );
}

export { Message };
