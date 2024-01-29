"use client";
import { EmailForms } from "../CustomeElement/EmailForms";
import Box from "@mui/material/Box";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "../../firebase/auth";
import DefaultUserIcon from '../../img/default-user.svg'

interface IWindow extends Window {
  recaptchaVerifier?: any;
  confirmResult?: any;
}
const windowI: IWindow = window;

const LoginPage = () => {
  const [signInWithEmailAndPassword] =
    useSignInWithEmailAndPassword(auth);
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
          width: "fit-content",
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
        <Link to={'/signin'}><Button size="small">Create account</Button></Link>
        <Link to="/reset">
          <Button sx={{ fontSize: "10px" }} color="error">
            I forgot password
          </Button>
        </Link>
      </Box>
    </div>
  );
};

export { LoginPage };
