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



  const handleOpenAskReload = () => {
    setAskRelogin(true);
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

  return (
    <>
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
    </>
  );
}

export { AccountData };
