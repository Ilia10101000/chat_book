import React, { useCallback, useEffect, useState } from "react";
import {
  USERS_D,
  SENT_FRIENDS_REQUESTS,
  RECEIVED_FRIENDS_REQUESTS,
  FRIENDS_LIST,
} from "../../../firebase_storage_path_constants/firebase_storage_path_constants";
import {
  FRIEND,
  SENTREQUEST,
  RECEIVED_REQUEST,
  NO_CONTACT,
  LOADING,
} from "../contact_status";
import { useCheckRelationshipUserStatus } from "../../../hooks/useCheckRelationshipUserStatus";
import { db } from "../../../firebase/auth";
import { Button, CircularProgress, Alert } from "@mui/material";
import { doc, setDoc, deleteDoc } from "firebase/firestore";
import { DocumentData } from "firebase/firestore";
import { User } from "firebase/auth";

type Status =
  | typeof FRIEND
  | typeof SENTREQUEST
  | typeof RECEIVED_REQUEST
  | typeof NO_CONTACT
  | typeof LOADING;

interface IContactButton {
  user: DocumentData;
  authUser: User;
  handleError: (errorMessage: string) => void;
}

function ContactButton({ authUser, user, handleError }: IContactButton) {
  const [waitingRequestProcessing, setWaitingRequestProcessing] =
    useState(false);
  const [handleSuccess, setHandleSuccess] = useState(null);

  useEffect(() => {
    if (handleSuccess) {
      setTimeout(() => {
        setHandleSuccess(null)
      },2000)
    }
  },[handleSuccess])

  const status: Status = useCheckRelationshipUserStatus(
    authUser.uid,
    user.id,
    handleError
  );
  const sendFriendRequest = async () => {
    setWaitingRequestProcessing(true);
    try {
      await setDoc(
        doc(db, `${USERS_D}/${authUser.uid}/${SENT_FRIENDS_REQUESTS}`, user.id),
        {
          id: user.id,
          displayName: user.displayName,
          photoURL: user.photoURL || "",
        }
      );
      await setDoc(
        doc(
          db,
          `${USERS_D}/${user.id}/${RECEIVED_FRIENDS_REQUESTS}`,
          authUser.uid
        ),
        {
          id: authUser.uid,
          displayName: authUser.displayName,
          photoURL: authUser.photoURL || "",
        }
      );
      setHandleSuccess("sent request");
    } catch (error) {
      handleError(error.message);
    } finally {
      setWaitingRequestProcessing(false);
    }
  };

  const removeFromFriendsList = async () => {
    setWaitingRequestProcessing(true);
    try {
      await deleteDoc(
        doc(db, `${USERS_D}/${authUser.uid}/${FRIENDS_LIST}/`, user.id)
      );
      await deleteDoc(
        doc(db, `${USERS_D}/${user.id}/${FRIENDS_LIST}/`, authUser.uid)
      );
      setHandleSuccess("Successful removed");
    } catch (error) {
      handleError(error.message);
    } finally {
      setWaitingRequestProcessing(false);
    }
  };
  const cancelFriendRequest = useCallback(
    () => async () => {
      try {
        await deleteDoc(
          doc(
            db,
            `${USERS_D}/${authUser.uid}/${SENT_FRIENDS_REQUESTS}/`,
            user.id
          )
        );
        await deleteDoc(
          doc(
            db,
            `${USERS_D}/${user.id}/${RECEIVED_FRIENDS_REQUESTS}/`,
            authUser.uid
          )
        );
        setHandleSuccess("canceled request");
      } catch (error) {
        handleError(error.message);
      }
    },
    []
  );

  const acceptFriendRequest = async () => {
      setWaitingRequestProcessing(true);
      try {
        await deleteDoc(
          doc(
            db,
            `${USERS_D}/${user.id}/${SENT_FRIENDS_REQUESTS}/`,
            authUser.uid
          )
        );
        await deleteDoc(
          doc(
            db,
            `${USERS_D}/${authUser.uid}/${RECEIVED_FRIENDS_REQUESTS}/`,
            user.id
          )
        );
        await setDoc(
          doc(db, `${USERS_D}/${authUser.uid}/${FRIENDS_LIST}`, user.id),
          {
            id: user.id,
            displayName: user.displayName,
            photoURL: user.photoURL,
          }
        );
        await setDoc(
          doc(db, `${USERS_D}/${user.id}/${FRIENDS_LIST}`, authUser.uid),
          {
            id: authUser.uid,
            displayName: authUser.displayName,
            photoURL: authUser.photoURL,
          }
        );
        setHandleSuccess("accepted request");
      } catch (error) {
        handleError(error.message);
      } finally {
        setWaitingRequestProcessing(false);
      }
    }

  const shownButton = {
    [FRIEND]: {
      label: "Remove from friend",
      onClick: removeFromFriendsList,
    },
    [SENTREQUEST]: {
      label: "Cancel friend request",
      onClick: cancelFriendRequest,
    },
    [RECEIVED_REQUEST]: {
      label: "Accept friend request",
      onClick: acceptFriendRequest,
    },
    [NO_CONTACT]: {
      label: "Send friend request",
      onClick: sendFriendRequest,
    },
    [LOADING]: {
      label: <CircularProgress />,
      onClick: null,
    },
  };
  return (
    <>
      <Button
        size="small"
        disabled={waitingRequestProcessing}
        onClick={shownButton[status].onClick}
      >
        {shownButton[status].label}
      </Button>
      {handleSuccess && <Alert severity="success">{handleSuccess}</Alert>}
    </>
  );
}

export { ContactButton };
