import { Box, Button } from "@mui/material";
import React, { ReactNode } from "react";
import { useSigninValue } from "./Signin";
import { useParams, Navigate, useNavigate, useLocation } from "react-router-dom";
import {
  DisplayNameValue,
  EmailValue,
  PhotoURLValue,
  SigninSubmitList,
} from "./SigninValueFields";
import { useTranslation } from "react-i18next";

const transformEmailValue = (value: string) => {
  return value.replace(/\s+/g, "");
};
const transformNameValue = (value: string) => {
  return value.trim().replace(/\s{2,}/g, " ");
};

function SigninInfo() {
  const { requiredInfo } = useParams();
  const { signinForm, error, loading } = useSigninValue();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const location = useLocation()
  const goBack = () => {
    if (location.pathname === "/signin/displayName") {
      navigate("/login");
    } else {
      navigate(- 1);
    }
  }

  let form: ReactNode | null = null;

  if (requiredInfo === "displayName") {
    form = (
      <DisplayNameValue
        error={
          signinForm.touched.displayName &&
          Boolean(signinForm.errors.displayName)
        }
        helperText={
          signinForm.touched.displayName && t(signinForm?.errors?.displayName)
        }
        autoComplete="off"
        label={t('login.enterName')}
        name={"displayName"}
        id={"displayName"}
        value={signinForm.values.displayName}
        onChange={signinForm.handleChange}
        onBlur={(e) => {
          signinForm
            .setFieldValue(
              "displayName",
              transformNameValue(signinForm.values.displayName)
            )
            .then(() => signinForm.handleBlur(e));
        }}
        nextStepButton={t("signin.nextStepButton")}
      />
    );
  }

  if (requiredInfo === "email") {
    form = (
      <EmailValue
        error={signinForm.touched.email && Boolean(signinForm.errors.email)}
        helperText={signinForm.touched.email && t(signinForm.errors.email)}
        displayName={signinForm.values.displayName}
        label={t("login.email")}
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
        nextStepButton={t("signin.nextStepButton")}
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
        selectAvatar={t("signin.selectAvatar")}
        nextStepButton={t("signin.nextStepButton")}
        photoSkipStep={t("signin.photoSkipStep")}
      />
    );
  }
  if (requiredInfo === "submit") {
    form = (
      <SigninSubmitList
        loading={loading}
        error={error}
        confirmButton={t("signin.confirmButton")}
        isValid={signinForm.isValid}
        handleSubmit={signinForm.handleSubmit}
        values={signinForm.values}
        mainPassword={{
          autoComplete:'off',
          label: t("login.password"),
          name: "password",
          id: "password",
          value: signinForm.values.password,
          onChange: signinForm.handleChange,
          onBlur: signinForm.handleBlur,
          error:
            signinForm.touched.password && Boolean(signinForm.errors.password),
          helperText: signinForm.touched.password && t(signinForm.errors.password,{min:6}),
        }}
        confirmPassword={{
          autoComplete:'off',
          label: t("signin.confirmPassword"),
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
            t(signinForm.errors.confirmPassword),
        }}
      />
    );
  }

  return form ? (
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
      <Button size="small" color="warning" onClick={goBack}>
        {t("signin.goBackButton")}
      </Button>
      {form}
    </Box>
  ) : (
    <Navigate to={"/login"} />
  );
}

export { SigninInfo };
