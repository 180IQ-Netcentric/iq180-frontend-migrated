import React, { useContext, useEffect } from 'react'
import { Button, Switch } from '@mui/material'
import GameToggleButton from '../../components/buttons/GameToggleButton'
import GameContainer from '../../components/containers/GameContainer'
import PlayerInfoCard from '../../components/cards/PlayerInfoCard'
import { UserContext } from '../../contexts/userContext'
import { useHistory } from 'react-router'
import withUserGuard from '../../guards/user.guard'
import { SocketContext } from '../../contexts/socketContext'
import { userToUserInfo } from '../../utils/userToUserInfo'
import { useTranslation } from 'react-i18next'
import { client } from '../../config/axiosConfig'
import socketIOClient from 'socket.io-client'

const Lobby = () => {
  const { t } = useTranslation()
  const { user } = useContext(UserContext)
  const { joinRoom } = useContext(SocketContext)
  const {
    socket,
    setSocket,
    settings,
    setSettings,
    updateSettings,
    playerInfos,
    setGameInfo,
    setPlayerInfos,
  } = useContext(SocketContext)
  const history = useHistory()

  const DIGITS_COUNT_OPTION = [3, 4, 5, 6]
  const ROUNDS_COUNT_OPTION = [1, 3, 5, 7]
  const TIME_LMIT_OPTION = [30, 60, 90, 120]

  const onSettingsChange = (change: any) => {
    if (settings) {
      const newSettings = { ...settings, ...change }
      setSettings(newSettings)
      updateSettings(newSettings)
    }
  }

  const leaveLobby = () => {
    history.push('/')
    setPlayerInfos([])
    socket?.emit('disconnectUser', user)
  }

  const beginGame = () => {
    history.push('/game')
  }

  useEffect(() => {
    if (socket) socket.close()
    const newSocket = socketIOClient(
      `${process.env.REACT_APP_APP_API_URL}` ?? 'http://localhost:4001',
      { forceNew: true }
    )
    setSocket(newSocket)

    newSocket.on('updatePlayerList', () => {
      if (user && playerInfos && playerInfos.length < 1) {
        history.push('/')
        history.push('/lobby')
      }
    })
  }, [])

  useEffect(() => {
    setGameInfo(undefined)
    client.get('/userinfo').then((res) => {
      const newUserInfo = res.data
      if (socket?.id) joinRoom({ ...userToUserInfo(newUserInfo, socket?.id) })
    })
  }, [socket, user])

  return (
    <GameContainer>
      <div className='game-padding'>
        <div className='settings-header'>
          <h1>{t('30')}</h1>
          <Button onClick={leaveLobby}>{t('56')}</Button>
        </div>
        <hr />
        <div className='match-container'>
          <div className='match-settings'>
            <h3>{t('31')}</h3>
            <div>
              <div className='settings-toggle-item'>
                {DIGITS_COUNT_OPTION.map((digit) => (
                  <GameToggleButton
                    key={digit}
                    item={digit}
                    matcher={settings?.digit ?? 5}
                    toggleCallback={(num) => onSettingsChange({ digit: num })}
                  >
                    {digit}
                  </GameToggleButton>
                ))}
              </div>

              <h3>{t('32')}</h3>
              <div className='settings-toggle-item'>
                {ROUNDS_COUNT_OPTION.map((round) => (
                  <GameToggleButton
                    key={round}
                    item={round}
                    matcher={settings?.round ?? 3}
                    toggleCallback={(num) => onSettingsChange({ round: num })}
                  >
                    {round}
                  </GameToggleButton>
                ))}
              </div>

              <h3>{t('33')}</h3>
              <div className='settings-toggle-item'>
                {TIME_LMIT_OPTION.map((limit) => (
                  <GameToggleButton
                    key={limit}
                    item={limit}
                    matcher={settings?.timeLimit}
                    toggleCallback={(time) =>
                      onSettingsChange({ timeLimit: time })
                    }
                  >
                    {`${limit} s`}
                  </GameToggleButton>
                ))}
              </div>
              <div className='empty-space' />
              <div className='settings-item'>
                <span>{t('34')}</span>
                <Switch
                  checked={!settings?.isClassicMode ?? false}
                  onChange={() =>
                    onSettingsChange({
                      isClassicMode: !settings?.isClassicMode,
                    })
                  }
                  inputProps={{ 'aria-label': 'controlled' }}
                />
              </div>
              <div className='settings-item'>
                <span>{t('35')}</span>
                <Switch
                  checked={settings?.isClassicMode ?? false}
                  onChange={() =>
                    onSettingsChange({
                      isClassicMode: !settings?.isClassicMode,
                    })
                  }
                  inputProps={{ 'aria-label': 'controlled' }}
                />
              </div>
            </div>
          </div>
          <div className='player-info-container'>
            <div className='welcome-player'>{t('105')}</div>
            <div className='player-info'>
              {user && (
                <PlayerInfoCard
                  player={playerInfos ? playerInfos[0] : undefined}
                />
              )}
            </div>
            <div className='player-info'>
              {user && (
                <PlayerInfoCard
                  player={playerInfos ? playerInfos[1] : undefined}
                />
              )}
            </div>
            <Button
              variant='contained'
              size='large'
              sx={{ borderRadius: '15px' }}
              className='game-start-button game-start-button-match'
              disabled={playerInfos && playerInfos.length < 2}
              onClick={beginGame}
            >
              {t('36')}
            </Button>
          </div>
        </div>
      </div>
    </GameContainer>
  )
}

export default withUserGuard(Lobby)
