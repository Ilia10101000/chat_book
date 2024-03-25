import React, { useState } from "react";
import { TextField, Box, IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import SentimentSatisfiedAltOutlinedIcon from "@mui/icons-material/SentimentSatisfiedAltOutlined";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { useTheme } from "../../../../theme";

interface IAddPostComment {
  addComment: (comment: string) => void;
  addCommentLabel:string;
}

function AddPostComment({ addComment,addCommentLabel }: IAddPostComment) {
  const [comment, setComment] = useState("");
  const [isOpenEmoji, setIsOpenEmoji] = useState(false);
  const { mode } = useTheme();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setComment(e.target.value);
  };
  const handleAddComment = () => {
    addComment(comment);
    setComment("");
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
          top: 0,
          transform:'translate(0%,-100%)',
          display: isOpenEmoji ? "block" : "none",
        }}
      >
        <Picker
          data={data}
          onEmojiSelect={addEmojiToMessage}
          onClickOutside={handleOnClickOutsideEmojiPicker}
          theme={mode}
          perLine={8}
          searchPosition="none"
        />
      </div>
      <TextField
        autoComplete="off"
        value={comment}
        onChange={handleChange}
        placeholder={addCommentLabel}
        variant="standard"
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
          endAdornment: (
            <IconButton disabled={!comment} onClick={handleAddComment}>
              <SendIcon />
            </IconButton>
          ),
        }}
      />
    </div>
  );
}

export { AddPostComment };
