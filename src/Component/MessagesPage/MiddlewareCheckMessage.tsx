import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
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
import { CHATS, EXISTING_CHATS, USERS } from "../../firebase_storage_path_constants/firebase_storage_path_constants";

const createChatDoc = async (myId: string, friendsId: string) => {
  try {
    const createdDoc = await addDoc(collection(db, CHATS), {
      private: true,
      [myId]: true,
      [friendsId]: true,
    });
    await setDoc(doc(db, `${USERS}/${myId}/${EXISTING_CHATS}`, createdDoc.id), {
      companion: friendsId,
      chatId: createdDoc.id,
    });
    await setDoc(
      doc(db, `${USERS}/${friendsId}/${EXISTING_CHATS}`, createdDoc.id),
      {
        companion: myId,
        chatId: createdDoc.id,
      }
    );
  } catch (error) {}
};

function MiddlewareCheckComponent() {
  const { reciever } = useParams();
  const authUser = useAuth();
  const navigate = useNavigate();
  const { state : user } = useLocation();

  const [chatSnap, loading, error] = useCollection(
    query(
      collection(db, CHATS),
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
      navigate(`/chats/${chatId}`, { state: user , replace:true});
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
