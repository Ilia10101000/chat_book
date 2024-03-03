import React from 'react'
import Modal from "@mui/material/Modal";
import CloseIcon from "@mui/icons-material/Close";
import { SxProps, Theme } from "@mui/material";
import Alert from "@mui/material/Alert";
import { Box, IconButton } from "@mui/material";
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { doc } from "firebase/firestore";
import { db,ref, storage } from '../../../firebase/auth';
import { USERS_D } from '../../../firebase_storage_path_constants/firebase_storage_path_constants';

const style: SxProps<Theme> = {
  position: "relative",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "380px", sm: "500px", md: "750px" },
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 2,
  display: "flex",
  flexDirection: "column",
  gap: "20px",
  alignItems: "center",
};
function PostModalWindow({ post, userId, closeModal,open }) {
    
  return (
    <Modal open={open}>
      <Box sx={style}>
        <IconButton
          onClick={closeModal}
          sx={{ position: "absolute", right: "-30px", top: "-30px" }}
        >
          <CloseIcon />
              </IconButton>
              <img src={post?.imageURL} style={{ width: '100%' }} alt={post?.id} />
      </Box>
    </Modal>
  );
}

export { PostModalWindow }




