import { TextField } from '@mui/material'
import { styled } from '@mui/system'

const RoundedTextField = styled(TextField)(() => ({
  '& fieldset': {
    borderRadius: '8px',
  },
}))

export default RoundedTextField
