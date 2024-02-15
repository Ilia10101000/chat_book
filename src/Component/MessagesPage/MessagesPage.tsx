import React from "react";
import { Navigate, useLocation, useParams } from "react-router-dom";
import {
  collection,
  query,
  addDoc,
  updateDoc,
  doc,
  orderBy
} from "firebase/firestore";
import {
  useCollectionData,
} from "react-firebase-hooks/firestore";
import { MessageFooter } from "./MessageFooter";
import { MessageList } from "./MessageList";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { useAuth } from "../../hooks/useAuth";
import { db } from "../../firebase/auth";
import { serverTimestamp } from "firebase/firestore";
import { MessageAppBar } from "./MessageAppBar";

function MessagesPage() {
  const { chatId } = useParams();
  const authUser = useAuth();
  const { state: companion } = useLocation();

  const [messages, loading, error] = useCollectionData(
    query(collection(db, `chats/${chatId}/messages`), orderBy("timestamp"))
  );
  if (!companion) {
    return <Navigate to='/'/>
  }
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
      isReaded: false,
    });
    await updateDoc(doc(db, `chats/${chatId}`), {
      lastMessage: message,
    });
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <MessageAppBar companion={companion}/>
      <MessageList
        messages={messages}
        isEmpty={messages.length === 0}
        user={authUser}
      />
      <MessageFooter sendMessage={sendMessage} />
    </Box>
  );
}

export { MessagesPage };
