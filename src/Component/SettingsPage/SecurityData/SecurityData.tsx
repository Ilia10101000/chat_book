import React, { useEffect, useState } from "react";
import { Alert, Button, TextField } from "@mui/material";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import InputAdornment from "@mui/material/InputAdornment";
import Box from "@mui/material/Box";
import { updatePasswordValidationSchema } from "../../../lib/yupFormsValidationParams";
import { useFormik } from "formik";
import { updatePassword } from "firebase/auth";
import { auth } from "../../../firebase/auth";
import { ReloginDialog } from "./ReloginDialog";
import { signOut } from "firebase/auth";
import { useTranslation } from "react-i18next";

function SecurityData({
  handleError,
  displayName,
}: {
  handleError: (errorMessage: string) => void;
  displayName: string;
}) {
  const [success, setSuccess] = useState(false);
  const [askRelogin, setAskRelogin] = useState(false);
  const [isShownPassword, setIsShownPassword] = useState(false);
  const {t} = useTranslation()

  const passwordForm = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    initialErrors: { password: "" },
    onSubmit: changeUserAccountPassword,
    validationSchema: updatePasswordValidationSchema,
  });

  useEffect(() => {
    if (success) {
      setTimeout(() => {
        setSuccess(false);
      }, 2000);
    }
  }, [success]);

  const handleOpenAskReload = () => {
    setAskRelogin(true);
  };

  const confirmSignout = () => {
    signOut(auth)
  }

  const handleCloseAskReload = () => {
    setAskRelogin(false);
  };

  async function changeUserAccountPassword() {
    try {
      await updatePassword(auth.currentUser, passwordForm.values.password);
      passwordForm.resetForm()
      setSuccess(true);
    } catch (error) {
      if (error.message == "Firebase: Error (auth/requires-recent-login).") {
        handleOpenAskReload();
        return;
      }
      handleError(error.message);
    }
  }

  const toogleVisibilityPassword = () => setIsShownPassword((value) => !value);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 5,
      }}
    >
      <TextField
        label={t("login.enterNewPassword")}
        name={"password"}
        id={"password"}
        value={passwordForm.values.password}
        onChange={passwordForm.handleChange}
        onBlur={passwordForm.handleBlur}
        error={
          passwordForm.values.password &&
          passwordForm.touched.password &&
          Boolean(passwordForm.errors.password)
        }
        helperText={
          passwordForm.values.password &&
          passwordForm.touched.password &&
          t(passwordForm.errors.password,{min:6})
        }
        sx={{
          width: "280px",
        }}
        type={isShownPassword ? "text" : "password"}
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
        label={t("signin.confirmPassword")}
        name={"confirmPassword"}
        id={"confirmPassword"}
        value={passwordForm.values.confirmPassword}
        onChange={passwordForm.handleChange}
        onBlur={passwordForm.handleBlur}
        error={
          passwordForm.values.confirmPassword &&
          passwordForm.touched.confirmPassword &&
          Boolean(passwordForm.errors.confirmPassword)
        }
        helperText={
          passwordForm.values.confirmPassword &&
          passwordForm.touched.confirmPassword &&
          t(passwordForm.errors.confirmPassword)
        }
        sx={{
          width: "280px",
        }}
        type={isShownPassword ? "text" : "password"}
      />
      <Button
        variant="contained"
        color="warning"
        disabled={!passwordForm.isValid}
        onClick={() => {
          passwordForm.handleSubmit();
        }}
      >
        {t("login.changePassword")}
      </Button>
      {success && <Alert>{t("settingsPage.success")}</Alert>}
      <ReloginDialog
        displayName={displayName}
        open={askRelogin}
        handleClose={handleCloseAskReload}
        handleConfirm={confirmSignout}
      />
    </Box>
  );
}

export { SecurityData };

