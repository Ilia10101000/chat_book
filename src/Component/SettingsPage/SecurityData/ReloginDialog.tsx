import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

function ReloginDialog({ open, handleClose, handleConfirm, displayName }) {
  return (
    <Dialog
      sx={{ maxWidth: { xs: "280px", md: "400px" }, mx: "auto" }}
      open={open}
      onClose={handleClose}
    >
      <DialogTitle id="alert-dialog-title">
        {"Require recent login"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {`Dear ${displayName},`}
          <br />
          <br />
          To ensure the security of your account, we kindly ask you to log in
          again before proceeding with your action. Once you've logged
          back in, you'll be able to finish.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button color="success" onClick={handleConfirm}>
          Relogin
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export { ReloginDialog };