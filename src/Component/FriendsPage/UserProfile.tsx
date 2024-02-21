import React, { useEffect, useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { Link, useParams } from "react-router-dom";
import { db } from "../../firebase/auth";
import { Button } from "@mui/material";
import User from "../../img/default-user.svg";
import { useAuth } from "../../hooks/useAuth";

const UserProfile = () => {
  const { id } = useParams();

  const authUser = useAuth()

  const [user, loading, errorloading] = useDocumentData(doc(db, "users", id));
  const [waitingRequestProcessing, setWaitingRequestProcessing] = useState(false);
  const [handleError, setHandleError] = useState(null);

  useEffect(() => {
    if (handleError) {
      setTimeout(() => {
        setHandleError(null)
      },2000)
    }
  },[handleError])

  if (loading) {
    return <div>Loading...</div>;
  }
  if (errorloading) {
    return <div>Some error has occured</div>;
  }


  const addToFriends = async () => {
    setWaitingRequestProcessing(true);
    try {
      await setDoc(doc(db, `users/${authUser.uid}/sentFriendsRequests`, user.id), {
        id: user.id,
        displayName: user.displayName,
        photoURL:user.photoURL || ''
      })
      await setDoc(
        doc(db, `users/${user.id}/receivedFriendsRequests`, authUser.uid),
        {
          id: authUser.uid,
          displayName: authUser.displayName,
          photoURL: authUser.photoURL || "",
        }
      );
    } catch (error) {
      setHandleError(error.message)
    } finally {
      setWaitingRequestProcessing(false);
    }
  }

  return (
    <div>
      <div style={{ display: "flex" }}>
        <img
          style={{ display: "flex", margin: " 0px 40px" }}
          src={user.photoURL || User}
        />
        <div>
          <div>{user.displayName}</div>
          <div>{user.email}</div>
        </div>
      </div>
      <Link to={`/messages/${id}`} state={user}>
        <Button>Start chat</Button>
      </Link>
      <Button disabled={waitingRequestProcessing} onClick={addToFriends}>
        Add to friends
      </Button>
    </div>
  );
};

export { UserProfile };
