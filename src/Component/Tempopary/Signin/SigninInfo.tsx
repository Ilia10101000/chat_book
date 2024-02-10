import { Box, Button } from "@mui/material";
import React, { ReactNode } from "react";
import { useSigninValue } from "./Signin";
import { useParams, Navigate, useNavigate } from "react-router-dom";
import {
  DisplayNameValue,
  EmailValue,
  PhotoURLValue,
  SigninSubmitList,
} from "./SigninValueFields";


const transformEmailValue = (value: string) => {
  return value.replace(/\s+/g, "");
};
const transformNameValue = (value: string) => {
  return value.trim().replace(/\s{2,}/g, " ");
};

function SigninInfo() {
  const { requiredInfo } = useParams();
  const {signinForm, error} = useSigninValue();
    const navigate = useNavigate();
    const goBack = () => navigate(-1);

  let form: ReactNode | null = null;

  if (requiredInfo === "displayName") {
    form = (
      <DisplayNameValue
        error={
          signinForm.touched.displayName &&
          Boolean(signinForm.errors.displayName)
        }
        helperText={
          signinForm.touched.displayName &&
          signinForm.errors.displayName
        }
        autoComplete='off'
        label={"Type your name"}
        name={"displayName"}
        id={"displayName"}
        value={signinForm.values.displayName}
        onChange={signinForm.handleChange}
        onBlur={(e) => {
          signinForm.setFieldValue(
            "displayName",
            transformNameValue(signinForm.values.displayName)
          ).then(() => signinForm.handleBlur(e));
        }}
      />
    );
  }

  if (requiredInfo === "email") {
    form = (
      <EmailValue
        error={signinForm.touched.email && Boolean(signinForm.errors.email)}
        helperText={signinForm.touched.email && signinForm.errors.email}
        displayName={signinForm.values.displayName}
        label={"Enter your email"}
        name={"email"}
        autoComplete="off"
        id={"email"}
        value={signinForm.values.email}
        onChange={signinForm.handleChange}
        onBlur={(e) => {
          signinForm
            .setFieldValue(
              "email",
              transformEmailValue(signinForm.values.email)
            )
            .then(() => signinForm.handleBlur(e));
        }}
      />
    );
  }
  if (requiredInfo === "photoURL") {
    form = (
      <PhotoURLValue
        displayName={signinForm.values.displayName}
        value={signinForm.values.photoURL}
        onChange={(data_url: string) =>
          signinForm.setFieldValue("photoURL", data_url)
        }
      />
    );
  }
  if (requiredInfo === "submit") {
    form = (
      <SigninSubmitList
        error={error}
        isValid={signinForm.isValid}
        handleSubmit={signinForm.handleSubmit}
        values={signinForm.values}
        mainPassword={{
          label: "Set password",
          name: "password",
          id: "password",
          value: signinForm.values.password,
          onChange: signinForm.handleChange,
          onBlur: signinForm.handleBlur,
          error:
            signinForm.touched.password && Boolean(signinForm.errors.password),
          helperText: signinForm.touched.password && signinForm.errors.password,
        }}
        confirmPassword={{
          label: "Confirm password",
          name: "confirmPassword",
          id: "confirmPassword",
          value: signinForm.values.confirmPassword,
          onChange: signinForm.handleChange,
          onBlur: signinForm.handleBlur,
          error:
            signinForm.touched.confirmPassword &&
            Boolean(signinForm.errors.confirmPassword),
          helperText:
            signinForm.touched.confirmPassword &&
            signinForm.errors.confirmPassword,
        }}
      />
    );
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
      <Button onClick={goBack}>Go back</Button>
      {form}
    </Box>
  ) : (
    <Navigate to={"/login"} />
  );
}

export { SigninInfo };
