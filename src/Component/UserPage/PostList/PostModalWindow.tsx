import React, {useEffect, useState} from "react";
import Modal from "@mui/material/Modal";
import CloseIcon from "@mui/icons-material/Close";
import { Alert, Avatar, Divider, SxProps, Theme, Typography } from "@mui/material";
import { Box, IconButton } from "@mui/material";
import { AddPostComment } from "./AddNewPost/AddPostComment";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { PostDialogConfig } from "./PostDialogConfig";
import { setDoc, doc, serverTimestamp, query, collection, orderBy } from "firebase/firestore";
import { db, storage } from "../../../firebase/auth";
import { COMMENTS, POSTS, USERS_D } from "../../../firebase_storage_path_constants/firebase_storage_path_constants";
import { useAuth } from "../../../hooks/useAuth";
import { useCollectionData } from "react-firebase-hooks/firestore";

const style: SxProps<Theme> = {
  position: "relative",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "300px", sm: "550px", md: "auto" },
  maxWidth: "1200px",
  backgroundColor: "#000",
  borderRadius: "10px",
  boxShadow: 24,
  p: 1.5,
  display: "flex",
  flexDirection: { xs: "column", md: "row" },
};

const generateUniqueFileName = (userId: string) => {
  return `${Date.now()}-${userId}-${Math.floor(Math.random() * 10000) + 1}`;
};

function PostModalWindow({ post, user, closeModal, open }) {

  const [error, setError] = useState('');
  const [commentsList, loadingCL, errorCL] = useCollectionData(
    query(
      collection(db, `${USERS_D}/${user.id}/${POSTS}/${post?.id}/${COMMENTS}`),
      orderBy("timestamp")
    )
  );

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError('')
      },22000)
    }
  },[error])

  const authUser = useAuth()

  const addComment = async (comment: string) => {

    
    const uniqueCommentsId = generateUniqueFileName(user.id);
    try {
      await setDoc(
        doc(db, `${USERS_D}/${user.id}/${POSTS}/${post.id}/${COMMENTS}`, uniqueCommentsId),
        {
          id: uniqueCommentsId,
          author: authUser.uid,
          authorPhotoURL: authUser.photoURL,
          text: comment,
          timestamp: serverTimestamp(),
        }
      );
    } catch (error) {
      setError(error.message)
    }
  }

  return (
    <Modal open={open}>
      <>
        {error && <Alert sx={{position:'absolute'}} color="error">{error}</Alert>}
        <IconButton
          onClick={closeModal}
          sx={{ position: "absolute", right: "10px", top: "10px" }}
        >
          <CloseIcon />
        </IconButton>
        <Box sx={style}>
          <Box sx={{ flexGrow: 1 }}>
            <img
              src={post?.imageURL}
              style={{ width: "100%" }}
              alt={post?.id}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              p: 2,
              width: { xs: "300px", sm: "550px", md: "400px" },
            }}
          >
            <Box sx={{ display: "flex", gap: "10px", mb: 2 }}>
              <Avatar src={user?.photoURL} alt={user.displayName || "avatar"} />
              <Typography
                sx={{
                  whiteSpace: "wrap",
                  wordBreak: "break-word",
                  maxHeight: { xs: "300px" },
                  overflowY: "scroll",
                }}
              >
                {post?.text}
              </Typography>
              <div style={{ marginLeft: "auto" }}>
                <PostDialogConfig />
              </div>
            </Box>
            <Box>
              {commentsList?.map((comment) => (
                <div>{comment.text}</div>
              ))}
            </Box>
            <Divider />
            <Box sx={{ mt: "auto" }}>
              <AddPostComment addComment={addComment} />
            </Box>
          </Box>
        </Box>
      </>
    </Modal>
  );
}

export { PostModalWindow };
