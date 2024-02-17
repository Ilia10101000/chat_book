"use client";
import { Paper, Box, TextField, IconButton } from "@mui/material";
import { Menu } from "@mui/icons-material";
import SendIcon from "@mui/icons-material/Send";
import { FormEvent } from "react";
import { useState } from "react";
import SentimentSatisfiedAltOutlinedIcon from "@mui/icons-material/SentimentSatisfiedAltOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import PanoramaOutlinedIcon from "@mui/icons-material/PanoramaOutlined";

interface IMessageFooter {
  sendMessage: (message: string) => void;
}

const MessageFooter = ({ sendMessage }: IMessageFooter) => {
  const [message, setMessage] = useState("");

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    sendMessage(message);
    setMessage("");
  };

  return (
    <Paper
      sx={{
        // display: "flex",
        // justifyContent: "center",
        // minWidth: "360px",
        // width: "100%",
        p: 2,
      }}
    >
      <form onSubmit={handleFormSubmit}>
        <TextField
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          multiline
          maxRows={4}
          sx={{ width: "100%" }}
          InputProps={{
            startAdornment: (
              <Box sx={{ mr: 1 }}>
                <IconButton>
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
