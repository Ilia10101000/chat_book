import { Paper } from '@mui/material';
import Avatar from "@mui/material/Avatar";
import React, { useEffect } from 'react';
import User from '../../img/default-user.svg'
import { Link } from 'react-router-dom';
import { useDocument, useDocumentData } from "react-firebase-hooks/firestore";
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/auth';

// const getData = async ({
//   companion,
//   chatId,
// }: {
//   companion: string;
//   chatId: string;
// }) => {
//   const userDoc = await getDoc(doc(db, `users/${companion}`));
//   const chatDoc = await getDoc(doc(db, `chats/${chatId}`));
//   console.log(userDoc.data());
//   console.log(chatDoc.data());
// };

function MessageListItemLink({
  companion,
  chatId,
}: {
  companion: string,
  chatId: string
    }) {
    
    const [user, loadingURL, errorURL, snapshotURL] = useDocumentData(
      doc(db, `users/${companion}`)
    );
    const [lastMessage, loadingLM, errorLM, snapshotLM] = useDocumentData(
      doc(db, `chats/${chatId}`)
    );

    console.log(chatId);
  
//     useEffect(() => {
//       getData({ companion, chatId });
//   })

  if (loadingLM || loadingURL) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      <Link to={`/chats/${chatId}`}>
        <Paper
          elevation={10}
          sx={{ display: "flex", alignItems: "center", gap: 2 }}
        >
          <Avatar
            alt={user.displayName}
            src={user?.photoURL || User}
            sx={{ width: 56, height: 56 }}
          />
          <div>{lastMessage?.lastMessage}</div>
        </Paper>
      </Link>
    </div>
  );
}

export {MessageListItemLink}