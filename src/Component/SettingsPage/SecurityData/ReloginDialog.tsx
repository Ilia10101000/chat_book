import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useTranslation } from "react-i18next";

function ReloginDialog({ open, handleClose, handleConfirm, displayName }) {
  const { t } = useTranslation();
  return (
    <Dialog
      sx={{ maxWidth: { xs: "280px", md: "400px" }, mx: "auto" }}
      open={open}
      onClose={handleClose}
    >
      <DialogTitle id="alert-dialog-title">
        {t("reloginDialog.title")}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {t("reloginDialog.dear", { name: displayName })}
          <br/>
          <br/>
          {t("reloginDialog.message")}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>{t("login.cancel")}</Button>
        <Button color="success" onClick={handleConfirm}>
          {t("reloginDialog.relogin")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export { ReloginDialog };