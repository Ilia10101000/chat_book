import React, { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import { User } from "firebase/auth";
import { deleteUserAccount } from "../../firebase/utils/account_utils";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/auth";
import { ReloginDialog } from "./SecurityData/ReloginDialog";
import { Alert, Box, Tab, Tabs, TextField } from "@mui/material";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import { CustomTabPanel } from "../CustomeElement/CustomeTabPanel";
import { useFormik } from "formik";
import { emailVerifySchema } from "../../lib/yupFormsValidationParams";
import { updateEmail } from "firebase/auth";
import { useSendEmailVerification } from "react-firebase-hooks/auth";

function ConfirmDeleteAccountDialog({
  open,
  handleClose,
  handleConfirmDeleteAccount,
}) {
  return (
    <Dialog
      sx={{ maxWidth: { xs: "280px", md: "400px" }, mx: "auto" }}
      open={open}
      onClose={handleClose}
    >
      <DialogTitle id="alert-dialog-title">
        {"Delete this account?"}
      </DialogTitle>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button color="error" onClick={handleConfirmDeleteAccount}>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function AccountData({
  handleError,
  user,
}: {
  handleError: (errorMessage: string) => void;
  user: User;
}) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [askRelogin, setAskRelogin] = useState(false);
  const [tabNumber, setTabNumber] = useState(0);

  const handleOpenAskReload = () => {
    setAskRelogin(true);
  };
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabNumber(newValue);
  };

  const confirmSignout = () => {
    signOut(auth);
  };

  const handleCloseAskReload = () => {
    setAskRelogin(false);
  };

  const handleOpenConfirmDialog = () => {
    setShowConfirmDialog(true);
  };
  const handleCloseConfirmDialog = () => {
    setShowConfirmDialog(false);
  };

  const deleteAccount = async () => {
    try {
      await deleteUserAccount(user);
    } catch (error) {
      if (error.message == "Firebase: Error (auth/requires-recent-login).") {
        handleOpenAskReload();
        return;
      }
      handleError(error.message);
    } finally {
      setShowConfirmDialog(false);
    }
  };

  const tabsList = [
    {
      label: "Email",
      icon: (
        <AlternateEmailIcon sx={{ fontSize: { xs: "15px", sm: "25px" } }} />
      ),
    },
    {
      label: "Delete",
      icon: <PersonRemoveIcon sx={{ fontSize: { xs: "15px", sm: "25px" } }} />,
    },
  ];

  return (
    <Box>
      <Tabs textColor="secondary" value={tabNumber} onChange={handleChange}>
        {tabsList.map((tab) => (
          <Tab
            sx={{
              fontSize: { xs: "9px", sm: "11px", md: "13px" },
              "&.MuiTab-root": {
                minWidth: "0px",
              },
            }}
            key={tab.label}
            icon={tab.icon}
            label={tab.label}
          />
        ))}
      </Tabs>
      <Box>
        <CustomTabPanel value={tabNumber} index={0}>
          <EmailSetting user={user} />
        </CustomTabPanel>
        <CustomTabPanel value={tabNumber} index={1}>
          <Button
            onClick={handleOpenConfirmDialog}
            color="error"
            variant="contained"
          >
            Delete account
          </Button>
          {showConfirmDialog && (
            <ConfirmDeleteAccountDialog
              handleConfirmDeleteAccount={deleteAccount}
              open={showConfirmDialog}
              handleClose={handleCloseConfirmDialog}
            />
          )}
          {askRelogin && (
            <ReloginDialog
              displayName={user.displayName}
              open={askRelogin}
              handleClose={handleCloseAskReload}
              handleConfirm={confirmSignout}
            />
          )}
        </CustomTabPanel>
      </Box>
    </Box>
  );
}

function EmailSetting({ user }: { user: User }) {
  const [error, setError] = useState("");
  const [sendEmailVerification, sending, errorEV] =
    useSendEmailVerification(auth);
  const [isSentEV,setIsSentEV] = useState(false)

  const emailForm = useFormik({
    initialValues: {
      email: user.email,
    },
    validationSchema: emailVerifySchema,
    onSubmit: handleChangeEmail,
  });

  const transformNameValue = (value: string) => {
    return value.trim().replace(/\s{2,}/g, "");
  };

  async function handleChangeEmail() {
    if (error) {
      setError("");
    }
    try {
      await updateEmail(user, emailForm.values.email);
    } catch (error) {
      setError(error.message);
    }
  }
  const handleSentEV = async () => {
    try {
      const res = await sendEmailVerification();
      if (res) {
        setIsSentEV(true)
      } else {
        setError('Some error occured. Try later...')
      }
    } catch (error) {
      setError(error.message)
    }
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        alignItems: "start",
      }}
    >
      <TextField
        error={emailForm.touched.email && Boolean(emailForm.errors.email)}
        autoComplete="off"
        helperText={emailForm.touched.email && emailForm.errors.email}
        id="email"
        value={emailForm.values.email}
        onChange={emailForm.handleChange}
        label={"Your email"}
        onBlur={(e) => {
          emailForm
            .setFieldValue("email", transformNameValue(emailForm.values.email))
            .then(() => emailForm.handleBlur(e));
        }}
      />
      <Button
        disabled={
          Boolean(emailForm.errors.email) ||
          emailForm.values.email.trim() == user.email
        }
        variant="contained"
        color="warning"
        onClick={() => emailForm.handleSubmit()}
      >
        Change
      </Button>
      {!user.emailVerified && (
        <Button disabled={isSentEV} onClick={handleSentEV} color="success" variant="contained">
          Verify email
        </Button>
      )}
      {error && (
        <Alert sx={{ maxWidth: "100%", maxHeight: "100%" }} color="error">
          {error}
        </Alert>
      )}
    </Box>
  );
}

export { AccountData };
