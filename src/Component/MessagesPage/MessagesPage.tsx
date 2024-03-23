import React, { useEffect } from "react";
import { Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  collection,
  query,
  doc,
  orderBy,
} from "firebase/firestore";
import { ref } from "firebase/database";
import { useCollectionData, useDocument } from "react-firebase-hooks/firestore";
import { MessageFooter } from "./MessageFooter";
import { MessageList } from "./MessageList";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { db, realTimeDB } from "../../firebase/auth";
import { MessageAppBar } from "./MessageAppBar";
import {
  CHATS_D,
  CHATS_RT,
  MESSAGES,
} from "../../firebase_storage_path_constants/firebase_storage_path_constants";
import { useObjectVal } from "react-firebase-hooks/database";
import {
  sendImages,
  setIsUserTyping,
  sendMessage,
  setViewedMessage,
  deleteChat,
  setReceiveNewMessageStatus,
} from "../../firebase/utils/message_utils";
import { useAuth } from "../../App";
import { useTranslation } from "react-i18next";

function MessagesPage() {
  const { chatId } = useParams();
  const { state: companion } = useLocation();
  const authUser = useAuth();
  const authUserId = authUser.uid;
  const companionId = companion?.id;

  const [messagesList, loadingML, errorML] = useCollectionData(
    query(
      collection(db, `${CHATS_D}/${chatId}/${MESSAGES}`),
      orderBy("timestamp")
    )
  );

  
  const [isUsersTyping, loadingUT, errorUT] = useObjectVal<{
    [key:string]: boolean;
  }>(ref(realTimeDB, `${CHATS_RT}/${chatId}`));
  
  const navigate = useNavigate();
  const {t} = useTranslation()
  
  useEffect(() => {
    setIsUserTyping(chatId, companion?.id,authUser.uid);
  }, [])
  
  const [chatDoc, loadingCD, errorCD] = useDocument(
    doc(db, `${CHATS_D}/${chatId}`)
  );
  
  if (!loadingCD && !chatDoc.exists()) {
    return <Navigate to={`/u/${authUser.uid}`} />;
  }
  if (!companionId || !chatId) {
    return <Navigate to={`/u/${authUser.uid}`} />;
  }

  if (loadingML) {
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
  if (errorML) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        {t("error.desc")}
      </div>
    );
  }

  const handleDeleteChat = async () => {
    try {
      await deleteChat(messagesList, chatId,authUserId,companionId);
      navigate(`/u/${authUserId}`, { replace: true });
    } catch (error) {
      
    }
  } 

  const handleSetViewedMessage = (chatId: string) => {
    setViewedMessage(authUserId,chatId);
  };

  const setNewMessageToCompanion = async () => {
    await setReceiveNewMessageStatus(chatId, companion?.id);
  }

  return (
    <Box
      sx={{
        height: "100%",
        maxHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <MessageAppBar
        deleteChat={handleDeleteChat}
        isTyping={isUsersTyping?.[companionId]}
        companion={companion}
      />
      <MessageList
        delLabel={t('login.delete')}
        messages={messagesList}
        isEmpty={messagesList.length === 0}
        user={authUser}
        chatId={chatId}
        setViewedMessage={handleSetViewedMessage}
      />
      <MessageFooter
        isAuthUserTyping={isUsersTyping?.[authUserId]}
        chatId={chatId}
        sendImages={sendImages}
        authUserId={authUserId}
        sendMessage={sendMessage}
        setNewMessageToCompanion={setNewMessageToCompanion}
      />
    </Box>
  );
}

export { MessagesPage };
