import React, { createContext, useContext } from 'react';
import { collection } from 'firebase/firestore';
import { db } from '../firebase/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { USERS_D, RECEIVED_FRIENDS_REQUESTS } from '../firebase_storage_path_constants/firebase_storage_path_constants';

const ReceivedFriendRequestList = createContext(null)

interface IReceivedFriendRequestList {
  authUserId: string;
  children:React.ReactNode
}

function ReceivedFriendListContext({authUserId, children}:IReceivedFriendRequestList) {
      const [receivedFriendsRequest, loadingRFR, errorRFR] = useCollectionData(
        collection(db, `${USERS_D}/${authUserId}/${RECEIVED_FRIENDS_REQUESTS}`)
      );
  return (
    <ReceivedFriendRequestList.Provider value={[receivedFriendsRequest, loadingRFR, errorRFR]}>
      {children}
    </ReceivedFriendRequestList.Provider>
  )
}


function useReceivedFriendList() {
  return useContext(ReceivedFriendRequestList)
}

export {useReceivedFriendList, ReceivedFriendListContext}