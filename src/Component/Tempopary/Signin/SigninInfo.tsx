import { Box } from "@mui/material";
import React, { ReactNode } from "react";
import { useSigninValue } from "./Signin";
import { useParams, Navigate } from "react-router-dom";
import {
  DisplayNameValue,
  PasswordValue,
  EmailValue,
  PhotoURLValue,
} from "./SigninValueFields";


const transformEmailValue = (value: string) => {
  return value.replace(/\s+/g, "");
};
const transformNameValue = (value: string) => {
  return value.trim().replace(/\s{2,}/g, " ");
};

function SigninInfo() {
  const { requiredInfo } = useParams();
  const signinForm = useSigninValue();

  let form: ReactNode | null = null;

  if (requiredInfo === "displayName") {
    form = (
      <DisplayNameValue
        label={"Type your name"}
        name={"displayName"}
        id={"displayName"}
        value={signinForm.values.displayName}
        onChange={signinForm.handleChange}
        onBlur={() => {
          signinForm
            .setFieldValue(
              "displayName",
              transformNameValue(signinForm.values.displayName)
            )
        }}
      />
    );
  }
  if (requiredInfo === "password") {
    form = (
      <PasswordValue
        mainPassword={{
          label: "Set password",
          name: "password",
          id: "password",
          value: signinForm.values.password,
          onChange: signinForm.handleChange,
          onBlur: signinForm.handleBlur,
        }}
        confirmPassword={{
          label: "Confirm password",
          name: "confirmPassword",
          id: "confirmPassword",
          value: signinForm.values.confirmPassword,
          onChange: signinForm.handleChange,
          onBlur: signinForm.handleBlur,
        }}
      />
    );
  }
  if (requiredInfo === "email") {
    form = (
      <EmailValue
        label={"Enter your email"}
        name={"email"}
        id={"email"}
        value={signinForm.values.email}
        onChange={signinForm.handleChange}
        onBlur={() => {
          signinForm.setFieldValue(
            "email",
            transformEmailValue(signinForm.values.email)
          );
        }}
      />
    );
  }
  if (requiredInfo === "photoURL") {
    form = <PhotoURLValue />;
  }

  return form ? (
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
      {form}
    </Box>
  ) : (
    <Navigate to={"/login"} />
  );
}

export { SigninInfo };
