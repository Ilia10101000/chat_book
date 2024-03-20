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
import { Button, CircularProgress } from "@mui/material";
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
  onClick: ({user1Id,user2Id}) => void | null;
  color:
    | "inherit"
    | "error"
    | "warning"
    | "success"
    | "info"
    | "primary"
    | "secondary";
}

const sendFriendRequest = async ({user1Id,user2Id}:{user1Id:string;user2Id:string}) => {
    await setDoc(
      doc(db, `${USERS_D}/${user1Id}/${SENT_FRIENDS_REQUESTS}`, user2Id),
      {
        id: user2Id,
      }
    );
    await setDoc(
      doc(db, `${USERS_D}/${user2Id}/${RECEIVED_FRIENDS_REQUESTS}`, user1Id),
      {
        id: user1Id,
      }
    );
};

const removeFromFriendsList = async ({user1Id,user2Id}:{user1Id:string;user2Id:string}) => {
    await deleteDoc(
      doc(db, `${USERS_D}/${user1Id}/${FRIENDS_LIST}/`, user2Id)
    );
    await deleteDoc(
      doc(db, `${USERS_D}/${user2Id}/${FRIENDS_LIST}/`, user1Id)
    );
};

const cancelFriendRequest = async ({user1Id,user2Id}:{user1Id:string;user2Id:string}) => {
      await deleteDoc(
        doc(
          db,
          `${USERS_D}/${user1Id}/${SENT_FRIENDS_REQUESTS}/`,
          user2Id
        )
      );
      await deleteDoc(
        doc(
          db,
          `${USERS_D}/${user2Id}/${RECEIVED_FRIENDS_REQUESTS}/`,
          user1Id
        )
      );
  }

const acceptFriendRequest = async ({user1Id,user2Id}:{user1Id:string;user2Id:string}) => {
      await deleteDoc(
        doc(
          db,
          `${USERS_D}/${user2Id}/${SENT_FRIENDS_REQUESTS}/`,
          user1Id
        )
      );
      await deleteDoc(
        doc(
          db,
          `${USERS_D}/${user1Id}/${RECEIVED_FRIENDS_REQUESTS}/`,
          user2Id
        )
      );
      await setDoc(
        doc(db, `${USERS_D}/${user1Id}/${FRIENDS_LIST}`, user2Id),
        {
          id: user2Id,
        }
      );
      await setDoc(
        doc(db, `${USERS_D}/${user2Id}/${FRIENDS_LIST}`, user1Id),
        {
          id: user1Id,
        }
      );
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

function ContactButton({ authUser, user, handleError }: IContactButton) {
  const [waitingRequestProcessing, setWaitingRequestProcessing] =
    useState(false);

  const status: Status = useCheckRelationshipUserStatus(
    authUser.uid,
    user?.id,
    handleError
  );

  const handleClickContactButton = async () => {
    setWaitingRequestProcessing(true);
    try {
      shownButton[status].onClick({user1Id:authUser.uid,user2Id:user.id});
    } catch (error) {
      handleError(error.message);
    } finally {
      setWaitingRequestProcessing(false);
    }
  }
  return (
    <div style={{ position: "relative" }}>
      <Button
        startIcon={shownButton[status].icon}
        variant="contained"
        color={shownButton[status].color}
        size="small"
        disabled={waitingRequestProcessing || status === LOADING}
        onClick={handleClickContactButton}
      >
        {shownButton[status].label}
      </Button>
    </div>
  );
}

export { ContactButton, cancelFriendRequest, removeFromFriendsList,  };
