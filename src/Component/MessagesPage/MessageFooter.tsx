import React from "react";
import { Paper, Box, TextField, IconButton, InputBase } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { FormEvent } from "react";
import { useState } from "react";
import SentimentSatisfiedAltOutlinedIcon from "@mui/icons-material/SentimentSatisfiedAltOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import PanoramaOutlinedIcon from "@mui/icons-material/PanoramaOutlined";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { useTheme } from "../../theme";
import { MessageFooterImagesContainer } from "./MessageFooterImagesContainer";

interface IMessageFooter {
  sendMessage: (message: string) => void;
  sendImages: (images: File[]) => void;
}

const MessageFooter = ({ sendMessage, sendImages }: IMessageFooter) => {
  const [message, setMessage] = useState("");
  const [isOpenEmoji, setIsOpenEmoji] = useState(false);
  const [imageList, setImageList] = useState<File[] | null>(null);
  const [mode] = useTheme();

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (message) {
      sendMessage(message);
      setMessage("");
    }
    if (imageList) {
      sendImages(imageList);
      setImageList(null);
    }
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
    sendMessage(heartEmoji);
  };

  const handleChooseImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const imageListArray = Array.from(e.target.files);
      setImageList(imageListArray);
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
      <form style={{ position: "relative" }} onSubmit={handleFormSubmit}>
        <InputBase
          id="filesPhoto"
          type="file"
          inputProps={{ accept: "image/*", multiple: true }}
          onChange={handleChooseImage}
          style={{ display: "none" }}
        />
        <TextField
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          multiline
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
            endAdornment: (message || imageList) ? (
              <IconButton type="submit">
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
      </form>
    </Paper>
  );
};

export { MessageFooter };

//react-dropzone
