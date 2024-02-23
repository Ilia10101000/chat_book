"use client";
import { Paper, Box, TextField, IconButton } from "@mui/material";
import { Menu } from "@mui/icons-material";
import SendIcon from "@mui/icons-material/Send";
import { FormEvent } from "react";
import { useState } from "react";
import SentimentSatisfiedAltOutlinedIcon from "@mui/icons-material/SentimentSatisfiedAltOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import PanoramaOutlinedIcon from "@mui/icons-material/PanoramaOutlined";
import EmojiPicker,{EmojiClickData} from "emoji-picker-react";

interface IMessageFooter {
  sendMessage: (message: string) => void;
}

const MessageFooter = ({ sendMessage }: IMessageFooter) => {
  const [message, setMessage] = useState("");
  const [isOpenEmoji, setIsOpenEmoji] = useState(false)

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    sendMessage(message);
    setMessage("");
  };

  const toogleEmojiView = () => {
    setIsOpenEmoji(open => !open)
  }

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setMessage(message => message + emojiData.emoji)
  }

  return (
    <Paper
      sx={{
        p: 2,
      }}
    >
      <form onSubmit={handleFormSubmit}>
        <EmojiPicker open={isOpenEmoji} onEmojiClick={handleEmojiClick} />
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
            endAdornment: message ? (
              <IconButton type="submit">
                <SendIcon />
              </IconButton>
            ) : (
              <Box sx={{ display: "flex", gap: { sx: "0px", sm: 1 } }}>
                <IconButton>
                  <PanoramaOutlinedIcon />
                </IconButton>
                <IconButton>
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
