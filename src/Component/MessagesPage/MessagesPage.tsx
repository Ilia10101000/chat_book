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
import { ref, storage } from "../../firebase/auth";
import { uploadString, getDownloadURL  } from "firebase/storage";
import { CHATS_D, CHATS_S, MESSAGES } from "../../firebase_storage_path_constants/firebase_storage_path_constants";


const fileToDataURL = async (file: File) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      resolve(reader.result);
    };

    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsDataURL(file);
  });
};
const generateUniqueFileName = (userId: string) => {
  return `${Date.now()}-${userId}-${Math.floor(Math.random() * 10000) + 1}`;
}

const filesToDataURLs = async (files: File[]) => {
  const promises = files.map((file) => fileToDataURL(file));

  const dataURLs = await Promise.all(promises);

  return dataURLs;
};


function MessagesPage() {
  const { chatId } = useParams();
  const { state: companion } = useLocation();
  const authUser = useAuth();

  const [messagesList, loading, error] = useCollectionData(
    query(collection(db, `${CHATS_D}/${chatId}/${MESSAGES}`), orderBy("timestamp"))
    );
    if (!companion) {
      return <Navigate to="/" />;
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
  const sendImages = async (imageList:File[]) => {
    try {
      const imagesDateURL = await filesToDataURLs(imageList);
      const imageListWithUniqueId = imagesDateURL.map((dataURL) => ({
        id: generateUniqueFileName(authUser.uid),
        data:dataURL
      }));
      const imageURLS = await Promise.all(
        imageListWithUniqueId.map(async (imageDataURL:{id:string,data:string}) => {
          const imageRef = ref(storage, `${CHATS_S}/${chatId}/${imageDataURL.id}`);
          await uploadString(imageRef, imageDataURL.data, 'data_url');
          const url = await getDownloadURL(imageRef);
          return url
        })
      );
      await Promise.all(imageURLS.map(async (url) => {
        await addDoc(collection(db, `${CHATS_D}/${chatId}/${MESSAGES}`), {
          senderId: authUser.uid,
          type:'image',
          content: url,
          timestamp: serverTimestamp(),
          isReaded: false,
        });
      }))
    } catch (error) {
      console.log(error.message)
    }
  };
  const sendMessage = async (message: string) => {
    await addDoc(collection(db, `${CHATS_D}/${chatId}/${MESSAGES}`), {
      senderId: authUser.uid,
      type:"text",
      content: message,
      timestamp: serverTimestamp(),
      isReaded: false,
    });
    await updateDoc(doc(db, `${CHATS_D}/${chatId}`), {
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
      <MessageAppBar companion={companion} />
      <MessageList
        messages={messagesList}
        isEmpty={messagesList.length === 0}
        user={authUser}
      />
      <MessageFooter sendImages={sendImages} sendMessage={sendMessage} />
    </Box>
  );
}

export { MessagesPage };
