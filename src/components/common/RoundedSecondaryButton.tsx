import React from 'react'
import { Button } from '@mui/material'

const RoundedSecondaryButton = (props: any) => {
  return (
    <Button
      variant='contained'
      size='large'
      color='secondary'
      disableElevation
      sx={{
        height: '55px',
        borderRadius: '8px',
      }}
      onClick={props.onClick}
    >
      {props.children}
    </Button>
  )
}

export default RoundedSecondaryButton
