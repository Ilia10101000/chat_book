import React, { ReactNode, createContext, useContext, useEffect, useRef, useState } from "react";
import Modal from "@mui/material/Modal";
import CloseIcon from "@mui/icons-material/Close";
import { SxProps, Theme } from "@mui/material";
import Alert from "@mui/material/Alert";
import { Box, IconButton } from "@mui/material";
import { useDrop } from "react-dnd";
import { NativeTypes } from "react-dnd-html5-backend";
import { ChoosePhotoField } from "./ChoosePhotoField";

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

const ImageContext = createContext(null);

function useImageDragDropContext() {
  return useContext(ImageContext)
}


function NewImageModalWindow({ open, onClose, children }) {
  const [error, setError] = useState("");
  const [postsImage, setPostsImage] = useState<string | ArrayBuffer | File>(null);

  const [{ canDrop, isOver }, drop] = useDrop({
    accept: NativeTypes.FILE,
    drop(item: any) {
      if (item.files.length >= 1) {
        const file = item.files[0];
        if (file.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onload = (e) => {
            setPostsImage(e.target.result);
          };
          reader.readAsDataURL(file);
        }
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  const isActive = canDrop && isOver;

  const handleRemoveImage = () => {
    setPostsImage(null);
  };

  const handleChangePostImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setPostsImage(e.target.files[0]);
  };

  const handleError = (message) => {
    setError(message);
  };

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError("");
      }, 2000);
    }
  }, [error]);

  const inputRef = useRef<HTMLInputElement>(null);

  const setInputClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };
  const onCloseWindow = () => {
    setPostsImage(null);
    onClose()
  }

  return (
    <Modal open={open}>
      <Box sx={style}>
        <ImageContext.Provider
          value={{ postsImage, onCloseWindow, handleRemoveImage, handleError }}
        >
          <IconButton
            onClick={onCloseWindow}
            sx={{ position: "absolute", right: "-5px", top: "-40px" }}
          >
            <CloseIcon sx={{ color: "#fff" }} />
          </IconButton>
          {postsImage ? (
            children
          ) : (
            <ChoosePhotoField
              ref={drop}
              isActive={isActive}
              handleClick={setInputClick}
            />
          )}
          {error && (
            <Alert sx={{ position: "absolute", top: "-50px" }} severity="error">
              {error}
            </Alert>
          )}
          <input
            ref={inputRef}
            onChange={handleChangePostImage}
            accept="image/*"
            type="file"
            style={{ display: "none" }}
          />
        </ImageContext.Provider>
      </Box>
    </Modal>
  );
}

export { NewImageModalWindow, useImageDragDropContext };

