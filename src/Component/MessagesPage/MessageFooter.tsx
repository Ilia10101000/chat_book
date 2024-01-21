"use client";
import { Paper, Box, TextField, IconButton } from "@mui/material";
import { Menu } from "@mui/icons-material";
import SendIcon from "@mui/icons-material/Send";
import { FormEvent } from "react";
import { useState } from "react";


const MessageFooter = () => {
  const [message, setMessage] = useState("");

  const handleFormSubmit =  (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // await addMessage(message);
    console.log(message)
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
          fullWidth
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
