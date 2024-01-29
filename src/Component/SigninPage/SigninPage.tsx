import React from "react";
import { EmailForms } from "../CustomeElement/EmailForms";
import Box from "@mui/material/Box";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth, db } from "../../firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import User from '../../img/default-user.svg'

const SigninPage = () => {

    const [createUserWithEmailAndPassword, user, loading, error] =
    useCreateUserWithEmailAndPassword(auth);
  
  const handleSignInUser = async (email: string, password: string) => {
    try {
      const credentials = await createUserWithEmailAndPassword(email, password);
      await setDoc(doc(db, "users", credentials.user.uid), {
        id: credentials.user.uid,
        email: credentials.user.email,
        emailVerified: credentials.user.emailVerified,
        displayName:
          credentials.user.displayName ||
          `User: ${credentials.user.uid.slice(0, 6)}`,
      });
    } catch (error) {
      console.log('error: ', error.message)
    }
  };
    
  return (
    <Box
      sx={{
        mx: "auto",
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
        <img src={User} alt="icon" />
      </Box>
      <Box>
        <EmailForms handleSubmit={handleSignInUser} />
      </Box>
      {error && (
        <Box
          sx={{
            maxWidth: "100%",
            whiteSpace: "wrap",
          }}
        >
          {error.message}
        </Box>
      )}
      {loading && (
        <Box
          sx={{
            maxWidth: "100%",
            whiteSpace: "wrap",
          }}
        >
          loading...
        </Box>
      )}
    </Box>
  );
};

export { SigninPage };
