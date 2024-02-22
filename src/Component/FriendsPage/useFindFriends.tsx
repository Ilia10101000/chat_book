import React from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { db } from "../../firebase/auth";
import { collection, query, where, limit } from "firebase/firestore";
import { USERS } from "../../firebase_storage_path_constants/firebase_storage_path_constants";

const useFindFriends = (text: string ) => {
  const [list] = useCollectionData(
    query(
      collection(db, USERS),
      where("displayName", ">=", text),
      where("displayName", "<=", text + "\uf8ff"),
      limit(5)
    )
  );

  if (text.length <= 0) {
    return null;
  }

  return list;
};

export { useFindFriends };
