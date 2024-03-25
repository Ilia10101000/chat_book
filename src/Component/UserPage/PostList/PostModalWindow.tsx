import React, { useEffect, useState } from "react";
import Modal from "@mui/material/Modal";
import CloseIcon from "@mui/icons-material/Close";
import {
  Alert,
  CircularProgress,
  Divider,
  List,
  SxProps,
  Theme,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { AddPostComment } from "./AddNewPost/AddPostComment";
import { PostDialogConfig } from "./PostDialogConfig";
import { doc, query, collection, orderBy } from "firebase/firestore";
import { db } from "../../../firebase/auth";
import {
  COMMENTS,
  POSTS,
  USERS_D,
} from "../../../firebase_storage_path_constants/firebase_storage_path_constants";
import {
  useCollectionData,
  useDocumentData,
} from "react-firebase-hooks/firestore";
import { CommentItem } from "./CommentItem";
import { UserAvatar } from "../../Drawer/DrawerUserAvatar";
import { LikesList } from "./LikesList";
import LockPersonIcon from "@mui/icons-material/LockPerson";
import { ImageContainer } from "./ImageContainer";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import {
  deletePost,
  removeComment,
  addComment,
  toogleVisibilityComments,
} from "../../../firebase/utils/post_utils";
import { useAuth } from "../../../App";
import { useTranslation } from "react-i18next";

const style: SxProps<Theme> = {
  position: "relative",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "100%",
  maxWidth: "1400px",
  backgroundColor: (theme) =>
    theme.palette.mode === "light" ? "#fff" : "#000",
  p: { xs: 1, sm: 1.5 },
  display: "flex",
  flexDirection: { xs: "column", md: "row" },
  height: { xs: "95vh", sm: "92vh" },
  gap: 1,
  flexWrap: "nowrap",
};

function PostModalWindow() {
  const { postId, ownerPostId } = useParams();
  const isScreenBelow700px = useMediaQuery("(max-height: 700px)");

  const [user, loadingU, errorU] = useDocumentData(
    doc(db, `${USERS_D}/${ownerPostId}`)
  );
  const [post, loadingP, errorP] = useDocumentData(
    doc(db, `${USERS_D}/${ownerPostId}/${POSTS}/${postId}`)
  );

  const authUser = useAuth();

  const [error, setError] = useState("");
  const { t } = useTranslation();

  const [commentsList, loadingCL, errorCL] = useCollectionData(
    query(
      collection(db, `${USERS_D}/${user?.id}/${POSTS}/${post?.id}/${COMMENTS}`),
      orderBy("timestamp", "desc")
    )
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError("");
      }, 22000);
    }
  }, [error]);

  if ((!user && !loadingU) || (!post && !loadingP)) {
    return <Navigate to={`/u/${authUser.uid}`} replace={true} />;
  }

  if (loadingU || loadingP) {
    return (
      <Box sx={{ ...style, alignItems: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  const isOwnerPost = authUser.uid === user?.id;
  const closeModal = () => {
    navigate(-1);
  };

  const handleAddComment = async (comment: string) => {
    try {
      await addComment(user.id, post.id, authUser, comment);
    } catch (error) {
      setError(error.message);
    }
  };

  const submitDeletePost = async () => {
    try {
      await deletePost(post as any);
      closeModal();
    } catch (error) {
      setError(error);
    }
  };

  const handleToogleVisibilityComments = async (isShown: boolean) => {
    try {
      await toogleVisibilityComments(user?.id, post?.id, isShown);
      closeModal();
    } catch (error) {
      setError(error.message);
    }
  };

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
          sx={{ position: "absolute", right: "5px", top: "0px", zIndex: 2000 }}
        >
          <CloseIcon sx={{ fontSize: "30px", color: "#fff" }} />
        </IconButton>
        <Box sx={style}>
          <Box
            sx={{
              maxWidth: "1000px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              px: isScreenBelow700px ? 4 : 0,
              mx: "auto",
            }}
          >
            <ImageContainer
              authUserId={authUser.uid}
              post={post}
              userId={user?.id}
              isOwner={isOwnerPost}
              handleError={setError}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              width: { xs: "100%", md: "400px" },
              minWidth: { xs: "100%", md: "400px" },
              height: "100%",
              justifyContent: "space-between",
              overflow: "hidden",
            }}
          >
            <Box sx={{ flexGrow: 0, flexShrink: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  gap: { xs: 0, sm: 1 },
                  mb: { xs: 0.5, sm: 2 },
                }}
              >
                <UserAvatar
                  photoURL={user?.photoURL}
                  userName={user?.displayName}
                />
                <Typography
                  sx={{
                    fontSize: { xs: "14px" },
                    whiteSpace: "wrap",
                    wordBreak: "break-word",
                    maxHeight: { xs: "75px", md: "300px" },
                    overflowY: "scroll",
                    ml: { xs: 1, sm: 0 },
                  }}
                >
                  {post?.text}
                </Typography>
                {isOwnerPost && (
                  <div style={{ marginLeft: "auto" }}>
                    <PostDialogConfig
                      isShownComments={post?.showComments}
                      handleShowComments={handleToogleVisibilityComments}
                      handleDeletePost={submitDeletePost}
                    />
                  </div>
                )}
              </Box>
              <LikesList
                likesCount={t("userPage.likesCount")}
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
                    flexGrow: 3,
                    flexShrink: 1,
                    overflowY: "scroll",
                    msxHeight: "100%",
                  }}
                >
                  {commentsList ? (
                    commentsList?.map((comment) => (
                      <CommentItem
                        key={comment.id}
                        removeComment={removeComment}
                        authUserId={authUser.uid}
                        data={comment}
                        can={t("login.cancel")}
                        del={t("login.delete")}
                        delComment={t("userPage.deleteComment")}
                      />
                    ))
                  ) : (
                    <Typography variant="body2" sx={{textAlign:'center'}}>{t("userPage.noComments")}</Typography>
                  )}
                </List>
                <Box sx={{ mt: "auto", height: "56px", flexShrink: 0 }}>
                  <Divider />
                  <AddPostComment
                    addCommentLabel={t("userPage.addComment")}
                    addComment={handleAddComment}
                  />
                </Box>
              </>
            ) : (
              <Box sx={{ p: 2, display: "flex", gap: "10px" }}>
                <Typography>{t("userPage.commentsClosed")}</Typography>
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
