import React, {useState} from "react";
import { DocumentData, doc } from "firebase/firestore";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  IconButton,
  Typography,
  Tooltip
} from "@mui/material";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { db } from "../../../firebase/auth";
import { USERS_D } from "../../../firebase_storage_path_constants/firebase_storage_path_constants";
import { UserAvatar } from "../../Drawer/DrawerUserAvatar";
import DeleteIcon from "@mui/icons-material/Delete";
import { Link } from "react-router-dom";

interface ICommentItem {
  data: DocumentData;
  authUserId: string;
  removeComment: (commentDoc: any) => void;
  delComment:string;
  can:string;
  del:string;
}

function CommentItem({ data, authUserId, removeComment, delComment,can,del }: ICommentItem) {

  const [commmentAuthor, loadingCA, errorCA] = useDocumentData(doc(db, `${USERS_D}`, data.authorId));

  const [showConfirmDialog, setConfirmDialog] = useState(false);
  const handleHideDialog = () => {
    setConfirmDialog(false)
  }
  const handleShowDialog = () => {
    setConfirmDialog(true)
  }

  const handleSubmitRemoveComment = () => {
    removeComment(data);
    handleHideDialog();
  }
  if (loadingCA) {
    return <div>Loadng...</div>;
  }
  const isCommentOwner = commmentAuthor.id === authUserId;

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        gap: "10px",
        mb: 2,
        position: "relative",
      }}
    >
      {isCommentOwner && (
        <IconButton
          size="small"
          sx={{ position: "absolute", right: "-15px", top: "-10px" }}
          onClick={handleShowDialog}
        >
          <DeleteIcon sx={{ fontSize: "16px" }} />
        </IconButton>
      )}
      <Link
        style={{ textDecoration: "none", color: "inherit" }}
        to={`/user/${commmentAuthor.id}`}
      >
        <UserAvatar
          photoURL={commmentAuthor.photoURL}
          userName={commmentAuthor.displayName}
          style={{ width: "25px", height: "25px" }}
        />
      </Link>
      <Box
        sx={{
          maxWidth: "100%",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          wordWrap: "break-word",
          overflowWrap: "break-word",
        }}
      >
        <Typography
          variant="caption"
          sx={{
            fontSize: "13px",
            maxWigth: "100%",
            overflowX: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
          }}
        >
          {commmentAuthor.displayName}
        </Typography>{" "}
        {data.text}
      </Box>
      {setConfirmDialog && (
        <Dialog open={showConfirmDialog} onClose={handleHideDialog}>
          <DialogTitle>{delComment}</DialogTitle>
          <DialogActions sx={{ display: "flex", justifyContent: "center" }}>
            <Button size="small" onClick={handleHideDialog}>
              {can}
            </Button>
            <Button
              size="small"
              onClick={handleSubmitRemoveComment}
              color="error"
            >
              {del}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
}

export { CommentItem };
