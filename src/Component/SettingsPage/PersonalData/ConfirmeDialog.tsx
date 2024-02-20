import React, { useState } from "react";
import { deleteObject } from "firebase/storage";
import { storage, ref } from "../../../firebase/auth";
import { getAuth, updateProfile } from "firebase/auth";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import { useAuth } from "../../../hooks/useAuth";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase/auth";

function PhotoURLDialog({ open, handleClose, handleError, updatePage }) {
  const [pending, setPending] = useState(false);
  const user = useAuth();

  const photoRef = ref(storage, `avatar/${user.uid}/avatar`);

  const deleteUserPhoto = async () => {
    setPending(true);
    try {
      await deleteObject(photoRef);
      await updateProfile(user, {
        photoURL: "",
      });
      await updateDoc(doc(db, "users", user.uid), { photoURL: "" });
      updatePage();
    } catch (error) {
      handleError(error.message);
    } finally {
      setPending(false);
      handleClose();
    }
  };
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="photo-url-dialog"
    >
      <DialogTitle id="photo-url-dialog">
        {"Confirm delete photo!"}
      </DialogTitle>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button disabled={pending} color="error" onClick={deleteUserPhoto}>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export {PhotoURLDialog}


