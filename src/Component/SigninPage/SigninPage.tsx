import React from "react";
import { EmailForms } from "../CustomeElement/EmailForms";
import Box from "@mui/material/Box";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "../../firebase/auth";

const SigninPage = () => {

    const [createUserWithEmailAndPassword] =
        useCreateUserWithEmailAndPassword(auth);
    
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
        <img src={"../../img/bird.png"} alt="icon" />
      </Box>
      <Box>
        <EmailForms handleSubmit={createUserWithEmailAndPassword} />
      </Box>
    </Box>
  );
};

export { SigninPage };
