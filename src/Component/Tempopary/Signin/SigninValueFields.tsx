import React, { useDeferredValue, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import InputAdornment from "@mui/material/InputAdornment";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";
import { storage, ref } from "../../../firebase/auth";
import { useSigninValue } from "./Signin";
import { uploadBytes, getDownloadURL } from "firebase/storage";
import { useDownloadURL } from "react-firebase-hooks/storage";
import User from "../../../img/default-user.svg";

function DisplayNameValue(props: any) {
  const defVal = useDeferredValue(props.value);
  const navigate = useNavigate();

  const goForward = () => {
    localStorage.setItem("displayNameSignInValue", props.value);
    navigate("/signin/password");
  };

  const goBack = () => navigate(-1);
  return (
    <>
      <Button onClick={goBack}>Go back</Button>
      <TextField {...props} />
      <Button onClick={goForward} disabled={props.error}>
        Submit
      </Button>
    </>
  );
}
function PasswordValue({ mainPassword, confirmPassword }: any) {
  const [isShownPassword, setIsShownPassword] = useState(false);
  const navigate = useNavigate();

  const toogleVisibilityPassword = () => setIsShownPassword((value) => !value);
  const goBack = () => navigate(-1);

  const [password1, password2] = [mainPassword.value, confirmPassword.value];

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
      <Button disabled={password1 !== password2 || !password1 || !password2}>
        <Link style={{ textDecoration: "none" }} to="/signin/email">
          Submit
        </Link>
      </Button>
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
      <Button disabled={!props.value || props.error}>
        <Link style={{ textDecoration: "none" }} to="/signin/photoURL">
          Submit
        </Link>
      </Button>
    </>
  );
}
function PhotoURLValue({
  id,
  name,
  value,
  onChange,
}: {
  id: string;
  name: string;
  value: string;
  onChange: (field: string, fileURL: string) => void;
}) {
  const navigate = useNavigate();
  const goBack = () => navigate(-1);

  let { email } = useSigninValue().values;

  const storageFilePath = `temporary/${email || "temporaryEmail"}/avatar`;

  const [error, setError] = useState("");

  const storageRef = ref(storage, storageFilePath);
  const [valueURL, loading] = useDownloadURL(storageRef);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files[0]) {
      try {
        await uploadBytes(storageRef, e.target.files[0]);
        const URL = await getDownloadURL(storageRef);
        localStorage.setItem("photoURLSignInValue", URL);
        onChange("photoURL", URL);
      } catch (error) {
        setError(error.message);
      }
    }
  };

  return (
    <div>
      <Button onClick={goBack}>Go back</Button>
      <div>
        {value && <span>Selected file: {value}</span>}
        <div>
          <label>
            <input
              id={id}
              name={name}
              accept="image/*"
              type="file"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
            <Button
              component="span"
              sx={{ display: "flex", gap: 2, mx: "auto" }}
            >
              Choose photo
              <InsertPhotoIcon />
            </Button>
          </label>
        </div>
      </div>
      {!loading && (
        <img
          style={{ width: "300px" }}
          src={valueURL || value || User}
          alt="avatar"
        />
      )}
      {error && <div>{error}</div>}
      <Button><Link to={'/signin/submit'}>Submit</Link></Button>
    </div>
  );
}

function SigninSubmitList({ values }: { values: { email: string, displayName: string, photoURL: string } }) {
  const { email, displayName, photoURL } = values;

  return (
    <>
      <div>{email}</div>
      <div>{displayName}</div>
      <div>
        <img style={{width:'300px'}} src={photoURL} alt="sdf" />
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
