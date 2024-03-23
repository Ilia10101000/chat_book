import React, { ReactNode, useState } from "react";
import {
  USERS_D,
  SENT_FRIENDS_REQUESTS,
  RECEIVED_FRIENDS_REQUESTS,
  FRIENDS_LIST,
  USERS_RT,
  RECEIVED_NEW_MESSAGES,
} from "../../../firebase_storage_path_constants/firebase_storage_path_constants";
import {
  FRIEND,
  SENTREQUEST,
  RECEIVED_REQUEST,
  NO_CONTACT,
  LOADING,
} from "../contact_status";
import { ref as refRT, set,remove } from "firebase/database";
import { useCheckRelationshipUserStatus } from "../../../hooks/useCheckRelationshipUserStatus";
import { db, realTimeDB } from "../../../firebase/auth";
import { Button, CircularProgress } from "@mui/material";
import { doc, setDoc, deleteDoc } from "firebase/firestore";
import { DocumentData } from "firebase/firestore";
import { User } from "firebase/auth";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import DoDisturbIcon from "@mui/icons-material/DoDisturb";
import HandshakeIcon from "@mui/icons-material/Handshake";
import { useTranslation } from "react-i18next";

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
  await set(
    refRT(realTimeDB, `${USERS_RT}/${user2Id}/${RECEIVED_FRIENDS_REQUESTS}`),
    {
      [user1Id]: true,
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
  await remove(
    refRT(
      realTimeDB,
      `${USERS_RT}/${user2Id}/${RECEIVED_FRIENDS_REQUESTS}/${user1Id}`
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
  await remove(
    refRT(
      realTimeDB,
      `${USERS_RT}/${user1Id}/${RECEIVED_FRIENDS_REQUESTS}/${user2Id}`
    )
  );
  }



  
  function ContactButton({
    authUser,
    user,
    handleError,
  }: IContactButton) {
    const [waitingRequestProcessing, setWaitingRequestProcessing] =
    useState(false);
    
    const status: Status = useCheckRelationshipUserStatus(
      authUser.uid,
      user?.id,
      handleError
    );
    
    const {t} = useTranslation()
      const shownButton: { [key: string]: IButtonProp } = {
        [FRIEND]: {
          label: t("contactButton.remove"),
          onClick: removeFromFriendsList,
          color: "error",
          icon: <PersonRemoveIcon />,
        },
        [SENTREQUEST]: {
          label: t("contactButton.cancel"),
          onClick: cancelFriendRequest,
          color: "warning",
          icon: <DoDisturbIcon />,
        },
        [RECEIVED_REQUEST]: {
          label: t("contactButton.accept"),
          onClick: acceptFriendRequest,
          color: "success",
          icon: <HandshakeIcon />,
        },
        [NO_CONTACT]: {
          label: t("contactButton.send"),
          onClick: sendFriendRequest,
          color: "info",
          icon: <PersonAddAlt1Icon />,
        },
        [LOADING]: {
          label: <CircularProgress size={25} />,
          onClick: null,
          color: "primary",
          icon: null,
        },
      };

  const handleClickContactButton = async () => {
    setWaitingRequestProcessing(true);
    try {
      shownButton[status].onClick({ user1Id: authUser.uid, user2Id: user.id });
    } catch (error) {
      handleError(error.message);
    } finally {
      setWaitingRequestProcessing(false);
    }
  };
  return (
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
  );
}

export {
  ContactButton,
  cancelFriendRequest,
  removeFromFriendsList,
  acceptFriendRequest,
};
