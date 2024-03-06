import React, {useEffect, useState} from "react";
import Modal from "@mui/material/Modal";
import CloseIcon from "@mui/icons-material/Close";
import { Alert, CircularProgress, Divider, List, SxProps, Theme, Typography } from "@mui/material";
import { Box, IconButton } from "@mui/material";
import { AddPostComment } from "./AddNewPost/AddPostComment";
import { PostDialogConfig } from "./PostDialogConfig";
import { setDoc, doc, serverTimestamp, query, collection, orderBy, deleteDoc, updateDoc } from "firebase/firestore";
import { db,ref,storage } from "../../../firebase/auth";
import { COMMENTS, POSTS, USERS_D} from "../../../firebase_storage_path_constants/firebase_storage_path_constants";
import { useAuth } from "../../../hooks/useAuth";
import { useCollectionData, useDocumentData } from "react-firebase-hooks/firestore";
import { CommentItem } from "./CommentItem";
import { UserAvatar } from "../../Drawer/DrawerUserAvatar";
import { LikesList } from "./LikesList";
import LockPersonIcon from "@mui/icons-material/LockPerson";
import { ImageContainer } from "./ImageContainer";
import { deleteObject } from "firebase/storage";
import { useNavigate, useParams } from "react-router-dom";

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
  maxHeight:'90vh',
};

const generateUniqueFileName = (userId: string) => {
  return `${Date.now()}-${userId}-${Math.floor(Math.random() * 10000) + 1}`;
};


function PostModalWindow() {

  const { postId, userId } = useParams();
  const navigate = useNavigate();

  const closeModal = () => {
    navigate(-1)
  }

  const [user, loadingU, errorU] = useDocumentData(doc(db, `${USERS_D}/${userId}`));
  const [post, loadingP, errorP] = useDocumentData(
    doc(db, `${USERS_D}/${userId}/${POSTS}/${postId}`)
  );


  const authUser = useAuth();

  const [error, setError] = useState('');
  
  const [commentsList, loadingCL, errorCL] = useCollectionData(
    query(
      collection(db, `${USERS_D}/${user?.id}/${POSTS}/${post?.id}/${COMMENTS}`),
      orderBy("timestamp", 'desc')
      )
      );
      
      useEffect(() => {
        if (error) {
          setTimeout(() => {
            setError('')
          },22000)
        }
      },[error])
      
      
        if (loadingU || loadingP) {
          return (
            <Box sx={{...style,alignItems:'center'}}>
              <CircularProgress/>
            </Box>
          )
        }

  const isOwnerPost = authUser.uid === user?.id;

  const addComment = async (comment: string) => {

    
    const uniqueCommentsId = generateUniqueFileName(user?.id);
    try {
      await setDoc(
        doc(db, `${USERS_D}/${user?.id}/${POSTS}/${post?.id}/${COMMENTS}`, uniqueCommentsId),
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

  const removeComment = async (commentId:string) => {
    try {
      await deleteDoc(
        doc(db, `${USERS_D}/${user?.id}/${POSTS}/${post?.id}/${COMMENTS}`,commentId)
      );
      
    } catch (error) {
      console.log(error.message)
    }
  }

  const deletePost = async () => {
    try {
      await deleteDoc(
        doc(db, `${USERS_D}/${user?.id}/${POSTS}/${post?.id}`)
      );
      await deleteObject(ref(storage, `${POSTS}/${user?.id}/${post?.id}`));
      closeModal()
    } catch (error) {
      console.log(error.message)
    }
  }

  const isShownComments = async (isShown:boolean) => {
    try {
      const postRef = doc(db, `${USERS_D}/${user?.id}/${POSTS}/${post?.id}`)
      await updateDoc(postRef, { showComments: isShown });
      closeModal();
    } catch (error) {
      console.log(error.message)
    }
  }


  return (
    <Modal open={true}>
      <>
        {error && (
          <Alert sx={{ position: "absolute" }} color="error">
            {error}
          </Alert>
        )}
        <IconButton
          onClick={closeModal}
          sx={{ position: "absolute", right: "10px", top: "10px" }}
        >
          <CloseIcon />
        </IconButton>
        <Box sx={style}>
          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              alignItems: "center",
            }}
          >
            <ImageContainer post={post} userId={user?.id} isOwner={isOwnerPost} />
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              p: { xs: 1, sm: 2 },
              width: { xs: "300px", sm: "550px", md: "400px" },
              maxHeiht: "100%",
              overflow: "scroll",
            }}
          >
            <Box>
              <Box sx={{ display: "flex", gap: "10px", mb: 2 }}>
                <UserAvatar
                  photoURL={user?.photoURL}
                  userName={user?.displayName}
                />
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
                {isOwnerPost && (
                  <div style={{ marginLeft: "auto" }}>
                    <PostDialogConfig
                      isShownComments={post?.showComments}
                      handleShowComments={isShownComments}
                      handleDeletePost={deletePost}
                    />
                  </div>
                )}
              </Box>
              <LikesList
                authUserId={authUser?.uid}
                userId={user?.id}
                postId={post?.id}
              />
            </Box>
            <Divider />
            {post?.showComments ? (
              <>
                <List
                  sx={{
                    flexGrow: 1,
                    maxHeight: "100%",
                    overflowY: "scroll",
                    p: { xs: "8px 16px 8px 0px", md: "8px 16px 8px 8px" },
                  }}
                >
                  {commentsList?.map((comment) => (
                    <CommentItem
                      key={comment.id}
                      removeComment={removeComment}
                      authUserId={authUser.uid}
                      data={comment}
                    />
                  ))}
                </List>
                <Divider />
                <Box sx={{ mt: "auto" }}>
                  <AddPostComment addComment={addComment} />
                </Box>
              </>
            ) : (
              <Box sx={{ p: 2, display: "flex", gap: "10px" }}>
                <Typography>Comments are closed</Typography>
                <LockPersonIcon />
              </Box>
            )}
          </Box>
        </Box>
      </>
    </Modal>
  );
}

export { PostModalWindow };
