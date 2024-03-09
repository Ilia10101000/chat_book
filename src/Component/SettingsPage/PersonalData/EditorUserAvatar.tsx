import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { IconButton, CircularProgress } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import { useImageDragDropContext } from "../../UserPage/PostList/AddNewPost/NewImageModalWindow";
import { CustomeAvatarEditor } from "./CustomeAvatarEditor";



function EditorNewAvatar({ handleSaveImage }: { handleSaveImage:(imageData:string) => void }) {
  const { postsImage, onCloseWindow, handleRemoveImage, handleError } =
    useImageDragDropContext();

  const [savedImage, setSavedImage] = useState("");
  const [pendingAddPost, setPendingAddPost] = useState(false);

  const handleSave = (editorRef: React.MutableRefObject<any>) => {
    if (editorRef.current) {
      const canvasScaled = editorRef.current
        .getImageScaledToCanvas()
        .toDataURL();

      setSavedImage(canvasScaled);
    }
  };

  const clearSavedImage = () => {
    setSavedImage("");
  };

      const handleSubmit = async () => {
        setPendingAddPost(true);
        try {
          handleSaveImage(savedImage);
        } catch (error) {
          handleError(error.message);
        } finally {
          setPendingAddPost(false);
          onCloseWindow();
        }
      };



  return (
    <Box>
      {savedImage ? (
        <Box
          sx={{
            minWidth: "100%",
            position: "relative",
          }}
        >
          <IconButton
            onClick={clearSavedImage}
            sx={{ position: "absolute", right: "-40px", top: "-10px" }}
          >
            <EditIcon />
          </IconButton>
          <img
            src={savedImage}
            style={{ width: "100%", borderRadius: "50%" }}
          />
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Button
              disabled={pendingAddPost}
              sx={{ mt: 2, padding: "4px 10px", boxSizing: "border-box" }}
              color="warning"
              size="small"
              startIcon={<ArrowBackIcon />}
              onClick={handleRemoveImage}
              variant="contained"
            >
              Back
            </Button>

            <Button
              disabled={pendingAddPost}
              sx={{ mt: 2, padding: "4px 10px", boxSizing: "border-box" }}
              color="success"
              size="small"
              endIcon={
                pendingAddPost ? (
                  <CircularProgress size={18} />
                ) : (
                  <LibraryAddIcon />
                )
              }
              onClick={handleSubmit}
              variant="contained"
            >
              Save
            </Button>
          </div>
        </Box>
      ) : (
        <CustomeAvatarEditor handleSave={handleSave} postsImage={postsImage} />
      )}
    </Box>
  );
}

export { EditorNewAvatar };
