import React, { ReactNode, useState } from "react";
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
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import DoDisturbIcon from "@mui/icons-material/DoDisturb";
import HandshakeIcon from "@mui/icons-material/Handshake";

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

interface IButtonProp {
  label: string | ReactNode;
  icon: ReactNode | null;
  onClick: () => void | null;
  color:
    | "inherit"
    | "error"
    | "warning"
    | "success"
    | "info"
    | "primary"
    | "secondary";
}

function ContactButton({ authUser, user, handleError }: IContactButton) {
  const [waitingRequestProcessing, setWaitingRequestProcessing] =
    useState(false);

  const status: Status = useCheckRelationshipUserStatus(
    authUser.uid,
    user?.id,
    handleError
  );
  const sendFriendRequest = async () => {
    setWaitingRequestProcessing(true);
    try {
      await setDoc(
        doc(db, `${USERS_D}/${authUser.uid}/${SENT_FRIENDS_REQUESTS}`, user.id),
        {
          id: user.id,
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
        }
      );
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
    } catch (error) {
      handleError(error.message);
    } finally {
      setWaitingRequestProcessing(false);
    }
  };
  const cancelFriendRequest = async () => {
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
      } catch (error) {
        handleError(error.message);
      }
    }

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
          }
        );
        await setDoc(
          doc(db, `${USERS_D}/${user.id}/${FRIENDS_LIST}`, authUser.uid),
          {
            id: authUser.uid,
          }
        );
      } catch (error) {
        handleError(error.message);
      } finally {
        setWaitingRequestProcessing(false);
      }
    }

  
  
  const shownButton: { [key: string]: IButtonProp } = {
    [FRIEND]: {
      label: "Remove from friend",
      onClick: removeFromFriendsList,
      color: "error",
      icon:<PersonRemoveIcon/>
    },
    [SENTREQUEST]: {
      label: "Cancel friend request",
      onClick: cancelFriendRequest,
      color: "warning",
      icon:<DoDisturbIcon/>
    },
    [RECEIVED_REQUEST]: {
      label: "Accept friend request",
      onClick: acceptFriendRequest,
      color: "success",
      icon:<HandshakeIcon/>
    },
    [NO_CONTACT]: {
      label: "Send friend request",
      onClick: sendFriendRequest,
      color: "info",
      icon:<PersonAddAlt1Icon/>
    },
    [LOADING]: {
      label: <CircularProgress size={25}/>,
      onClick: null,
      color: "primary",
      icon:null
    },
  };
  return (
    <div style={{ position: "relative" }}>
      <Button
        startIcon={shownButton[status].icon}
        variant="contained"
        color={shownButton[status].color}
        size="small"
        disabled={waitingRequestProcessing || status === LOADING}
        onClick={shownButton[status].onClick}
      >
        {shownButton[status].label}
      </Button>
    </div>
  );
}

export { ContactButton };
