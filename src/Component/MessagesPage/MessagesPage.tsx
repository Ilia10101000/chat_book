import React, { useEffect, useContext, useState } from "react";
import { useParams } from "react-router-dom";
import {
  collection,
  limit,
  query,
  where,
  addDoc,
  orderBy,
  getDocs,
  QuerySnapshot,
} from "firebase/firestore";
import {
  useCollection,
  useCollectionData,
} from "react-firebase-hooks/firestore";
import { MessageFooter } from "./MessageFooter";
import { MessageList } from "./MessageList";
import { UserContext } from "../../App";
import { db } from "../../firebase/auth";
import { serverTimestamp } from "firebase/firestore";

const checkIsExistChatDoc = (myId: string, friendsId: string) => {
  return new Promise((res, rej) => {
    const qRef = query(
      collection(db, "chats"),
      where(myId, "==", true),
      where(friendsId, "==", true),
      limit(1)
    );

    getDocs(qRef).then((snap) => {
      if (snap.empty) {
        rej();
        return
      }
      let id = snap.docs[0].id;
      res(id);
    });
  });
};

const createChatDoc = (myId: string, friendsId: string) => {
  return addDoc(collection(db, "chats"), {
    myId: true,
    reciever: true,
  });
};

function MessagesPage() {
  const { reciever } = useParams();
  const authUser = useContext(UserContext);

  const [chatSnap, loading, error] = useCollection(
    query(
      collection(db, "chats"),
      where(authUser.uid, "==", true),
      where(reciever, "==", true),
      limit(1)
    )
  );

  useEffect(() => {
    if (chatSnap.empty) {
      addDoc(collection(db, "chats"), {
        myId: true,
        reciever: true,
      }).then(console.log);
    }
  },[chatSnap])

  if (chatSnap.empty || loading) {
    return (
          <div>Loading</div>
        )
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
