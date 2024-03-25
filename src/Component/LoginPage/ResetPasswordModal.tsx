import React, { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import TextField from "@mui/material/TextField";
import { useFormik } from "formik";
import { emailVerifySchema } from "../../lib/yupFormsValidationParams";
import { useTranslation } from "react-i18next";
import { sendPasswordResetEmail } from "firebase/auth";
import Alert, { AlertColor } from "@mui/material/Alert";
import { Box, Modal } from "@mui/material";

const transformNameValue = (value: string) => {
  return value.trim().replace(/\s{2,}/g, "");
};

function ResetPasswordModal({ open, onClose, auth }) {
  const { t } = useTranslation();
  const [result, setResult] = useState<{
    message: string;
    color: AlertColor;
  } | null>(null);
  const emailForm = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: emailVerifySchema,
    onSubmit: handleChangeEmail,
  });

  async function handleChangeEmail() {
    if (result) {
      setResult(null);
    }
    try {
      await sendPasswordResetEmail(auth, emailForm.values.email);
      setResult({ message: t("settingsPage.check"), color: "success" });
    } catch (error) {
      setResult({ message: error.message, color: "error" });
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
    >
      <Box
        sx={{
          position: "relative",
          width: "300px",
          backgroundColor: "background.paper",
        }}
      >
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            {t("resetPasswordForm.context")}
          </DialogContentText>
          <TextField
            sx={{ width: "250px", mb: 2 }}
            error={
              emailForm.values.email &&
              emailForm.touched.email &&
              Boolean(emailForm.errors.email)
            }
            autoComplete="off"
            helperText={
              emailForm.values.email &&
              emailForm.touched.email &&
              t(emailForm.errors.email)
            }
            id="email"
            value={emailForm.values.email}
            onChange={emailForm.handleChange}
            label={t("login.email")}
            onBlur={(e) => {
              emailForm
                .setFieldValue(
                  "email",
                  transformNameValue(emailForm.values.email)
                )
                .then(() => emailForm.handleBlur(e));
            }}
          />
        </DialogContent>
        <DialogActions sx={{ display: "flex", justifyContent: "start" }}>
          <Button color="warning" onClick={onClose}>
            {t("login.cancel")}
          </Button>
          <Button
            disabled={
              !emailForm.values.email || Boolean(emailForm.errors.email)
            }
            variant="contained"
            onClick={() => emailForm.handleSubmit()}
          >
            {t("resetPasswordForm.send")}
          </Button>
        </DialogActions>
        {result && (
          <Alert
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              transform: "translate(0%,100%)",
              maxWidth: "300px",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
            color={result.color}
          >
            {result.message}
          </Alert>
        )}
      </Box>
    </Modal>
  );
}

export { ResetPasswordModal };
