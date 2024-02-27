import React, { useEffect, useState } from "react";
import { doc, setDoc, deleteDoc } from "firebase/firestore";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { Link, useParams } from "react-router-dom";
import { db } from "../../firebase/auth";
import { Alert, Button, CircularProgress, Box, Divider } from "@mui/material";
import User from "../../img/default-user.svg";
import { useAuth } from "../../hooks/useAuth";
import { useCheckRelationshipUserStatus } from "../../hooks/useCheckRelationshipUserStatus";
import {
  FRIEND,
  SENTREQUEST,
  RECEIVED_REQUEST,
  NO_CONTACT,
  LOADING,
} from "./contact_status";
import {
  USERS_D,
  SENT_FRIENDS_REQUESTS,
  RECEIVED_FRIENDS_REQUESTS,
  FRIENDS_LIST,
} from "../../firebase_storage_path_constants/firebase_storage_path_constants";

type Status =
  | typeof FRIEND
  | typeof SENTREQUEST
  | typeof RECEIVED_REQUEST
  | typeof NO_CONTACT
  | typeof LOADING;

const UserProfile = () => {
  const { id } = useParams();

  const authUser = useAuth();

  const [user, loading, errorloading] = useDocumentData(doc(db, "users", id));
  const [waitingRequestProcessing, setWaitingRequestProcessing] =
    useState(false);
  const [handleError, setHandleError] = useState(null);
  const [handleSuccess, setHandleSuccess] = useState(null);
  console.log(user);

  const status: Status = useCheckRelationshipUserStatus(
    authUser.uid,
    id,
    setHandleError
  );

  useEffect(() => {
    if (handleError) {
      setTimeout(() => {
        setHandleError(null);
      }, 2000);
    }
  }, [handleError]);

  useEffect(() => {
    if (handleSuccess) {
      setTimeout(() => {
        setHandleSuccess(null);
      }, 2000);
    }
  }, [handleSuccess]);

  if (loading) {
    return <div>Loading...</div>;
  }
  if (errorloading) {
    return <div>Some error has occured</div>;
  }

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
      setHandleError(error.message);
    } finally {
      setWaitingRequestProcessing(false);
    }
  };

  const removeFromFriendsList = async () => {
    setWaitingRequestProcessing(true);
    try {
      await deleteDoc(
        doc(db, `${USERS_D}/${authUser.uid}/${FRIENDS_LIST}/`, id)
      );
      await deleteDoc(
        doc(db, `${USERS_D}/${id}/${FRIENDS_LIST}/`, authUser.uid)
      );
      setHandleSuccess("Successful removed");
    } catch (error) {
      setHandleError(error.message);
    } finally {
      setWaitingRequestProcessing(false);
    }
  };
  const cancelFriendRequest = async () => {
    try {
      await deleteDoc(
        doc(db, `${USERS_D}/${authUser.uid}/${SENT_FRIENDS_REQUESTS}/`, id)
      );
      await deleteDoc(
        doc(db, `${USERS_D}/${id}/${RECEIVED_FRIENDS_REQUESTS}/`, authUser.uid)
      );
      setHandleSuccess("canceled request");
    } catch (error) {
      setHandleError(error.message);
    }
  };

  const acceptFriendRequest = async () => {
    setWaitingRequestProcessing(true);
    try {
      await deleteDoc(
        doc(db, `${USERS_D}/${id}/${SENT_FRIENDS_REQUESTS}/`, authUser.uid)
      );
      await deleteDoc(
        doc(db, `${USERS_D}/${authUser.uid}/${RECEIVED_FRIENDS_REQUESTS}/`, id)
      );
      await setDoc(doc(db, `${USERS_D}/${authUser.uid}/${FRIENDS_LIST}`, id), {
        id: user.id,
        displayName: user.displayName,
        photoURL: user.photoURL,
      });
      await setDoc(doc(db, `${USERS_D}/${id}/${FRIENDS_LIST}`, authUser.uid), {
        id: authUser.uid,
        displayName: authUser.displayName,
        photoURL: authUser.photoURL,
      });
      setHandleSuccess("accepted request");
    } catch (error) {
      handleError(error.message);
    } finally {
      setWaitingRequestProcessing(false);
    }
  };

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
    <Box
      sx={{
        backgroundColor: "rgba(0,0,0,0.2)",
        mx: "auto",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div>
        <div style={{ padding: "0px 30px" }}>
          <img style={{ width: "100px" }} src={user?.photoURL || User} />
        </div>
        <div>
          <div>{user?.displayName}</div>
        </div>
        <Link to={`/messages/${id}`} state={user}>
          <Button>Start chat</Button>
        </Link>
        <Button
          disabled={waitingRequestProcessing}
          onClick={shownButton[status].onClick}
        >
          {shownButton[status].label}
        </Button>
      </div>
      <Divider />
      <Box>
        
      </Box>
      {handleError && <Alert severity="error">{handleError}</Alert>}
      {handleSuccess && <Alert severity="success">{handleSuccess}</Alert>}
    </Box>
  );
};

export { UserProfile };
