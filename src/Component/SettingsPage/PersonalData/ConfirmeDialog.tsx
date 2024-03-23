import React, { useState } from "react";
import { deleteObject } from "firebase/storage";
import { storage, ref } from "../../../firebase/auth";
import { updateProfile } from "firebase/auth";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase/auth";
import { AVATAR_S, USERS_D } from "../../../firebase_storage_path_constants/firebase_storage_path_constants";
import { useAuth } from "../../../App";
import { useTranslation } from "react-i18next";

function PhotoURLDialog({ open, handleClose, handleError, updatePage }) {
  const [pending, setPending] = useState(false);
  const user = useAuth();
  const {t} = useTranslation()

  const deleteUserPhoto = async () => {
    setPending(true);
    try {
      if (
        user.photoURL.startsWith("https://firebasestorage.googleapis.com/")
      ) {
        await deleteObject(ref(storage, `${AVATAR_S}/${user.uid}/${AVATAR_S}`));
      }
      await updateProfile(user, {
        photoURL: "",
      });
      await updateDoc(doc(db, USERS_D, user.uid), { photoURL: "" });
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
        {t('imageModal.confirmDelete')}
      </DialogTitle>
      <DialogActions>
        <Button onClick={handleClose}>{t('login.cancel')}</Button>
        <Button disabled={pending} color="error" onClick={deleteUserPhoto}>
          {t('login.delete')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export {PhotoURLDialog}


