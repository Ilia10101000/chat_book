import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../../../firebase/auth";
import {
  POSTS,
  USERS_D,
} from "../../../firebase_storage_path_constants/firebase_storage_path_constants";
import { OwnPosts } from "./PostsCollection";

interface IPostTagsData {
  id: string;
  ownerPostId: string;
  postId: string;
}

interface IPostTagsList {
  postTagsList: IPostTagsData[];
}

function ThirdPartyPosts({ postTagsList }: IPostTagsList) {
  const [readyPostList, setReadyPostList] = useState([]);

  useEffect(() => {
      const postsPromises = postTagsList.map(async (tagPostData) => {
        console.log(readyPostList);
      const postRef = doc(
        db,
        `${USERS_D}/${tagPostData.ownerPostId}/${POSTS}/${tagPostData.postId}`
        );
        return await getDoc(postRef)
    });
      
      Promise.all(postsPromises).then(result => result.map(docSnap => docSnap.data()
      )).then(data => setReadyPostList(data)).catch(error => console.log(error.message))

  }, [postTagsList]);
    
    if (!readyPostList.length) {
        return null
    }

  return <OwnPosts posts={readyPostList}/>;
}
export { ThirdPartyPosts };
