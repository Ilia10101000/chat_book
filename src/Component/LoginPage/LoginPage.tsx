"use client";
import { EmailForms } from "../CustomeElement/EmailForms";
import Box from "@mui/material/Box";
import { Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import {
  useSignInWithEmailAndPassword,
  useSignInWithGoogle,
} from "react-firebase-hooks/auth";
import { auth, db } from "../../firebase/auth";
import DefaultUserIcon from "../../img/default-user.svg";
import {
  collection,
  doc,
  getDocs,
  limit,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { USERS_D } from "../../firebase_storage_path_constants/firebase_storage_path_constants";
import { ThemeSwitch } from "../CustomeElement/SwitchTheme";
import { useTheme } from "../../theme";
import { useTranslation } from "react-i18next";
import { SwitchLanguage } from "../CustomeElement/SwitchLanguage";

interface IWindow extends Window {
  recaptchaVerifier?: any;
  confirmResult?: any;
}
const windowI: IWindow = window;

const LoginPage = () => {
  const [signInWithEmailAndPassword, logedUser, loginLoading, loginError] =
    useSignInWithEmailAndPassword(auth);
  const [signInWithGoogle, googleLogedUser, loading, googleAuthError] =
    useSignInWithGoogle(auth);

  const { mode, toogleThemeMode } = useTheme();
  const { t } = useTranslation();

  const handleSignInWithGoogle = async () => {
    const credentials = await signInWithGoogle();
    const { uid, photoURL, displayName, email } = credentials.user;
    const userDocSnap = await getDocs(
      query(collection(db, USERS_D), where("email", "==", email), limit(1))
    );
    if (userDocSnap.empty) {
      await setDoc(doc(db, USERS_D, uid), {
        id: uid,
        displayName,
        email,
        photoURL,
        searchQuery: displayName.toLowerCase(),
      });
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        paddingTop: "40px",
        width: "100%",
        minHeight: "100vh",
      }}
    >
      <Box
        sx={{
          position: 'relative',
        // top: '50%',
        // left: '50%',
        // transform:'translate(-50%,-50%)',
          borderRadius: "10px",
          width: "300px",
          p: 4,
          gap: { xs: 1, sm: 2, md: 3 },
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
        <Typography variant="h5">{t("login.login")}</Typography>
        <Box>
          <img src={DefaultUserIcon} alt="icon" />
        </Box>
        <Box>
          <EmailForms handleSubmit={signInWithEmailAndPassword} />
        </Box>
        <Link to={"/signin/displayName"}>
          <Button size="small">{t("login.createAccount")}</Button>
        </Link>
        <Button
          // onClick={handleSignInWithEmailLink}
          sx={{ fontSize: "10px" }}
          color="error"
        >
          {t("login.forgotPassword")}
        </Button>
        <Button onClick={handleSignInWithGoogle}>{t("login.google")}</Button>
        <div
          style={{
            display: "flex",
            alignSelf: "stretch",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <SwitchLanguage />
          <ThemeSwitch
            sx={{ alignSelf: "end" }}
            checked={mode === "dark"}
            onChange={toogleThemeMode}
          />
        </div>
        {loginError && <div style={{position:'absolute',top:'0px',transform:'translate(0%,-100%)'}}>{loginError.message}</div>}
        {googleAuthError && <div style={{position:'absolute',top:'0px',transform:'translate(0%,-100%)'}}>{googleAuthError.message}</div>}
      </Box>
    </div>
  );
};

export { LoginPage };
