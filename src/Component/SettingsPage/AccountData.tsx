import React, { useState } from 'react'
import Button from '@mui/material/Button';
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

function ConfirmDeleteAccountDialog({ open, handleClose }) {
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
        <Button color="error" onClick={handleClose}>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function AccountData({ handleError }: { handleError: (errorMessage: string) => void }) {
  
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)

  const handleOpenConfirmDialog = () => {
    setShowConfirmDialog(true)
  }
  const handleCloseConfirmDialog = () => {
    setShowConfirmDialog(false)
  }

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
          open={showConfirmDialog}
          handleClose={handleCloseConfirmDialog}
        />
      )}
    </>
  );
}

export {AccountData}
