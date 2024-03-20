import React, { useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  collection,
  limit,
  query,
  where,
} from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import CircularProgress from "@mui/material/CircularProgress";
import { useAuth } from "../../hooks/useAuth";
import { db } from "../../firebase/auth";
import { CHATS_D} from "../../firebase_storage_path_constants/firebase_storage_path_constants";
import { createChatDoc } from "../../firebase/utils/message_utils";

function MiddlewareCheckComponent() {
  const { reciever } = useParams();
  const authUser = useAuth();
  const navigate = useNavigate();
  const { state : user } = useLocation();

  const [chatSnap, loading, error] = useCollection(
    query(
      collection(db, CHATS_D),
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
        navigate(`/c/${chatId}`, { state: user , replace:true});
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
