import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button, TextField, Box } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";
import IconButton from "@mui/material/IconButton";

function DisplayNameValue(props: any) {
  const navigate = useNavigate();

  const goBack = () => navigate(-1);
  return (
    <>
      <Button onClick={goBack}>Go back</Button>
      <TextField {...props} />
      <Link to="/signin/password">
        <Button>Submit</Button>
      </Link>
    </>
  );
}
function PasswordValue({mainPassword, confirmPassword}: any) {

  const [isShownPassword, setIsShownPassword] = useState(false);
  const navigate = useNavigate();
  
  const toogleVisibilityPassword = () => setIsShownPassword(value => !value);
  const goBack = () => navigate(-1);

  return (
    <>
      <Button onClick={goBack}>Go back</Button>
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
      <Link to="/signin/email">
        <Button>Submit</Button>
      </Link>
    </>
  );
}
function EmailValue(props: any) {
  const navigate = useNavigate();

  const goBack = () => navigate(-1);
  return (
    <>
      <Button onClick={goBack}>Go back</Button>
      <TextField {...props} />
      <Link to="/signin/photoURL">
        <Button>Submit</Button>
      </Link>
    </>
  );
}
function PhotoURLValue() {
  const navigate = useNavigate();

  const goBack = () => navigate(-1);
  return (
    <>
      <Button onClick={goBack}>Go back</Button>
      <TextField />
      <Link to="/signin/displayName">
        <Button>Submit</Button>
      </Link>
    </>
  );
}

export { DisplayNameValue, PasswordValue, EmailValue, PhotoURLValue };
