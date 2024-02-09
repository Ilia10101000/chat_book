import React, { useState } from "react";
import { useNavigate, Link, Navigate } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";
import User from "../../../img/default-user.svg";
import Avatar from "react-avatar-edit";

function DisplayNameValue(props: any) {
  const navigate = useNavigate();

  const goForward = () => {
    localStorage.setItem("displayNameSignInValue", props.value);
    navigate("/signin/email");
  };

  return (
    <>
      <TextField {...props} />
      <Button onClick={goForward} disabled={props.error}>
        Submit
      </Button>
    </>
  );
}
function EmailValue(props: any) {
  const navigate = useNavigate();
  if (!props.displayName) {
    return <Navigate to={"/signin/displayName"} />;
  }
  const goForward = () => {
    localStorage.setItem("emailSignInValue", props.value);
    navigate("/signin/photoURL");
  };
  return (
    <>
      <TextField {...props} />
      <Button onClick={goForward} disabled={!props.value || props.error}>
        Submit
      </Button>
    </>
  );
}
function PhotoURLValue({
  displayName,
  value,
  onChange,
}: {
  displayName: string;
  value: string;
  onChange: (data_url: string) => void;
}) {
  const navigate = useNavigate();

  const [photoFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [showEditor, setShowEditor] = useState(value ? false : true);

  if (!displayName) {
    return <Navigate to={"/signin/displayName"} />;
  }
  const onCrop = (view) => {
    setPreview(view);
  };

  const handleClose = () => {
    setShowEditor(false);
  };

  const deletePhoto = () => {
    setPreview(null);
    onChange(null);
    setShowEditor(true);
  };
  const handleSubmit = () => {
    if (preview) {
      onChange(preview);
      localStorage.setItem("photoURLSignInValue", preview);
    }
    navigate("/signin/submit");
  };

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      {showEditor && (
        <Avatar
          width={200}
          height={250}
          src={photoFile}
          onCrop={onCrop}
          onClose={handleClose}
        />
      )}
      {!showEditor && (
        <>
          <img style={{ width: "250px" }} src={value || preview} alt="avatar" />
          <Button onClick={deletePhoto}>Delete photo</Button>
        </>
      )}
      <Button onClick={handleSubmit}>
        {value || preview ? "Submit" : "Skip"}
      </Button>
    </div>
  );
}

function SigninSubmitList({
  isValid,
  mainPassword,
  confirmPassword,
  values,
  handleSubmit,
}: {
  isValid: boolean;
  mainPassword: any;
  confirmPassword: any;
  handleSubmit: () => void;
  values: {
    email: string;
    displayName: string;
    photoURL: string;
    password: string;
  };
}) {
  const { email, displayName, photoURL } = values;
  const [error, setError] = useState("");
  const [isShownPassword, setIsShownPassword] = useState(false);
  if (!displayName) {
    return <Navigate to={"/signin/displayName"} />;
  }

  const toogleVisibilityPassword = () => setIsShownPassword((value) => !value);

  const handleSubmitSignInUser = () => {
    try {
      handleSubmit();
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <>
      <div>{email}</div>
      <div>{displayName}</div>
      <div>
        <img style={{ width: "300px" }} src={photoURL || User} alt="sdf" />
      </div>
      <TextField
        type={isShownPassword ? "text" : "password"}
        {...mainPassword}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={toogleVisibilityPassword}>
                {isShownPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <TextField
        type={isShownPassword ? "text" : "password"}
        {...confirmPassword}
      />
      <Button disabled={!isValid} onClick={handleSubmitSignInUser}>
        Confirm
      </Button>
      {error && <div>{error}</div>}
    </>
  );
}

export { DisplayNameValue, EmailValue, PhotoURLValue, SigninSubmitList };
