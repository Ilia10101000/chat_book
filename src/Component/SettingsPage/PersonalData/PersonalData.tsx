import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { PhotoURLDialog } from "./ConfirmeDialog";
import { UserPhoto } from "./UserPhoto";
import { auth, db, storage, ref } from "../../../firebase/auth";
import { updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, uploadString } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { loginValidationSchema } from "../../../lib/yupFormsValidationParams";
import {
  USERS_D,
  AVATAR_S,
} from "../../../firebase_storage_path_constants/firebase_storage_path_constants";
import { Box } from "@mui/material";
import { NewImageModalWindow } from "../../UserPage/PostList/AddNewPost/NewImageModalWindow";
import { EditorNewAvatar } from "./EditorUserAvatar";
import { useTranslation } from "react-i18next";

interface IPersonalData {
  displayName: string;
  photoURL: string;
  uid: string;
  handleError: (errorMessage: string) => void;
}

function PersonalData({
  displayName,
  photoURL,
  uid,
  handleError,
}: IPersonalData) {
  const navigate = useNavigate();
  const {t} = useTranslation()

  const displayNameForm = useFormik({
    initialValues: {
      displayName: displayName,
    },
    onSubmit: handleSubmitChangeUserName,
    validationSchema: loginValidationSchema,
  });

  const [isOpenDialog, setIsOpenDialog] = React.useState(false);
  const [showEditor, setShowEditor] = useState(false);

  const handleClickOpen = () => {
    setIsOpenDialog(true);
  };

  const handleClose = () => {
    setIsOpenDialog(false);
  };

  const updatePage = () => {
    navigate(0);
  };

  const handleSaveImage = async (savedImage: string) => {
    const storageRef = ref(storage, `${AVATAR_S}/${uid}/${AVATAR_S}`);
    try {
      await uploadString(storageRef, savedImage, "data_url");

      const photourlLink = await getDownloadURL(
        ref(storage, `${AVATAR_S}/${uid}/${AVATAR_S}`)
      );
      await updateDoc(doc(db, USERS_D, uid), {
        photoURL: photourlLink,
      });
      await updateProfile(auth.currentUser, { photoURL: photourlLink });
      updatePage();
    } catch (error) {
      handleError(error.message);
    }
  };

  async function handleSubmitChangeUserName() {
    const changedUserData: {
      displayName?: string;
      searchQuery?: string;
    } = {};

    if (displayName !== displayNameForm.values.displayName) {
      changedUserData.displayName = displayNameForm.values.displayName;
      changedUserData.searchQuery =
        displayNameForm.values.displayName.toLowerCase();
    }

    try {
      await updateDoc(doc(db, USERS_D, uid), changedUserData);
      await updateProfile(auth.currentUser, changedUserData);
      updatePage();
    } catch (error) {
      handleError(error.message);
    }
  }

  const transformNameValue = (value: string) => {
    return value.trim().replace(/\s{2,}/g, " ");
  };
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "40px",
      }}
    >
      {photoURL ? (
        <UserPhoto photoURL={photoURL} handleClick={handleClickOpen} />
      ) : (
        <Box
          sx={{
            width: "250px",
            height: "250px",
            border: "1px dotted #8c8c8c",
            borderRadius: "50%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
            "&:hover": {
              border: "1px solid #8c8c8c",
            },
          }}
          onClick={() => setShowEditor(true)}
        >
          {t("settingsPage.addPhoto")}
        </Box>
      )}
      <TextField
        error={
          displayNameForm.touched.displayName &&
          Boolean(displayNameForm.errors.displayName)
        }
        autoComplete="off"
        helperText={
          displayNameForm.touched.displayName &&
          t(displayNameForm.errors.displayName)
        }
        id="displayName"
        value={displayNameForm.values.displayName}
        onChange={displayNameForm.handleChange}
        label={t("login.name")}
        onBlur={(e) => {
          displayNameForm
            .setFieldValue(
              "displayName",
              transformNameValue(displayNameForm.values.displayName)
            )
            .then(() => displayNameForm.handleBlur(e));
        }}
      />
      <Button
        disabled={
          Boolean(displayNameForm.errors.displayName) ||
          displayNameForm.values.displayName.trim() == displayName
        }
        variant="contained"
        color="warning"
        onClick={() => displayNameForm.handleSubmit()}
      >
        {t("login.change")}
      </Button>
      <PhotoURLDialog
        open={isOpenDialog}
        handleClose={handleClose}
        handleError={handleError}
        updatePage={updatePage}
      />
      <NewImageModalWindow
        open={showEditor}
        onClose={() => setShowEditor(false)}
      >
        <EditorNewAvatar handleSaveImage={handleSaveImage} />
      </NewImageModalWindow>
    </div>
  );
}

export { PersonalData };
