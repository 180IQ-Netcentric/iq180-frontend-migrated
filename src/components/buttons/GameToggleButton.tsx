import React, { useContext } from 'react'
import { useStyles } from '../../styles/useStyles'
import { ToggleButton } from '@mui/material'
import useSound from 'use-sound'
import { GameSettingsContext } from '../../contexts/gameSettingsContext'
// @ts-ignore
import clickSfx from '../../assets/audio/click.mp3'

interface Props {
  item: any
  matcher: any
  toggleCallback: (value?: any) => void
  children: any
  color?: 'primary' | 'secondary'
}

const GameToggleButton = (props: Props) => {
  const classes = useStyles()
  const [play] = useSound(clickSfx)
  const { soundEffectOn } = useContext(GameSettingsContext)

  return (
    <ToggleButton
      className={`toggle-buttons-gap ${classes.toggleButton}`}
      key={props.item}
      value='check'
      selected={props.matcher === props.item}
      onChange={() => {
        props.toggleCallback(props.item)
        if (soundEffectOn) play()
      }}
      color={props.color ?? 'secondary'}
      sx={{
        height: '64px',
        width: '64px',
        paddingLeft: '12px',
        backgroundColor: '#F3C18E',
        borderRadius: '8px',
        border: 'none',
      }}
    >
      {props.children}
    </ToggleButton>
  )
}

export default GameToggleButton
