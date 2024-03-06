import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { IconButton, TextField, CircularProgress } from "@mui/material";
import { CustomeAvatarEditor } from "./CustomeAvatarEditor";
import EditIcon from "@mui/icons-material/Edit";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useAuth } from "../../../../hooks/useAuth";
import { getDownloadURL, uploadString } from "firebase/storage";
import { storage, ref, db } from "../../../../firebase/auth";
import {
  POSTS,
  USERS_D,
} from "../../../../firebase_storage_path_constants/firebase_storage_path_constants";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from "@mui/material/FormControlLabel";

interface IEditorNewPost {
  handleClose: () => void;
  handleError: (message: string) => void;
  onClose: () => void;
  postsImage: File;
}

const generateUniqueFileName = (userId: string) => {
  return `${Date.now()}-${userId}-${Math.floor(Math.random() * 10000) + 1}`;
};

function EditorNewPost({
  handleClose,
  postsImage,
  handleError,
  onClose,
}: IEditorNewPost) {
  const authUser = useAuth();

  const [text, setText] = useState("");
  const [savedImage, setSavedImage] = useState("");
  const [pendingAddPost, setPendingAddPost] = useState(false);
  const [hideComments, setHideComments] = useState(false)

  const handleChangeText = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (e.target.value.length <= 2000) {
      setText(e.target.value);
    }
  };

  const handleSave = (editorRef: React.MutableRefObject<any>) => {
    if (editorRef.current) {
      const canvasScaled = editorRef.current
        .getImageScaledToCanvas()
        .toDataURL();

      setSavedImage(canvasScaled);
    }
  };

  const clearSavedImage = () => {
    setSavedImage("");
  };

  const closeEditor = () => {
    setSavedImage("");
    handleClose();
  };

  const handleAddPost = async () => {
    const postsId = generateUniqueFileName(authUser.uid);
    const storageRef = ref(storage, `${POSTS}/${authUser.uid}/${postsId}`);
    setPendingAddPost(true);
    try {
      await uploadString(storageRef, savedImage, "data_url");
      const postsImageURL = await getDownloadURL(storageRef);
      await setDoc(doc(db, `${USERS_D}/${authUser.uid}/${POSTS}/${postsId}`), {
        id: postsId,
        imageURL: postsImageURL,
        text,
        showComments:!hideComments,
        timestamp: serverTimestamp(),
      });
    } catch (error) {
      handleError(error.message);
    } finally {
      closeEditor();
      setPendingAddPost(false);
      onClose();
    }
  };

  return (
    <Box>
      {savedImage ? (
        <Box
          sx={{
            minWidth: "100%",
            position: "relative",
          }}
        >
          <IconButton
            onClick={clearSavedImage}
            sx={{ position: "absolute", right: "-40px", top: "-10px" }}
          >
            <EditIcon />
          </IconButton>
          <img src={savedImage} style={{ width: "100%" }} />
          <div style={{ width: "100%", position: "relative" }}>
            <TextField
              placeholder="Add posts text..."
              sx={{ width: "100%", mt: 2 }}
              autoComplete="off"
              multiline
              maxRows={2}
              value={text}
              onChange={handleChangeText}
            />
            <div
              style={{
                position: "absolute",
                bottom: "-15px",
                right: "0px",
                fontSize: "10px",
                color: "grey",
              }}
            >
              {2000 - text.length}
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Button
              disabled={pendingAddPost}
              sx={{ mt: 2, padding: "4px 10px", boxSizing: "border-box" }}
              color="warning"
              size="small"
              startIcon={<ArrowBackIcon />}
              onClick={closeEditor}
              variant="contained"
            >
              Back
            </Button>
            <FormControlLabel
              control={
                <Checkbox
                  checked={hideComments}
                  onChange={() => setHideComments((value) => !value)}
                />
              }
              label="Hide comments"
            />

            <Button
              disabled={pendingAddPost}
              sx={{ mt: 2, padding: "4px 10px", boxSizing: "border-box" }}
              color="success"
              size="small"
              endIcon={
                pendingAddPost ? (
                  <CircularProgress size={18} />
                ) : (
                  <LibraryAddIcon />
                )
              }
              onClick={handleAddPost}
              variant="contained"
            >
              Add post
            </Button>
          </div>
        </Box>
      ) : (
        <CustomeAvatarEditor handleSave={handleSave} postsImage={postsImage} />
      )}
    </Box>
  );
}

export { EditorNewPost };
