import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useTranslation } from "react-i18next";

type Props = {
  open: boolean;
  setOpen: (value: boolean) => void;
  title: string;
  description: string;
  primaryAction: () => void;
  secondaryAction?: () => void;
};

const ErrorAlert = (props: Props) => {
  const { t } = useTranslation();
  const { open, setOpen, title, description, primaryAction, secondaryAction } =
    props;

  const handleClose = () => {
    if (secondaryAction) secondaryAction();
    setOpen(false);
  };

  if (!open) return null;
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {description}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        {secondaryAction && (
          <Button onClick={secondaryAction}>{t("54")}</Button>
        )}
        <Button onClick={primaryAction} autoFocus>
          {t("61")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ErrorAlert;
