import React, { useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { collection, limit, query, where, addDoc, orderBy } from "firebase/firestore";
import { useCollection, useCollectionData } from 'react-firebase-hooks/firestore';
import { MessageFooter } from './MessageFooter';
import { MessageList } from './MessageList';
import { UserContext } from '../../App';
import { db } from '../../firebase/auth';
import { serverTimestamp } from 'firebase/firestore';

function MessagesPage() {

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
    console.log(chatData)

  const createChatCollection = async () => {
    await addDoc(collection(db, "chats"), {
      [authUser.uid]: true,
      reciever: true,
    });
  }

    useEffect(() => {
      if (chatData?.empty) {
        createChatCollection()
      }
    });

  const [messages, loadingMessages, errorMessages] = useCollectionData(
    query(
      collection(db, `chats/${chatData?.docs[0]?.id}/messages`),
      orderBy("timestamp")
    )
  );

  const sendMessage = async (message:string) => {
    await addDoc(collection(db, `chats/${chatData?.docs[0].id}/messages`), {
      senderId: authUser.uid,
      text: message,
      timestamp: serverTimestamp(),
    });
  };

  console.log(errorChatData)
  console.log(errorMessages)

  if (loadingChatData) {
    return (
      <div>Loading...</div>
    )
  }
    return (
      <div>
        <MessageList
          user={authUser}
          loading={loadingMessages}
          messages={messages}
        />
        <MessageFooter sendMessage={sendMessage} />
      </div>
    );
}

export {MessagesPage}