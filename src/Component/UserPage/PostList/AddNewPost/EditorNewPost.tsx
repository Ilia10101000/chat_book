import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { IconButton, TextField, CircularProgress } from "@mui/material";
import { CustomePostImageEditor } from "./CustomePostImageEditor";
import EditIcon from "@mui/icons-material/Edit";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { getDownloadURL, uploadString } from "firebase/storage";
import { storage, ref, db } from "../../../../firebase/auth";
import {
  POSTS,
  USERS_D,
} from "../../../../firebase_storage_path_constants/firebase_storage_path_constants";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import { useImageDragDropContext } from "./NewImageModalWindow";
import { useAuth } from "../../../../App";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../../../theme";
import SentimentSatisfiedAltOutlinedIcon from "@mui/icons-material/SentimentSatisfiedAltOutlined";


const generateUniqueFileName = (userId: string) => {
  return `${Date.now()}-${userId}-${Math.floor(Math.random() * 10000) + 1}`;
};

function EditorNewPost() {
  const { postsImage, handleError, onCloseWindow } =
    useImageDragDropContext();
  const authUser = useAuth();

  const [text, setText] = useState("");
  const [savedImage, setSavedImage] = useState("");
  const [pendingAddPost, setPendingAddPost] = useState(false);
  const [hideComments, setHideComments] = useState(false);
  const [isOpenEmoji, setIsOpenEmoji] = useState(false);
  const {mode} = useTheme()
  const {t} = useTranslation()

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
        .getImage()
        .toDataURL();

      setSavedImage(canvasScaled);
    }
  };

  const clearSavedImage = () => {
    setSavedImage("");
  };
    const addEmojiToMessage = (e: { native: string }) => {
      setText((message) => message + e.native);
    };

  const closeEditor = () => {
    setSavedImage("");
    onCloseWindow();
  };
  const handleOnClickOutsideEmojiPicker = () => {
    if (isOpenEmoji) {
      setIsOpenEmoji(false);
    }
  };
  const toogleEmojiView = () => {
    setIsOpenEmoji((open) => !open);
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
        ownerPostId: authUser.uid,
        imageURL: postsImageURL,
        text,
        showComments: !hideComments,
        timestamp: serverTimestamp(),
      });
    } catch (error) {
      handleError(error.message);
    } finally {
      setPendingAddPost(false);
      onCloseWindow();
    }
  };

  return (
    <Box sx={{ maxWidth: { xs: "325px", sm: "500px", md: "700px" } }}>
      {savedImage ? (
        <Box
          sx={{
            minWidth: "100%",
            position: "relative",
          }}
        >
          <IconButton
            onClick={clearSavedImage}
            sx={{ position: "absolute", right: "0px", top: "0px" }}
          >
            <EditIcon />
          </IconButton>
          <img src={savedImage} style={{ width: "100%" }} />
          <div style={{ width: "100%", position: "relative" }}>
            <div
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                transform: "translate(0%,-94%)",
                display: isOpenEmoji ? "block" : "none",
              }}
            >
              <Picker
                data={data}
                onEmojiSelect={addEmojiToMessage}
                onClickOutside={handleOnClickOutsideEmojiPicker}
                theme={mode}
                searchPosition="none"
                perLine={8}
                maxFrequentRows={1}
              />
            </div>
            <TextField
              placeholder={t("imageModal.postDesc")}
              sx={{ width: "100%", mt: 2 }}
              autoComplete="off"
              multiline
              maxRows={2}
              value={text}
              onChange={handleChangeText}
              InputProps={{
                endAdornment: (
                  <IconButton onClick={toogleEmojiView}>
                    <SentimentSatisfiedAltOutlinedIcon />
                  </IconButton>
                ),
              }}
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
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Button
              disabled={pendingAddPost}
              sx={{
                mt: 2,
                padding: "4px 10px",
                boxSizing: "border-box",
                fontSize: { xs: "9px", sm: "13px" },
              }}
              color="warning"
              size="small"
              startIcon={<ArrowBackIcon />}
              onClick={closeEditor}
              variant="contained"
            >
              {t("signin.goBackButton")}
            </Button>
            <FormControlLabel
              labelPlacement="bottom"
              sx={{
                "& .MuiTypography-root": {
                  fontSize: { xs: "11px", sm: "1rem" },
                  textAlign: "center",
                },
              }}
              control={
                <Checkbox
                  checked={hideComments}
                  onChange={() => setHideComments((value) => !value)}
                />
              }
              label={t("imageModal.hideComment")}
            />

            <Button
              disabled={pendingAddPost}
              sx={{
                mt: 2,
                padding: "4px 10px",
                boxSizing: "border-box",
                fontSize: { xs: "9px", sm: "13px" },
              }}
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
              {t("drawerInner.post")}
            </Button>
          </div>
        </Box>
      ) : (
        <CustomePostImageEditor
          handleSave={handleSave}
          postsImage={postsImage}
        />
      )}
    </Box>
  );
}

export { EditorNewPost };
