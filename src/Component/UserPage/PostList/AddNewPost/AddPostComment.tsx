import React, { useState } from "react";
import { TextField, Box, IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import SentimentSatisfiedAltOutlinedIcon from "@mui/icons-material/SentimentSatisfiedAltOutlined";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { useTheme } from "../../../../theme";

function AddPostComment({ addComment }) {
  const [comment, setComment] = useState("");
  const [isOpenEmoji, setIsOpenEmoji] = useState(false);
  const [mode] = useTheme();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setComment(e.target.value);
  };
  const handleAddComment = () => {
    addComment(comment);
    setComment('')
  };
  const toogleEmojiView = () => {
    setIsOpenEmoji((open) => !open);
  };
  const handleOnClickOutsideEmojiPicker = () => {
    if (isOpenEmoji) {
      setIsOpenEmoji(false);
    }
  };
  const addEmojiToMessage = (e: { native: string }) => {
    setComment((message) => message + e.native);
  };

  return (
    <div style={{ position: "relative" }}>
      <div
        style={{
          position: "absolute",
          left: "10px",
          bottom: "65px",
          display: isOpenEmoji ? "block" : "none",
        }}
      >
        <Picker
          data={data}
          onEmojiSelect={addEmojiToMessage}
          onClickOutside={handleOnClickOutsideEmojiPicker}
          theme={mode}
          perLine={5}
          previewPosition="none"
          searchPosition="none"
        />
      </div>
      <TextField
        value={comment}
        onChange={handleChange}
        multiline
        placeholder="Add comment..."
        variant="standard"
        maxRows={3}
        sx={{
          width: "100%",
          "& .MuiInputBase-root": {
            borderRadius: "5px",
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
          endAdornment: comment && (
            <IconButton onClick={handleAddComment}>
              <SendIcon />
            </IconButton>
          ),
        }}
      />
    </div>
  );
}

export { AddPostComment };
