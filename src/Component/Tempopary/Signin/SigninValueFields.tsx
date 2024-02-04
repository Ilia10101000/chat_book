import React, { useDeferredValue, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button, TextField, Box } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";
import IconButton from "@mui/material/IconButton";
import { storage, ref, auth } from "../../../firebase/auth";
import { useUploadFile } from "react-firebase-hooks/storage";
import { useUpdateProfile } from "react-firebase-hooks/auth";
import { useDownloadURL } from "react-firebase-hooks/storage";


function DisplayNameValue(props: any) {
  const defVal = useDeferredValue(props.value);
  const navigate = useNavigate();

  const goBack = () => navigate(-1);
  return (
    <>
      <Button onClick={goBack}>Go back</Button>
      <TextField {...props} />
      <Button disabled={props.error}>
        <Link style={{ textDecoration: "none" }} to="/signin/password">
          Submit
        </Link>
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
      <TextField {...props}/>
      <Button disabled={!props.value || props.error}>
        <Link style={{ textDecoration: "none" }} to="/signin/photoURL">
          Submit
        </Link>
      </Button>
    </>
  );
}
function PhotoURLValue() {
  const navigate = useNavigate();
  const goBack = () => navigate(-1);

  const [uploadFile, uploading, snapshot, errorUploadFile] = useUploadFile();
  const [updateProfile, updating, errorUpdateProfile] = useUpdateProfile(auth);
  const [value, loading, error] = useDownloadURL(
    storageRef(storage, "path/to/file")
  );

    const storageRef = ref(storage, "ilia/img/file.jpg");
    const [selectedFile, setSelectedFile] = useState<File>();

   const upload = async () => {
     if (selectedFile) {
       const result = await uploadFile(storageRef, selectedFile, {
         contentType: "image/jpeg",
       });
       console.log(`Result: ${JSON.stringify(result,null,2)}`);
     }
   };

   return (
     <div>
       <p>
         {errorUploadFile && <strong>Error: {errorUploadFile.message}</strong>}
         {uploading && <span>Uploading file...</span>}
         {snapshot && <span>Snapshot: {JSON.stringify(snapshot)}</span>}
         {selectedFile && <span>Selected file: {selectedFile.name}</span>}
         <input
           type="file"
           onChange={(e) => {
             const file = e.target.files ? e.target.files[0] : undefined;
             setSelectedFile(file);
           }}
         />
         <button onClick={upload}>Upload file</button>
       </p>
     </div>
   );
}

export { DisplayNameValue, PasswordValue, EmailValue, PhotoURLValue };
