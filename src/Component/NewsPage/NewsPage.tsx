import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/auth';
import { FRIENDS_LIST, POSTS, USERS_D } from '../../firebase_storage_path_constants/firebase_storage_path_constants';



function NewsPage() {
    const authUser = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [newsList, setNewsList] = useState([]);

    const fetchNewsList = async () => {
        setLoading(true)
        try {
            const friendsListSnapshot = await getDocs(collection(db, `${USERS_D}/${authUser.uid}/${FRIENDS_LIST}`));
            if (!friendsListSnapshot.empty) {
                const friendsList = [];
                friendsListSnapshot.forEach(snap => friendsList.push(snap.data()));
                const friendsPostsPromises = friendsList.map(async ({ id }) => await getDocs(collection(db, `${USERS_D}/${id}/${POSTS}`)));
                const friendsPostsList = [];
                await Promise.all(friendsPostsPromises).then(res => {
                    return res
                }).then(postsSnap => postsSnap.forEach(snap => {
                    if (!snap.empty) {
                        snap.forEach((postSnap) => friendsPostsList.push(postSnap.data()));
                    }
                })).catch(error => console.log(error.message));
                console.log(friendsPostsList);

            }
        } catch (error) {
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchNewsList()
    },[authUser.uid])

  return (
      <div>
          {loading && <div>Loading...</div>}
          {error && <div>{error}</div>}
    </div>
  )
}

export {NewsPage}