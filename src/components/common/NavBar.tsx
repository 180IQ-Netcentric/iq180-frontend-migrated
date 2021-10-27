import React, { useState, useContext, useEffect, useRef } from 'react'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Container from '@mui/material/Container'
import SchoolIcon from '@mui/icons-material/School'
import SettingsIcon from '@mui/icons-material/Settings'

import { GameSettingsContext } from '../../contexts/gameSettingsContext'
import { Backdrop, Button, Fade, Modal } from '@mui/material'
import GameContainer from '../containers/GameContainer'
import GameSettings from '../../pages/gameSettings'
import GearImg from '../../assets/images/gear.png'
import { setCookie } from '../..//utils/cookie'
import { UserContext } from '../../contexts/userContext'
import { AuthContext } from '../../contexts/authContext'
import { useHistory } from 'react-router'
import { useTranslation } from 'react-i18next'
import { SocketContext } from '../../contexts/socketContext'

export default function MenuAppBar() {
  const { t } = useTranslation()
  const { showSettings } = useContext(GameSettingsContext)
  const { user, clearUser } = useContext(UserContext)
  const { isUser, setToken } = useContext(AuthContext)
  const { socket } = useContext(SocketContext)
  const history = useHistory()
  const anchor = useRef(null)
  const [elevation, setElevation] = useState(0)
  const [openSettings, setOpenSettings] = useState(showSettings)

  const handleSignOut = () => {
    setToken('')
    setCookie('token', null, 0)
    clearUser()
  }

  const handleSignIn = () => {
    history.push('/signin')
  }

  const handleLogoClick = () => {
    history.push('/')
    if (user) socket?.emit('disconnectUser', user)
  }

  useEffect(() => {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 0) {
        setElevation(4)
      } else {
        setElevation(0)
      }
    })
  }, [])

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar className='MuiToolbar-center' elevation={elevation}>
          <Container maxWidth='lg'>
            <Toolbar>
              <IconButton
                size='large'
                edge='start'
                color='inherit'
                aria-label='menu'
                sx={{ mr: 2 }}
                onClick={handleLogoClick}
              >
                <SchoolIcon />
              </IconButton>
              <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
                IQ180
              </Typography>

              <div>
                <IconButton
                  size='large'
                  aria-label='account of current user'
                  aria-controls='menu-appbar'
                  aria-haspopup='true'
                  onClick={() => setOpenSettings(true)}
                  color='inherit'
                >
                  <SettingsIcon />
                </IconButton>
                <Button
                  variant='contained'
                  disableElevation
                  aria-label='account of current user'
                  aria-controls='menu-appbar'
                  aria-haspopup='true'
                  onClick={isUser ? handleSignOut : handleSignIn}
                  color='primary'
                  id='authentication-button'
                  ref={anchor}
                >
                  {isUser ? t('65') : t('0')}
                </Button>
              </div>
            </Toolbar>
          </Container>
        </AppBar>
      </Box>
      <Modal
        aria-labelledby='transition-modal-title'
        aria-describedby='transition-modal-description'
        open={openSettings}
        onClose={() => setOpenSettings(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openSettings}>
          <Box sx={{ marginTop: '90px' }}>
            <GameContainer>
              <img className='gear-background' src={GearImg} alt='Settings' />
              <GameSettings onClose={() => setOpenSettings(false)} />
            </GameContainer>
          </Box>
        </Fade>
      </Modal>
    </>
  )
}
