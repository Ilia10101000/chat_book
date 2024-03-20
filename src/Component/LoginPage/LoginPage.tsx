"use client";
import { EmailForms } from "../CustomeElement/EmailForms";
import Box from "@mui/material/Box";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth, db } from "../../firebase/auth";
import { useSignInWithGoogle } from "react-firebase-hooks/auth";
import DefaultUserIcon from '../../img/default-user.svg'
import { useEffect } from "react";
import { collection, getDocs, limit, query, where } from "firebase/firestore";
import { USERS_D } from "../../firebase_storage_path_constants/firebase_storage_path_constants";

interface IWindow extends Window {
  recaptchaVerifier?: any;
  confirmResult?: any;
}
const windowI: IWindow = window;

const LoginPage = () => {
  const [signInWithEmailAndPassword,logedUser,loginLoading,loginError] =
    useSignInWithEmailAndPassword(auth);
  const [signInWithGoogle, googleLogedUser, loading, googleAuthError] = useSignInWithGoogle(auth);
  
  const handleSignInWithGoogle = async () => {
    const credentials = await signInWithGoogle();
    const { uid, photoURL, displayName, email } = credentials.user;
    const userDocSnap = await getDocs(query(collection(db,USERS_D), where('email','==', email), limit(1)))
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "baseline",
        paddingTop: "40px",
        width: "100%",
        minHeight: "100vh",
      }}
    >
      <Box
        sx={{
          borderRadius: "10px",
          width: "300px",
          p: 4,
          gap: 3,
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          bgcolor: (theme) =>
            theme.palette.mode === "light"
              ? "rgba(255,255,255,0.5)"
              : "rgba(0,0,0,0.7)",
          boxShadow: 5,
        }}
      >
        <Box>
          <img src={DefaultUserIcon} alt="icon" />
        </Box>
        <Box>
          <EmailForms handleSubmit={signInWithEmailAndPassword} />
        </Box>
        <Link to={"/signin/displayName"}>
          <Button size="small">Create account</Button>
        </Link>
        <Link to="/reset">
          <Button sx={{ fontSize: "10px" }} color="error">
            I forgot password
          </Button>
        </Link>
        <Button onClick={handleSignInWithGoogle}>Google</Button>
        {loginError && <div>{loginError.message}</div>}
        {googleAuthError && <div>{googleAuthError.message}</div>}
      </Box>
    </div>
  );
};

export { LoginPage };
