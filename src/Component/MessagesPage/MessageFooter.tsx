import React, { useEffect } from "react";
import { Paper, Box, TextField, IconButton, InputBase } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { ref, set } from "firebase/database";
import { useState } from "react";
import SentimentSatisfiedAltOutlinedIcon from "@mui/icons-material/SentimentSatisfiedAltOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import PanoramaOutlinedIcon from "@mui/icons-material/PanoramaOutlined";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { useTheme } from "../../theme";
import { MessageFooterImagesContainer } from "./MessageFooterImagesContainer";
import { realTimeDB } from "../../firebase/auth";
import { CHATS_RT, USERS_D } from "../../firebase_storage_path_constants/firebase_storage_path_constants";
import { updateDoc } from "firebase/firestore";

interface IMessageFooter {
  sendMessage: (message: string, authUserId: string, chatId: string) => void;
  sendImages: (imageList: File[], authUserId: string, chatId: string) => void;
  isAuthUserTyping: boolean;
  authUserId: string;
  chatId: string;
  setNewMessageToCompanion: () => void
}

const MessageFooter = ({
  sendMessage,
  sendImages,
  isAuthUserTyping,
  authUserId,
  chatId,
  setNewMessageToCompanion
}: IMessageFooter) => {
  const [message, setMessage] = useState("");
  const [isOpenEmoji, setIsOpenEmoji] = useState(false);
  const [imageList, setImageList] = useState<File[] | null>(null);
  const { mode } = useTheme();

  const handleChange = (event) => {
    setMessage(event.target.value);
  };

  useEffect(() => {
    if (!isAuthUserTyping && message) {
      set(ref(realTimeDB, `${CHATS_RT}/${chatId}`), {
        [authUserId]: true,
      });
    }
    const timer1Id = setTimeout(() => {
      set(ref(realTimeDB, `${CHATS_RT}/${chatId}`), {
        [authUserId]: false,
      });
    }, 4000);
    return () => {
      clearTimeout(timer1Id);
    };
  }, [message]);

  const handleSendMessage = async () => {
    if (message) {
      sendMessage(message, authUserId, chatId);
      setMessage("");
    }
    if (imageList) {
      sendImages(imageList,authUserId,chatId);
      setImageList(null);
    }
    setNewMessageToCompanion();
    
  };

  const toogleEmojiView = () => {
    setIsOpenEmoji((open) => !open);
  };

  const addEmojiToMessage = (e: { native: string }) => {
    setMessage((message) => message + e.native);
  };

  const handleOnClickOutsideEmojiPicker = () => {
    if (isOpenEmoji) {
      setIsOpenEmoji(false);
    }
  };
  const sendHeardEmoji = () => {
    const heartEmoji: string = "\u2764\uFE0F";
    sendMessage(heartEmoji, authUserId, chatId);
  };

  const handleChooseImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const imageListArray = Array.from(e.target.files);
      setImageList(imageListArray);
    }
  };
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };
  const deleteSelectedImage = (imageName: string) => {
    setImageList((list) => list.filter((image) => image.name !== imageName));
  };

  return (
    <Paper
      sx={{
        p: 2,
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: "10px",
          bottom: "90px",
          display: isOpenEmoji ? "block" : "none",
        }}
      >
        <Picker
          data={data}
          onEmojiSelect={addEmojiToMessage}
          onClickOutside={handleOnClickOutsideEmojiPicker}
          theme={mode}
          searchPosition="none"
        />
      </div>
      {!!imageList?.length && (
        <MessageFooterImagesContainer
          deleteImage={deleteSelectedImage}
          imageList={imageList}
        />
      )}
      <div style={{ position: "relative" }}>
        <InputBase
          id="filesPhoto"
          type="file"
          inputProps={{ accept: "image/*", multiple: true }}
          onChange={handleChooseImage}
          style={{ display: "none" }}
        />
        <TextField
          value={message}
          onChange={handleChange}
          multiline
          onKeyDown={handleKeyDown}
          maxRows={4}
          sx={{
            width: "100%",
            "& .MuiInputBase-root": {
              borderRadius: "30px",
              p: 1,
            },
          }}
          InputProps={{
            startAdornment: (
              <Box sx={{ mr: 1 }}>
                <IconButton onClick={toogleEmojiView}>
                  <SentimentSatisfiedAltOutlinedIcon />
                </IconButton>
              </Box>
            ),
            endAdornment:
              message || imageList ? (
                <IconButton onClick={handleSendMessage}>
                  <SendIcon />
                </IconButton>
              ) : (
                <Box sx={{ display: "flex", gap: { sx: "0px", sm: 1 } }}>
                  <label style={{ padding: 0, margin: 0 }} htmlFor="filesPhoto">
                    <IconButton component="span">
                      <PanoramaOutlinedIcon />
                    </IconButton>
                  </label>
                  <IconButton onClick={sendHeardEmoji}>
                    <FavoriteBorderOutlinedIcon />
                  </IconButton>
                </Box>
              ),
          }}
        />
      </div>
    </Paper>
  );
};

export { MessageFooter };
