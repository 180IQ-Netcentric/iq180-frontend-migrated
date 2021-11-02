import { Button } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import GameContainer from '../../components/containers/GameContainer'
import { client } from '../../config/axiosConfig'
import { PlayerInfos, SocketContext } from '../../contexts/socketContext'
import { UserContext } from '../../contexts/userContext'
import socketIOClient from 'socket.io-client'
import { useTranslation } from 'react-i18next'
import withAdminGuard from '../../guards/admin.guard'

function Admin() {
  const { t } = useTranslation()
  const history = useHistory()
  const { socket, setSocket } = useContext(SocketContext)
  const { setIsAdmin } = useContext(UserContext)
  const [onlineUsers, setOnlineUsers] = useState<PlayerInfos>([])

  const showAllPlayers = (socket: any) => {
    socket.emit('showAllPlayers')
  }

  const resetSocketGame = () => {
    socket?.emit('resetByAdmin')
  }

  useEffect(() => {
    const newSocket = socketIOClient(
      `${process.env.REACT_APP_APP_API_URL}` ?? 'http://localhost:4001',
      { forceNew: true }
    )
    setSocket(newSocket)

    client
      .get('/adminState')
      .then((res) => {
        // @ts-ignore
        const isAdmin = !res.data.isUser
        setIsAdmin(isAdmin)
        if (!isAdmin) history.push('/')
      })
      .catch(() => {
        history.push('/')
      })
  }, [setIsAdmin])

  useEffect(() => {
    if (socket) {
      showAllPlayers(socket)
      socket.on('onShowAllPlayers', (playerInfos: PlayerInfos) => {
        setOnlineUsers(playerInfos)
      })
    }
  }, [socket])

  return (
    <div>
      <GameContainer>
        <div className='home-content-container'>
          <h2>{t('108')}</h2>
          <hr />
          <h4>{t('106')} </h4>
          <h3>{onlineUsers.length.toString()}</h3>
          <h4>{t('107')}</h4>
          <Button onClick={resetSocketGame} variant='contained'>
            {t('38')}
          </Button>
        </div>
      </GameContainer>
    </div>
  )
}

export default withAdminGuard(Admin)
