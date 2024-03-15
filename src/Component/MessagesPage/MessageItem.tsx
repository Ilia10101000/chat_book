import React, { useState } from "react";
import { User } from "firebase/auth";
import { Modal, Paper, SpeedDial, SpeedDialAction, IconButton, Box, CircularProgress } from "@mui/material";
import { DocumentData } from "firebase/firestore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";

interface IMessageItem {
  doc: DocumentData;
  user: User;
  deleteMessage: (message: {
    id: string;
    type: string;
    imageId: string;
  }) => void;
}

function MessageItem({ doc, user, deleteMessage }: IMessageItem) {
  const [showSpeedDial, setShowSpeedDial] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);

  const { timestamp, content, senderId, type, id } = doc;

  const closeImageModal = () => {
    setShowImage(false);
  }
  const openImageModal = () => {
    setShowImage(true);
    setLoadingImage(true);
  }

  let createdAt: string;

  if (timestamp) {
    let hour = timestamp.toDate().getHours();

    let minutes = timestamp.toDate().getMinutes();
    minutes = minutes < 10 ? "0" + minutes : minutes;

    createdAt = `${hour}:${minutes}`;
  }
  return (
    <div
      onMouseEnter={senderId == user.uid ? () => setShowSpeedDial(true) : null}
      onMouseLeave={senderId == user.uid ? () => setShowSpeedDial(false) : null}
      style={{
        width: "100%",
        display: "flex",
        justifyContent: senderId == user.uid ? "end" : "start",
      }}
    >
      <Paper
        key={timestamp}
        elevation={20}
        onClick={type == "image" ? openImageModal : null}
        sx={{
          p: 2,
          maxWidth: "45%",
          overflowWrap: "break-word",
          position: "relative",
          ...(type == "image" && { cursor: "pointer" }),
        }}
      >
        {type == "text" ? (
          content
        ) : (
          <img style={{ width: "100%" }} src={content} alt={content} />
        )}
        <div
          style={{
            position: "absolute",
            bottom: "0px",
            right: "5px",
            fontSize: "11px",
            color: "grey",
            userSelect: "none",
          }}
        >
          {createdAt}
        </div>
        {showSpeedDial && (
          <SpeedDial
            direction={senderId == user.uid ? "left" : "right"}
            icon={
              <MoreVertIcon sx={{ fontSize: "15px", color: "text.primary" }} />
            }
            sx={{
              position: "absolute",
              top: "50%",
              ...(senderId == user.uid
                ? { left: "-10px" }
                : { right: "-10px" }),
              transform:
                senderId == user.uid
                  ? "translate(-90%,-50%)"
                  : "translate(80%,-50%)",
              "& .MuiSpeedDial-fab": {
                minHeight: "20px",
                width: "25px",
                height: "25px",
                backgroundColor: "background.paper",
              },
            }}
            ariaLabel="message-action"
          >
            <SpeedDialAction
              onClick={() =>
                deleteMessage(
                  doc as { id: string; imageId: string; type: string }
                )
              }
              icon={<DeleteIcon />}
              tooltipTitle={"Delete"}
            />
          </SpeedDial>
        )}
      </Paper>
        {type === "image" && (
          <Modal open={showImage}>
            <>
              <IconButton
                onClick={closeImageModal}
                sx={{
                  position: "absolute",
                  right: "5px",
                  top: "2px",
                  zIndex: 2000,
                }}
              >
                <CloseIcon sx={{ fontSize: "30px", color: "#fff" }} />
              </IconButton>
            <Box sx={{ width: '90%', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}>
              <CircularProgress sx={{display:loadingImage?'block':'none', mx:'auto'}} />
                <img onLoad={() => setLoadingImage(false)} style={{ width: "100%", display:loadingImage?'none':'block'}} src={content} alt={content} />
              </Box>
            </>
           </Modal>
        )}
    </div>
  );
}

export { MessageItem };
