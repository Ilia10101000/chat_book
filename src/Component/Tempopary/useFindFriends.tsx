import React from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { db } from "../../firebase/auth";
import { collection, query, where } from "firebase/firestore";


const useFindFriends = ({ text }: { text: string }) => {
    const [list, loading, error] = useCollectionData(
      query(collection(db, "users"), orderByChild("name"), equalTo(searchValue))
    );

    if (text.length <= 0) {
        return null
    }
    
    return list
};

export {useFindFriends}