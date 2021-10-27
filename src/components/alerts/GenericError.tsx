import React from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import { useTranslation } from 'react-i18next'

type Props = {
  open: boolean
  setOpen: (value: boolean) => void
}

const GenericErrorAlert = (props: Props) => {
  const { t } = useTranslation()
  const { open, setOpen } = props
  const handleClose = () => {
    setOpen(false)
  }

  if (!open) return null
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'
    >
      <DialogTitle id='alert-dialog-title'>{t('62')}</DialogTitle>
      <DialogContent>
        <DialogContentText id='alert-dialog-description'>
          {t('63')}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} autoFocus>
          {t('61')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default GenericErrorAlert
