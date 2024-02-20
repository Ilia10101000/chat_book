import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Avatar from "react-avatar-edit";
import { PhotoURLDialog } from "./ConfirmeDialog";
import { UserPhoto } from "./UserPhoto";
import { getDownloadURL, uploadString } from "firebase/storage";
import { storage, ref, auth, db } from "../../../firebase/auth";
import { updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { loginValidationSchema } from "../../../lib/yupFormsValidationParams";

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

  const displayNameForm = useFormik({
    initialValues: {
      displayName: displayName,
    },
    onSubmit: handleSubmitChangeUserData,
    validationSchema: loginValidationSchema,
  });

  const [isOpenDialog, setIsOpenDialog] = React.useState(false);
  const [preview, setPreview] = useState(null);
  const [showEditor, setShowEditor] = useState(photoURL ? false : true);

  const handleEditorClose = () => {
    setShowEditor(false);
  };

  const handleClickOpen = () => {
    setIsOpenDialog(true);
  };

  const onCrop = (view) => {
    setPreview(view);
  };

  const handleClose = () => {
    setIsOpenDialog(false);
  };

  const handleDeletePhoto = () => {
    setPreview(null);
    setShowEditor(true);
  };

  const updatePage = () => {
    navigate(0);
  };

  async function handleSubmitChangeUserData () {
    
    const changedUserData: { displayName?: string; photoURL?: string } = {};

    if (displayName !== displayNameForm.values.displayName) {
      changedUserData.displayName = displayNameForm.values.displayName;
    }

    try {
      if (!photoURL && preview) {
        await uploadString(
          ref(storage, `avatar/${uid}/avatar`),
          preview,
          "data_url"
        );

        const photourlLink = await getDownloadURL(
          ref(storage, `avatar/${uid}/avatar`)
        );

        changedUserData.photoURL = photourlLink;
      }
      await updateDoc(doc(db, "users", uid), changedUserData);
      await updateProfile(auth.currentUser, changedUserData);
      updatePage();
    } catch (error) {
      handleError(error.message);
    } finally {
      if (preview) {
        setPreview(null)
      }
    }
  };

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
      ) : showEditor ? (
        <Avatar
          width={200}
          height={200}
          onCrop={onCrop}
          onClose={handleEditorClose}
        />
      ) : (
        <UserPhoto photoURL={preview} handleClick={handleDeletePhoto} />
      )}
      <TextField
        error={
          displayNameForm.touched.displayName &&
          Boolean(displayNameForm.errors.displayName)
        }
        autoComplete="off"
        helperText={
          displayNameForm.touched.displayName &&
          displayNameForm.errors.displayName
        }
        id="displayName"
        value={displayNameForm.values.displayName}
        onChange={displayNameForm.handleChange}
        label={"Your name"}
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
          Boolean(displayNameForm.errors.displayName) || (
          displayNameForm.values.displayName == displayName && photoURL
            ? !preview && !showEditor
            : !preview && showEditor)
        }
        variant="contained"
        color="warning"
        onClick={() => displayNameForm.handleSubmit()}
      >
        Change
      </Button>
      <PhotoURLDialog
        open={isOpenDialog}
        handleClose={handleClose}
        handleError={handleError}
        updatePage={updatePage}
      />
    </div>
  );
}

export { PersonalData };
