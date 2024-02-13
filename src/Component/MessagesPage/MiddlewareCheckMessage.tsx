import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  collection,
  limit,
  query,
  where,
  addDoc,
  setDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import CircularProgress from "@mui/material/CircularProgress";
import { useAuth } from "../../hooks/useAuth";
import { db } from "../../firebase/auth";

const createChatDoc = async (myId: string, friendsId: string) => {
  try {
    const createdDoc = await addDoc(collection(db, "chats"), {
      private: true,
      [myId]: true,
      [friendsId]: true,
    });
    await setDoc(doc(db, `users/${myId}/existingChats`, createdDoc.id), {
      companion: friendsId,
      chatID: createdDoc,
    });
    await setDoc(doc(db, `users/${friendsId}/existingChats`, createdDoc.id), {
      companion: myId,
      chatID: createdDoc,
    });
  } catch (error) {}
};

function MiddlewareCheckComponent() {
  const { reciever } = useParams();
  const authUser = useAuth();
  const navigate = useNavigate()

  const [chatSnap, loading, error] = useCollection(
    query(
      collection(db, "chats"),
      where("private", "==", true),
      where(authUser.uid, "==", true),
      where(reciever, "==", true),
      limit(1)
    )
  );

  useEffect(() => {
    if (chatSnap?.empty) {
      createChatDoc(authUser.uid, reciever);
    }
    if (chatSnap && !chatSnap.empty) {
      const chatId = chatSnap.docs[0].id
      navigate(`/chats/${chatId}`);
    }
  }, [chatSnap]);

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

export { MiddlewareCheckComponent };
