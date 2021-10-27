import { Button } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import GameContainer from '../../components/containers/GameContainer'
import { client } from '../../config/axiosConfig'
import {
  PlayerInfos,
  Settings,
  SocketContext,
} from '../../contexts/socketContext'
import { UserContext } from '../../contexts/userContext'
import socketIOClient from 'socket.io-client'

function Admin() {
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
      socket.on('updatePlayerList', (playerInfos: PlayerInfos) => {
        console.log(playerInfos)
        setOnlineUsers(playerInfos)
      })
    }
  }, [socket])

  return (
    <div>
      <GameContainer>
        <div className='home-content-container'>
          <h2>Admin Page</h2>
          <hr />
          <div>Online {onlineUsers.length.toString()}</div>
          <Button onClick={resetSocketGame}>Reset Game</Button>
        </div>
      </GameContainer>
    </div>
  )
}

export default Admin
