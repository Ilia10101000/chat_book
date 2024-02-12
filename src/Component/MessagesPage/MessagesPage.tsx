import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  collection,
  limit,
  query,
  where,
  addDoc,
  setDoc,
  orderBy,
  getDocs,
  QuerySnapshot,
  doc,
} from "firebase/firestore";
import {
  useCollection,
  useCollectionData,
} from "react-firebase-hooks/firestore";
import { MessageFooter } from "./MessageFooter";
import { MessageList } from "./MessageList";
import CircularProgress from "@mui/material/CircularProgress";
import { useAuth } from "../../hooks/useAuth";
import { db } from "../../firebase/auth";
import { serverTimestamp } from "firebase/firestore";

const createChatDoc = async (myId: string, friendsId: string) => {
  try {
   const createdDoc = await addDoc(collection(db, "chats"), {
     [myId]: true,
     [friendsId]: true,
   });
    await setDoc(doc(db, `users/${myId}`, createdDoc.id), {
      companion: friendsId,
    });
    
  } catch (error) {
    
  }
};

function MessagesPage() {
  const { reciever } = useParams();
  const authUser = useAuth();

  const [chatSnap, loading, error] = useCollection(
    query(
      collection(db, "chats"),
      where(authUser.uid, "==", true),
      where(reciever, "==", true),
      limit(1)
    )
  );

  useEffect(() => {
    if (chatSnap?.empty) {
      createChatDoc(authUser.uid, reciever);
    }
  },[chatSnap])

  if (chatSnap?.empty || loading) {
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
  const sendMessage = async (message:string) => {
    await addDoc(collection(db, `chats/${chatSnap?.docs[0].id}/messages`), {
      senderId: authUser.uid,
      text: message,
      timestamp: serverTimestamp(),
    });
  };

  return (
    <div>
      <MessageList
          id={chatSnap.docs[0].id}
          user={authUser}
        />
        <MessageFooter sendMessage={sendMessage} />
    </div>
  );
}

export { MessagesPage };
