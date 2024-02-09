import React, { useDeferredValue, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";
import { storage, ref } from "../../../firebase/auth";
import { useSigninValue } from "./Signin";
import { uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { useDownloadURL } from "react-firebase-hooks/storage";
import User from "../../../img/default-user.svg";
import Avatar from "react-avatar-edit";

function DisplayNameValue(props: any) {
  const navigate = useNavigate();

  const goForward = () => {
    localStorage.setItem("displayNameSignInValue", props.value);
    navigate("/signin/password");
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
function PasswordValue({ mainPassword, confirmPassword }: any) {
  const [isShownPassword, setIsShownPassword] = useState(false);

  const toogleVisibilityPassword = () => setIsShownPassword((value) => !value);

  const [password1, password2] = [mainPassword.value, confirmPassword.value];

  return (
    <>
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
      <Button disabled={password1 !== password2 || !password1 || !password2}>
        <Link style={{ textDecoration: "none" }} to="/signin/email">
          Submit
        </Link>
      </Button>
    </>
  );
}
function EmailValue(props: any) {
  return (
    <>
      <TextField {...props} />
      <Button disabled={!props.value || props.error}>
        <Link style={{ textDecoration: "none" }} to="/signin/photoURL">
          Submit
        </Link>
      </Button>
    </>
  );
}
function PhotoURLValue({
  value,
  onChange,
}: {
  value: string;
  onChange: (data_url: string) => void;
}) {
  const navigate = useNavigate();

  const [photoFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [showEditor, setShowEditor] = useState(value ? false : true)

  const onCrop = (view) => {
    setPreview(view);
  };

  const handleClose = () => {
    setShowEditor(false)
  }

  const deletePhoto = () => {
    setPreview(null);
    onChange(null)
    setShowEditor(true)
  }
  const handleSubmit = () => {
    if(preview){
      onChange(preview)
    }
    navigate("/signin/submit")
  }

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      {showEditor && (
        <Avatar width={200} height={250} src={photoFile} onCrop={onCrop} onClose={handleClose}/>
      )}
      {!showEditor && (
        <>
        <img style={{ width: "250px" }} src={value || preview} alt="avatar" />
        <Button onClick={deletePhoto}>Delete photo</Button>
        </>

      )
      }
      <Button onClick={handleSubmit}>{value || preview?'Submit':'Skip'}</Button>
    </div>
  );
}

function SigninSubmitList({
  values,
}: {
  values: { email: string; displayName: string; photoURL: string };
}) {
  const { email, displayName, photoURL } = values;

  return (
    <>
      <div>{email}</div>
      <div>{displayName}</div>
      <div>
        <img style={{ width: "300px" }} src={photoURL || User} alt="sdf" />
      </div>
    </>
  );
}

export {
  DisplayNameValue,
  PasswordValue,
  EmailValue,
  PhotoURLValue,
  SigninSubmitList,
};
