"use client";
import { Paper, Box, TextField, IconButton } from "@mui/material";
import { Menu } from "@mui/icons-material";
import SendIcon from "@mui/icons-material/Send";
import { FormEvent } from "react";
import { useState } from "react";

interface IMessageFooter{
  sendMessage:(message:string)=>void
  
}


const MessageFooter = ({sendMessage}:IMessageFooter) => {
  const [message, setMessage] = useState("");

  const handleFormSubmit =  async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    sendMessage(message)
    setMessage("");
  };

  return (
    <Paper
      sx={{
        position: "fixed",
        bottom: 0,
        width: { xs: "100%", sm: "calc(100% - 200px)" },
        display: "flex",
        justifyContent: "center",
      }}
    >
      <form onSubmit={handleFormSubmit}>
        <IconButton>
          <Menu />
        </IconButton>
        <TextField
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          multiline
          maxRows={4}
          sx={{ width: { xs: "275px", sm: "375px" } }}
        />
        <IconButton type="submit">
          <SendIcon />
        </IconButton>
      </form>
    </Paper>
  );
};

export { MessageFooter };
