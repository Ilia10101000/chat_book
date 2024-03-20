import React, { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";
import CircularProgress from "@mui/material/CircularProgress";
import { Badge, Box } from "@mui/material";
import User from "../../img/default-user.svg";
import { NewImageModalWindow } from "../UserPage/PostList/AddNewPost/NewImageModalWindow";
import { EditorNewAvatar } from "../SettingsPage/PersonalData/EditorUserAvatar";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";

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
function EmailValue({ displayName, ...props }: any) {
  const navigate = useNavigate();
  if (!displayName) {
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

  const [showEditorButton, setShowEditorButton] = useState(false);

  if (!displayName) {
    return <Navigate to={"/signin/displayName"} />;
  }

  const handleCloseEditorWindow = () => {
    setShowEditorButton(false);
  };
  const handleOpenEditorWindow = () => {
    setShowEditorButton(true);
  };

  const deletePhoto = () => {
    onChange(null);
  };
  const handleSubmit = (image) => {
    localStorage.setItem("photoURLSignInValue", image);
    onChange(image);
    navigate("/signin/submit");
  };

  const nextStep = () => {
    navigate("/signin/submit");
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "15px",
      }}
    >
      <NewImageModalWindow
        open={showEditorButton}
        onClose={handleCloseEditorWindow}
      >
        <EditorNewAvatar handleSaveImage={handleSubmit} />
      </NewImageModalWindow>
      {value ? (
        <Badge
          badgeContent={
            <IconButton onClick={deletePhoto} color="warning">
              <DeleteForeverIcon fontSize="small" />
            </IconButton>
          }
        >
          <img
            style={{ width: "250px", borderRadius: "50%" }}
            src={value}
            alt="avatar"
          />
        </Badge>
      ) : (
        <Box
          sx={{
            width: "250px",
            height: "250px",
            display: "flex",
            backgroundColor: "inherit",
            alignItems: "center",
            justifyContent: "center",
            border: "1px dotted #8c8c8c",
            borderRadius: "50%",
            whiteSpace: "pre-wrap",
            cursor: "pointer",
            flexDirection: "column",
            "&:hover": {
              filter: "brightness(150%)",
              border: "1px solid #8c8c8c",
            },
          }}
          onClick={handleOpenEditorWindow}
        >
          Click to select avatar
          <AddPhotoAlternateIcon sx={{ fontSize: "55px" }} />
        </Box>
      )}
      <Button onClick={nextStep}>{value ? "Next step" : "Skip"}</Button>
    </div>
  );
}

function SigninSubmitList({
  loading,
  error,
  isValid,
  mainPassword,
  confirmPassword,
  values,
  handleSubmit,
}: {
  loading: boolean;
  error: string | null;
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
  const [isShownPassword, setIsShownPassword] = useState(false);

  if (!displayName) {
    return <Navigate to={"/signin/displayName"} />;
  }

  const toogleVisibilityPassword = () => setIsShownPassword((value) => !value);

  return (
    <>
      <div>{email}</div>
      <div>{displayName}</div>
      <div>
        <img
          style={{ width: "250px", borderRadius: "50%" }}
          src={photoURL || User}
          alt="sdf"
        />
      </div>
      <TextField
        sx={{ width: "280px" }}
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
        sx={{ width: "280px" }}
        type={isShownPassword ? "text" : "password"}
        {...confirmPassword}
      />
      <Button disabled={!isValid} onClick={handleSubmit}>
        Confirm
      </Button>
      {loading && <CircularProgress color="success" />}
      {error && <div>{error}</div>}
    </>
  );
}

export { DisplayNameValue, EmailValue, PhotoURLValue, SigninSubmitList };
